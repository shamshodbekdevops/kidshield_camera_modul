from django.db import models


class Camera(models.Model):
    """Represents a kindergarten camera source."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        OFFLINE = "offline", "Offline"

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    video_file = models.FileField(upload_to="videos/", blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return f"{self.name} ({self.location})"


class Event(models.Model):
    """Stores detected AI-like events tied to a camera."""

    class EventType(models.TextChoices):
        FALL = "Fall", "Fall"
        FIGHT = "Fight", "Fight"
        INTRUDER = "Intruder", "Intruder"
        CRYING = "Crying", "Crying"

    class Severity(models.TextChoices):
        CRITICAL = "Critical", "Critical"
        WARNING = "Warning", "Warning"
        INFO = "Info", "Info"

    camera = models.ForeignKey(
        Camera,
        on_delete=models.CASCADE,
        related_name="events",
    )
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    severity = models.CharField(max_length=20, choices=Severity.choices)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self) -> str:
        return f"{self.event_type} | {self.severity} | Camera #{self.camera_id}"


class Notification(models.Model):
    """Represents notification payload generated for an event."""

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Notification #{self.id} for Event #{self.event_id}"
