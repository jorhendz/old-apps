# Generated by Django 3.2.12 on 2022-04-24 14:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0080_memberships_part_2'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='provider',
            name='membership',
        ),
    ]