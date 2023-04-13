# Generated by Django 3.2.13 on 2023-01-30 11:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0055_auto_20230130_1118"),
        ("database", "0109_rename_group_token_workspace"),
    ]

    operations = [
        migrations.AlterField(
            model_name="token",
            name="workspace",
            field=models.ForeignKey(
                help_text="Only the tables of the workspace can be accessed.",
                on_delete=django.db.models.deletion.CASCADE,
                to="core.workspace",
            ),
        ),
    ]
