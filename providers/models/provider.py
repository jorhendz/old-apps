from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.functional import cached_property
from django.core.exceptions import ValidationError
from django.apps import apps

from .base_model import BaseModel
from boernebasen import settings
from .municipality import Municipality
from .area import Area
from .postal_code import PostalCode
from .region import Region
from .language import Language
from .creditation import Creditation
from .theme import Theme


class Membership:
    FREE = 0
    BASIS = 1
    EXPERT = 2


class Provider(BaseModel):

    name = models.CharField("Navn", max_length=255)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    MEMBERSHIP_CHOICES = [
        (Membership.FREE, "Begynder"),
        (Membership.BASIS, "Basis"),
        (Membership.EXPERT, "Ekspert"),
    ]

    membership = models.IntegerField(
        "Medlemstype", default=Membership.FREE, choices=MEMBERSHIP_CHOICES
    )

    data_checked = models.BooleanField(
        "Tjekket",
        default=False,
    )

    note = models.TextField(
        "Note",
        max_length=50000,
        null=True,
        blank=True,
    )
    consent_given = models.BooleanField(
        "Samtykke til GDPR",
        default=False,
    )

    info_mail_consent_given = models.BooleanField(
        "Samtykke til info mail",
        default=False,
    )

    registered_externally = models.BooleanField(
        "Selvregistreret",
        default=False,
    )
    migrated_postal_code = models.IntegerField(
        "Postnummer fra gammelt system",
        blank=True,
        null=True,
    )
    # Before April 23rd 2022, we didn't require users to fill out their welcome message.
    # That resulted in a script being created to replace all empty welcome messages with this one
    # ('add_welcome_messages.py')
    default_welcome_msg = 'Ønsker du mere information om vores tilbud, er du meget velkommen til at kontakte os.'
    welcome_message = models.TextField(
        'Velkomsthilsen',
        max_length=250,
        default=default_welcome_msg,
    )

    service_description = models.TextField(
        "Beskrivelse af indsats",
        max_length=10000,
        default="",
        blank=True,
        null=True,
    )
    is_public = models.BooleanField(
        "Offentliggjort",
        default=False,
    )
    is_volunteer_organization = models.BooleanField(
        "Frivilligt tilbud",
        default=False,
    )
    company_description = models.TextField(
        "Beskrivelse af stedet",
        max_length=10000,
        default="",
        blank=True,
        null=True,
    )

    method_description = models.TextField(
        "Beskrivelse af metoder/tilgang",
        max_length=10000,
        default="",
        blank=True,
        null=True,
    )

    min_age = models.IntegerField(
        "Minimumsalder", validators=[MinValueValidator(0)], blank=True, null=True
    )
    max_age = models.IntegerField(
        "Maksimumalder",
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        blank=True,
        null=True,
    )
    open_hours = models.CharField("Åbningstider", max_length=550, blank=True, null=True)

    logo = models.ImageField("Logo", blank=True, null=True)

    owned_by = models.ForeignKey(
        Municipality,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="owned_by",
    )

    admin_first_name = models.CharField(
        "Administrators fornavn", max_length=100, blank=True, null=True
    )

    admin_last_name = models.CharField(
        "Administrators efternavn", max_length=100, blank=True, null=True
    )

    contact_name = models.CharField(
        "Kontaktperson", max_length=100, blank=True, null=True
    )

    # This name is stupid.. I apparently misread it when originally defining the model
    # At the time of writing I would like to avoid making changes to the DB.
    # TODO: Rename to `founded`
    contact_title = models.CharField("Stiftet d.", max_length=60, blank=True, null=True)
    contact_phone = models.CharField("Telefon", max_length=850, blank=True, null=True)
    contact_email = models.EmailField("Email", blank=True, null=True)
    contact_phone_2 = models.CharField(
        "Telefon 2", max_length=150, null=True, blank=True
    )
    contact_email_2 = models.EmailField("Email 2", blank=True, null=True)
    contact_address = models.CharField("Adresse", max_length=120, blank=True, null=True)
    contact_postal_code = models.IntegerField(
        "Postnummer",
        validators=[MinValueValidator(0), MaxValueValidator(9999)],
        blank=True,
        null=True,
    )
    contact_city = models.CharField("By", max_length=80, blank=True, null=True)
    contact_cvr = models.CharField("CVR", max_length=20, blank=True, null=True)
    contact_website = models.URLField(
        "Hjemmeside",
        blank=True,
        null=True,
    )

    postal_codes = models.ManyToManyField(PostalCode, blank=True)
    regions = models.ManyToManyField(Region, blank=True)
    languages = models.ManyToManyField(Language, blank=True)
    themes = models.ManyToManyField(Theme, blank=True)
    creditations = models.ManyToManyField(Creditation, blank=True)
    municipality_creditations = models.ManyToManyField(
        Municipality, blank=True, related_name="municipality_creditations"
    )

    WAITING_TIME_NOT_PROVIDED = "Ikke oplyst"
    NO_WAITING_TIME = "Ingen ventetid"
    POSSIBLE_WAITING_TIME = "Muligvis ventetid"
    WAITING_TIME_CHOICES = [
        (WAITING_TIME_NOT_PROVIDED, "Ventetid ikke oplyst"),
        (NO_WAITING_TIME, "Ingen ventetid"),
        (POSSIBLE_WAITING_TIME, "Mulig ventetid"),
    ]
    waiting_time = models.CharField(
        "Ventetid",
        max_length=100,
        choices=WAITING_TIME_CHOICES,
        default=WAITING_TIME_NOT_PROVIDED,
    )

    STATUS_REPORT_INTERVAL_UNKNOWN = "Statusrapport ikke oplyst"
    STATUS_REPORT_INTERVAL_NOT_RELEVANT = "Ikke relevant"
    STATUS_REPORT_INTERVAL_MONTHLY = "Status månedligt"
    STATUS_REPORT_INTERVAL_QUARTERLY = "Statusrapport kvartalvis"
    STATUS_REPORT_INTERVAL_BIYEARLY = "Statusrapport halvårligt"
    STATUS_REPORT_INTERVAL_YEARLY = "Statusrapport årligt"
    STATUS_REPORT_BY_AGREEMENT = "Statusrapport efter aftale"
    STATUS_REPORT_INTERVALS = [
        (STATUS_REPORT_INTERVAL_UNKNOWN, "Statusrapport ikke oplyst"),
        (STATUS_REPORT_BY_AGREEMENT, "Statusrapport efter aftale"),
        (STATUS_REPORT_INTERVAL_NOT_RELEVANT, "Ikke relevant"),
        (STATUS_REPORT_INTERVAL_MONTHLY, "Statusrapport månedligt"),
        (STATUS_REPORT_INTERVAL_QUARTERLY, "Statusrapport kvartalvis"),
        (STATUS_REPORT_INTERVAL_BIYEARLY, "Statusrapport halvårligt"),
        (STATUS_REPORT_INTERVAL_YEARLY, "Statusrapport årligt"),
    ]
    status_report_interval = models.CharField(
        "Frekvens af statusrapporter",
        max_length=255,
        choices=STATUS_REPORT_INTERVALS,
        default=STATUS_REPORT_INTERVAL_UNKNOWN,
    )

    BOTH_SEXES = "Både drenge og piger"
    ONLY_BOYS = "Kun drenge"
    ONLY_GIRLS = "Kun piger"
    SEXES_CHOICES = [
        (BOTH_SEXES, "Både drenge og piger"),
        (ONLY_BOYS, "Kun drenge"),
        (ONLY_GIRLS, "Kun piger"),
    ]
    sexes = models.CharField(
        "Køn", max_length=255, default=BOTH_SEXES, choices=SEXES_CHOICES
    )

    # https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.clean
    def clean(self):
        # Clean contact_phone
        empty_phone_numbers = ["-", " ", "\t"]
        if self.contact_phone:
            if self.contact_phone in empty_phone_numbers:
                self.contact_phone = None
            else:
                current_phone = self.contact_phone
                current_phone = current_phone.replace(" ", "").replace("\t", "")
                if current_phone.startswith('+45'):
                    current_phone = current_phone[3:]
                # Make sure that only digits are used in the phone number
                for character in current_phone:
                    if not character in "0123456789":
                        # Todo: Make this in a localized form instead of Danish
                        # https://docs.djangoproject.com/en/3.2/topics/i18n/translation/
                        raise ValidationError(
                            {
                                "contact_phone": f"Dette nummer indeholder '{character}'. Telefonnumre må kun indeholde tal"
                            }
                        )
                if not len(current_phone) == 8:
                    current_phone = None
                self.contact_phone = current_phone

    @property
    def is_active(self):
        return self.user.is_active

    @property
    def is_internal(self):
        return self.owned_by is not None

    @property
    def services(self):
        # We cannot import this model normally without creating a circular dependency
        Service = apps.get_model("providers", "Service")
        return Service.objects.filter(provider=self).all()

    @cached_property
    def is_ready(self):
        return self.is_public
        # return self.themes.all().count() != 0 and self.services.all().count(
        # ) != 0 and self.user.is_active

    @property
    def publication_requirements_sattisfied(self):
        for _, value in self.publication_requirement_list:
            if not value:
                return False
        return True

    @property
    def publication_requirement_list(self):
        return [
            (
                "Velkomsthilsen",
                (self.welcome_message != "")
                and (self.welcome_message != self.default_welcome_msg),
            ),
            ("Tilbuddets navn", (self.name != None) and (len(self.name) != 0)),
            (
                "Kontaktperson",
                (self.contact_name != None) and (len(self.contact_name) != 0),
            ),
            ("Email", (self.contact_email != None) and (len(self.contact_email) != 0)),
            (
                "Telefonnummer",
                (self.contact_phone != None) and (len(self.contact_phone) != 0),
            ),
            (
                "Indsats(er)"
                + (" (se Vælg/ret indsats)" if self.services is None else ""),
                self.services is not None and len(self.services) != 0,
            ),
            ("Udfordringer", self.themes.all().count() != 0),
            # Currently we don't have a way for the providers to input this
            # ("Område tilbuddet dækker", self.postal_codes.all().count() != 0),
            ("Sprog", self.languages.all().count() != 0),
            ("Aldersgruppe", self.max_age is not None and self.min_age is not None),
            (
                "Område eller postnummer",
                (self.areas.count() != 0) or (self.postal_codes.all().count() != 0),
            ),
        ]

    @cached_property
    def price(self):
        prices = [s.price for s in self.services if not s.price is None]
        if not len(prices) == 0:
            return max(prices)
        else:
            return None

    @cached_property
    def is_free(self):
        # return self.is_volunteer_organization
        for service in self.services.all():
            if not service.is_free:
                return False
        return True

    # Memberships
    @property
    def is_beginner(self):
        if self.membership == Membership.FREE:
            return True
        else:
            return False

    @property
    def is_basis(self):
        if self.membership == Membership.BASIS:
            return True
        else:
            return False

    @property
    def is_expert(self):
        if self.membership == Membership.EXPERT:
            return True
        else:
            return False

    @cached_property
    def price_string(self):
        if self.is_volunteer_organization:
            return "Gratis"
        elif self.is_free:
            return "Gratis"
        prices = [
            (s.price, s.price_string) for s in self.services if not s.price is None
        ]
        if not len(prices) == 0:
            price = min(prices, key=lambda v: v[0])
            return price[1]
        else:
            return "Kontakt for pris"

    @cached_property
    def is_online(self):
        for service in self.services.all():
            if service.online:
                return True
        return False

    @cached_property
    def is_transport_included(self):
        for service in self.services.all():
            if service.online:
                return True
        return False

    @cached_property
    def is_administration_included(self):
        for service in self.services.all():
            if service.administration_included:
                return True
        return False

    @cached_property
    def is_for_parents(self):
        for service in self.services.all():
            if service.for_parents:
                return True
        return False

    @cached_property
    def areas(self):
        return Area.objects.filter(postal_codes__in=self.postal_codes.all()).distinct()

    def __str__(self):
        if self.name and self.name.strip() != "":
            return self.name
        else:
            return "TilbudUdenNavn:" + str(self.pk)

    class Meta:
        verbose_name = "Tilbud"
        verbose_name_plural = "Tilbud"
