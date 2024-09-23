document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing application');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('fileInput');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const runAdvancedAnalyticsBtn = document.getElementById('runAdvancedAnalyticsBtn');
    const scenarioSelect = document.getElementById('scenarioSelect');
    const sensitivitySlider = document.getElementById('sensitivitySlider');

    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', importData);
    exportBtn.addEventListener('click', exportData);
    generateReportBtn.addEventListener('click', generateReport);
    runAdvancedAnalyticsBtn.addEventListener('click', runAdvancedAnalytics);
    scenarioSelect.addEventListener('change', updateScenario);
    sensitivitySlider.addEventListener('input', updateSensitivity);

    loadDefaultData();

    function loadDefaultData() {
        console.log('Loading default data');
        fetch('/api/get_default_data')
            .then(response => response.json())
            .then(data => {
                console.log('Default data received:', data);
                processData(data);
            })
            .catch(error => {
                console.error('Error loading default data:', error);
                showErrorMessage('Error loading default data. Please try refreshing the page.');
            });
    }

    function processData(data) {
        console.log('Processing data:', data);
        fetch('/api/process_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(processedData => {
            console.log('Processed data received:', processedData);
            initCharts(processedData);
            updateCharts(processedData);
            saveSession(processedData);
        })
        .catch(error => {
            console.error('Error processing data:', error);
            showErrorMessage('Error processing data. Please try again.');
        });
    }

    // Rest of the functions remain the same...
});

function getLLMResponses() {
    return JSON.parse(localStorage.getItem('llmResponses') || '[]');
}

// Add these helper functions to get chart data
function getTemperatureData() {
    return temperatureChart ? temperatureChart.data.datasets[0].data.map((temp, index) => ({
        year: temperatureChart.data.labels[index],
        temperature: temp
    })) : [];
}

function getEconomicData() {
    return economicChart ? economicChart.data.datasets[0].data.map((gdp, index) => ({
        year: economicChart.data.labels[index],
        gdp: gdp
    })) : [];
}

function getRiskMetrics() {
    if (riskChart) {
        const data = riskChart.data.datasets[0].data;
        return {
            mean_temperature: data[0],
            var_95: data[1],
            max_temperature: data[2]
        };
    }
    return {};
}

function getScenarioData() {
    if (scenarioChart) {
        const scenarios = {};
        scenarioChart.data.datasets.forEach(dataset => {
            scenarios[dataset.label] = dataset.data.map((temp, index) => ({
                year: scenarioChart.data.labels[index],
                temperature: temp
            }));
        });
        return scenarios;
    }
    return {};
}

function getSensitivityData() {
    if (sensitivityChart) {
        const data = {};
        sensitivityChart.data.labels.forEach((label, index) => {
            data[label] = sensitivityChart.data.datasets[0].data[index];
        });
        return data;
    }
    return {};
}
