# Generated by Django 3.1.3 on 2020-11-24 12:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(default=None, max_length=100, null=True)),
                ('text', models.CharField(default=None, max_length=1000, null=True)),
                ('audio_file', models.FileField(default=None, null=True, upload_to='uploaded-audio-files/')),
                ('audio_processing_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Ok'), (2, 'Error')], default=None, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
