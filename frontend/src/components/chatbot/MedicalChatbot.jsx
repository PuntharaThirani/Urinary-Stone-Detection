import React, { useState } from 'react';

const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Medical Assistant. How can I help you regarding kidney stones today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  // සරල පිළිතුරු දීමේ ක්‍රමය (Mock AI Logic)
  const getBotResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    if (lowerText.includes("symptoms")) return "Common symptoms include severe pain in the side and back, pain that radiates to the lower abdomen and groin, and pain on urination.";
    if (lowerText.includes("water") || lowerText.includes("drink")) return "Drinking plenty of water (2-3 liters per day) is the best way to prevent kidney stones.";
    if (lowerText.includes("prevention")) return "Reduce salt, eat calcium-rich foods, and drink plenty of fluids.";
    if (lowerText.includes("hello") || lowerText.includes("hi")) return "Hello! Ask me anything about kidney health.";
    return "I'm not sure about that. Please consult a doctor for specific medical advice.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. User Message Add කිරීම
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // 2. Bot Response එක තත්පරයකින් Add කිරීම
    setTimeout(() => {
      const botReply = getBotResponse(input);
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div style={styles.wrapper}>
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>🤖 MedBot Assistant</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
          </div>
          
          <div style={styles.messagesArea}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                ...styles.messageBubble,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f0f0",
                color: msg.sender === "user" ? "white" : "black"
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input 
              style={styles.input} 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a question..."
            />
            <button onClick={handleSend} style={styles.sendBtn}>➤</button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatBtn}>
          💬 Chat
        </button>
      )}
    </div>
  );
};

const styles = {
  wrapper: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 },
  floatBtn: {
    padding: '15px 20px', borderRadius: '30px', backgroundColor: '#007bff', 
    color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontSize: '16px', fontWeight: 'bold'
  },
  chatWindow: {
    width: '300px', height: '400px', backgroundColor: 'white', borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#007bff', color: 'white', padding: '10px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center'
  },
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' },
  messagesArea: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  messageBubble: { padding: '8px 12px', borderRadius: '15px', maxWidth: '80%', fontSize: '14px' },
  inputArea: { padding: '10px', borderTop: '1px solid #eee', display: 'flex' },
  input: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '20px', outline: 'none' },
  sendBtn: { marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#007bff' }
};

export default MedicalChatbot;