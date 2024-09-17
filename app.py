from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Get the API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# Configure Gemini Pro client
genai.configure(api_key=api_key)

# Create a GenerativeModel object
model = genai.GenerativeModel('gemini-pro')

# Initialize chat history
chat = model.start_chat(history=[])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_route():  # Renamed this function to avoid conflict
    user_message = request.json['message']
    response = chat.send_message(user_message)
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(debug=True)