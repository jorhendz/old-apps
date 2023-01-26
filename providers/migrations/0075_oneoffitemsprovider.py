# Generated by Django 3.2.12 on 2022-04-19 15:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0074_provider_is_internal'),
    ]

    operations = [
        migrations.CreateModel(
            name='OneOffItemsProvider',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                (
                    'should_receive_is_internal_flow',
                    models.BooleanField(
                        default=False,
                        verbose_name="Skal modtage et 'Kommunalt tilbud? Ja/nej'-flow næste gang, de logger ind",
                    ),
                ),
                (
                    'provider',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='oneoffitems',
                        to='providers.provider',
                    ),
                ),
            ],
            options={
                'abstract': False,
            },
        ),
    ]