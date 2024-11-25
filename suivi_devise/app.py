from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autoriser CORS pour les appels API

# Endpoint pour l'API REST
@app.route('/api/resource', methods=['GET'])
def api_resource():
    return jsonify({"message": "Hello from the API!"})

# Endpoint pour le front-end
@app.route('/')
def index():
    return render_template('index.html')  # Sert le fichier HTML

if __name__ == '__main__':
    app.run(debug=True)
