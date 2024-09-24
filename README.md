# Climate Economic Modeling Tool

## Project Overview

The Climate Economic Modeling Tool is a sophisticated web application designed to analyze and visualize the complex relationships between climate change and economic factors. This tool provides researchers, policymakers, and the general public with an interactive platform to explore various climate scenarios, economic impacts, and risk assessments.

## Key Features

1. **Interactive Data Visualization**: Utilizes Chart.js to create dynamic, responsive charts for temperature trends, economic impacts, risk assessments, scenario comparisons, and sensitivity analyses.

2. **Scenario Analysis**: Allows users to compare different climate scenarios (baseline, optimistic, pessimistic) and their potential outcomes.

3. **Economic Impact Assessment**: Visualizes the projected GDP impact under different climate scenarios.

4. **Risk Metrics**: Provides a radar chart displaying key risk metrics such as mean temperature, VaR 95, and maximum temperature.

5. **Sensitivity Analysis**: Enables users to adjust sensitivity parameters and observe their effects on economic projections.

6. **AI-Powered Queries**: Integrates an AI assistant that can answer user questions about the data and provide insights.

7. **Data Summary Generation**: Automatically generates textual summaries of the visualized data for quick understanding.

8. **Scenario Comparison**: Offers a detailed comparison between different scenarios in a tabular format.

9. **Responsive Design**: Built with a mobile-first approach using Tailwind CSS for a seamless experience across devices.

10. **Data Export**: Allows users to export data in various formats for further analysis.

## Technical Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Backend**: Python (Flask)
- **Data Visualization**: Chart.js
- **AI Integration**: Custom LLM implementation
- **Additional Libraries**: Shepherd.js for user onboarding

## Project Structure

```
climate-economic-modeling-tool/
│
├── static/
│   ├── css/
│   │   └── custom.css
│   ├── js/
│   │   ├── app.js
│   │   ├── charts.js
│   │   └── llm.js
│   └── img/
│       └── herologo.jpg
│
├── templates/
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   ├── index.html
│   ├── about.html
│   └── report.html
│
├── utils/
│   ├── data_processor.py
│   ├── llm_integration.py
│   ├── replit_db.py
│   ├── nlg.py
│   └── scenario_comparison.py
│
├── main.py
├── requirements.txt
└── README.md
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/nztinversive/Climatellmapp
   ```

2. Navigate to the project directory:
   ```
   cd climate-economic-modeling-tool
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```
   python main.py
   ```

5. Open a web browser and navigate to `http://localhost:5000` to access the application.

## Usage Guide

1. **Dashboard Overview**: Upon loading, the dashboard displays default data across various charts.

2. **Scenario Selection**: Use the dropdown menu to select different climate scenarios (baseline, optimistic, pessimistic).

3. **Sensitivity Analysis**: Adjust the sensitivity slider to see how it affects economic projections.

4. **AI Queries**: Use the "Ask the Climate AI" input box to ask specific questions about the data.

5. **Generate Summary**: Click the "Summary" button to generate a textual summary of the current data.

6. **Compare Scenarios**: Use the "Compare" button to view a detailed comparison between different scenarios.

7. **Advanced Analytics**: The "Analytics" button provides access to more in-depth analysis tools.

8. **Data Export**: Use the export functionality to download the current data set for external use.

## Contributing

We welcome contributions to the Climate Economic Modeling Tool. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

