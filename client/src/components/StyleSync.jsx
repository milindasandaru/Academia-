import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

const StyleSync = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm StyleSync. I can help you find the perfect outfit. What are you looking for?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  // Load the Mock Data when the component mounts
  useEffect(() => {
    fetch('/mockData.json')
      .then(res => res.json())
      .then(data => setInventory(data));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 2. Call Backend to Extract Search Intent
      // NOTE: Make sure this URL matches your server (localhost or 127.0.0.1)
      const searchRes = await axios.post('http://localhost:5000/api/search', { query: userMsg.text });
      const filters = searchRes.data;
      console.log("AI Filters:", filters);

      // 3. Filter Inventory (The "Expert System" Logic)
      const matchedProducts = inventory.filter(item => {
        let isMatch = true;
        // Check Category (fuzzy match)
        if (filters.category && !item.category.includes(filters.category.toLowerCase())) isMatch = false;
        // Check Budget
        if (filters.budget && item.price > filters.budget) isMatch = false;
        // Check Color (simple check)
        if (filters.color && !item.tags.includes(filters.color.toLowerCase())) isMatch = false;
        return isMatch;
      });

      // 4. Get Final Stylist Response from AI
      const chatRes = await axios.post('http://localhost:5000/api/chat', { 
        query: userMsg.text,
        products: matchedProducts 
      });

      // 5. Add Bot Response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: chatRes.data.message,
        products: matchedProducts 
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I had trouble connecting to the stylist server." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 h-[600px] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-gray-200 mt-10">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-2 text-white shadow-md">
        <Sparkles size={20} />
        <h1 className="font-bold text-lg">StyleSync AI</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
            
            {/* Render Product Cards if available */}
            {msg.products && msg.products.length > 0 && (
              <div className="flex gap-2 mt-2 ml-10 overflow-x-auto w-full pb-2">
                {msg.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs ml-10 flex items-center gap-1"><Loader2 className="animate-spin" size={12} /> Thinking...</div>}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe the occasion or outfit..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleSync;