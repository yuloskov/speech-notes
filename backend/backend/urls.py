from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('notes/', include('notes.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('user_management.urls')),
] + static(settings.AUDIO_FILE_UPLOAD_DIR, document_root=settings.AUDIO_FILE_UPLOAD_DIR)
