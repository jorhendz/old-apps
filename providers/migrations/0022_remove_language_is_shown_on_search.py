# Generated by Django 3.2.3 on 2021-06-02 10:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0021_language_is_shown_on_search'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='language',
            name='is_shown_on_search',
        ),
    ]