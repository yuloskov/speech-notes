from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'datetime', 'title', 'text', 'audio_file', 'audio_processing_status')
        read_only_fields = ('id', 'datetime', 'audio_processing_status')
