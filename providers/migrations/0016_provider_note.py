# Generated by Django 3.2.3 on 2021-05-26 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0015_socialworker_newsletter'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='note',
            field=models.TextField(
                blank=True, max_length=50000, null=True, verbose_name='Note'
            ),
        ),
    ]
