# Generated by Django 4.1 on 2024-07-12 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0002_profile"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="role",
            field=models.PositiveSmallIntegerField(
                blank=True,
                choices=[(1, "Customer"), (2, "Manager"), (3, "Supervisor")],
                null=True,
            ),
        ),
    ]
