import numpy as np
from sklearn.linear_model import LinearRegression
from scipy.stats import norm
import json
from io import StringIO
import csv
import logging

DEFAULT_DATA = {
    "temperatureData": [
        {"year": 2000, "temperature": 14.8},
        {"year": 2010, "temperature": 15.2},
        {"year": 2020, "temperature": 15.5},
        {"year": 2030, "temperature": 15.9}
    ],
    "economicData": [
        {"year": 2000, "gdp": 33.6},
        {"year": 2010, "gdp": 65.9},
        {"year": 2020, "gdp": 84.5},
        {"year": 2030, "gdp": 100.0}
    ]
}

def load_default_data():
    # This is a placeholder. Replace with actual default data loading logic.
    return {
        'temperatureData': [
            {'year': 2020, 'temperature': 14.5},
            {'year': 2021, 'temperature': 14.6},
            {'year': 2022, 'temperature': 14.7},
        ],
        'economicData': [
            {'year': 2020, 'gdp': 84.54},
            {'year': 2021, 'gdp': 94.58},
            {'year': 2022, 'gdp': 100.36},
        ],
        'riskMetrics': {
            'mean_temperature': 14.6,
            'var_95': 15.2,
            'max_temperature': 15.5
        },
        'scenarioData': {
            'baseline': [
                {'year': 2020, 'temperature': 14.5},
                {'year': 2021, 'temperature': 14.6},
                {'year': 2022, 'temperature': 14.7},
            ],
            'optimistic': [
                {'year': 2020, 'temperature': 14.5},
                {'year': 2021, 'temperature': 14.55},
                {'year': 2022, 'temperature': 14.6},
            ],
            'pessimistic': [
                {'year': 2020, 'temperature': 14.5},
                {'year': 2021, 'temperature': 14.65},
                {'year': 2022, 'temperature': 14.8},
            ]
        },
        'sensitivityData': {
            'GDP': 0.8,
            'Population': 0.6,
            'CO2 Emissions': 0.9,
            'Renewable Energy': 0.7
        }
    }

def process_data(data):
    if not data:
        data = load_default_data()
    
    temperature_data = data.get("temperatureData", [])
    economic_data = data.get("economicData", [])
    
    years = [entry["year"] for entry in temperature_data]
    temperatures = [entry["temperature"] for entry in temperature_data]
    
    model = linear_regression_temperature(years, temperatures)
    
    future_years = list(range(max(years) + 1, max(years) + 31))
    future_temperatures = [predict_temperature(model, year) for year in future_years]
    
    base_temperature = temperatures[-1]
    economic_impacts = [calculate_economic_impact(temp - base_temperature) for temp in future_temperatures]
    
    simulations = monte_carlo_simulation(1000, base_temperature, volatility=0.1)
    risk_metrics = calculate_risk_metrics(simulations)
    
    return {
        "temperatureData": temperature_data + [{"year": year, "temperature": temp} for year, temp in zip(future_years, future_temperatures)],
        "economicData": economic_data + [{"year": year, "gdp": impact} for year, impact in zip(future_years, economic_impacts)],
        "riskMetrics": risk_metrics
    }

def generate_scenarios(data, scenario_type='all'):
    if not data or 'temperatureData' not in data or not data['temperatureData']:
        data = load_default_data()
    
    base_data = data['temperatureData']
    years = [entry['year'] for entry in base_data]
    base_temperatures = [entry['temperature'] for entry in base_data]
    
    def generate_scenario(modifier):
        return [{'year': year, 'temperature': temp + modifier * (i / len(years))} 
                for i, (year, temp) in enumerate(zip(years, base_temperatures))]
    
    scenarios = {
        'baseline': base_data,
        'optimistic': generate_scenario(-0.5),
        'pessimistic': generate_scenario(0.5)
    }
    
    if scenario_type == 'all':
        return scenarios
    else:
        return {scenario_type: scenarios[scenario_type]}

def perform_sensitivity_analysis(data, sensitivity_value=50):
    logging.info(f"Starting sensitivity analysis with sensitivity_value: {sensitivity_value}")
    logging.info(f"Input data structure: {json.dumps(data, indent=2)}")

    if not data or 'economicData' not in data or not data['economicData']:
        logging.warning("No economic data provided for sensitivity analysis")
        return {
            'temperature_sensitivity': 0.1,
            'economic_growth_sensitivity': 0.1,
            'adaptation_sensitivity': 0.1,
            'technology_sensitivity': 0.1
        }
    
    try:
        latest_economic_data = data['economicData'][-1]
        logging.info(f"Latest economic data: {json.dumps(latest_economic_data, indent=2)}")
        
        if 'gdp' in latest_economic_data:
            base_economic_value = float(latest_economic_data['gdp'])
        elif 'impact' in latest_economic_data:
            base_economic_value = float(latest_economic_data['impact'])
        else:
            raise ValueError(f"No 'gdp' or 'impact' key found in economic data: {latest_economic_data}")
        
        logging.info(f"Base economic value for sensitivity analysis: {base_economic_value}")
        
        sensitivity_factor = (sensitivity_value / 100) * 2  # Scale factor
        
        sensitivities = {
            'temperature_sensitivity': max(0.1, sensitivity_factor * 1.0) * base_economic_value,
            'economic_growth_sensitivity': max(0.1, sensitivity_factor * 0.8) * base_economic_value,
            'adaptation_sensitivity': max(0.1, sensitivity_factor * 1.2) * base_economic_value,
            'technology_sensitivity': max(0.1, sensitivity_factor * 1.5) * base_economic_value
        }
        
        logging.info(f"Calculated sensitivities: {json.dumps(sensitivities, indent=2)}")
        return sensitivities

    except (ValueError, TypeError, IndexError) as e:
        logging.error(f"Error in sensitivity analysis: {str(e)}", exc_info=True)
        return {
            'temperature_sensitivity': 0.1,
            'economic_growth_sensitivity': 0.1,
            'adaptation_sensitivity': 0.1,
            'technology_sensitivity': 0.1
        }

def export_data(data, format_type):
    if format_type == 'json':
        return json.dumps(data, indent=2)
    elif format_type == 'csv':
        output = StringIO()
        writer = csv.writer(output)
        
        headers = set()
        for item in data:
            headers.update(item.keys())
        writer.writerow(headers)
        
        for item in data:
            writer.writerow([item.get(header, '') for header in headers])
        
        return output.getvalue()
    else:
        raise ValueError(f"Unsupported format: {format_type}")

def linear_regression_temperature(years, temperatures):
    X = np.array(years).reshape(-1, 1)
    y = np.array(temperatures)
    model = LinearRegression()
    model.fit(X, y)
    return model

def predict_temperature(model, year):
    return model.predict([[year]])[0]

def calculate_economic_impact(temperature_change):
    gdp_impact = -0.01 * temperature_change
    return gdp_impact

def monte_carlo_simulation(num_simulations, base_temperature, volatility):
    simulations = []
    for _ in range(num_simulations):
        annual_changes = norm.rvs(0, volatility, 30)
        temperature_path = np.cumsum(annual_changes) + base_temperature
        simulations.append(temperature_path)
    return np.array(simulations)

def calculate_risk_metrics(simulations):
    final_temperatures = simulations[:, -1]
    mean_temp = np.mean(final_temperatures)
    var_95 = np.percentile(final_temperatures, 95)
    max_temp = np.max(final_temperatures)
    
    return {
        "mean_temperature": mean_temp,
        "var_95": var_95,
        "max_temperature": max_temp
    }