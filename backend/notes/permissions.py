from rest_framework import permissions
from django.conf import settings


class MyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        is_valid_stt = 'auth_token' in request.data and \
                       request.data['auth_token'] == settings.STT_SERVICE_TOKEN
        return bool(request.user and request.user.is_authenticated or is_valid_stt)
