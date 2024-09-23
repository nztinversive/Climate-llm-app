document.addEventListener('DOMContentLoaded', () => {
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('fileInput');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const runAdvancedAnalyticsBtn = document.getElementById('runAdvancedAnalyticsBtn');
    const scenarioSelect = document.getElementById('scenarioSelect');
    const sensitivitySlider = document.getElementById('sensitivitySlider');

    importBtn.addEventListener('click', importData);
    exportBtn.addEventListener('click', exportData);
    generateReportBtn.addEventListener('click', generateReport);
    runAdvancedAnalyticsBtn.addEventListener('click', runAdvancedAnalytics);
    scenarioSelect.addEventListener('change', updateScenario);
    sensitivitySlider.addEventListener('input', updateSensitivity);

    loadDefaultData();

    function loadDefaultData() {
        fetch('/api/get_default_data')
            .then(response => response.json())
            .then(data => {
                processData(data);
            })
            .catch(error => console.error('Error loading default data:', error));
    }

    function importData() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to import.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            let data;
            
            if (file.name.endsWith('.json')) {
                data = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                data = parseCSV(content);
            } else {
                alert('Unsupported file format. Please use JSON or CSV.');
                return;
            }

            processData(data);
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

        fetch('/api/export_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: data, format: 'json' })
        })
        .then(response => response.json())
        .then(result => {
            const blob = new Blob([result.exported_data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'climate_economic_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error exporting data:', error));
    }

    function processData(data) {
        fetch('/api/process_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(processedData => {
            updateCharts(processedData);
            saveSession(processedData);
        })
        .catch(error => console.error('Error processing data:', error));
    }

    function generateReport() {
        const data = {
            temperatureData: getTemperatureData(),
            economicData: getEconomicData(),
            riskMetrics: getRiskMetrics(),
            scenarioData: getScenarioData(),
            sensitivityData: getSensitivityData(),
            llmResponses: getLLMResponses()
        };

        fetch('/generate_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(html => {
            const reportWindow = window.open('', '_blank');
            reportWindow.document.write(html);
            reportWindow.document.close();
        })
        .catch(error => console.error('Error generating report:', error));
    }

    function runAdvancedAnalytics() {
        const data = {
            temperatureData: getTemperatureData(),
            economicData: getEconomicData()
        };

        fetch('/api/advanced_analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(processedData => {
            updateCharts(processedData);
            saveSession(processedData);
        })
        .catch(error => console.error('Error running advanced analytics:', error));
    }

    function updateScenario() {
        const selectedScenario = scenarioSelect.value;
        const data = {
            temperatureData: getTemperatureData(),
            scenario: selectedScenario
        };

        fetch('/api/update_scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(updatedScenario => {
            if (updatedScenario && updatedScenario[selectedScenario]) {
                updateScenarioChart(updatedScenario[selectedScenario]);
            } else {
                console.error('Invalid scenario data received:', updatedScenario);
            }
        })
        .catch(error => console.error('Error updating scenario:', error));
    }

    function updateSensitivity() {
        const sensitivityValue = parseInt(sensitivitySlider.value);
        const economicData = getEconomicData();
        
        if (!economicData || economicData.length === 0) {
            console.error('No economic data available for sensitivity analysis');
            showErrorMessage('No economic data available for sensitivity analysis');
            return;
        }
        
        const data = {
            economicData: economicData,
            sensitivity: sensitivityValue
        };

        console.log('Sending sensitivity update request:', JSON.stringify(data, null, 2));

        fetch('/api/update_sensitivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(updatedSensitivity => {
            console.log('Received sensitivity update response:', JSON.stringify(updatedSensitivity, null, 2));
            if (updatedSensitivity && typeof updatedSensitivity === 'object') {
                updateSensitivityChart(updatedSensitivity);
                console.log('Sensitivity chart updated with data:', updatedSensitivity);
            } else {
                console.error('Invalid sensitivity data received:', updatedSensitivity);
                showErrorMessage('Invalid sensitivity data received from the server');
            }
        })
        .catch(error => {
            console.error('Error updating sensitivity:', error);
            showErrorMessage('An error occurred while updating the sensitivity: ' + error.message);
        });
    }

    function saveSession(data) {
        fetch('/api/save_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Session saved with ID:', result.session_id);
        })
        .catch(error => console.error('Error saving session:', error));
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
});