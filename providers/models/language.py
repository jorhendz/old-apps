from django.db import models
from .base_model import BaseModel
from django.apps import apps


class Language(BaseModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    def provider_count(self):
        # The provider_set is added dynamically, due to the
        # relation between the two. It's a Django thing and here
        # it prevents us from needing to make a circular import by
        # not needing to `from .provider import Provider`
        return self.provider_set.filter(is_public=True).count()

    class Meta:
        verbose_name = "Sprog"
        verbose_name_plural = "Sprog"
