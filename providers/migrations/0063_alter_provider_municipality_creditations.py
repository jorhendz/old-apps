# Generated by Django 3.2.8 on 2021-11-28 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0062_auto_20211128_2044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='municipality_creditations',
            field=models.ManyToManyField(
                blank=True, related_name='Kommunereference', to='providers.Municipality'
            ),
        ),
    ]
