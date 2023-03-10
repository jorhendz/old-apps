# Generated by Django 3.2.4 on 2021-06-24 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0026_auto_20210609_0701'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='is_public',
            field=models.BooleanField(default=False, verbose_name='Offentliggjort'),
        ),
        migrations.AddField(
            model_name='provider',
            name='is_volunteer_organization',
            field=models.BooleanField(default=False, verbose_name='Frivilligt tilbud'),
        ),
    ]
