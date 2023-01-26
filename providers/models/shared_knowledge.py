from django.db import models
from .municipality import Municipality
from .base_model import BaseModel


class SharedKnowledge(BaseModel):
    name = models.CharField("Beskrivelse", max_length=255)
    body = models.TextField("Indhold")
    municipalities = models.ManyToManyField(Municipality, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Viden på tværs"
        verbose_name_plural = "Viden på tværs"
