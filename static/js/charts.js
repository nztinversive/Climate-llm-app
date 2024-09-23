let temperatureChart, economicChart, riskChart, scenarioChart, sensitivityChart;
const MAX_RETRIES = 5;
const RETRY_DELAY = 100; // milliseconds

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing charts');
    initCharts();
});

function initCharts() {
    console.log('Initializing charts');
    loadDefaultData();
}

function loadDefaultData() {
    console.log('Loading default data');
    fetch('/api/get_default_data')
        .then(response => response.json())
        .then(data => {
            console.log('Default data received:', data);
            createCharts(data);
        })
        .catch(error => {
            console.error('Error loading default data:', error);
            showErrorMessage('Error loading default data. Please try refreshing the page.');
        });
}

function createCharts(data) {
    console.log('Creating charts with data:', data);
    if (!data) {
        console.error('No data provided for chart creation');
        return;
    }

    createChartWithRetry('temperatureChart', () => createTemperatureChart(data.temperatureData), 0);
    createChartWithRetry('economicChart', () => createEconomicChart(data.economicData), 0);
    createChartWithRetry('riskChart', () => createRiskChart(data.riskMetrics), 0);
    createChartWithRetry('scenarioChart', () => createScenarioChart(data.scenarioData), 0);
    createChartWithRetry('sensitivityChart', () => createSensitivityChart(data.sensitivityData), 0);
}

function createChartWithRetry(chartId, createChartFunc, retryCount) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            console.log(`Creating ${chartId}`);
            try {
                createChartFunc(ctx);
                console.log(`${chartId} created successfully`);
            } catch (error) {
                console.error(`Error creating ${chartId}:`, error);
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying ${chartId} creation. Attempt ${retryCount + 1}`);
                    setTimeout(() => createChartWithRetry(chartId, createChartFunc, retryCount + 1), RETRY_DELAY);
                } else {
                    console.error(`Failed to create ${chartId} after ${MAX_RETRIES} attempts`);
                }
            }
        } else {
            console.error(`Unable to get 2D context for ${chartId}`);
        }
    } else if (retryCount < MAX_RETRIES) {
        console.log(`${chartId} element not found. Retrying. Attempt ${retryCount + 1}`);
        setTimeout(() => createChartWithRetry(chartId, createChartFunc, retryCount + 1), RETRY_DELAY);
    } else {
        console.error(`${chartId} element not found after ${MAX_RETRIES} attempts`);
    }
}

function createTemperatureChart(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Invalid temperature data:', data);
        return;
    }
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'Temperature (°C)',
                data: data.map(d => d.temperature),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function createEconomicChart(data) {
    const ctx = document.getElementById('economicChart').getContext('2d');
    economicChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'GDP Impact',
                data: data.map(d => d.gdp),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createRiskChart(data) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Mean Temperature', 'VaR 95', 'Max Temperature'],
            datasets: [{
                label: 'Risk Metrics',
                data: [data.mean_temperature, data.var_95, data.max_temperature],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}

function createScenarioChart(data) {
    const ctx = document.getElementById('scenarioChart').getContext('2d');
    const scenarios = Object.keys(data);
    const years = data[scenarios[0]].map(d => d.year);
    
    const datasets = scenarios.map(scenario => ({
        label: scenario,
        data: data[scenario].map(d => d.temperature),
        borderColor: getScenarioColor(scenario),
        fill: false
    }));

    scenarioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function createSensitivityChart(data) {
    const ctx = document.getElementById('sensitivityChart').getContext('2d');
    sensitivityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Sensitivity',
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getScenarioColor(scenario) {
    switch (scenario) {
        case 'baseline': return 'rgb(75, 192, 192)';
        case 'optimistic': return 'rgb(54, 162, 235)';
        case 'pessimistic': return 'rgb(255, 99, 132)';
        default: return 'rgb(201, 203, 207)';
    }
}

function updateCharts(data) {
    console.log('Updating charts with data:', data);
    if (!data) {
        console.error('No data provided for chart update');
        return;
    }

    try {
        updateTemperatureChart(data.temperatureData);
        updateEconomicChart(data.economicData);
        updateRiskChart(data.riskMetrics);
        updateScenarioChart(data.scenarioData);
        updateSensitivityChart(data.sensitivityData);
        console.log('All charts updated successfully');
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

function updateTemperatureChart(data) {
    if (temperatureChart && data) {
        temperatureChart.data.labels = data.map(d => d.year);
        temperatureChart.data.datasets[0].data = data.map(d => d.temperature);
        temperatureChart.update();
    }
}

function updateEconomicChart(data) {
    if (economicChart && data) {
        economicChart.data.labels = data.map(d => d.year);
        economicChart.data.datasets[0].data = data.map(d => d.gdp);
        economicChart.update();
    }
}

function updateRiskChart(data) {
    if (riskChart && data) {
        riskChart.data.datasets[0].data = [data.mean_temperature, data.var_95, data.max_temperature];
        riskChart.update();
    }
}

function updateScenarioChart(data) {
    if (scenarioChart && data) {
        const scenarios = Object.keys(data);
        const years = data[scenarios[0]].map(d => d.year);
        
        scenarioChart.data.labels = years;
        scenarioChart.data.datasets = scenarios.map(scenario => ({
            label: scenario,
            data: data[scenario].map(d => d.temperature),
            borderColor: getScenarioColor(scenario),
            fill: false
        }));
        scenarioChart.update();
    }
}

function updateSensitivityChart(data) {
    if (sensitivityChart && data) {
        sensitivityChart.data.labels = Object.keys(data);
        sensitivityChart.data.datasets[0].data = Object.values(data);
        sensitivityChart.update();
    }
}

function showErrorMessage(message) {
    console.error('Error:', message);
    alert(message);
}