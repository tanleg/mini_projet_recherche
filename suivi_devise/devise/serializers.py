from rest_framework import serializers
from .models import Devise, TauxDeChange

class DeviseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devise
        fields = ['id_devise', 'code_iso']  # Champs à exposer dans l'API

class TauxDeChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TauxDeChange
        fields = ['id_taux', 'date', 'valeur', 'id_devise']  # Champs à exposer dans l'API
