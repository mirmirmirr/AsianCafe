# Generated by Django 5.1.4 on 2025-01-08 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_orderitem_extras"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="quantity",
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
