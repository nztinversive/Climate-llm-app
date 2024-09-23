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
            updateScenarioChart(updatedScenario);
        })
        .catch(error => console.error('Error updating scenario:', error));
    }

    function updateSensitivity() {
        const sensitivityValue = sensitivitySlider.value;
        const data = {
            economicData: getEconomicData(),
            sensitivity: sensitivityValue
        };

        fetch('/api/update_sensitivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(updatedSensitivity => {
            updateSensitivityChart(updatedSensitivity);
        })
        .catch(error => console.error('Error updating sensitivity:', error));
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
});
