# Generated by Django 3.2.12 on 2022-04-13 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0073_remove_provider_area'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='is_internal',
            field=models.BooleanField(default=False, verbose_name='Kommunalt tilbud'),
        ),
    ]
