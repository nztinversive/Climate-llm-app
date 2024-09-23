import json
import csv
from io import StringIO

def process_data(data):
    # Simulate data processing
    # In a real scenario, this would involve more complex calculations and analysis
    temperature_data = [
        {"year": 2020, "temperature": 1.1},
        {"year": 2030, "temperature": 1.5},
        {"year": 2040, "temperature": 1.9},
        {"year": 2050, "temperature": 2.3}
    ]
    
    economic_data = [
        {"sector": "Agriculture", "impact": 50},
        {"sector": "Energy", "impact": 75},
        {"sector": "Tourism", "impact": 30},
        {"sector": "Infrastructure", "impact": 60}
    ]
    
    return {
        "temperatureData": temperature_data,
        "economicData": economic_data
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
