from django.contrib import admin

from .models import Camera, Event, Notification


@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location", "status")
    list_filter = ("status",)
    search_fields = ("name", "location")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "camera",
        "event_type",
        "severity",
        "timestamp",
        "is_resolved",
    )
    list_filter = (
        "event_type",
        "severity",
        "is_resolved",
    )
    search_fields = (
        "description",
        "camera__name",
        "camera__location",
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "is_read", "created_at")
    list_filter = ("is_read",)
    search_fields = ("message",)

