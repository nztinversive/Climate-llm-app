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
        llmResponseText.innerHTML = '<p class="text-gray-600">Thinking...</p>';
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
            llmResponseText.innerHTML = formatResponse(data.response);
            saveLLMResponse(query, data.response);
        })
        .catch(error => {
            console.error('Error performing LLM query:', error);
            llmResponseText.innerHTML = '<p class="text-red-600">Error processing your query. Please try again.</p>';
        })
        .finally(() => {
            llmQueryBtn.disabled = false;
            llmQueryBtn.textContent = 'Ask';
        });
    }

    function formatResponse(response) {
        // Simple markdown-like parsing
        return response
            .replace(/\n\n/g, '</p><p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/- (.*)/g, '<li>$1</li>')
            .replace(/<li>.*?<\/li>/g, match => `<ul>${match}</ul>`)
            .replace(/\d+\. (.*)/g, '<li>$1</li>')
            .replace(/<li>.*?<\/li>/g, match => `<ol>${match}</ol>`);
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
