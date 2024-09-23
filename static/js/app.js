document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing application');
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

    // Rest of the code remains unchanged...
});

function getLLMResponses() {
    return JSON.parse(localStorage.getItem('llmResponses') || '[]');
}
