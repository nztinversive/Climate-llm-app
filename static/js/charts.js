// Global variables to store chart instances
let temperatureChart, economicChart, riskChart, scenarioChart, sensitivityChart;

// Initialize charts by loading default data
function initCharts() {
    console.log('Initializing charts');
    try {
        loadDefaultData();
    } catch (error) {
        console.error('Error initializing charts:', error);
        showErrorMessage('Error initializing charts. Please try refreshing the page.');
    }
}

// Fetch default data from the server
function loadDefaultData() {
    console.log('Loading default data');
    fetch('/api/get_default_data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Default data received:', JSON.stringify(data, null, 2));
            createCharts(data);
        })
        .catch(error => {
            console.error('Error loading default data:', error);
            showErrorMessage('Error loading default data. Please try refreshing the page.');
        });
}

// Create all charts using the provided data
function createCharts(data) {
    console.log('Creating charts with data:', JSON.stringify(data, null, 2));
    if (!data) {
        console.error('No data provided for chart creation');
        return;
    }

    // Create or update each chart
    createOrUpdateChart('temperatureChart', () => createTemperatureChart(data.temperatureData));
    createOrUpdateChart('economicChart', () => createEconomicChart(data.economicData));
    createOrUpdateChart('riskChart', () => createRiskChart(data.riskMetrics));
    createOrUpdateChart('scenarioChart', () => createScenarioChart(data.scenarioData));
    createOrUpdateChart('sensitivityChart', () => createSensitivityChart(data.sensitivityData));
}

// Helper function to create or update a chart
function createOrUpdateChart(chartId, createChartFunction) {
    const container = document.getElementById(chartId);
    if (!container) {
        console.error(`Container for ${chartId} not found`);
        return;
    }

    // Clear the container
    container.innerHTML = '';

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.id = `${chartId}Canvas`;
    container.appendChild(canvas);

    try {
        createChartFunction();
    } catch (error) {
        console.error(`Error creating ${chartId}:`, error);
        container.innerHTML = `<div class="error-message">Error creating chart. Please try refreshing the page.</div>`;
    }
}

// Create temperature chart
function createTemperatureChart(data) {
    console.log('Creating Temperature Chart with data:', JSON.stringify(data, null, 2));
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Invalid temperature data');
        return;
    }
    
    const canvas = document.getElementById('temperatureChartCanvas');
    if (!canvas) {
        console.error('Temperature chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
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

// Create economic chart
function createEconomicChart(data) {
    console.log('Creating Economic Chart');
    const canvas = document.getElementById('economicChartCanvas');
    if (!canvas) {
        console.error('Economic chart canvas not found');
        return;
    }

    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to get 2D context for economic chart');
            return;
        }

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
    } catch (error) {
        console.error('Error creating economic chart:', error);
    }
}

// Create risk assessment chart
function createRiskChart(data) {
    console.log('Creating Risk Chart');
    const canvas = document.getElementById('riskChartCanvas');
    if (!canvas) {
        console.error('Risk chart canvas not found');
        return;
    }

    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to get 2D context for risk chart');
            return;
        }

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
                maintainAspectRatio: false
            }
        });
    } catch (error) {
        console.error('Error creating risk chart:', error);
    }
}

// Create scenario comparison chart
function createScenarioChart(data) {
    console.log('Creating Scenario Chart');
    const canvas = document.getElementById('scenarioChartCanvas');
    if (!canvas) {
        console.error('Scenario chart canvas not found');
        return;
    }

    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to get 2D context for scenario chart');
            return;
        }

        const scenarios = Object.keys(data);
        scenarioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data[scenarios[0]].map(d => d.year),
                datasets: scenarios.map(scenario => ({
                    label: scenario,
                    data: data[scenario].map(d => d.temperature),
                    borderColor: getScenarioColor(scenario),
                    fill: false
                }))
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
    } catch (error) {
        console.error('Error creating scenario chart:', error);
    }
}

// Create sensitivity analysis chart
function createSensitivityChart(data) {
    console.log('Creating Sensitivity Chart');
    const canvas = document.getElementById('sensitivityChartCanvas');
    if (!canvas) {
        console.error('Sensitivity chart canvas not found');
        return;
    }

    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to get 2D context for sensitivity chart');
            return;
        }

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
    } catch (error) {
        console.error('Error creating sensitivity chart:', error);
    }
}

