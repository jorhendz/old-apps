from providers.models import Provider
from django.db import migrations


def basis_to_beginner(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    for provider in Provider.objects.all():
        provider.membership = "Begynder"
        provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0071_auto_20211229_1321'),
    ]

    operations = [
        migrations.RunPython(basis_to_beginner),
    ]
