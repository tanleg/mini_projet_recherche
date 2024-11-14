from django.db import models

class Devise(models.Model):
    id_devise = models.AutoField(primary_key=True)  # Clé primaire auto-incrémentée
    code_iso = models.CharField(max_length=50)  # Code ISO de la devise

    class Meta:
        db_table = 'devise'  # Nom exact de la table dans la base de données


class TauxDeChange(models.Model):
    id_taux = models.AutoField(primary_key=True)  # Clé primaire auto-incrémentée
    date = models.DateTimeField()  # Date associée au taux de change
    valeur = models.DecimalField(max_digits=25, decimal_places=20)  # Valeur décimale du taux de change
    id_devise = models.ForeignKey(Devise, on_delete=models.CASCADE, db_column='id_devise')  # Clé étrangère vers la devise

    class Meta:
        db_table = 'taux_de_change'  # Nom exact de la table dans la base de données
