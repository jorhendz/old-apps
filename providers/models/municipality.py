from django.db import models
from .base_model import BaseModel


class Municipality(BaseModel):
    name = models.CharField("Kommunenavn", max_length=255, unique=True)
    logo = models.ImageField("Logo", null=True, blank=True)
    email_domain = models.CharField("Emaildomæne", max_length=255)
    is_member = models.BooleanField("Medlem", default=False)

    feature_methods = models.BooleanField("Metoder aktiveret", default=True)
    feature_shared_knowledge = models.BooleanField(
        "Viden på tværs aktiveret", default=False
    )
    is_not_municipality = models.BooleanField("Er ikke en kommune", default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Kommune"
        verbose_name_plural = "Kommuner"
