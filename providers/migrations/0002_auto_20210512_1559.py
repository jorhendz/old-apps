# Generated by Django 3.2.2 on 2021-05-12 15:59

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='contact_city',
            field=models.CharField(blank=True, max_length=80, null=True),
        ),
        migrations.AlterField(
            model_name='provider',
            name='contact_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='provider',
            name='contact_phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='provider',
            name='contact_postal_code',
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(9999),
                ],
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='languages',
            field=models.ManyToManyField(blank=True, to='providers.Language'),
        ),
        migrations.AlterField(
            model_name='provider',
            name='max_age',
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='min_age',
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='regions',
            field=models.ManyToManyField(blank=True, to='providers.Region'),
        ),
        migrations.AlterField(
            model_name='provider',
            name='themes',
            field=models.ManyToManyField(blank=True, to='providers.Theme'),
        ),
    ]
