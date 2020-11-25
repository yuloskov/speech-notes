from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import UserRegisterViewSet

urlpatterns = [
    path('register/', UserRegisterViewSet.as_view({'post': 'create'})),
    path('login/', obtain_auth_token),
]
