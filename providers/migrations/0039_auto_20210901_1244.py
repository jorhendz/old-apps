# Generated by Django 3.2.6 on 2021-09-01 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0038_3_auto_20210825_1528'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='info_mail_consent_given',
            field=models.BooleanField(
                default=False, verbose_name='Samtykke til info mail'
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='consent_given',
            field=models.BooleanField(default=False, verbose_name='Samtykke til GDPR'),
        ),
    ]
