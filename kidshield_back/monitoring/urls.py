from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CameraViewSet, EventViewSet, NotificationViewSet

router = DefaultRouter()
router.register("cameras", CameraViewSet, basename="camera")
router.register("events", EventViewSet, basename="event")
router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("", include(router.urls)),
]
