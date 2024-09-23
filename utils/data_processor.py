import numpy as np
from sklearn.linear_model import LinearRegression
from scipy.stats import norm
import json
from io import StringIO
import csv

def process_data(data):
    # Use the provided data or generate sample data if not available
    if not data:
        temperature_data = [
            {"year": 2020, "temperature": 1.1},
            {"year": 2030, "temperature": 1.5},
            {"year": 2040, "temperature": 1.9},
            {"year": 2050, "temperature": 2.3}
        ]
    else:
        temperature_data = data.get("temperatureData", [])
    
    years = [entry["year"] for entry in temperature_data]
    temperatures = [entry["temperature"] for entry in temperature_data]
    
    # Perform linear regression
    model = linear_regression_temperature(years, temperatures)
    
    # Predict temperatures for the next 30 years
    future_years = list(range(max(years) + 1, max(years) + 31))
    future_temperatures = [predict_temperature(model, year) for year in future_years]
    
    # Calculate economic impact
    base_temperature = temperatures[-1]
    economic_impacts = [calculate_economic_impact(temp - base_temperature) for temp in future_temperatures]
    
    # Perform Monte Carlo simulation
    simulations = monte_carlo_simulation(1000, base_temperature, volatility=0.1)
    risk_metrics = calculate_risk_metrics(simulations)
    
    return {
        "temperatureData": temperature_data + [{"year": year, "temperature": temp} for year, temp in zip(future_years, future_temperatures)],
        "economicData": [{"year": year, "impact": impact} for year, impact in zip(future_years, economic_impacts)],
        "riskMetrics": risk_metrics
    }

def generate_scenarios(data, scenario_type='all'):
    if not data or 'temperatureData' not in data or not data['temperatureData']:
        # Generate sample data if input is empty or invalid
        base_data = [
            {'year': 2020, 'temperature': 1.1},
            {'year': 2030, 'temperature': 1.5},
            {'year': 2040, 'temperature': 1.9},
            {'year': 2050, 'temperature': 2.3}
        ]
    else:
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
    if not data or 'economicData' not in data or not data['economicData']:
        # Generate sample data if input is empty or invalid
        base_economic_impact = 0.05  # 5% impact as a default value
    else:
        base_economic_impact = data['economicData'][-1]['impact']
    
    sensitivities = {
        'temperature_sensitivity': (sensitivity_value / 100) * 2,
        'economic_growth_sensitivity': (sensitivity_value / 100) * 1.5,
        'adaptation_sensitivity': (sensitivity_value / 100) * 1.2,
        'technology_sensitivity': (sensitivity_value / 100) * 1.8
    }
    
    return {
        'temperature_sensitivity': base_economic_impact * sensitivities['temperature_sensitivity'],
        'economic_growth_sensitivity': base_economic_impact * sensitivities['economic_growth_sensitivity'],
        'adaptation_sensitivity': base_economic_impact * sensitivities['adaptation_sensitivity'],
        'technology_sensitivity': base_economic_impact * sensitivities['technology_sensitivity']
    }

def export_data(data, format_type):
    if format_type == 'json':
        return json.dumps(data, indent=2)
    elif format_type == 'csv':
        output = StringIO()
        writer = csv.writer(output)
        
        # Write headers
        headers = set()
        for item in data:
            headers.update(item.keys())
        writer.writerow(headers)
        
        # Write data
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
    # Assume 1°C increase leads to 1% GDP loss
    gdp_impact = -0.01 * temperature_change
    return gdp_impact

def monte_carlo_simulation(num_simulations, base_temperature, volatility):
    simulations = []
    for _ in range(num_simulations):
        annual_changes = norm.rvs(0, volatility, 30)  # Simulate 30 years
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
