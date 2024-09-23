let temperatureChart, economicChart;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    const economicCtx = document.getElementById('economicChart').getContext('2d');

    temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature Change (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    economicChart = new Chart(economicCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Economic Impact ($B)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCharts(data) {
    updateTemperatureChart(data.temperatureData);
    updateEconomicChart(data.economicData);
}

function updateTemperatureChart(data) {
    temperatureChart.data.labels = data.map(d => d.year);
    temperatureChart.data.datasets[0].data = data.map(d => d.temperature);
    temperatureChart.update();
}

function updateEconomicChart(data) {
    economicChart.data.labels = data.map(d => d.sector);
    economicChart.data.datasets[0].data = data.map(d => d.impact);
    economicChart.update();
}

function getTemperatureData() {
    return temperatureChart.data.datasets[0].data.map((value, index) => ({
        year: temperatureChart.data.labels[index],
        temperature: value
    }));
}

function getEconomicData() {
    return economicChart.data.datasets[0].data.map((value, index) => ({
        sector: economicChart.data.labels[index],
        impact: value
    }));
}
