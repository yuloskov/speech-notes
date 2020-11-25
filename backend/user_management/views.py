from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from .serializers import UserRegisterSerializer


class UserRegisterViewSet(mixins.CreateModelMixin, GenericViewSet):
    serializer_class = UserRegisterSerializer
