// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hey there! I am BroBot, your AI Wingman. Ask me anything!' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const botReply = { sender: 'bot', text: response.data.reply };
      setMessages([...messages, userMessage, botReply]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'bot', text: '🤖 Oops! I hit a snag. Can you try that again?' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container">
      <h1>🤖 BroBot - Your AI Wingman</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'message user-message' : 'message bot-message'}>
            {msg.sender === 'user' ? <strong>You:</strong> : <strong>BroBot:</strong>} {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message"><strong>BroBot:</strong> Thinking...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ask BroBot anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;