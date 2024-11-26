let currentChart = null;

let initialChartState = {
    xMin: null,
    xMax: null,
    yMin: null,
    yMax: null
};

document.addEventListener("DOMContentLoaded", function () {
    chargerDevises();
    document.getElementById('btnSubmit').addEventListener('click', upload);
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


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
                    maintainAspectRatio: false, 
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        zoom: {
                            wheel: {
                                enabled: true,  // Active le zoom avec la molette de la souris
                                speed: 0.1      // Détermine la vitesse du zoom
                            },
                            drag: {
                                enabled: true,  // Active le zoom par glissement (drag)
                                speed: 0.1      // Vitesse du zoom
                            },
                            pinch: {
                                enabled: true,  // Active le zoom par pincement (pour les appareils tactiles)
                                speed: 0.1      // Vitesse du zoom
                            }
                        }
                    }
                    
                }
            });


            initialChartState.xMin = currentChart.scales.x.min;
            initialChartState.xMax = currentChart.scales.x.max;
            initialChartState.yMin = currentChart.scales.y.min;
            initialChartState.yMax = currentChart.scales.y.max;
            document.getElementById('deviseGraph').addEventListener('click', zoomGraph);    
            document.getElementById('resetZoomButton').addEventListener('click', dezoomGraph);

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
    event.preventDefault();

    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://127.0.0.1:8000/api/charger_csv/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du fichier');
        }
        return response.json();
    })
    .then(data => {
        alert("Fichier téléchargé avec succès !");
        chargerDevises();
        console.log(data);
    })
    .catch(error => {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de l'upload.");
    });
}
 

function zoomGraph(event) {
    const xScale = currentChart.scales.x;

    const canvasX = event.offsetX;

    const dataX = xScale.getValueForPixel(canvasX);

    console.log(`Clic à position X: ${dataX}`);

    const zoomFactor = 0.5; // zoom 50%
    const rangeX = xScale.max - xScale.min;

    const newMinX = dataX - rangeX * zoomFactor / 2;
    const newMaxX = dataX + rangeX * zoomFactor / 2;

    xScale.min = newMinX;
    xScale.max = newMaxX;

    currentChart.options.scales.x.min = newMinX;
    currentChart.options.scales.x.max = newMaxX;

    currentChart.update('none');
}


function dezoomGraph() {
    if (currentChart) {
        
        currentChart.options.scales.x.min = initialChartState.xMin;
        currentChart.options.scales.x.max = initialChartState.xMax;

        currentChart.scales.x.min = initialChartState.xMin;
        currentChart.scales.x.max = initialChartState.xMax;

        currentChart.update();
    }
}

