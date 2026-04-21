import os
import shutil
import tempfile
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Camera, Event, Notification


class MediaRootMixin:
    """Use an isolated media directory for each test run."""

    def setUp(self):
        super().setUp()
        self._temp_media_dir = tempfile.mkdtemp(prefix="kidshield_media_")
        self._media_override = override_settings(MEDIA_ROOT=self._temp_media_dir)
        self._media_override.enable()

    def tearDown(self):
        self._media_override.disable()
        shutil.rmtree(self._temp_media_dir, ignore_errors=True)
        super().tearDown()

    @staticmethod
    def _video_file(name: str) -> SimpleUploadedFile:
        return SimpleUploadedFile(name, b"mock-video-bytes", content_type="video/mp4")


class CameraFileLifecycleTests(MediaRootMixin, TestCase):
    """Validate physical file lifecycle behavior for camera videos."""

    def test_old_video_file_deleted_when_video_replaced(self):
        camera = Camera.objects.create(name="Cam 1", location="Hall")
        camera.video_file = self._video_file("first.mp4")
        camera.save()

        old_path = camera.video_file.path
        self.assertTrue(os.path.exists(old_path))

        camera.video_file = self._video_file("second.mp4")
        camera.save()

        self.assertFalse(os.path.exists(old_path))
        self.assertTrue(os.path.exists(camera.video_file.path))

    def test_video_file_deleted_when_camera_deleted(self):
        camera = Camera.objects.create(name="Cam 2", location="Playground")
        camera.video_file = self._video_file("to_delete.mp4")
        camera.save()

        file_path = camera.video_file.path
        self.assertTrue(os.path.exists(file_path))

        camera.delete()
        self.assertFalse(os.path.exists(file_path))


class MockAISignalTests(MediaRootMixin, TestCase):
    """Validate mock AI signal pipeline and false-positive handling."""

    def test_video_upload_creates_events_and_notifications(self):
        camera = Camera.objects.create(name="Cam 3", location="Room A")

        with patch(
            "monitoring.signals.random.randint",
            side_effect=[3, 11, 22, 33],
        ), patch(
            "monitoring.signals.random.choice",
            side_effect=[
                Event.EventType.FALL,
                Event.Severity.CRITICAL,
                Event.EventType.FIGHT,
                Event.Severity.WARNING,
                Event.EventType.INTRUDER,
                Event.Severity.CRITICAL,
            ],
        ):
            camera.video_file = self._video_file("pipeline.mp4")
            camera.save()

        events = Event.objects.filter(camera=camera)
        notifications = Notification.objects.filter(event__camera=camera)

        self.assertEqual(events.count(), 3)
        self.assertEqual(notifications.count(), 3)

    def test_false_positive_event_does_not_send_notification(self):
        camera = Camera.objects.create(name="Cam 4", location="Room B")

        with patch(
            "monitoring.signals.random.randint",
            side_effect=[2, 8, 24],
        ), patch(
            "monitoring.signals.random.choice",
            side_effect=[
                Event.EventType.CRYING,
                Event.Severity.INFO,
                Event.EventType.FALL,
                Event.Severity.CRITICAL,
            ],
        ):
            camera.video_file = self._video_file("false_positive.mp4")
            camera.save()

        events = Event.objects.filter(camera=camera)
        notifications = Notification.objects.filter(event__camera=camera)
        info_event = events.get(severity=Event.Severity.INFO)

        self.assertEqual(events.count(), 2)
        self.assertEqual(notifications.count(), 1)
        self.assertIn("notify yuborilmadi", info_event.description)


class APIPipelineTests(MediaRootMixin, APITestCase):
    """Exercise REST API endpoints in realistic scenarios."""

    def setUp(self):
        super().setUp()
        self.camera = Camera.objects.create(name="API Cam", location="Entry")

    def test_camera_detail_returns_nested_events_and_notifications(self):
        event = Event.objects.create(
            camera=self.camera,
            event_type=Event.EventType.FALL,
            severity=Event.Severity.WARNING,
            description="10-soniyada bola yiqilishi aniqlandi.",
        )
        Notification.objects.create(event=event, message="Test notification")

        response = self.client.get(f"/api/cameras/{self.camera.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.camera.id)
        self.assertEqual(len(response.data["events"]), 1)
        self.assertEqual(len(response.data["events"][0]["notifications"]), 1)

    def test_upload_video_endpoint_runs_ai_pipeline(self):
        with patch(
            "monitoring.signals.random.randint",
            side_effect=[2, 12, 25],
        ), patch(
            "monitoring.signals.random.choice",
            side_effect=[
                Event.EventType.CRYING,
                Event.Severity.INFO,
                Event.EventType.FIGHT,
                Event.Severity.CRITICAL,
            ],
        ):
            response = self.client.post(
                f"/api/cameras/{self.camera.id}/upload-video/",
                {"video_file": self._video_file("api_upload.mp4")},
                format="multipart",
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.filter(camera=self.camera).count(), 2)
        self.assertEqual(
            Notification.objects.filter(event__camera=self.camera).count(),
            1,
        )

    def test_notification_mark_read_endpoint(self):
        event = Event.objects.create(
            camera=self.camera,
            event_type=Event.EventType.INTRUDER,
            severity=Event.Severity.CRITICAL,
            description="20-soniyada begona shaxs kirib kelishi aniqlandi.",
        )
        notification = Notification.objects.create(
            event=event,
            message="Critical alert",
        )

        response = self.client.post(f"/api/notifications/{notification.id}/mark-read/")

        notification.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(notification.is_read)

    def test_notification_list_can_filter_by_event_id(self):
        event_a = Event.objects.create(
            camera=self.camera,
            event_type=Event.EventType.FALL,
            severity=Event.Severity.WARNING,
            description="A",
        )
        event_b = Event.objects.create(
            camera=self.camera,
            event_type=Event.EventType.FIGHT,
            severity=Event.Severity.CRITICAL,
            description="B",
        )
        Notification.objects.create(event=event_a, message="A1")
        Notification.objects.create(event=event_b, message="B1")

        response = self.client.get(f"/api/notifications/?event_id={event_a.id}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["event"], event_a.id)
