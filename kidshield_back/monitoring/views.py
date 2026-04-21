from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Camera, Event, Notification
from .serializers import (
    CameraSerializer,
    CameraVideoUploadSerializer,
    EventSerializer,
    NotificationSerializer,
)


class CameraViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for cameras and nested event payloads."""

    queryset = Camera.objects.prefetch_related("events__notifications").all()
    serializer_class = CameraSerializer

    def list(self, request, *args, **kwargs):
        """GET /api/cameras/ to list all cameras with nested events."""

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """POST /api/cameras/ to create a new camera."""

        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """GET /api/cameras/{id}/ to retrieve one camera with events."""

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """PUT /api/cameras/{id}/ to fully update a camera."""

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/cameras/{id}/ to partially update a camera."""

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """DELETE /api/cameras/{id}/ to remove a camera and video file."""

        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=["post"],
        parser_classes=[MultiPartParser, FormParser],
        url_path="upload-video",
    )
    def upload_video(self, request, pk=None):
        """POST /api/cameras/{id}/upload-video/ to upload or replace camera video."""

        camera = self.get_object()
        serializer = CameraVideoUploadSerializer(camera, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        camera = Camera.objects.prefetch_related(
            "events__notifications"
        ).get(pk=camera.pk)
        response_serializer = self.get_serializer(camera)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class EventViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for event records with optional camera_id filtering."""

    queryset = Event.objects.select_related(
        "camera"
    ).prefetch_related("notifications").all()
    serializer_class = EventSerializer

    def list(self, request, *args, **kwargs):
        """GET /api/events/ to list events, optional camera_id filter."""

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """POST /api/events/ to create an event manually."""

        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """GET /api/events/{id}/ to retrieve one event."""

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """PUT /api/events/{id}/ to fully update an event."""

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/events/{id}/ to partially update an event."""

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """DELETE /api/events/{id}/ to remove an event."""

        return super().destroy(request, *args, **kwargs)

    def get_queryset(self):
        """GET /api/events/?camera_id={id} to filter events by camera."""

        queryset = super().get_queryset()
        camera_id = self.request.query_params.get("camera_id")
        if camera_id:
            queryset = queryset.filter(camera_id=camera_id)
        return queryset


class NotificationViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for notifications with optional event_id filtering."""

    queryset = Notification.objects.select_related("event", "event__camera").all()
    serializer_class = NotificationSerializer

    def list(self, request, *args, **kwargs):
        """GET /api/notifications/ to list notifications, optional event_id."""

        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """POST /api/notifications/ to create a notification manually."""

        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """GET /api/notifications/{id}/ to retrieve one notification."""

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """PUT /api/notifications/{id}/ to fully update a notification."""

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/notifications/{id}/ to partially update a notification."""

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """DELETE /api/notifications/{id}/ to remove a notification."""

        return super().destroy(request, *args, **kwargs)

    def get_queryset(self):
        """GET /api/notifications/?event_id={id} to filter by event."""

        queryset = super().get_queryset()
        event_id = self.request.query_params.get("event_id")
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        """POST /api/notifications/{id}/mark-read/ to mark as read."""

        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

