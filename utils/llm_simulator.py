import random

def simulate_llm_response(query):
    # Simulated LLM responses
    responses = [
        "Based on current climate models, we project a global temperature increase of 1.5°C by 2050 if current trends continue.",
        "The economic impact of climate change varies by sector, with agriculture and coastal real estate being particularly vulnerable.",
        "Renewable energy adoption is crucial for mitigating climate change. Solar and wind power are becoming increasingly cost-competitive.",
        "Climate adaptation strategies, such as improved water management and resilient infrastructure, are essential for minimizing economic losses.",
        "Carbon pricing mechanisms, like cap-and-trade systems or carbon taxes, can be effective tools for reducing greenhouse gas emissions.",
        "The transition to a low-carbon economy presents both challenges and opportunities for job creation and economic growth.",
        "Extreme weather events, exacerbated by climate change, can have significant impacts on supply chains and global trade.",
        "Investing in climate-resilient infrastructure can provide long-term economic benefits and reduce future climate-related costs.",
        "The insurance industry is adapting to increased climate risks by developing new products and adjusting pricing models.",
        "International cooperation and policy alignment are crucial for addressing the global nature of climate change and its economic impacts."
    ]
    
    return random.choice(responses)
