from flask import Flask, render_template, request, jsonify, session
from utils.data_processor import process_data, export_data, generate_scenarios, perform_sensitivity_analysis, load_default_data
from utils.llm_integration import get_llm_response
from utils.replit_db import ReplitDB
import json
import os
import logging
import traceback

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management
db = ReplitDB()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/')
def index():
    if 'data' not in session:
        session['data'] = load_default_data()
    return render_template('index.html')

@app.route('/api/get_default_data', methods=['GET'])
def api_get_default_data():
    if 'data' not in session:
        session['data'] = load_default_data()
    return jsonify(session['data'])

@app.route('/api/process_data', methods=['POST'])
def api_process_data():
    data = request.json or session['data']
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    result = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    session['data'] = result
    return jsonify(result)

@app.route('/api/export_data', methods=['POST'])
def api_export_data():
    data = request.json
    format_type = data.get('format', 'json')
    exported_data = export_data(data['data'], format_type)
    return jsonify({'exported_data': exported_data})

@app.route('/api/llm_query', methods=['POST'])
def api_llm_query():
    query = request.json['query']
    try:
        response = get_llm_response(query)
        return jsonify({'response': response})
    except Exception as e:
        logging.error(f"Error in LLM query: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your query.'}), 500

@app.route('/api/save_session', methods=['POST'])
def api_save_session():
    session_data = request.json
    session_id = db.save_session(session_data)
    return jsonify({'session_id': session_id})

@app.route('/api/load_session/<session_id>', methods=['GET'])
def api_load_session(session_id):
    session_data = db.load_session(session_id)
    return jsonify(session_data)

@app.route('/generate_report', methods=['POST'])
def generate_report():
    data = request.json or session['data']
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    report_data = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    return render_template('report.html', report_data=report_data)

@app.route('/api/advanced_analytics', methods=['POST'])
def api_advanced_analytics():
    data = request.json or session['data']
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    result = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    return jsonify(result)

@app.route('/api/update_scenario', methods=['POST'])
def api_update_scenario():
    try:
        data = request.json or session.get('data', {})
        scenario_type = data.get('scenario', 'baseline')
        temperature_data = data.get('temperatureData', [])
        
        if not temperature_data:
            return jsonify({'error': 'No temperature data provided'}), 400

        updated_scenario = generate_scenarios({'temperatureData': temperature_data}, scenario_type)
        return jsonify(updated_scenario)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/update_sensitivity', methods=['POST'])
def api_update_sensitivity():
    try:
        data = request.json
        logging.info(f"Received sensitivity update request: {json.dumps(data, indent=2)}")

        if not data:
            raise ValueError("No data provided in the request")

        sensitivity_value = data.get('sensitivity')
        economic_data = data.get('economicData')

        if sensitivity_value is None:
            raise ValueError("Sensitivity value is missing")
        if not economic_data:
            raise ValueError("Economic data is missing or empty")

        logging.info(f"Performing sensitivity analysis. Sensitivity: {sensitivity_value}")
        logging.info(f"Economic data structure: {json.dumps(economic_data, indent=2)}")

        updated_sensitivity = perform_sensitivity_analysis({'economicData': economic_data}, sensitivity_value)
        
        logging.info(f"Sensitivity analysis completed. Result: {json.dumps(updated_sensitivity, indent=2)}")

        if not all(isinstance(value, (int, float)) for value in updated_sensitivity.values()):
            raise ValueError("Invalid sensitivity values returned from analysis")

        return jsonify(updated_sensitivity)
    except ValueError as ve:
        error_message = str(ve)
        logging.error(f"ValueError in update_sensitivity: {error_message}")
        return jsonify({'error': error_message, 'errorType': 'ValueError'}), 400
    except Exception as e:
        error_message = str(e)
        logging.error(f"Unexpected error in update_sensitivity: {error_message}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'An unexpected error occurred', 'errorType': str(e.__class__.__name__)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
