from .base_model import BaseModel
from django.db import models


class ToolboxTool(BaseModel):
    name = models.CharField("Fagligt værktøj", max_length=255)
    body = models.TextField("Indhold")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Fagligt værktøj"
        verbose_name_plural = "Faglige værktøjer"
