# Generated by Django 3.2.12 on 2022-04-24 14:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0081_remove_provider_membership'),
    ]

    operations = [
        migrations.RenameField(
            model_name='provider',
            old_name='membership2',
            new_name='membership',
        ),
    ]