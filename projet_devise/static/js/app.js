let currentChart = null;

// Fonction afficherGraphique définie en dehors de window.onload
function afficherGraphique(devise) {
    const ctx = document.getElementById('deviseGraph').getContext('2d');

    fetch(`/api/taux_de_change/${devise}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            const labels = data.map(item => item.labels);
            const taux = data.map(item => item.taux);

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

window.onload = function() {
    // Charger les devises et afficher le tableau
    function chargerDevises() {
        console.log("Tentative de récupération des devises...");
        fetch('http://localhost:5000/api/devises')
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

    chargerDevises();
};

function upload(){
    document.getElementById('uploadButton').addEventListener('click', async () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0]; // Récupérer le fichier sélectionné
    
        if (!file) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch('https://localhost:8000/api/charger_csv', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.json();
                alert("Fichier téléchargé avec succès !");
                console.log(result); // Résultat de l'API
            } else {
                console.error("Erreur lors de l'envoi du fichier :", response.statusText);
                alert("Échec du téléchargement.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Une erreur réseau est survenue.");
        }
    });
    
} 
