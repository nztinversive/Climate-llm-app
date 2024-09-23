document.addEventListener('DOMContentLoaded', () => {
    const llmQueryBtn = document.getElementById('llmQueryBtn');
    const llmQuery = document.getElementById('llmQuery');
    const llmResponse = document.getElementById('llmResponse');

    llmQueryBtn.addEventListener('click', performLLMQuery);

    function performLLMQuery() {
        const query = llmQuery.value.trim();
        if (!query) {
            alert('Please enter a query.');
            return;
        }

        fetch('/api/llm_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
            llmResponse.innerHTML = `<p><strong>Response:</strong> ${data.response}</p>`;
            saveLLMResponse(query, data.response);
        })
        .catch(error => {
            console.error('Error performing LLM query:', error);
            llmResponse.innerHTML = '<p>Error processing your query. Please try again.</p>';
        });
    }

    function saveLLMResponse(query, response) {
        const responses = JSON.parse(localStorage.getItem('llmResponses') || '[]');
        responses.push({ query, response, timestamp: new Date().toISOString() });
        localStorage.setItem('llmResponses', JSON.stringify(responses));
    }
});

function getLLMResponses() {
    return JSON.parse(localStorage.getItem('llmResponses') || '[]');
}
