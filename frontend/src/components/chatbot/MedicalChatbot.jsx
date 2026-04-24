import React, { useEffect, useRef, useState } from 'react';

const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I am your UroScan AI assistant. I can help explain scan results, reports, uploads, and the doctor review process. I provide support information only and not a final medical diagnosis.',
      sender: 'bot',
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = [
    'How do I upload an X-ray?',
    'What does stone detected mean?',
    'When can a patient see the report?',
    'What does confidence score mean?',
  ];

  const getBotResponse = (userText) => {
    const lowerText = userText.toLowerCase().trim();

    if (
      lowerText.includes('hello') ||
      lowerText.includes('hi') ||
      lowerText.includes('hey')
    ) {
      return 'Hello! I can help you understand uploads, AI scan results, report generation, and doctor confirmation in the system.';
    }

    if (
      lowerText.includes('upload') ||
      lowerText.includes('x-ray') ||
      lowerText.includes('scan image')
    ) {
      return 'To analyze a scan, go to the Analyze page, upload a valid X-ray image in JPG, JPEG, or PNG format, and run the AI analysis. The image is uploaded first, then the AI model processes it and shows the result summary.';
    }

    if (
      lowerText.includes('stone detected') ||
      lowerText.includes('what does stone') ||
      lowerText.includes('meaning of stone')
    ) {
      return '“Stone detected” means the AI model found an image region that may indicate a urinary stone. This is an AI-assisted finding only. It must still be reviewed and confirmed by a doctor before it becomes part of the final patient-visible report.';
    }

    if (
      lowerText.includes('confidence') ||
      lowerText.includes('confidence score')
    ) {
      return 'The confidence score shows how strongly the AI model believes a detected region may contain a stone. A higher score means the model is more confident, but it is still not a final diagnosis. Doctor review is required.';
    }

    if (
      lowerText.includes('patient see') ||
      lowerText.includes('when can a patient') ||
      lowerText.includes('doctor approve') ||
      lowerText.includes('approve')
    ) {
      return 'A patient should only see the final report after the doctor reviews the AI draft, edits anything necessary, and confirms the report. Pending AI results should not be treated as a final diagnosis.';
    }

    if (
      lowerText.includes('report') ||
      lowerText.includes('draft') ||
      lowerText.includes('diagnosis')
    ) {
      return 'After analysis, the system can generate an AI-assisted draft report. The doctor can review, edit, and confirm the final diagnosis, advice, and follow-up plan. Only the confirmed version should be shown to the patient.';
    }

    if (
      lowerText.includes('treatment') ||
      lowerText.includes('medicine') ||
      lowerText.includes('what should i do') ||
      lowerText.includes('prathikara')
    ) {
      return 'Treatment depends on factors such as stone size, location, symptoms, and the doctor’s clinical judgment. The system should present doctor-approved advice, not automatic treatment decisions from AI alone.';
    }

    if (
      lowerText.includes('symptom') ||
      lowerText.includes('pain') ||
      lowerText.includes('sign')
    ) {
      return 'Common urinary stone symptoms may include flank pain, lower abdominal pain, burning during urination, nausea, or blood in urine. These symptoms vary by patient, so clinical consultation is important.';
    }

    if (
      lowerText.includes('prevent') ||
      lowerText.includes('water') ||
      lowerText.includes('drink')
    ) {
      return 'General prevention advice often includes staying well hydrated, reducing excessive salt intake, and following medical dietary advice when appropriate. Prevention guidance should ideally be personalized by a doctor.';
    }

    if (
      lowerText.includes('doctor') &&
      (lowerText.includes('edit') || lowerText.includes('change'))
    ) {
      return 'Yes. In this system, the doctor should be able to edit the AI-generated draft, update the final diagnosis, add advice, and confirm the report before it is shown to the patient.';
    }

    if (
      lowerText.includes('dashboard') ||
      lowerText.includes('page') ||
      lowerText.includes('navigation')
    ) {
      return 'Doctors usually use the dashboard for scan analysis, reports, and patient review. Patients should mainly see their dashboard and confirmed reports. Staff can manage patients and appointments.';
    }

    return 'I can help with scan uploads, AI result meaning, confidence scores, report approval flow, and doctor confirmation. Please ask about one of those topics.';
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
    }, 700);
  };

  const handleSend = () => {
    sendMessage(input);
  };

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
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">UroScan AI Assistant</p>
              <p className="text-[11px] text-blue-100">
                Support guidance only
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full px-2 py-1 text-xl font-bold transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs leading-5 text-slate-500">
              This assistant provides educational and workflow guidance only. Final diagnosis and treatment decisions must be confirmed by a doctor.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                  Typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about reports, analysis, or workflow..."
              />
              <button
                onClick={handleSend}
                className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-blue-700"
        >
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default MedicalChatbot;