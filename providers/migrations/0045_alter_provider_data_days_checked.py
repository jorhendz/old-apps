# Generated by Django 3.2.6 on 2021-09-12 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0044_provider_data_days_checked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='data_days_checked',
            field=models.BooleanField(
                default=False, verbose_name='Tjekket til DataDays'
            ),
        ),
    ]
