# Import necessary modules and custom utilities
from flask import Flask, render_template, request, jsonify, session
from utils.data_processor import process_data, export_data, generate_scenarios, perform_sensitivity_analysis, load_default_data
from utils.llm_integration import get_llm_response
from utils.replit_db import ReplitDB
import json
import os
import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional

# Initialize Flask app and set up session management
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key for secure sessions
db = ReplitDB()

# Configure logging for better debugging and monitoring
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Route for the landing page
@app.route('/')
def landing():
    return render_template('landing.html')

# Route for the main dashboard
@app.route('/dashboard')
def dashboard():
    logging.info('Dashboard route accessed')
    # Load default data if not present in the session
    if 'data' not in session:
        logging.info('Loading default data into session')
        session['data'] = load_default_data()
    else:
        logging.info('Using existing data from session')
    
    logging.info(f'Session data: {json.dumps(session["data"], indent=2)}')
    
    current_year = datetime.now().year
    return render_template('index.html', current_year=current_year)

# API route to get default data
@app.route('/api/get_default_data', methods=['GET'])
def api_get_default_data():
    logging.info('Default data requested')
    if 'data' not in session:
        logging.info('Loading default data into session')
        session['data'] = load_default_data()
    data = session['data']
    logging.info(f'Returning default data: {json.dumps(data, indent=2)}')
    # Return a structured response with all required data fields
    return jsonify({
        'temperatureData': data.get('temperatureData', []),
        'economicData': data.get('economicData', []),
        'riskMetrics': data.get('riskMetrics', {}),
        'scenarioData': data.get('scenarioData', {}),
        'sensitivityData': data.get('sensitivityData', {})
    })

# API route to process data and generate scenarios and sensitivity analysis
@app.route('/api/process_data', methods=['POST'])
def api_process_data():
    data = request.json or session.get('data', {})
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    # Combine all results into a single response
    result = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    session['data'] = result
    return jsonify(result)

# API route to export data in various formats
@app.route('/api/export_data', methods=['POST'])
def api_export_data():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    format_type = data.get('format', 'json')
    try:
        exported_data = export_data(data['data'], format_type)
        return jsonify({'exported_data': exported_data})
    except KeyError:
        return jsonify({'error': 'Invalid data format'}), 400
    except Exception as e:
        logging.error(f"Error exporting data: {str(e)}")
        return jsonify({'error': 'An error occurred while exporting data'}), 500

# API route to handle LLM queries
@app.route('/api/llm_query', methods=['POST'])
def api_llm_query():
    query = request.json.get('query') if request.json else None
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    
    try:
        response = get_llm_response(query)
        return jsonify({'response': response})
    except Exception as e:
        logging.error(f"Error in LLM query: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your query.'}), 500

# API route to save session data
@app.route('/api/save_session', methods=['POST'])
def api_save_session():
    session_data = request.json
    if not session_data:
        return jsonify({'error': 'No session data provided'}), 400
    
    session_id = db.save_session(session_data)
    return jsonify({'session_id': session_id})

# API route to load session data
@app.route('/api/load_session/<session_id>', methods=['GET'])
def api_load_session(session_id):
    session_data = db.load_session(session_id)
    if session_data is None:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(session_data)

# Route to generate a report based on processed data
@app.route('/generate_report', methods=['POST'])
def generate_report():
    data = request.json or session.get('data', {})
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    report_data = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    current_year = datetime.now().year
    return render_template('report.html', report_data=report_data, current_year=current_year)

# API route for advanced analytics
@app.route('/api/advanced_analytics', methods=['POST'])
def api_advanced_analytics():
    data = request.json or session.get('data', {})
    processed_data = process_data(data)
    scenario_data = generate_scenarios(processed_data)
    sensitivity_data = perform_sensitivity_analysis(processed_data)
    
    result = {
        **processed_data,
        'scenarioData': scenario_data,
        'sensitivityData': sensitivity_data
    }
    
    return jsonify(result)

# API route to update scenario data
@app.route('/api/update_scenario', methods=['POST'])
def api_update_scenario():
    try:
        data = request.json
        logging.info(f"Received scenario update request: {json.dumps(data, indent=2)}")

        if not data:
            return jsonify({'error': 'No data provided in the request'}), 400

        scenario_type = data.get('scenario', 'baseline')
        temperature_data = data.get('temperatureData')
        
        if not temperature_data:
            return jsonify({'error': 'No temperature data provided'}), 400

        updated_scenario = generate_scenarios({'temperatureData': temperature_data}, scenario_type)
        logging.info(f"Generated updated scenario: {json.dumps(updated_scenario, indent=2)}")
        
        return jsonify(updated_scenario)
    except Exception as e:
        logging.error(f"Error updating scenario: {str(e)}")
        return jsonify({'error': 'An error occurred while updating the scenario'}), 500

# API route to update sensitivity analysis
@app.route('/api/update_sensitivity', methods=['POST'])
def api_update_sensitivity():
    try:
        data = request.json
        logging.info(f"Received sensitivity update request: {json.dumps(data, indent=2)}")

        if not data:
            return jsonify({'error': 'No data provided in the request'}), 400

        sensitivity_value = data.get('sensitivity')
        economic_data = data.get('economicData')

        if sensitivity_value is None:
            return jsonify({'error': 'Sensitivity value is missing'}), 400
        if not economic_data:
            return jsonify({'error': 'Economic data is missing or empty'}), 400

        logging.info(f"Performing sensitivity analysis. Sensitivity: {sensitivity_value}")
        logging.info(f"Economic data structure: {json.dumps(economic_data, indent=2)}")

        updated_sensitivity = perform_sensitivity_analysis({'economicData': economic_data}, sensitivity_value)
        
        logging.info(f"Sensitivity analysis completed. Result: {json.dumps(updated_sensitivity, indent=2)}")

        if not all(isinstance(value, (int, float)) for value in updated_sensitivity.values()):
            return jsonify({'error': 'Invalid sensitivity values returned from analysis'}), 500

        return jsonify(updated_sensitivity)
    except Exception as e:
        error_message = str(e)
        logging.error(f"Unexpected error in update_sensitivity: {error_message}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'An unexpected error occurred', 'errorType': str(e.__class__.__name__)}), 500

# Import additional utilities for new features
from utils.nlg import generate_chart_summary
from utils.scenario_comparison import compare_scenarios

# Route for the about page
@app.route('/about')
def about():
    current_year = datetime.now().year
    return render_template('about.html', current_year=current_year)

# API route to generate summary of chart data
@app.route('/api/generate_summary', methods=['POST'])
def api_generate_summary():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        summary = generate_chart_summary(data)
        return jsonify({'summary': summary})
    except Exception as e:
        logging.error(f"Error generating summary: {str(e)}")
        return jsonify({'error': 'An error occurred while generating the summary'}), 500

# API route to compare scenarios
@app.route('/api/compare_scenarios', methods=['POST'])
def api_compare_scenarios():
    try:
        data = request.json
        if not data or 'scenarios' not in data:
            return jsonify({'error': 'No scenario data provided'}), 400
        
        comparison = compare_scenarios(data['scenarios'])
        return jsonify({'comparison': comparison})
    except Exception as e:
        logging.error(f"Error comparing scenarios: {str(e)}")
        return jsonify({'error': 'An error occurred while comparing scenarios'}), 500

# Run the Flask app if this script is executed directly
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)