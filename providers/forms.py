from django import forms
from django.forms.widgets import (
    CheckboxSelectMultiple,
    Widget,
    CheckboxInput,
    PasswordInput,
    TextInput,
)
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from django.core.validators import MaxValueValidator, MinValueValidator

from .models import (
    SocialWorker,
    Provider,
    Region,
    Language,
    Theme,
    Creditation,
    Service,
    PostalCode,
    ServiceCategory,
    ProfessionalSubscriber,
    Area,
)
from accounts.models import CustomUser


class CustomAuthForm(AuthenticationForm):
    username = forms.CharField(
        widget=TextInput(attrs={'class': 'validate input', 'placeholder': 'Email'})
    )
    password = forms.CharField(
        widget=PasswordInput(
            attrs={'class': 'validate input', 'placeholder': 'Kodeord'}
        )
    )


class ProviderSignupForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(ProviderSignupForm, self).__init__(*args, **kwargs)
        self.fields['provider_name'].label = 'Tilbuddets navn'
        self.fields['first_name'].label = 'Administrators fornavn'
        self.fields['last_name'].label = 'Administrators efternavn'
        self.fields['password2'].label = 'Bekræft adgangskode'
        self.fields['consent_given'].label = mark_safe(
            "Jeg giver samtykke til Børnebasens <a href='https://www.boernebasen.dk/samtykke'>betingelser for oprettelse</a>"
        )
        self.fields[
            'info_mail_consent_given'
        ].label = 'Jeg giver samtykke til at modtage mails med relevante informationer og opdateringer fra Børnebasen'
        self.fields[
            'password1'
        ].help_text = 'Din adgangskode skal bestå af mindst 8 cifre. Koden skal indeholde både tal og bogstaver.'
        self.fields['password2'].help_text = ''
        self.fields['email'].widget.attrs['placeholder'] = 'Email'
        self.fields['password1'].widget.attrs['placeholder'] = self.fields[
            'password1'
        ].label
        self.fields['password2'].widget.attrs['placeholder'] = self.fields[
            'password2'
        ].label

    provider_name = forms.CharField(
        max_length=255,
        required=True,
        widget=TextInput(attrs={'placeholder': 'Tilbuddets navn'}),
    )

    first_name = forms.CharField(
        max_length=30,
        required=True,
        widget=TextInput(attrs={'placeholder': 'Administrators fornavn'}),
    )
    last_name = forms.CharField(
        max_length=30,
        required=True,
        widget=TextInput(attrs={'placeholder': 'Administrators efternavn'}),
    )

    email = forms.EmailField(
        max_length=254,
    )

    consent_given = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'btn col',
                'style': 'width:20px;height:20px;margin-top:1rem;margin-left:0.5rem;',
            }
        ),
    )
    info_mail_consent_given = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'btn col',
                'style': 'width:20px;height:20px;margin-top:1rem;margin-left:0.5rem;',
            }
        ),
    )

    class Meta:
        model = CustomUser
        fields = [
            'provider_name',
            'first_name',
            'last_name',
            'email',
            'password1',
            'password2',
            'consent_given',
            'info_mail_consent_given',
        ]


class SocialWorkerForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(SocialWorkerForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].label = 'Fornavn'
        self.fields['last_name'].label = 'Efternavn'
        self.fields['password2'].label = 'Bekræft adgangskode'
        self.fields[
            'info_mail_consent_given'
        ].label = 'Jeg giver samtykke til at modtage mails med relevante informationer og opdateringer fra Børnebasen'
        self.fields[
            'password1'
        ].help_text = 'Din adgangskode skal bestå af mindst 8 cifre. Koden skal indeholde både tal og bogstaver.'
        self.fields['password2'].help_text = ''
        self.fields['email'].widget.attrs['placeholder'] = 'Email'
        self.fields['password1'].widget.attrs['placeholder'] = self.fields[
            'password1'
        ].label
        self.fields['password2'].widget.attrs['placeholder'] = self.fields[
            'password2'
        ].label
        self.fields['first_name'].widget.attrs['placeholder'] = self.fields[
            'first_name'
        ].label
        self.fields['last_name'].widget.attrs['placeholder'] = self.fields[
            'last_name'
        ].label

    first_name = forms.CharField(
        max_length=30,
        required=False,
    )
    last_name = forms.CharField(
        max_length=30,
        required=False,
    )
    email = forms.EmailField(
        max_length=254,
    )

    info_mail_consent_given = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'btn col',
                'style': 'width:20px;height:20px;margin-top:1rem;margin-left:0.5rem;',
            }
        ),
    )

    class Meta:
        model = CustomUser
        fields = (
            'first_name',
            'last_name',
            'email',
            'password1',
            'password2',
            'info_mail_consent_given',
        )


class ProfessionalSubscriberSignupForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(ProfessionalSubscriberSignupForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].label = 'Fornavn'
        self.fields['last_name'].label = 'Efternavn'
        self.fields['password2'].label = 'Bekræft adgangskode'
        self.fields[
            'info_mail_consent_given'
        ].label = 'Jeg giver samtykke til at modtage mails med relevante informationer og opdateringer fra Børnebasen'
        self.fields[
            'password1'
        ].help_text = 'Din adgangskode skal bestå af mindst 8 cifre. Koden skal indeholde både tal og bogstaver.'
        self.fields['password2'].help_text = ''
        self.fields['email'].widget.attrs['placeholder'] = 'Email'
        self.fields['password1'].widget.attrs['placeholder'] = self.fields[
            'password1'
        ].label
        self.fields['password2'].widget.attrs['placeholder'] = self.fields[
            'password2'
        ].label
        self.fields['first_name'].widget.attrs['placeholder'] = self.fields[
            'first_name'
        ].label
        self.fields['last_name'].widget.attrs['placeholder'] = self.fields[
            'last_name'
        ].label

    first_name = forms.CharField(
        max_length=30,
        required=False,
    )
    last_name = forms.CharField(
        max_length=30,
        required=False,
    )

    email = forms.EmailField(max_length=254)

    info_mail_consent_given = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(
            attrs={
                'class': 'btn col',
                'style': 'width:20px;height:20px;margin-top:1rem;margin-left:0.5rem;',
            }
        ),
    )

    class Meta:
        model = CustomUser
        fields = (
            'first_name',
            'last_name',
            'email',
            'password1',
            'password2',
            'info_mail_consent_given',
        )


