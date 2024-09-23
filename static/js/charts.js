let temperatureChart, economicChart, riskChart, scenarioChart, sensitivityChart;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
    const economicCtx = document.getElementById('economicChart').getContext('2d');
    const riskCtx = document.getElementById('riskChart').getContext('2d');
    const scenarioCtx = document.getElementById('scenarioChart').getContext('2d');
    const sensitivityCtx = document.getElementById('sensitivityChart').getContext('2d');

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
        type: 'radar',
        data: {
            labels: ['Mean Temperature', '95% VaR', 'Max Temperature', 'Economic Impact', 'Adaptation Cost'],
            datasets: [{
                label: 'Risk Metrics',
                data: [],
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

    scenarioChart = new Chart(scenarioCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Baseline Scenario',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: 'Optimistic Scenario',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }, {
                label: 'Pessimistic Scenario',
                data: [],
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

    sensitivityChart = new Chart(sensitivityCtx, {
        type: 'bar',
        data: {
            labels: ['Temperature Change', 'Economic Growth', 'Adaptation Measures', 'Technology Advancement'],
            datasets: [{
                label: 'Sensitivity to Economic Impact',
                data: [],
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
    updateTemperatureChart(data.temperatureData);
    updateEconomicChart(data.economicData);
    updateRiskChart(data.riskMetrics);
    updateScenarioChart(data.scenarioData);
    updateSensitivityChart(data.sensitivityData);
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
    economicChart.data.datasets[0].data = data.map(d => d.impact * 100);
    economicChart.update();
}

function updateRiskChart(data) {
    riskChart.data.datasets[0].data = [
        data.mean_temperature,
        data.var_95,
        data.max_temperature,
        data.economic_impact,
        data.adaptation_cost
    ];
    riskChart.update();
}

function updateScenarioChart(scenarioData) {
    console.log('Received scenario data:', JSON.stringify(scenarioData, null, 2));

    let dataToUse;
    if (scenarioData && scenarioData.baseline && Array.isArray(scenarioData.baseline)) {
        dataToUse = scenarioData.baseline;
    } else if (Array.isArray(scenarioData)) {
        dataToUse = scenarioData;
    } else {
        console.error('Invalid scenario data:', scenarioData);
        showErrorMessage('Invalid scenario data received');
        return;
    }

    if (dataToUse.length === 0) {
        console.warn('Empty scenario data received');
        showErrorMessage('No scenario data available');
        return;
    }

    try {
        const years = dataToUse.map(d => {
            if (!d.year) throw new Error('Missing year in scenario data');
            return d.year;
        });
        const temperatures = dataToUse.map(d => {
            if (d.temperature === undefined || d.temperature === null) throw new Error('Missing temperature in scenario data');
            return d.temperature;
        });

        scenarioChart.data.labels = years;
        scenarioChart.data.datasets[0].data = temperatures;

        if (scenarioData.optimistic && Array.isArray(scenarioData.optimistic)) {
            scenarioChart.data.datasets[1].data = scenarioData.optimistic.map(d => d.temperature);
        }
        if (scenarioData.pessimistic && Array.isArray(scenarioData.pessimistic)) {
            scenarioChart.data.datasets[2].data = scenarioData.pessimistic.map(d => d.temperature);
        }

        scenarioChart.update();
        console.log('Scenario chart updated successfully');
    } catch (error) {
        console.error('Error updating scenario chart:', error);
        showErrorMessage(`Error updating scenario chart: ${error.message}`);
    }
}

function updateSensitivityChart(sensitivityData) {
    console.log('Updating sensitivity chart with data:', JSON.stringify(sensitivityData, null, 2));

    if (!sensitivityData || typeof sensitivityData !== 'object') {
        console.error('Invalid sensitivity data:', sensitivityData);
        showErrorMessage('Invalid sensitivity data received');
        return;
    }

    const data = [
        sensitivityData.temperature_sensitivity,
        sensitivityData.economic_growth_sensitivity,
        sensitivityData.adaptation_sensitivity,
        sensitivityData.technology_sensitivity
    ];

    console.log('Parsed sensitivity data:', data);

    const labels = [
        'Temperature Change',
        'Economic Growth',
        'Adaptation Measures',
        'Technology Advancement'
    ];

    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)'
    ];

    sensitivityChart.data.labels = labels;
    sensitivityChart.data.datasets[0].data = data;
    sensitivityChart.data.datasets[0].backgroundColor = backgroundColors;

    sensitivityChart.options.scales.y.beginAtZero = true;
    sensitivityChart.options.scales.y.title = {
        display: true,
        text: 'Sensitivity Impact'
    };

    console.log('Updating sensitivity chart with new data');
    sensitivityChart.update();

    console.log('Sensitivity chart updated successfully');
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
        impact: value / 100
    }));
}

function getRiskMetrics() {
    const data = riskChart.data.datasets[0].data;
    return {
        mean_temperature: data[0],
        var_95: data[1],
        max_temperature: data[2],
        economic_impact: data[3],
        adaptation_cost: data[4]
    };
}

function getScenarioData() {
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
    const data = sensitivityChart.data.datasets[0].data;
    return {
        temperature_sensitivity: data[0],
        economic_growth_sensitivity: data[1],
        adaptation_sensitivity: data[2],
        technology_sensitivity: data[3]
    };
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