# Generated by Django 3.2.6 on 2021-09-07 11:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0040_auto_20210901_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='administration_included',
            field=models.BooleanField(
                default=False, null=True, verbose_name='Administration'
            ),
        ),
        migrations.AddField(
            model_name='service',
            name='online',
            field=models.BooleanField(default=False, null=True, verbose_name='Online'),
        ),
        migrations.AddField(
            model_name='service',
            name='transport_included',
            field=models.BooleanField(default=False, null=True, verbose_name='Kørsel'),
        ),
    ]
