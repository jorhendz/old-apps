# Generated by Django 3.2.3 on 2021-06-02 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0020_auto_20210602_0851'),
    ]

    operations = [
        migrations.AddField(
            model_name='language',
            name='is_shown_on_search',
            field=models.BooleanField(default=False),
        ),
    ]