class ProviderSearchForm(forms.Form):
    service_category = forms.ModelChoiceField(
        queryset=ServiceCategory.objects.all(),
        required=False,
    )

    # Misc
    CHOICES = [
        ('VOLUNTEER', 'Frivilligt tilbud'),
        ('INTERNAL', 'Internt tilbud'),
        ('ONLINE', 'Tilbyder online'),
    ]
    misc = forms.MultipleChoiceField(
        choices=CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    # Location filters
    regions = forms.ModelMultipleChoiceField(
        queryset=Region.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    postal_codes = forms.ModelMultipleChoiceField(
        queryset=PostalCode.objects.all(),
        required=False,
    )

    themes = forms.ModelMultipleChoiceField(
        queryset=Theme.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    waiting_time = forms.ChoiceField(
        choices=Provider.WAITING_TIME_CHOICES,
        required=False,
    )

    gender = forms.ChoiceField(
        choices=Provider.SEXES_CHOICES,
        required=False,
    )

    languages = forms.ModelMultipleChoiceField(
        queryset=Language.objects.all(),
        required=False,
    )

    age = forms.IntegerField(
        max_value=23,
        min_value=0,
        required=False,
    )


class ProviderForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # This is not really used for anythin right now
        for field_name in ["name", "contact_phone"]:
            self.fields[field_name].widget.attrs.update(
                {'style': 'background-color : grey'}
            )
        for field_name in ["languages"]:
            self.fields[field_name].widget.attrs.update(
                {'style': 'background-color : grey'}
            )

    regions = forms.ModelMultipleChoiceField(
        queryset=Region.objects.all(), widget=forms.CheckboxSelectMultiple
    )
    languages = forms.ModelMultipleChoiceField(
        queryset=Language.objects.all(), widget=forms.CheckboxSelectMultiple
    )
    themes = forms.ModelMultipleChoiceField(
        queryset=Theme.objects.all(), widget=forms.CheckboxSelectMultiple
    )
    creditations = forms.ModelMultipleChoiceField(
        queryset=Creditation.objects.all(), widget=forms.CheckboxSelectMultiple
    )

    class Meta:
        model = Provider
        fields = "__all__"
        exclude = ['user']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Navn'}),
            'contact_name': forms.TextInput(attrs={'placeholder': 'Kontaktperson'}),
            'contact_phone': forms.TextInput(attrs={'placeholder': 'Telefon'}),
            'contact_email': forms.TextInput(attrs={'placeholder': 'Email'}),
            'contact_phone_2': forms.TextInput(attrs={'placeholder': 'Telefon 2'}),
            'contact_email_2': forms.TextInput(attrs={'placeholder': 'Email 2'}),
            'contact_address': forms.TextInput(attrs={'placeholder': 'Adresse'}),
            'contact_postal_code': forms.TextInput(attrs={'placeholder': 'Postnr. '}),
            'contact_city': forms.TextInput(attrs={'placeholder': 'By'}),
            'contact_cvr': forms.TextInput(attrs={'placeholder': 'Cvr nr.'}),
            'contact_website': forms.TextInput(attrs={'placeholder': 'Hjemmeside'}),
            'open_hours': forms.TextInput(attrs={'placeholder': 'Åbningstider'}),
        }


class ProviderContactInfoForm(forms.ModelForm):
    class Meta:
        model = Provider
        fields = [
            'contact_name',
            'contact_phone',
            'contact_phone_2',
            'contact_email',
            'contact_email_2',
            'contact_address',
            'contact_postal_code',
            'contact_city',
            'contact_cvr',
            'open_hours',
        ]

        widgets = {
            'contact_name': forms.TextInput(
                attrs={'placeholder': 'Kontaktperson', 'class': 'form-control'}
            ),
            'contact_phone': forms.TextInput(
                attrs={'placeholder': 'Telefon', 'class': 'form-control'}
            ),
            'contact_email': forms.TextInput(
                attrs={'placeholder': 'Email', 'class': 'form-control '}
            ),
            'contact_phone_2': forms.TextInput(
                attrs={'placeholder': 'Telefon 2', 'class': 'form-control'}
            ),
            'contact_email_2': forms.TextInput(
                attrs={'placeholder': 'Email 2', 'class': 'form-control'}
            ),
            'contact_address': forms.TextInput(
                attrs={'placeholder': 'Adresse', 'class': 'form-control'}
            ),
            'contact_postal_code': forms.TextInput(
                attrs={'placeholder': 'Postnr. ', 'class': 'form-control'}
            ),
            'contact_city': forms.TextInput(
                attrs={'placeholder': 'By', 'class': 'form-control'}
            ),
            'contact_cvr': forms.TextInput(
                attrs={'placeholder': 'Cvr nr.', 'class': 'form-control'}
            ),
            'open_hours': forms.TextInput(
                attrs={'placeholder': 'Åbningstider', 'class': 'form-control'}
            ),
        }
        help_texts = {
            "contact_name": "Kontaktpersonens navn kan ses på tilbuddets profil"
        }


class ProviderAboutInfoForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['themes'].label = 'Udfordringer'
        self.fields['themes'].queryset = self.fields['themes'].queryset.order_by('name')
        self.fields['creditations'].label = 'Kvalitetsstempler'
        self.fields['creditations'].queryset = self.fields[
            'creditations'
        ].queryset.order_by('name')
        self.fields['languages'].label = 'Sprog'
        self.fields['languages'].queryset = self.fields['languages'].queryset.order_by(
            'name'
        )
        self.fields['max_age'].label = 'Maksimal alder'
        self.fields['max_age'].help_text = "Du kan maks vælge til og med 23 år."

    max_age = forms.IntegerField(
        max_value=23,
        widget=forms.NumberInput(
            attrs={
                "class": "form-control",
            }
        ),
    )

    class Meta:
        model = Provider
        fields = [
            "name",
            "welcome_message",
            "min_age",
            "max_age",
            "themes",
            "sexes",
            "waiting_time",
            'status_report_interval',
            "creditations",
            "languages",
        ]
        widgets = {
            'name': forms.TextInput(
                attrs={'placeholder': 'Navn', 'class': 'form-control'}
            ),
            'welcome_message': forms.Textarea(
                attrs={
                    'placeholder': "...",
                    "class": "form-control",
                    "rows": 5,
                    "maxlength": "150",
                    "type": "text",
                }
            ),
            'min_age': forms.NumberInput(
                attrs={
                    'placeholder': "Minimumsalder",
                    "class": "form-control",
                }
            ),
            'themes':
            # TODO: CheckboxSelectMultiple
            forms.SelectMultiple(
                attrs={
                    "class": "form-control",
                }
            ),
            'sexes': forms.Select(
                attrs={
                    "class": "form-control",
                }
            ),
            'waiting_time': forms.Select(
                attrs={
                    "class": "form-control",
                }
            ),
            'status_report_interval': forms.Select(
                attrs={
                    "class": "form-control",
                }
            ),
            'creditations':
            # TODO: CheckboxSelectMultiple
            forms.SelectMultiple(
                attrs={
                    "class": "form-control",
                }
            ),
            'languages':
            # TODO: CheckboxSelectMultiple
            forms.SelectMultiple(
                attrs={
                    "class": "form-control",
                }
            ),
        }
        help_texts = {
            "welcome_message": "Maks 250 tegn",
            "languages": "Hold Ctrl-knappen nede for at vælge flere sprog",
            "themes": "Hold Ctrl-knappen nede for at vælge flere udfordringer",
        }


class ProviderBasisInfoForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['municipality_creditations'].label = 'Kommunereferencer'
        self.fields['municipality_creditations'].queryset = (
            self.fields['municipality_creditations']
            .queryset.exclude(is_not_municipality=True)
            .order_by('name')
        )

    class Meta:
        model = Provider
        fields = [
            'logo',
            'contact_website',
            "municipality_creditations",
            "company_description",
            "service_description",
            "method_description",
        ]
        widgets = {
            'contact_website': forms.TextInput(
                attrs={'placeholder': 'Hjemmeside', 'class': 'form-control'}
            ),
            'municipality_creditations': forms.SelectMultiple(
                attrs={
                    "class": "form-control",
                }
            ),
            'company_description': forms.Textarea(
                attrs={
                    'placeholder': "...",
                    "class": "form-control",
                    "rows": 20,
                    "type": "text",
                }
            ),
            'service_description': forms.Textarea(
                attrs={
                    'placeholder': "...",
                    "class": "form-control",
                    "rows": 20,
                    "type": "text",
                }
            ),
            'method_description': forms.Textarea(
                attrs={
                    'placeholder': "...",
                    "class": "form-control",
                    "rows": 20,
                    "type": "text",
                }
            ),
        }
        help_texts = {
            "municipality_creditations": "Hold Ctrl-knappen nede for at vælge flere referencer",
        }


class ProviderAdminInfoForm(forms.ModelForm):
    class Meta:
        model = Provider
        fields = ['admin_first_name', 'admin_last_name']

        widgets = {
            'admin_first_name': forms.TextInput(
                attrs={'placeholder': 'Administrators fornavn', 'class': 'form-control'}
            ),
            'admin_last_name': forms.TextInput(
                attrs={
                    'placeholder': 'Administrators efternavn',
                    'class': 'form-control',
                }
            ),
        }
        help_texts = {}


# ProviderAreaFormset = forms.inlineformset_factory(
# PostalCode, Area, form=AreaForm)


class InlineServiceForm(forms.ModelForm):

    #    def __init__(self, provider):
    #        self.provider = provider
    #
    #    ServiceFormSet = inlineformset_factory(
    #        Provider, Service, fields=(
    #            'full_day_price',
    #            'hourly_price'
    #        )
    #    )
    class Meta:
        model = Service
        fields = "__all__"
        widgets = {
            'category': forms.Select(attrs={'class': 'form-control'}),
        }
