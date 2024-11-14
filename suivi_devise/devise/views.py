import csv
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from .models import Devise, TauxDeChange
from .serializers import DeviseSerializer, TauxDeChangeSerializer

# ViewSet pour gérer les devises
class DeviseViewSet(viewsets.ModelViewSet):
    """
    API permettant de lister, récupérer et ajouter des devises.
    """
    queryset = Devise.objects.all()
    serializer_class = DeviseSerializer

    @action(detail=False, methods=['get'])
    def list_devises(self, request):
        """
        Endpoint pour lister toutes les devises disponibles.
        """
        devises = Devise.objects.all()
        serializer = self.get_serializer(devises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet pour gérer les taux de change
class TauxDeChangeViewSet(viewsets.ModelViewSet):
    """
    API permettant de lister, récupérer, ajouter des taux de change, et importer des données via un fichier CSV.
    """
    queryset = TauxDeChange.objects.all()
    serializer_class = TauxDeChangeSerializer

    @action(detail=False, methods=['get'])
    def list_taux_par_devise(self, request, devise_id=None):
        """
        Endpoint pour lister les taux de change d'une devise spécifique.
        """
        devise_id = request.query_params.get('id_devise')
        if not devise_id:
            return Response({"error": "Paramètre 'id_devise' requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        devise = get_object_or_404(Devise, id_devise=devise_id)
        taux_de_change = TauxDeChange.objects.filter(id_devise=devise)
        serializer = self.get_serializer(taux_de_change, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='(?P<code_iso>\w+)')
    def get_taux_by_devise_code(self, request, code_iso=None):
        """
        Endpoint pour lister les taux de change d'une devise spécifique en utilisant son code ISO.
        Exemple : /api/taux_de_change/USD
        """
        devise = get_object_or_404(Devise, code_iso=code_iso)
        taux_de_change = TauxDeChange.objects.filter(id_devise=devise)
        serializer = self.get_serializer(taux_de_change, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def upload_csv(self, request):
        """
        Endpoint pour charger un fichier CSV avec des taux de change.
        """
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "Fichier CSV non fourni."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            csv_file = csv.reader(file.read().decode('utf-8').splitlines())
            header = next(csv_file)  # Lire la première ligne d'en-tête
            
            # Vérification des colonnes du fichier CSV
            if header[0].lower() != 'datetime' or len(header) != 2:
                return Response({"error": "Format CSV incorrect. Utilisez les colonnes: DateTime, Devise_to_EUR"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Extraction du code de devise depuis l'en-tête (ex: "JPY" de "JPY_to_EUR")
            code_iso = header[1].split('_')[0]
            devise, created = Devise.objects.get_or_create(code_iso=code_iso)
            
            for row in csv_file:
                date_str, valeur_str = row
                date = datetime.fromisoformat(date_str.strip())
                valeur = float(valeur_str.strip())
                
                # Enregistrement de chaque taux de change
                TauxDeChange.objects.create(
                    date=date,
                    valeur=valeur,
                    id_devise=devise
                )

            return Response({"success": "Données CSV importées avec succès."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Erreur d'importation CSV: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def ajouter_taux(self, request):
        """
        Endpoint pour ajouter manuellement un taux de change pour une devise.
        """
        devise_id = request.data.get("id_devise")
        date_str = request.data.get("date")
        valeur = request.data.get("valeur")

        if not (devise_id and date_str and valeur):
            return Response({"error": "Les champs 'id_devise', 'date' et 'valeur' sont requis."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            devise = get_object_or_404(Devise, id_devise=devise_id)
            date = datetime.fromisoformat(date_str.strip())
            taux_de_change = TauxDeChange.objects.create(
                date=date,
                valeur=valeur,
                id_devise=devise
            )
            serializer = TauxDeChangeSerializer(taux_de_change)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Erreur lors de l'ajout du taux: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
