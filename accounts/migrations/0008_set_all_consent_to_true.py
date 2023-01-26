from django.db import migrations, models


def set_all_true(apps, schema_editor):
    CustomUser = apps.get_model("accounts", "CustomUser")
    for user in CustomUser.objects.all():
        user.consent_given = True
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20210901_0913'),
    ]

    operations = [
        migrations.RunPython(set_all_true),
    ]
