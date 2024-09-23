import json
import csv
from io import StringIO
from .advanced_models import (
    linear_regression_temperature,
    predict_temperature,
    calculate_economic_impact,
    monte_carlo_simulation,
    calculate_risk_metrics
)
import numpy as np

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
