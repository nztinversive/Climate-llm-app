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

    initializeApplication();

    function initializeApplication() {
        setTimeout(() => {
            loadDefaultData();
        }, 500);
    }

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
            updateCharts(processedData);
            saveSession(processedData);
        })
        .catch(error => {
            console.error('Error processing data:', error);
            showErrorMessage('Error processing data. Please try again.');
        });
    }

    function importData(event) {
        const file = event.target.files[0];
        if (!file) {
            alert('Please select a file to import.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            let data;
            
            try {
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    data = parseCSV(content);
                } else {
                    throw new Error('Unsupported file format. Please use JSON or CSV.');
                }
                processData(data);
            } catch (error) {
                console.error('Error parsing imported data:', error);
                showErrorMessage('Error parsing imported data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    function exportData() {
        const data = {
            temperatureData: getTemperatureData(),
            economicData: getEconomicData(),
            riskMetrics: getRiskMetrics(),
            scenarioData: getScenarioData(),
            sensitivityData: getSensitivityData()
        };

        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'climate_economic_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function parseCSV(content) {
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header.trim()] = values[index].trim();
                });
                data.push(entry);
            }
        }

        return data;
    }

    function generateReport() {
        console.log('Generating report...');
        alert('Report generated! This is a placeholder.');
    }

    function runAdvancedAnalytics() {
        console.log('Running advanced analytics...');
        alert('Advanced analytics completed! This is a placeholder.');
    }

    function updateScenario() {
        console.log('Updating scenario...');
        alert('Scenario updated! This is a placeholder.');
    }

    function updateSensitivity() {
        console.log('Updating sensitivity...');
        alert('Sensitivity updated! This is a placeholder.');
    }

    function showErrorMessage(message) {
        console.error(message);
        alert(message);
    }

    function saveSession(data) {
        console.log('Saving session data:', data);
    }
});

function getLLMResponses() {
    return JSON.parse(localStorage.getItem('llmResponses') || '[]');
}

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