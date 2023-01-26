from .base_model import BaseModel
from django.db import models
from boernebasen import settings
from .municipality import Municipality


class SocialWorker(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE)
    newsletter = models.BooleanField("Nyhedsbrev", default=False)

    def __str__(self):
        if self.user.name:
            return f"{self.user.name} - {self.municipality}"
        else:
            return f"{self.user} - {self.municipality}"

    class Meta:
        verbose_name = "Socialrådgiver"
        verbose_name_plural = "Socialrådgivere"
