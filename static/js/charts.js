let temperatureChart, economicChart, riskChart;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    const economicCtx = document.getElementById('economicChart').getContext('2d');
    const riskCtx = document.getElementById('riskChart').getContext('2d');

    temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Historical Temperature (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }, {
                label: 'Predicted Temperature (°C)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    economicChart = new Chart(economicCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Economic Impact (% GDP)',
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

    riskChart = new Chart(riskCtx, {
        type: 'bar',
        data: {
            labels: ['Mean Temperature', '95% VaR', 'Max Temperature'],
            datasets: [{
                label: 'Temperature Risk Metrics (°C)',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateCharts(data) {
    updateTemperatureChart(data.temperatureData);
    updateEconomicChart(data.economicData);
    updateRiskChart(data.riskMetrics);
}

function updateTemperatureChart(data) {
    const historical = data.filter(d => d.year <= 2050);
    const predicted = data.filter(d => d.year > 2050);

    temperatureChart.data.labels = data.map(d => d.year);
    temperatureChart.data.datasets[0].data = historical.map(d => d.temperature);
    temperatureChart.data.datasets[1].data = predicted.map(d => d.temperature);
    temperatureChart.update();
}

function updateEconomicChart(data) {
    economicChart.data.labels = data.map(d => d.year);
    economicChart.data.datasets[0].data = data.map(d => d.impact * 100); // Convert to percentage
    economicChart.update();
}

function updateRiskChart(data) {
    riskChart.data.datasets[0].data = [
        data.mean_temperature,
        data.var_95,
        data.max_temperature
    ];
    riskChart.update();
}

function getTemperatureData() {
    return temperatureChart.data.datasets[0].data.map((value, index) => ({
        year: temperatureChart.data.labels[index],
        temperature: value
    }));
}

function getEconomicData() {
    return economicChart.data.datasets[0].data.map((value, index) => ({
        year: economicChart.data.labels[index],
        impact: value / 100 // Convert back to decimal
    }));
}

function getRiskMetrics() {
    return {
        mean_temperature: riskChart.data.datasets[0].data[0],
        var_95: riskChart.data.datasets[0].data[1],
        max_temperature: riskChart.data.datasets[0].data[2]
    };
}
