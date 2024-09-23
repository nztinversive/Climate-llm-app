from flask import Flask, render_template, request, jsonify, session
from utils.data_processor import process_data, export_data, generate_scenarios, perform_sensitivity_analysis, load_default_data
from utils.llm_integration import get_llm_response
from utils.replit_db import ReplitDB
import json
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management
db = ReplitDB()

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
    response = get_llm_response(query)
    return jsonify({'response': response})

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
        data = request.json or session['data']
        scenario_type = data.get('scenario', 'baseline')
        updated_scenario = generate_scenarios(data, scenario_type)
        return jsonify(updated_scenario)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/update_sensitivity', methods=['POST'])
def api_update_sensitivity():
    try:
        data = request.json or session['data']
        sensitivity_value = data.get('sensitivity', 50)
        updated_sensitivity = perform_sensitivity_analysis(data, sensitivity_value)
        return jsonify(updated_sensitivity)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)