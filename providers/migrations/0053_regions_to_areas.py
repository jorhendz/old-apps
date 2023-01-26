from providers.models import Provider, Area
from django.db import migrations


def regions_to_areas(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    Area = apps.get_model("providers", "Area")
    for provider in Provider.objects.all():
        provider_areas = [area.name for area in provider.area.all()]
        for region in provider.regions.all():
            if region.name not in provider_areas:
                provider.area.set(
                    provider.area.all().union(
                        Area.objects.all().filter(name=region.name)
                    )
                )
        print(provider.name)
        provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0052_alter_professionalsubscriber_authentication_key'),
    ]

    operations = [
        migrations.RunPython(regions_to_areas),
    ]
