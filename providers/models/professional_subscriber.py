from .base_model import BaseModel
from django.db import models
from boernebasen import settings
from .municipality import Municipality


class ProfessionalSubscriber(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    authentication_key = models.CharField(
        "Aktiveringskode", max_length=255, null=True, blank=True
    )
    municipality = models.ForeignKey(
        Municipality, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        if self.user.first_name and self.user.last_name:
            return f"{self.user.first_name} {self.user.last_name}"
        else:
            return f"{self.user}"

    class Meta:
        verbose_name = "Fagperson"
        verbose_name_plural = "Fagpersoner"
