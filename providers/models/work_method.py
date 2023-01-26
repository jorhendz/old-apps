from .base_model import BaseModel
from django.db import models
from .municipality import Municipality


class WorkMethod(BaseModel):
    name = models.CharField("Metodenavn", max_length=255)
    body = models.TextField("Indhold")
    municipalities = models.ManyToManyField(Municipality, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Metode"
        verbose_name_plural = "Metoder"
