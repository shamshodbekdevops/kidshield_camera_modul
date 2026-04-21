import os
import random

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Camera, Event, Notification


EVENT_LABELS = {
    Event.EventType.FALL: "bola yiqilishi aniqlandi",
    Event.EventType.FIGHT: "bolalar o'rtasida urushish holati aniqlandi",
    Event.EventType.INTRUDER: "begona shaxs kirib kelishi aniqlandi",
    Event.EventType.CRYING: "bola yig'lashi aniqlandi",
}

SEVERITY_MAP = {
    Event.EventType.FALL: [Event.Severity.WARNING, Event.Severity.CRITICAL],
    Event.EventType.FIGHT: [Event.Severity.CRITICAL, Event.Severity.WARNING],
    Event.EventType.INTRUDER: [Event.Severity.CRITICAL],
    Event.EventType.CRYING: [Event.Severity.INFO, Event.Severity.WARNING],
}


def _is_false_positive(event_type: str, severity: str) -> bool:
    """Mark low-confidence detections as false positives."""

    del event_type
    return severity == Event.Severity.INFO


def _remove_file(file_field) -> None:
    """Physically remove a file from storage if it exists."""

    if not file_field:
        return

    try:
        file_path = file_field.path
    except (ValueError, OSError):
        return

    if file_path and os.path.isfile(file_path):
        os.remove(file_path)


@receiver(pre_save, sender=Camera)
def camera_video_pre_save(sender, instance: Camera, **kwargs):
    """Delete the previous video file if a new one is assigned."""

    instance._video_file_changed = False

    if not instance.pk:
        instance._video_file_changed = bool(instance.video_file)
        return

    try:
        previous_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        instance._video_file_changed = bool(instance.video_file)
        return

    old_name = previous_instance.video_file.name if previous_instance.video_file else ""
    new_name = instance.video_file.name if instance.video_file else ""

    if old_name != new_name:
        _remove_file(previous_instance.video_file)
        instance._video_file_changed = bool(new_name)


@receiver(post_delete, sender=Camera)
def camera_video_post_delete(sender, instance: Camera, **kwargs):
    """Delete camera video file from disk when camera is removed."""

    _remove_file(instance.video_file)


@receiver(post_save, sender=Camera)
def create_mock_ai_outputs(sender, instance: Camera, **kwargs):
    """Generate random events and notifications after video upload/update."""

    if not getattr(instance, "_video_file_changed", False):
        return

    event_types = [choice[0] for choice in Event.EventType.choices]

    for _ in range(random.randint(2, 5)):
        event_type = random.choice(event_types)
        second = random.randint(4, 59)
        severity = random.choice(SEVERITY_MAP[event_type])
        is_false_positive = _is_false_positive(event_type, severity)

        if is_false_positive:
            description = (
                f"{second}-soniyada {EVENT_LABELS[event_type]} "
                "(aldamchi signal, notify yuborilmadi)."
            )
        else:
            description = f"{second}-soniyada {EVENT_LABELS[event_type]}."

        event = Event.objects.create(
            camera=instance,
            event_type=event_type,
            severity=severity,
            description=description,
            is_resolved=False,
        )

        if is_false_positive:
            continue

        Notification.objects.create(
            event=event,
            message=f"{instance.name}: {description}",
            is_read=False,
        )
