import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .permissions import MyPermission
from rest_framework.response import Response

from .models import Note
from .serializers import NoteSerializer

import logging
logger = logging.getLogger(__name__)


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [MyPermission]
    serializer_class = NoteSerializer

    def get_queryset(self):
        user = self.request.user
        notes = Note.objects.filter(author=user).order_by('datetime')
        return notes

    def perform_create(self, serializer):
        note = serializer.save(author=self.request.user)

        if note.has_audio_file:
            self._initiate_audio_file_processing(note)

    def perform_update(self, serializer):
        note = serializer.save()

        if note.has_audio_file:
            self._initiate_audio_file_processing(note)

    def _initiate_audio_file_processing(self, note):
        callback_url = f'http://web:8000/notes/' \
                       f'{note.pk}/process_audio_callback/'

        if settings.STT_SERVICE_URL is None:
            note.audio_processing_status = Note.STATUS_ERROR
            note.save(update_fields=['audio_processing_status'])

            logger.warning(f'STT_SERVICE_URL is not specified. callback_url: {callback_url}')
            return

        response = requests.post(
            settings.STT_SERVICE_URL,
            data={
                'callback_url': callback_url,
                'auth_token': settings.STT_SERVICE_TOKEN,
            },
            files={'audio_file': note.audio_file}
        )

        if response.status_code == status.HTTP_200_OK:
            note.audio_processing_status = Note.STATUS_PENDING
        else:
            note.audio_processing_status = Note.STATUS_ERROR

        note.save(update_fields=['audio_processing_status'])

    @action(detail=True, methods=['post'])
    def process_audio_callback(self, request, pk=None):
        note = Note.objects.get(pk=pk)

        text = request.data.get('text')
        success = request.data.get('success')

        note.text = text if success is True else None
        note.audio_processing_status = Note.STATUS_OK if success is True else Note.STATUS_ERROR
        note.save(update_fields=['text', 'audio_processing_status'])

        return Response(status=status.HTTP_200_OK)
