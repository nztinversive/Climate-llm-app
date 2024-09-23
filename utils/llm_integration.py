import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_llm_response(query):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant specializing in climate economic modeling.",
                },
                {
                    "role": "user",
                    "content": query,
                }
            ],
            model="llama2-70b-4096",
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error in LLM API call: {str(e)}")
        return "I apologize, but I'm having trouble processing your request at the moment. Please try again later."

