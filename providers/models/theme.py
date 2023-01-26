from django.db import models
from .base_model import BaseModel


class Theme(BaseModel):
    name = models.CharField("Temanavn", max_length=255, unique=True)
    SOCIAL_TYPE = "Socialt"
    PHYSICAL_TYPE = "Fysisk"
    MENTAL_TYPE = "Psykisk"
    TYPES = [
        (SOCIAL_TYPE, SOCIAL_TYPE),
        (PHYSICAL_TYPE, PHYSICAL_TYPE),
        (MENTAL_TYPE, MENTAL_TYPE),
    ]
    theme_type = models.CharField(
        "Tematype", max_length=255, default=SOCIAL_TYPE, choices=TYPES
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Tema"
        verbose_name_plural = "Temaer"
