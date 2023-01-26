from django.db import models
from .base_model import BaseModel
from .provider import Provider
from .service_category import ServiceCategory
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


class Service(BaseModel):
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    price_value = models.IntegerField(
        validators=[MinValueValidator(0)], blank=True, null=True
    )
    DAILY_TYPE = "DAILY"
    HOURLY_TYPE = "HOURLY"
    FREE_TYPE = "FREE"
    price_type = models.CharField(
        choices=[
            (DAILY_TYPE, "Dagspris"),
            (HOURLY_TYPE, "Timepris"),
            (FREE_TYPE, "Gratis"),
        ],
        null=True,
        blank=True,
        max_length=255,
    )

    online = models.BooleanField("Online", default=False, null=True)
    transport_included = models.BooleanField("Kørsel", default=False, null=True)
    administration_included = models.BooleanField(
        "Administration", default=False, null=True
    )
    for_parents = models.BooleanField("Til forældre", default=False, null=True)

    def clean(self):
        if self.price_type == self.FREE_TYPE and self.price_value is None:
            raise ValidationError("Hvis prisypen er gratis skal du have en pris på 0")

        if (self.price_type == None) != (self.price_value == None):
            raise ValidationError("Du skal vælge både en pristype of et beløb")

        if self.price_type == self.FREE_TYPE and self.price_value != 0:
            raise ValidationError(
                f"Du kan ikke have en pris på '{self.price_value}'' og samtidig være gratis"
            )

        if self.price_value is not None and self.price_value < 0:
            raise ValidationError("Du kan ikke sætte en negativ pris")

    @property
    def price_string(self):
        if self.price_type == self.HOURLY_TYPE:
            return f"{self.price_value} / time"
        elif self.price_type == self.DAILY_TYPE:
            return f"{self.price_value} / dag"
        elif self.is_free:
            return "Gratis"
        else:
            return "Kontakt for pris"

    @property
    def price(self):
        # The reason for having this function is legacy...
        # If it can be removed in favour of just refering to self.price_value
        # that would probably be better
        return self.price_value

    @property
    def is_paid(self):
        return not self.price_type == self.FREE_TYPE

    @property
    def is_free(self):
        return self.price_type == self.FREE_TYPE

    def __str__(self):
        return f"{self.provider} - {self.category}"

    class Meta:
        verbose_name = "Ydelse"
        verbose_name_plural = "Ydelser"
