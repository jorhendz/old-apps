from django.db import migrations


def consent_is_true(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    Service = apps.get_model("providers", "Service")
    for provider in Provider.objects.all():
        provider.consent_given = True
        provider.info_mail_consent_given = True
        provider.save()


class Migration(migrations.Migration):
    dependencies = [
        ('providers', '0042_alter_service_options'),
    ]

    operations = [
        migrations.RunPython(consent_is_true),
    ]
