import React, { useEffect, useRef, useState, useCallback } from 'react';

const MedicalChatbot = ({ analysis }) => {
  const [isOpen, setIsOpen]     = useState(false);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisInjected, setAnalysisInjected] = useState(false); 
  const [messages, setMessages] = useState([
    {
      text:   'Hello! I am your UroScan AI assistant. I can help explain scan results and system workflow.',
      sender: 'bot',
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Inject AI result — only once 
  useEffect(() => {
    if (!analysis || analysisInjected) return;

    const message = analysis.hasStones
      ? `AI detected ${analysis.stoneCount} possible stone(s) in this scan. Confidence: ${
          analysis.phase1?.confidence?.toFixed(2) || 'N/A'
        }%. This is NOT a final diagnosis — please consult your doctor.`
      : 'AI did not detect any stones in this scan. A doctor review is still recommended for confirmation.';

    setMessages((prev) => [...prev, { text: message, sender: 'bot' }]);
    setAnalysisInjected(true); 
  }, [analysis, analysisInjected]);

  const quickReplies = [
    'Explain my result',
    'What does confidence mean?',
    'What should I do next?',
    'How to upload X-ray?',
    'Is this result accurate?',
  ];

  // Generate bot response based on user input
  const getBotResponse = useCallback((userText) => {
    const text = userText.toLowerCase().trim();

    if (text.includes('result') || text.includes('my result')) {
      if (!analysis) return 'Please run an X-ray analysis first to see your results.';
      return analysis.hasStones
        ? `Your scan shows ${analysis.stoneCount} possible stone(s). This is an AI-assisted preliminary result and must be confirmed by a qualified doctor.`
        : 'No stones were detected in your scan by the AI model. Please still consult your doctor for confirmation.';
    }

    if (text.includes('confidence')) {
      return 'Confidence score indicates how certain the AI model is about a detection. A higher score means stronger confidence, but it does NOT replace a doctor\'s diagnosis.';
    }

    if (text.includes('accurate') || text.includes('accuracy')) {
      return 'The AI system has been trained on thousands of X-ray images and achieves high accuracy. However, all results must be verified by a qualified medical professional before any treatment decisions.';
    }

    if (text.includes('what should i do') || text.includes('next')) {
      return 'Next steps: (1) Show this result to your doctor. (2) The doctor will review the AI analysis. (3) A confirmed report will be generated. (4) Follow your doctor\'s medical advice.';
    }

    if (text.includes('upload')) {
      return 'To upload an X-ray: (1) Go to the Analyze page. (2) Click the upload area or drag & drop. (3) Select a JPG or PNG image. (4) Click "Run AI Analysis".';
    }

    if (text.includes('stone')) {
      return 'A urinary stone (kidney stone) is a hard deposit of minerals that forms in the kidneys. The AI detects suspicious regions in X-ray images that may indicate stones. Doctor confirmation is always required.';
    }

    if (text.includes('report')) {
      return 'After AI analysis, a preliminary draft report is generated. Your doctor will review and confirm this report. You can view confirmed reports in your patient dashboard.';
    }

    if (text.includes('doctor') || text.includes('consult')) {
      return 'Always consult your doctor after receiving AI results. The AI system supports clinical decision-making but does not replace medical expertise.';
    }

    if (text.includes('hello') || text.includes('hi')) {
      return 'Hello! How can I help you today? You can ask me about your scan results, how to upload X-rays, or what to do next.';
    }

    return 'I can help explain your AI results, confidence scores, and next steps. Try asking about your result or what to do next.';
  }, [analysis]);

  // Send message
  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: getBotResponse(text), sender: 'bot' },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend    = () => sendMessage(input);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">

      {/*  Chat Window  */}
      {isOpen && (
        <div className="flex h-[520px] w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">UroScan AI Assistant</p>
              <p className="text-[11px] text-blue-100">
                {analysis ? '● Analysis Loaded' : '● Chat Support'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl leading-none hover:text-blue-200"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] leading-6 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl text-sm text-slate-500">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
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
                className="flex-1 border border-slate-200 px-3 py-2 rounded-full text-sm outline-none focus:border-blue-400 transition"
                placeholder="Ask about your result..."
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Toggle Button  */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all"
      >
        <span>{isOpen ? '✕' : '💬'}</span>
        <span className="text-sm font-bold">{isOpen ? 'Close' : 'Chat'}</span>
      </button>
    </div>
  );
};

export default MedicalChatbot;