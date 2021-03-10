# Generated by Django 3.1.2 on 2021-03-10 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_merge_20210224_1242'),
    ]

    operations = [
        migrations.AddField(
            model_name='landmarkimage',
            name='image_name',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AlterField(
            model_name='layer',
            name='description',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='layer',
            name='name',
            field=models.TextField(default=''),
        ),
    ]
