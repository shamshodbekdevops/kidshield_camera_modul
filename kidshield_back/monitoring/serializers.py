from rest_framework import serializers

from .models import Camera, Event, Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notification payloads."""

    class Meta:
        model = Notification
        fields = ["id", "event", "message", "is_read", "created_at"]
        read_only_fields = ["id", "created_at"]


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events with nested notifications."""

    notifications = NotificationSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "camera",
            "event_type",
            "severity",
            "timestamp",
            "description",
            "is_resolved",
            "notifications",
        ]
        read_only_fields = ["id", "timestamp", "notifications"]


class CameraSerializer(serializers.ModelSerializer):
    """Serializer for cameras with nested events and notifications."""

    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Camera
        fields = ["id", "name", "location", "video_file", "status", "events"]
        read_only_fields = ["id", "events"]


class CameraVideoUploadSerializer(serializers.ModelSerializer):
    """Serializer used by /upload-video endpoint."""

    class Meta:
        model = Camera
        fields = ["video_file"]

    def validate_video_file(self, value):
        """Ensure a non-empty video file is uploaded."""

        if not value:
            raise serializers.ValidationError("video_file is required.")
        return value
