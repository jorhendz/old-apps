# Generated by Django 3.2.4 on 2021-06-24 10:51

from django.db import migrations


def set_providers_active(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    Service = apps.get_model("providers", "Service")
    Theme = apps.get_model("providers", "Theme")

    for provider in Provider.objects.all():
        services = Service.objects.filter(provider=provider).all()
        themes = Theme.objects.filter(provider=provider).all()
        if provider.consent_given and provider.user.is_active and services.count() > 0:
            provider.is_public = True
            provider.save()
    print(
        "> Providers set public if they have themes, services, consent and user is active."
    )


def set_is_free(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    Service = apps.get_model("providers", "Service")
    for provider in Provider.objects.all():
        services = Service.objects.filter(provider=provider).all()
        if not len(services) == 0:
            provider.is_volunteer_organization = True
            for service in services:
                if service.full_day_price is not None and service.full_day_price > 0:
                    provider.is_volunteer_organization = False
                elif service.hourly_price is not None and service.hourly_price > 0:
                    provider.is_volunteer_organization = False
            provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0027_auto_20210624_1050'),
    ]

    operations = [
        migrations.RunPython(set_providers_active),
        migrations.RunPython(set_is_free),
    ]
