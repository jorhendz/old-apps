from django.db import models
from .base_model import BaseModel


class ServiceCategory(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    PREVENTIVE_TYPE = "preventive"
    INTRUSIVE_TYPE = "intrusive"
    OTHER_TYPE = "other"
    TYPES = [
        (PREVENTIVE_TYPE, "Forebyggende ydelser"),
        (INTRUSIVE_TYPE, "Indgribende ydelser"),
        (OTHER_TYPE, "Andre ydelser"),
    ]
    # type is a reserved keyword
    service_type = models.CharField(max_length=255, choices=TYPES, default=OTHER_TYPE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Ydelsestype"
        verbose_name_plural = "Ydelsestyper"
