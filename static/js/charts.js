let temperatureChart, economicChart, riskChart, scenarioChart, sensitivityChart;
const MAX_RETRIES = 5;
const RETRY_DELAY = 100; // milliseconds

function initCharts(data) {
    console.log('Initializing charts with data:', data);
    if (!data) {
        console.error('No data provided for chart initialization');
        return;
    }

    initChartWithRetry('temperatureChart', () => createTemperatureChart(data.temperatureData), 0);
    initChartWithRetry('economicChart', () => createEconomicChart(data.economicData), 0);
    initChartWithRetry('riskChart', () => createRiskChart(data.riskMetrics), 0);
    initChartWithRetry('scenarioChart', () => createScenarioChart(data.scenarioData), 0);
    initChartWithRetry('sensitivityChart', () => createSensitivityChart(data.sensitivityData), 0);
}

function initChartWithRetry(chartId, createChartFunc, retryCount) {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (ctx) {
        console.log(`Creating ${chartId}`);
        createChartFunc(ctx);
    } else if (retryCount < MAX_RETRIES) {
        console.log(`Retrying ${chartId} initialization. Attempt ${retryCount + 1}`);
        setTimeout(() => initChartWithRetry(chartId, createChartFunc, retryCount + 1), RETRY_DELAY);
    } else {
        console.error(`${chartId} context not found after ${MAX_RETRIES} attempts`);
    }
}

// The rest of the chart creation and update functions remain the same
// ...

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

// The rest of the file remains unchanged
