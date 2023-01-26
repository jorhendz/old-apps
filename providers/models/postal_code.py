from django.db import models
from .base_model import BaseModel
from django.core.validators import MaxValueValidator, MinValueValidator


class PostalCode(BaseModel):
    name = models.CharField(max_length=255)
    number = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(9999)],
        unique=True,
    )

    def __str__(self):
        return f'{self.number} - {self.name}'

    class Meta:
        verbose_name = "Postnummer"
        verbose_name_plural = "Postnumre"
