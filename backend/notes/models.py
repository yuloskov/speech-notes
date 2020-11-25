from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


class Note(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    datetime = models.DateTimeField(auto_now_add=True)

    title = models.CharField(max_length=100, null=True, default=None)
    text = models.CharField(max_length=1000, null=True, default=None)
    audio_file = models.FileField(null=True, default=None, upload_to=settings.AUDIO_FILE_UPLOAD_DIR)

    (STATUS_PENDING, STATUS_OK, STATUS_ERROR) = range(3)
    AUDIO_PROCESSING_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_OK, "Ok"),
        (STATUS_ERROR, "Error")
    )
    audio_processing_status = models.IntegerField(choices=AUDIO_PROCESSING_CHOICES, null=True, default=None)

    @property
    def has_audio_file(self):
        return bool(self.audio_file)
