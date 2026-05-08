import React, { useEffect, useRef, useState } from 'react';

const MedicalChatbot = ({ analysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I am your UroScan AI assistant. I can help explain scan results and system workflow.',
      sender: 'bot',
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 🔥 Inject AI result automatically
  useEffect(() => {
    if (!analysis) return;

    const message = analysis.hasStones
      ? `AI detected ${analysis.stoneCount} possible stone(s) in the scan. This is not a final diagnosis. Please consult a doctor.`
      : 'AI did not detect any stones in this scan. A doctor review is still recommended.';

    setMessages((prev) => [
      ...prev,
      { text: message, sender: 'bot' }
    ]);
  }, [analysis]);

  const quickReplies = [
    'Explain my result',
    'What does confidence mean?',
    'What should I do next?',
    'How to upload X-ray?',
  ];

  // 🔥 Smart response using analysis
  const getBotResponse = (userText) => {
    const text = userText.toLowerCase().trim();

    // 🔥 AI result based answers
    if (text.includes('result') || text.includes('my result')) {
      if (!analysis) return 'Please run an analysis first.';

      return analysis.hasStones
        ? `Your scan shows ${analysis.stoneCount} possible stone(s). This is an AI-assisted result and must be confirmed by a doctor.`
        : 'No stones were detected in your scan according to the AI model.';
    }

    if (text.includes('confidence')) {
      if (!analysis) return 'Run an analysis to see confidence values.';

      return 'Confidence indicates how sure the AI model is about a detection. Higher values mean stronger confidence, but it is not a confirmed diagnosis.';
    }

    if (text.includes('what should i do') || text.includes('next')) {
      return 'You should consult a doctor for confirmation. The AI result is only a preliminary analysis.';
    }

    if (text.includes('upload')) {
      return 'Go to the Analyze page, upload an X-ray image (JPG/PNG), and run the AI analysis.';
    }

    if (text.includes('stone')) {
      return 'A stone detection means the AI found a suspicious region that may indicate a urinary stone. Doctor confirmation is required.';
    }

    return 'I can explain your AI results, confidence levels, and next steps. Try asking about your result.';
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        text: getBotResponse(text),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="flex h-[500px] w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">UroScan AI Assistant</p>
              <p className="text-[11px] text-blue-100">AI + Chat Support</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xl">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-sm text-gray-500">Typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t">
            <div className="flex flex-wrap gap-2 mb-2">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1 border rounded-full hover:bg-blue-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border px-3 py-2 rounded-full text-sm"
                placeholder="Ask about your result..."
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl"
        >
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default MedicalChatbot;