def generate_chart_summary(data):
    summary = "Here's a summary of the climate economic data:\n\n"

    if 'temperatureData' in data:
        temp_data = data['temperatureData']
        start_year = temp_data[0]['year']
        end_year = temp_data[-1]['year']
        start_temp = temp_data[0]['temperature']
        end_temp = temp_data[-1]['temperature']
        temp_change = end_temp - start_temp
        
        summary += f"Temperature Trends: From {start_year} to {end_year}, the temperature "
        summary += f"{'increased' if temp_change > 0 else 'decreased'} by {abs(temp_change):.2f}°C, "
        summary += f"from {start_temp:.2f}°C to {end_temp:.2f}°C.\n\n"

    if 'economicData' in data:
        econ_data = data['economicData']
        start_year = econ_data[0]['year']
        end_year = econ_data[-1]['year']
        start_gdp = econ_data[0]['gdp']
        end_gdp = econ_data[-1]['gdp']
        gdp_change = (end_gdp - start_gdp) / start_gdp * 100
        
        summary += f"Economic Impact: The GDP {'increased' if gdp_change > 0 else 'decreased'} "
        summary += f"by {abs(gdp_change):.2f}% from {start_year} to {end_year}.\n\n"

    if 'riskMetrics' in data:
        risk = data['riskMetrics']
        summary += f"Risk Assessment: The mean temperature is {risk['mean_temperature']:.2f}°C, "
        summary += f"with a 95% Value at Risk of {risk['var_95']:.2f}°C "
        summary += f"and a maximum temperature of {risk['max_temperature']:.2f}°C.\n\n"

    return summary