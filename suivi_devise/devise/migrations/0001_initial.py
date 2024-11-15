# Generated by Django 5.1.3 on 2024-11-14 13:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Devise',
            fields=[
                ('id_devise', models.AutoField(primary_key=True, serialize=False)),
                ('code_iso', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'devise',
            },
        ),
        migrations.CreateModel(
            name='TauxDeChange',
            fields=[
                ('id_taux', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('valeur', models.DecimalField(decimal_places=20, max_digits=25)),
                ('id_devise', models.ForeignKey(db_column='id_devise', on_delete=django.db.models.deletion.CASCADE, to='devise.devise')),
            ],
            options={
                'db_table': 'taux_de_change',
            },
        ),
    ]
