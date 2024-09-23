def compare_scenarios(scenarios):
    comparison = []
    scenario_names = list(scenarios.keys())
    
    for year in scenarios[scenario_names[0]]:
        row = {'Year': year['year']}
        for scenario in scenario_names:
            row[scenario] = next(s['temperature'] for s in scenarios[scenario] if s['year'] == year['year'])
        comparison.append(row)
    
    return comparison