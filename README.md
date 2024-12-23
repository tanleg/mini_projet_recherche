# Application de Suivi des Cours des Devises

## Description

Cette application permet de suivre et de gérer les cours de devises en temps réel. Elle offre plusieurs fonctionnalités : 
- Affichage graphique de l'évolution des cours des devises (USD, GBP, SEK).
- Ajout de nouvelles devises et mise à jour des cours via des fichiers CSV.
- Accès aux données via une API REST.

L'application est conçue pour répondre aux besoins d'analyse des fluctuations monétaires, tout en permettant une gestion efficace des données.

---

## Fonctionnalités


1. **Base de données** :
   - Stocke les cours des devises avec une historisation des variations par date.

2. **API REST** :
   - **Récupération des cours** : Endpoint GET pour obtenir les données d'une devise spécifique.
   - **Ajout via CSV** : Endpoint POST pour importer des fichiers CSV contenant des données sur les devises et leurs variations.
   - **Liste des devises** : Endpoint GET pour afficher toutes les devises disponibles.

3. **Interface Web** :
   - **Graphiques dynamiques** : Visualisation de l'évolution des cours par devise.
   - **Formulaire CSV** : Interface pour charger des fichiers CSV et enrichir la base de données.

---

## Technologies Utilisées

La contrainte de temps du projet a favorisé l'utilisation de technlogies simples et permettant un développement rapide :  

- **Backend** : Django  
     Django est choisi pour sa productivité grâce à son ORM intégré, son architecture MVT modulaire, et son support natif des API REST, permettant un développement rapide et structuré tout en favorisant la maintenabilité.
- **Base de données** : MySQL  
     MySQL offre une solution fiable et performante pour gérer les données des devises et des taux de change, tout en s’intégrant parfaitement avec Django et en étant accessible pour une configuration locale ou en cloud.
- **Frontend** : Bootstrap  
   Bootstrap facilite le développement rapide d’une interface utilisateur responsive avec des composants prêts à l’emploi, tout en s’intégrant efficacement avec des bibliothèques de visualisation de données comme Chart.js
- **API REST** : Intégrée dans Django  
   L’intégration de l’API REST dans Django simplifie la gestion du projet en restant cohérente avec l’architecture backend, tout en garantissant des performances optimales et une standardisation pour des usages futurs.

---

## Modèle de Données

- **Table `devise`** :
  - `id_devise` (clé primaire, auto-incrément)
  - `code_iso` (code ISO de la devise)

- **Table `taux_de_change`** :
  - `id_taux` (clé primaire, auto-incrément)
  - `date` (date du cours)
  - `valeur` (valeur du cours)
  - `id_devise` (clé étrangère vers `devise`)

---

## Installation et Exécution

1. **Cloner le dépôt** :
   ```
   git clone https://github.com/tanleg/mini_projet_recherche.git
   cd mini_projet_recherche
   ```

2. **Installer les dépendances** :
   - Créer un environnement virtuel et l'activer
     ```
     python -m venv venv
     .\venv\Scripts\Activate
     pip install -r requirements.txt
     ```

3. **Configurer la base de données** :
   - Créer une base MySQL grâce au fichier [suivi_devises](suivi_devises.sql)
   - Mettre à jour les paramètres DATABASES dans `settings.py`.
   - Effectuer les migrations pour la base de données :
     ```
     cd suivi_devise
     python manage.py makemigrations
     python manage.py migrate
     ```
4. **Lancer le projet** :
     ```
     python manage.py runserver
     ```
     L'interface web se trouve à l'adresse suivante : http://127.0.0.1:8000/
---

## Utilisation

1. Accéder à l'application web pour visualiser les graphiques et charger des fichiers CSV.
2. Parcourir les devises et appuyer sur "Afficher" pour afficher l'historique des données sous forme de graphique.
3. Charger un fichier CSV pour ajouter une nouvelle devise ou remplacer les données d'une devise existante.
   Format du fichier CSV : DateTime,JPY_to_EUR  
   Exemple :  
      DateTime,JPY_to_EUR  
      2024-11-12 14:27:50.735354,0.007473733501264278  
      2024-11-12 14:57:50.735354,0.007342967307777718


---

## Membres de l'Équipe

- SACROUD Riad
- TOULLEC Alexis
- LE GOFF Tanguy

---

## Vidéo de Démonstration

Lien vers la vidéo : https://youtu.be/l9cHH7xRAL8

---

