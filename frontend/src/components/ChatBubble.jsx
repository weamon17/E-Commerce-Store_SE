import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable'; 

// === CÁC ICON (SVG) ===
const SendIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009.5 16.571V11.5a1 1 0 011-1h.071a1 1 0 01.929.619l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
  </svg>
);
const ChatIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h2.293l3.353 3.354a.5.5 0 00.854-.353V15H16a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 11a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);
// ======================

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  
  // *** LỖI 1 ĐÃ SỬA Ở ĐÂY: Thêm "=" và "[" ***
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Chào bạn! Tôi là bot hỗ trợ của TechSync Store, tôi có thể giúp gì cho bạn?' }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const nodeRef = useRef(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Lỗi khi gọi bot:", error);
      const errorMessage = { id: Date.now() + 1, sender: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Draggable
      nodeRef={nodeRef} 
      handle=".chat-handle"
      cancel="input, button, .no-drag"
      bounds="body"
    >
      <div ref={nodeRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {isOpen && (
          <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col mb-4 border border-gray-300">
            
            <div className="chat-handle p-3 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center cursor-move">
              <h3 className="font-semibold">TechSync Support</h3>
              <button onClick={() => setIsOpen(false)} className="text-white no-drag">
                <CloseIcon />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`py-2 px-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                      msg.sender === 'bot'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="py-2 px-3 rounded-xl bg-gray-200 text-gray-800">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-2 border-t flex">
              <input
                type="text"
                value={input}
                // *** LỖI 2 ĐÃ SỬA Ở ĐÂY: "e.g.value" -> "e.target.value" ***
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        )}

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="chat-handle w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 cursor-move"
          >
            <ChatIcon />
          </button>
        )}
      </div>
    </Draggable>
  );
}