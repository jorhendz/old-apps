# Generated by Django 3.2.4 on 2021-08-18 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0034_is_free2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='service_description',
            field=models.TextField(
                blank=True,
                default='',
                max_length=2000,
                null=True,
                verbose_name='Beskrivelse af indsats',
            ),
        ),
    ]