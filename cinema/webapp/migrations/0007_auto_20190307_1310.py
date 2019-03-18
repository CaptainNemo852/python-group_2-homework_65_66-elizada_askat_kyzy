# Generated by Django 2.1.7 on 2019-03-07 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0006_auto_20190307_1254'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='status',
            field=models.CharField(choices=[('Created', 'Создано'), ('Bought', 'Выкуплено'), ('Canceled', 'Отменено')], default='Created', max_length=12),
        ),
    ]