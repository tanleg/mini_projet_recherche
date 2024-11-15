from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from devise.views import DeviseViewSet, TauxDeChangeViewSet  # Remplacez 'mon_app' par le nom de votre application

# Création d'un routeur pour gérer les routes automatiquement
router = DefaultRouter()
router.register(r'devise', DeviseViewSet, basename='devise')
router.register(r'taux_de_change', TauxDeChangeViewSet, basename='taux_de_change')

urlpatterns = [
    path('admin/', admin.site.urls),             # URL pour l'interface d'administration
    path('api/', include(router.urls)),          # URL pour les endpoints de l'API
]
