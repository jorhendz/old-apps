from django.db import migrations, models


def admin_name_format(apps, schema_editor):
    CustomUser = apps.get_model("accounts", "CustomUser")
    Provider = apps.get_model("providers", "Provider")
    for user in CustomUser.objects.all():
        for provider in Provider.objects.all():
            if user.email == provider.contact_email:
                provider.admin_first_name = user.first_name
                provider.admin_last_name = user.last_name
                print(user.email)
                provider.save()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_auto_20210922_1141'),
    ]

    operations = [
        # migrations.RunPython(admin_name_format),
    ]
