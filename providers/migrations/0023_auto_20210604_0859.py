# Generated by Django 3.2.3 on 2021-06-04 08:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0022_remove_language_is_shown_on_search'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='consent_given',
            field=models.BooleanField(default=False, verbose_name='Samtykke'),
        ),
        migrations.AddField(
            model_name='provider',
            name='registered_externally',
            field=models.BooleanField(default=False, verbose_name='Selvregistreret'),
        ),
    ]
