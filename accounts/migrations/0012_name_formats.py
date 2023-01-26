from django.db import migrations, models


def name_format(apps, schema_editor):
    CustomUser = apps.get_model("accounts", "CustomUser")
    for user in CustomUser.objects.all():
        if (user.name != None) and (len(user.name) != 0):
            if (user.first_name == None) or (len(user.first_name) == 0):
                user.first_name = user.name.split(' ', 1)[0]
                if len(user.name.split(' ', 1)) > 1:
                    user.last_name = user.name.split(' ', 1)[1]
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_customuser_consent_given'),
    ]

    operations = [
        migrations.RunPython(name_format),
    ]
