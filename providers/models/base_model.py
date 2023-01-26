from django.db import models


class BaseModel(models.Model):
    """
    The Model that all our other models extends.
    This is the most general code that we have in the model layer and
    can be used for things like logging or update/creation time that is
    needed for all models we have.
    """

    created_at = models.DateTimeField(auto_now_add=True, editable=False, null=True)
    updated_at = models.DateTimeField(auto_now=True, editable=False, null=True)

    class Meta:
        abstract = True  # specify this model as an Abstract Model
