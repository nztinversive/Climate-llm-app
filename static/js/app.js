document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, setting up event listeners');

    // Object to store references to DOM elements
    const elements = {
        generateReportBtn: document.getElementById('generateReportBtn'),
        runAdvancedAnalyticsBtn: document.getElementById('runAdvancedAnalyticsBtn'),
        scenarioSelect: document.getElementById('scenarioSelect'),
        sensitivitySlider: document.getElementById('sensitivitySlider'),
        generateSummaryBtn: document.getElementById('generateSummaryBtn'),
        compareScenarioBtn: document.getElementById('compareScenarioBtn'),
        loading: document.getElementById('loading')
    };

    // Attach event listeners to DOM elements if they exist
    // This prevents errors if elements are missing from the DOM
    if (elements.generateReportBtn) {
        elements.generateReportBtn.addEventListener('click', generateReport);
    }

    if (elements.runAdvancedAnalyticsBtn) {
        elements.runAdvancedAnalyticsBtn.addEventListener('click', runAdvancedAnalytics);
    }

    if (elements.scenarioSelect) {
        elements.scenarioSelect.addEventListener('change', handleScenarioChange);
    }

    if (elements.sensitivitySlider) {
        elements.sensitivitySlider.addEventListener('input', handleSensitivityChange);
    }

    if (elements.generateSummaryBtn) {
        elements.generateSummaryBtn.addEventListener('click', generateSummary);
    }

    if (elements.compareScenarioBtn) {
        elements.compareScenarioBtn.addEventListener('click', compareScenarios);
    }

    initializeApplication();

    // Function definitions

    // Shows the loading indicator
    function showLoading() {
        if (elements.loading) {
            elements.loading.style.display = 'flex';
        }
    }

    // Hides the loading indicator
    function hideLoading() {
        if (elements.loading) {
            elements.loading.style.display = 'none';
        }
    }

    // Wrap all fetch calls with showLoading and hideLoading
    // This ensures the loading indicator is shown for all API calls
    const originalFetch = window.fetch;
    window.fetch = function() {
        showLoading();
        return originalFetch.apply(this, arguments).then(response => {
            hideLoading();
            return response;
        }).catch(error => {
            hideLoading();
            throw error;
        });
    };
});

// Initialize the application, including setting up charts
function initializeApplication() {
    console.log('Initializing application');
    initCharts();
}

// Load default data from the server and create initial charts
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
            console.log('Data structure:', Object.keys(data));
            // Validate the received data
            if (!data.temperatureData || !Array.isArray(data.temperatureData)) {
                throw new Error('Invalid or missing temperature data in the response');
            }
            if (data.temperatureData.length === 0) {
                throw new Error('Temperature data array is empty');
            }
            createCharts(data);
        })
        .catch(error => {
            console.error('Error loading default data:', error);
            showErrorMessage('Error loading default data. Please try refreshing the page.');
        });
}

// Process data by sending it to the server for analysis
function processData(data) {
    console.log('Processing data:', data);
    fetch('/api/process_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
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

// Handle data import from file (JSON or CSV)
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

// Export current application data to a JSON file
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

// Parse CSV content into a structured data object
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

// Placeholder functions for future implementation
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

// Display error messages to the user
function showErrorMessage(message) {
    console.error('Error:', message);
    alert(message);
}

// Save current session data (to be implemented)
function saveSession(data) {
    console.log('Saving session data:', data);
    // Implement session saving logic here
}

// Retrieve LLM responses from local storage
function getLLMResponses() {
    return JSON.parse(localStorage.getItem('llmResponses') || '[]');
}

// Helper functions to extract data from charts

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

// Event handlers for user interactions

function handleScenarioChange(event) {
    const selectedScenario = event.target.value;
    console.log('Scenario changed to:', selectedScenario);
    updateScenarioChart(selectedScenario);
}

function handleSensitivityChange(event) {
    const sensitivityValue = event.target.value;
    console.log('Sensitivity changed to:', sensitivityValue);
    updateSensitivityChart(sensitivityValue);
}

// Loading indicator functions

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Wrap all fetch calls with showLoading and hideLoading
// This ensures consistent loading behavior across the application
const originalFetch = window.fetch;
window.fetch = function() {
    showLoading();
    return originalFetch.apply(this, arguments).then(response => {
        hideLoading();
        return response;
    }).catch(error => {
        hideLoading();
        throw error;
    });
};