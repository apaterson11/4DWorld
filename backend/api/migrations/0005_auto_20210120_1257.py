# Generated by Django 3.1.2 on 2021-01-20 12:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20210120_1151'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landmark',
            name='map',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='landmarks', to='api.map'),
        ),
    ]