from django.apps import AppConfig


class MonitoringConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "monitoring"
    verbose_name = "Bogcha Guard Monitoring"

    def ready(self) -> None:
        # Import signal handlers when the app is ready.
        from . import signals  # noqa: F401
