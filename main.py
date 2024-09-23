from flask import Flask, render_template, request, jsonify
from utils.data_processor import process_data, export_data
from utils.llm_simulator import simulate_llm_response
from utils.replit_db import ReplitDB
import json

app = Flask(__name__)
db = ReplitDB()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process_data', methods=['POST'])
def api_process_data():
    data = request.json
    processed_data = process_data(data)
    return jsonify(processed_data)

@app.route('/api/export_data', methods=['POST'])
def api_export_data():
    data = request.json
    format_type = data.get('format', 'json')
    exported_data = export_data(data['data'], format_type)
    return jsonify({'exported_data': exported_data})

@app.route('/api/llm_query', methods=['POST'])
def api_llm_query():
    query = request.json['query']
    response = simulate_llm_response(query)
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
    data = request.json
    # Process data and generate report
    return render_template('report.html', report_data=data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
