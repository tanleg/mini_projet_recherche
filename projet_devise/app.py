from flask import Flask, jsonify, render_template
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy


# Charger les variables d'environnement depuis le fichier .env
load_dotenv()


app = Flask(__name__)


# Configurer la base de données avec la variable d'environnement
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optionnelle, mais recommande de la désactiver pour économiser des ressources

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

class Devise(db.Model):
    __tablename__ = 'devise'  # Nom de la table dans la base de données
    id_devise = db.Column(db.Integer, primary_key=True)
    code_iso = db.Column(db.String(3), nullable=False)
    
     # Relation vers TauxDeChange, précisant 'primaryjoin'
    taux_de_change = db.relationship('TauxDeChange', back_populates="devise")
    
class TauxDeChange(db.Model):
    __tablename__ = 'taux_de_change'
    id_taux = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)  # Date et heure du taux de change
    valeur = db.Column(db.Float, nullable=False)  # Valeur du taux de change
    id_devise = db.Column(db.Integer, db.ForeignKey('devise.id_devise'), nullable=False)  # Relation avec la devise

    devise = db.relationship('Devise', back_populates="taux_de_change")

Devise.taux_de_change = db.relationship('TauxDeChange', back_populates="devise")


@app.route('/api/devises', methods=['GET'])
def get_devises():
    devises = Devise.query.all()  # Remplacez par la requête pour récupérer vos devises
    devises_list = [{"id_devise": devise.id_devise, "code_iso": devise.code_iso} for devise in devises]
    return jsonify(devises_list)

@app.route('/api/taux_de_change/<string:code_iso>', methods=['GET'])
def get_taux_de_change(code_iso):
    # Récupérer l'ID de la devise à partir du code ISO
    devise = Devise.query.filter_by(code_iso=code_iso).first()
    if not devise:
        return jsonify({"error": "Devise non trouvée"}), 404

    # Récupérer les taux de change pour cette devise
    taux = TauxDeChange.query.filter_by(id_devise=devise.id_devise).order_by(TauxDeChange.date).all()
    if not taux:
        return jsonify({"error": "Pas de taux de change disponibles pour cette devise"}), 404

    # Extraire les données des taux
    data = [{
        'labels': t.date.strftime('%Y-%m-%d %H:%M:%S'),  # Format de la date
        'taux': t.valeur,
    }
            for t in taux]

    return jsonify(data)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
