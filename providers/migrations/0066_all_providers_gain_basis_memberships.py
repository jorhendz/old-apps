from providers.models import Provider
from django.db import migrations


def free_to_basis(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    for provider in Provider.objects.all():
        provider.membership = "Basis"
        provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0065_alter_provider_membership'),
    ]

    operations = [
        migrations.RunPython(free_to_basis),
    ]
