# Generated by Django 3.2.13 on 2022-08-02 15:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0084_duplicatetablejob"),
    ]

    operations = [
        migrations.AlterField(
            model_name="fileimportjob",
            name="name",
            field=models.CharField(
                default="",
                help_text="The name of the created " "table.",
                max_length=255,
            ),
        ),
    ]
