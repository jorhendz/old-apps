from django.db import models
from .base_model import BaseModel
from .postal_code import PostalCode


class Area(BaseModel):
    name = models.CharField(max_length=255)
    postal_codes = models.ManyToManyField(PostalCode)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Område"
        verbose_name_plural = "Områder"
