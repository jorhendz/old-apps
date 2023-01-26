# Generated by Django 3.2.8 on 2021-11-30 07:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0064_alter_provider_municipality_creditations'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provider',
            name='membership',
            field=models.CharField(
                choices=[
                    ('Begynder', 'Begynder'),
                    ('Basis', 'Basis'),
                    ('Ekspert', 'Ekspert'),
                ],
                default='Begynder',
                max_length=100,
                verbose_name='Medlemstype',
            ),
        ),
    ]
