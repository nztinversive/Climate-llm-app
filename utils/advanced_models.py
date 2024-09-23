import numpy as np
from sklearn.linear_model import LinearRegression
from scipy.stats import norm

def linear_regression_temperature(years, temperatures):
    """
    Perform linear regression to predict future temperatures.
    """
    X = np.array(years).reshape(-1, 1)
    y = np.array(temperatures)
    model = LinearRegression()
    model.fit(X, y)
    return model

def predict_temperature(model, year):
    """
    Predict temperature for a given year using the linear regression model.
    """
    return model.predict([[year]])[0]

def calculate_economic_impact(temperature_change):
    """
    Calculate economic impact based on temperature change.
    This is a simplified model and should be replaced with more complex calculations in a real-world scenario.
    """
    # Assume 1°C increase leads to 1% GDP loss
    gdp_impact = -0.01 * temperature_change
    return gdp_impact

def monte_carlo_simulation(num_simulations, base_temperature, volatility):
    """
    Perform Monte Carlo simulation for temperature change risk assessment.
    """
    simulations = []
    for _ in range(num_simulations):
        annual_changes = norm.rvs(0, volatility, 30)  # Simulate 30 years
        temperature_path = np.cumsum(annual_changes) + base_temperature
        simulations.append(temperature_path)
    return np.array(simulations)

def calculate_risk_metrics(simulations):
    """
    Calculate risk metrics from Monte Carlo simulations.
    """
    final_temperatures = simulations[:, -1]
    mean_temp = np.mean(final_temperatures)
    var_95 = np.percentile(final_temperatures, 95)
    max_temp = np.max(final_temperatures)
    
    return {
        "mean_temperature": mean_temp,
        "var_95": var_95,
        "max_temperature": max_temp
    }
