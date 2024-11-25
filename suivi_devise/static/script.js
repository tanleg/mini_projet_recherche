let currentChart = null;

// Fonction afficherGraphique définie en dehors de window.onload
function afficherGraphique(devise) {
    const ctx = document.getElementById('deviseGraph').getContext('2d');

    fetch(`/api/taux_de_change/${devise}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            const labels = data.map(item => item.date);
            const taux = data.map(item => item.valeur);

            if (currentChart) {
                currentChart.destroy();
            }

            
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Taux de change de ${devise}`,
                        data: taux,
                        fill: true,
                        borderColor: 'rgb(40, 167, 69)',
                        backgroundColor: "rgba(0, 128, 0, 0.2)",
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Désactive le ratio pour adapter la largeur
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Taux de change: ${context.parsed.y}`;
                                }
                            }
                        }
                    }
                }
            });

            const modal = new bootstrap.Modal(document.getElementById('graphModal'));
            modal.show();
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données : ", error);
        });
}


function chargerDevises() {
    console.log("Tentative de récupération des devises...");
    fetch('http://localhost:8000/api/devise')
        .then(response => {
            if (!response.ok) {
                console.error('Erreur dans la requête API:', response.statusText);
                throw new Error('Erreur dans la requête API');
            }
            return response.json();
        })
        .then(data => {
            console.log('Données reçues :', data);
            const tbody = document.querySelector('.currency-table tbody');
            tbody.innerHTML = '';

            data.forEach(devise => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${devise.code_iso}</td>
                    <td>
                        <button class="btn btn-primary" onclick="afficherGraphique('${devise.code_iso}')">
                            <i class="fas fa-chart-line"></i> Afficher
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des devises :', error);
        });
}

function upload(event) {
    // Empêche le rafraîchissement automatique de la page
    event.preventDefault();

    // Récupérer le fichier sélectionné
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    // Récupérer le token CSRF
    const csrfToken = document.querySelector('[name="csrf-token"]').value;

    // Créer un objet FormData et y ajouter le fichier
    const formData = new FormData();
    formData.append('file', file);

    // Envoi du fichier au serveur avec CSRF Token
    fetch('http://localhost:8000/api/charger_csv', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken // Ajouter le token CSRF dans les en-têtes
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du fichier');
        }
        return response.json();
    })
    .then(result => {
        alert("Fichier téléchargé avec succès !");
        console.log(result); // Résultat de l'API
    })
    .catch(error => {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de l'upload.");
    });
}

document.getElementById('csvForm').addEventListener('submit', upload);

window.onload = function() {
    chargerDevises();
};

