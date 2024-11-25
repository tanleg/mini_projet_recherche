from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from devise.views import DeviseViewSet, TauxDeChangeViewSet, PostViewSet
from django.views.generic import TemplateView

# Création d'un routeur pour gérer les routes automatiquement
router = DefaultRouter()
router.register(r'devise', DeviseViewSet, basename='devise')
router.register(r'taux_de_change', TauxDeChangeViewSet, basename='taux_de_change')

urlpatterns = [
    path('admin/', admin.site.urls),             # URL pour l'interface d'administration
    path('api/', include(router.urls)),
    path('api/charger_csv/', PostViewSet.as_view(), name='charger_csv'),
    path('', TemplateView.as_view(template_name='index.html'))
]
