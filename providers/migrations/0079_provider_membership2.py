# Generated by Django 3.2.12 on 2022-04-24 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0078_alter_provider_welcome_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='membership2',
            field=models.IntegerField(
                choices=[(0, 'Begynder'), (1, 'Basis'), (2, 'Ekspert')],
                default=0,
                verbose_name='Medlemstype',
            ),
        ),
    ]
