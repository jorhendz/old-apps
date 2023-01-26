from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    name = models.CharField("Navn", max_length=255, unique=False, null=True, blank=True)
    first_name = models.CharField(
        "Fornavn", max_length=255, unique=False, null=True, blank=True
    )
    last_name = models.CharField(
        "Efternavn", max_length=255, unique=False, null=True, blank=True
    )
    email = models.EmailField("Email", unique=True)
    old_email = models.CharField(
        "Gammel email",
        max_length=255,
        blank=True,
        null=True,
        default=None,
    )
    consent_given = models.BooleanField("Samtykke til GDPR givet", default=False)
    info_mail_consent_given = models.BooleanField(
        "Samtykke til infomail givet", default=False
    )
    migration_notes = models.TextField(
        "Migrationsoplysninger", max_length=20000, default=""
    )
    last_analytics_event = models.DateTimeField(blank=True, null=True)

    def add_migration_note(self, note):
        self.migration_notes = self.migration_notes + "\n\t* " + note
        self.save()

    # add additional fields in here

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.is_superuser or self.is_staff
