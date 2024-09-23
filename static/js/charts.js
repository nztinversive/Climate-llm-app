let temperatureChart, economicChart, riskChart, scenarioChart, sensitivityChart;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing chart containers');
    initChartContainers();
});

function initChartContainers() {
    const chartContainers = ['temperatureChart', 'economicChart', 'riskChart', 'scenarioChart', 'sensitivityChart'];
    chartContainers.forEach(containerId => {
        if (!document.getElementById(containerId)) {
            console.error(`Chart container ${containerId} not found`);
        }
    });
}

function initCharts(data) {
    console.log('Initializing charts with data:', data);
    if (!data) {
        console.error('No data provided for chart initialization');
        return;
    }

    const temperatureCtx = document.getElementById('temperatureChart')?.getContext('2d');
    const economicCtx = document.getElementById('economicChart')?.getContext('2d');
    const riskCtx = document.getElementById('riskChart')?.getContext('2d');
    const scenarioCtx = document.getElementById('scenarioChart')?.getContext('2d');
    const sensitivityCtx = document.getElementById('sensitivityChart')?.getContext('2d');

    if (temperatureCtx) {
        console.log('Creating temperature chart');
        temperatureChart = createTemperatureChart(temperatureCtx, data.temperatureData);
    } else {
        console.error('Temperature chart context not found');
    }
    if (economicCtx) {
        console.log('Creating economic chart');
        economicChart = createEconomicChart(economicCtx, data.economicData);
    } else {
        console.error('Economic chart context not found');
    }
    if (riskCtx) {
        console.log('Creating risk chart');
        riskChart = createRiskChart(riskCtx, data.riskMetrics);
    } else {
        console.error('Risk chart context not found');
    }
    if (scenarioCtx) {
        console.log('Creating scenario chart');
        scenarioChart = createScenarioChart(scenarioCtx, data.scenarioData);
    } else {
        console.error('Scenario chart context not found');
    }
    if (sensitivityCtx) {
        console.log('Creating sensitivity chart');
        sensitivityChart = createSensitivityChart(sensitivityCtx, data.sensitivityData);
    } else {
        console.error('Sensitivity chart context not found');
    }
}

function createTemperatureChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'Historical Temperature (°C)',
                data: data.filter(d => d.year <= 2050).map(d => d.temperature),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }, {
                label: 'Predicted Temperature (°C)',
                data: data.filter(d => d.year > 2050).map(d => d.temperature),
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
}

function createEconomicChart(ctx, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'Economic Impact (% GDP)',
                data: data.map(d => d.impact * 100),
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

function createRiskChart(ctx, data) {
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Mean Temperature', '95% VaR', 'Max Temperature', 'Economic Impact', 'Adaptation Cost'],
            datasets: [{
                label: 'Risk Metrics',
                data: [
                    data.mean_temperature,
                    data.var_95,
                    data.max_temperature,
                    data.economic_impact,
                    data.adaptation_cost
                ],
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
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}

function createScenarioChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.baseline.map(d => d.year),
            datasets: [{
                label: 'Baseline Scenario',
                data: data.baseline.map(d => d.temperature),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: 'Optimistic Scenario',
                data: data.optimistic.map(d => d.temperature),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }, {
                label: 'Pessimistic Scenario',
                data: data.pessimistic.map(d => d.temperature),
                borderColor: 'rgb(255, 99, 132)',
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
}

function createSensitivityChart(ctx, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature Change', 'Economic Growth', 'Adaptation Measures', 'Technology Advancement'],
            datasets: [{
                label: 'Sensitivity to Economic Impact',
                data: [
                    data.temperature_sensitivity,
                    data.economic_growth_sensitivity,
                    data.adaptation_sensitivity,
                    data.technology_sensitivity
                ],
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCharts(data) {
    if (!data) {
        console.error('No data provided for chart update');
        return;
    }

    updateTemperatureChart(data.temperatureData);
    updateEconomicChart(data.economicData);
    updateRiskChart(data.riskMetrics);
    updateScenarioChart(data.scenarioData);
    updateSensitivityChart(data.sensitivityData);
}

function updateTemperatureChart(data) {
    if (!temperatureChart || !data) return;

    const historical = data.filter(d => d.year <= 2050);
    const predicted = data.filter(d => d.year > 2050);

    temperatureChart.data.labels = data.map(d => d.year);
    temperatureChart.data.datasets[0].data = historical.map(d => d.temperature);
    temperatureChart.data.datasets[1].data = predicted.map(d => d.temperature);
    temperatureChart.update();
}

function updateEconomicChart(data) {
    if (!economicChart || !data) return;

    economicChart.data.labels = data.map(d => d.year);
    economicChart.data.datasets[0].data = data.map(d => d.impact * 100);
    economicChart.update();
}

function updateRiskChart(data) {
    if (!riskChart || !data) return;

    riskChart.data.datasets[0].data = [
        data.mean_temperature,
        data.var_95,
        data.max_temperature,
        data.economic_impact,
        data.adaptation_cost
    ];
    riskChart.update();
}

function updateScenarioChart(data) {
    if (!scenarioChart || !data) return;

    scenarioChart.data.labels = data.baseline.map(d => d.year);
    scenarioChart.data.datasets[0].data = data.baseline.map(d => d.temperature);
    scenarioChart.data.datasets[1].data = data.optimistic.map(d => d.temperature);
    scenarioChart.data.datasets[2].data = data.pessimistic.map(d => d.temperature);
    scenarioChart.update();
}

function updateSensitivityChart(data) {
    if (!sensitivityChart || !data) return;

    sensitivityChart.data.datasets[0].data = [
        data.temperature_sensitivity,
        data.economic_growth_sensitivity,
        data.adaptation_sensitivity,
        data.technology_sensitivity
    ];
    sensitivityChart.update();
}

function getTemperatureData() {
    return temperatureChart ? temperatureChart.data.datasets[0].data.map((value, index) => ({
        year: temperatureChart.data.labels[index],
        temperature: value
    })) : [];
}

function getEconomicData() {
    return economicChart ? economicChart.data.datasets[0].data.map((value, index) => ({
        year: economicChart.data.labels[index],
        impact: value / 100
    })) : [];
}

function getRiskMetrics() {
    return riskChart ? {
        mean_temperature: riskChart.data.datasets[0].data[0],
        var_95: riskChart.data.datasets[0].data[1],
        max_temperature: riskChart.data.datasets[0].data[2],
        economic_impact: riskChart.data.datasets[0].data[3],
        adaptation_cost: riskChart.data.datasets[0].data[4]
    } : {};
}

function getScenarioData() {
    if (!scenarioChart) return {};

    const baseline = scenarioChart.data.datasets[0].data;
    const optimistic = scenarioChart.data.datasets[1].data;
    const pessimistic = scenarioChart.data.datasets[2].data;
    
    return {
        baseline: baseline.map((value, index) => ({
            year: scenarioChart.data.labels[index],
            temperature: value
        })),
        optimistic: optimistic.map((value, index) => ({
            year: scenarioChart.data.labels[index],
            temperature: value
        })),
        pessimistic: pessimistic.map((value, index) => ({
            year: scenarioChart.data.labels[index],
            temperature: value
        }))
    };
}

function getSensitivityData() {
    return sensitivityChart ? {
        temperature_sensitivity: sensitivityChart.data.datasets[0].data[0],
        economic_growth_sensitivity: sensitivityChart.data.datasets[0].data[1],
        adaptation_sensitivity: sensitivityChart.data.datasets[0].data[2],
        technology_sensitivity: sensitivityChart.data.datasets[0].data[3]
    } : {};
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f44336;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}