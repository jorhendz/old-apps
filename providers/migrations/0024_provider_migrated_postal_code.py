# Generated by Django 3.2.3 on 2021-06-04 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0023_auto_20210604_0859'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='migrated_postal_code',
            field=models.IntegerField(
                blank=True, null=True, verbose_name='Postnummer fra gammelt system'
            ),
        ),
    ]
