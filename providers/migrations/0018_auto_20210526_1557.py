# Generated by Django 3.2.3 on 2021-05-26 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0017_merge_0006_auto_20210524_1523_0016_provider_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='contact_phone',
            field=models.CharField(
                blank=True, max_length=850, null=True, verbose_name='Telefon'
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='contact_phone_2',
            field=models.CharField(
                blank=True, max_length=150, null=True, verbose_name='Telefon 2'
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='contact_title',
            field=models.CharField(
                blank=True, max_length=60, null=True, verbose_name='Stiftet d.'
            ),
        ),
        migrations.AlterField(
            model_name='provider',
            name='open_hours',
            field=models.CharField(
                blank=True, max_length=550, null=True, verbose_name='Åbningstider'
            ),
        ),
    ]
