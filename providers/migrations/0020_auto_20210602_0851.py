# Generated by Django 3.2.3 on 2021-06-02 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0019_sharedknowledge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sharedknowledge',
            name='name',
            field=models.CharField(max_length=255, verbose_name='Beskrivelse'),
        ),
        migrations.CreateModel(
            name='Area',
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
                ('name', models.CharField(max_length=255)),
                ('postal_codes', models.ManyToManyField(to='providers.PostalCode')),
            ],
            options={
                'verbose_name': 'Område',
                'verbose_name_plural': 'Områder',
            },
        ),
    ]
