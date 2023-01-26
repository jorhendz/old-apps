from django.db import migrations


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
                elif service.full_day_price is None:
                    provider.is_volunteer_organization = False
                elif service.hourly_price is None:
                    provider.is_volunteer_organization = False
            provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0032_alter_language_name'),
    ]

    operations = [
        migrations.RunPython(set_is_free),
    ]
