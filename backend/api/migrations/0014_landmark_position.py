# Generated by Django 3.1.2 on 2021-02-17 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20210216_1137'),
    ]

    operations = [
        migrations.AddField(
            model_name='landmark',
            name='position',
            field=models.IntegerField(default=-1),
        ),
    ]
