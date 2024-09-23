document.addEventListener('DOMContentLoaded', () => {
    const llmQueryBtn = document.getElementById('llmQueryBtn');
    const llmQuery = document.getElementById('llmQuery');
    const llmResponse = document.getElementById('llmResponse');
    const llmResponseText = document.getElementById('llmResponseText');

    llmQueryBtn.addEventListener('click', performLLMQuery);
    llmQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performLLMQuery();
        }
    });

    function performLLMQuery() {
        const query = llmQuery.value.trim();
        if (!query) {
            alert('Please enter a query.');
            return;
        }

        // Show loading state
        llmResponseText.textContent = 'Thinking...';
        llmResponse.classList.remove('hidden');
        llmQueryBtn.disabled = true;
        llmQueryBtn.textContent = 'Processing...';

        fetch('/api/llm_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
            llmResponseText.textContent = data.response;
            saveLLMResponse(query, data.response);
        })
        .catch(error => {
            console.error('Error performing LLM query:', error);
            llmResponseText.textContent = 'Error processing your query. Please try again.';
        })
        .finally(() => {
            llmQueryBtn.disabled = false;
            llmQueryBtn.textContent = 'Ask';
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