// Helper function to create a table from data
function createTable(data, headers, rowDataFunction = null) {
    let tableHTML = '<table class="w-full text-left border-collapse">';
    tableHTML += '<thead><tr>' + headers.map(h => `<th class="p-2 border">${h}</th>`).join('') + '</tr></thead>';
    tableHTML += '<tbody>';
    
    data.forEach(row => {
        const rowData = rowDataFunction ? rowDataFunction(row) : row;
        tableHTML += '<tr>' + rowData.map(cell => `<td class="p-2 border">${cell}</td>`).join('') + '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    return tableHTML;
}

// Helper function to get color for different scenarios
function getScenarioColor(scenario) {
    switch (scenario) {
        case 'baseline': return 'rgb(75, 192, 192)';
        case 'optimistic': return 'rgb(54, 162, 235)';
        case 'pessimistic': return 'rgb(255, 99, 132)';
        default: return 'rgb(201, 203, 207)';
    }
}

// Update all charts with new data
function updateCharts(data) {
    console.log('Updating charts with data:', data);
    if (!data) {
        console.error('No data provided for chart update');
        return;
    }

    createTemperatureChart(data.temperatureData);
    createEconomicChart(data.economicData);
    createRiskChart(data.riskMetrics);
    createScenarioChart(data.scenarioData);
    createSensitivityChart(data.sensitivityData);
}

// Display error message to the user
function showErrorMessage(message) {
    console.error('Error:', message);
    alert(message);
}

// Update scenario chart based on user selection
function updateScenarioChart(scenarioType) {
    console.log('Updating Scenario Chart for:', scenarioType);
    fetch('/api/update_scenario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            scenario: scenarioType,
            temperatureData: getTemperatureData()
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received scenario data:', data);
        if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid data received from server');
        }
        
        const scenarios = Object.keys(data);
        if (scenarios.length === 0) {
            throw new Error('No scenario data received');
        }
        
        if (scenarioChart) {
            scenarioChart.data.labels = data[scenarios[0]].map(d => d.year);
            scenarioChart.data.datasets = scenarios.map(scenario => ({
                label: scenario,
                data: data[scenario].map(d => d.temperature),
                borderColor: getScenarioColor(scenario),
                fill: false
            }));
            scenarioChart.update();
        } else {
            createScenarioChart(data);
        }
    })
    .catch(error => {
        console.error('Error updating scenario chart:', error);
        showErrorMessage('Error updating scenario. Please try again.');
    });
}

// Update sensitivity chart based on user input
function updateSensitivityChart(sensitivityValue) {
    console.log('Updating Sensitivity Chart with value:', sensitivityValue);
    const economicData = getEconomicData();
    
    fetch('/api/update_sensitivity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            sensitivity: parseInt(sensitivityValue),
            economicData: economicData
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (sensitivityChart) {
            sensitivityChart.data.labels = Object.keys(data);
            sensitivityChart.data.datasets[0].data = Object.values(data);
            sensitivityChart.update();
        } else {
            createSensitivityChart(data);
        }
    })
    .catch(error => {
        console.error('Error updating sensitivity chart:', error);
        showErrorMessage('Error updating sensitivity. Please try again.');
    });
}

// Helper function to get economic data from the chart
function getEconomicData() {
    if (economicChart) {
        return economicChart.data.labels.map((year, index) => ({
            year: parseInt(year),
            gdp: economicChart.data.datasets[0].data[index]
        }));
    }
    return [];
}

// Generate summary of the current data
function generateSummary() {
    const data = {
        temperatureData: getTemperatureData(),
        economicData: getEconomicData(),
        riskMetrics: getRiskMetrics(),
        scenarioData: getScenarioData(),
        sensitivityData: getSensitivityData()
    };

    fetch('/api/generate_summary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById('summaryText').textContent = result.summary;
        document.getElementById('summarySection').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error generating summary:', error);
        showErrorMessage('Error generating summary. Please try again.');
    });
}

// Compare different scenarios
function compareScenarios() {
    const scenarioData = getScenarioData();

    fetch('/api/compare_scenarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scenarios: scenarioData })
    })
    .then(response => response.json())
    .then(result => {
        const comparisonTable = createComparisonTable(result.comparison);
        document.getElementById('comparisonTableContainer').innerHTML = comparisonTable;
        document.getElementById('comparisonSection').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error comparing scenarios:', error);
        showErrorMessage('Error comparing scenarios. Please try again.');
    });
}

// Helper function to create a comparison table
function createComparisonTable(data) {
    let tableHTML = '<table class="w-full text-left border-collapse">';
    
    // Create header
    const headers = Object.keys(data[0]);
    tableHTML += '<thead><tr>' + headers.map(h => `<th class="p-2 border">${h}</th>`).join('') + '</tr></thead>';
    
    // Create rows
    tableHTML += '<tbody>';
    data.forEach(row => {
        tableHTML += '<tr>' + headers.map(h => `<td class="p-2 border">${row[h]}</td>`).join('') + '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    return tableHTML;
}

// Note: The following functions (getTemperatureData, getRiskMetrics, getScenarioData, getSensitivityData)
// are assumed to be defined elsewhere in the code or in another file.