import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, X, ArrowLeft, MoreVertical, Clock } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

const SESSION_ID = Math.random().toString(36).substring(7);

const SYSTEM_PROMPT = `You are Nexa, a highly intelligent and helpful AI assistant representing Nabajit Mandal on his portfolio website. 

Your personality:
- Warm, professional yet friendly.
- You speak in the first person ("I", "my") as Nexa, but ALWAYS refer to Nabajit in the third person ("he", "his", "Nabajit").
- You are enthusiastic about Nabajit's work and encourage people to connect with him.
- Keep responses concise and relevant — this is a chat widget.

Here is everything about Nabajit Mandal:

**Who he is:**
- Name: Nabajit Mandal
- Role: Engineering Student at ICEAS, VTU
- Summary: Engineering student with skills in ML, Python, and coordinating major event operations (Google, WhatsApp, LinkedIn).

**Skills:**
- Programming & Core Tech: C, Python, Machine Learning, Data Preprocessing (Pandas, NumPy)
- AI & Digital Media: Prompt Engineering (Generative AI), Graphic Designing, Video Editing
- Management & Operations: Leadership, Event Logistics, Team Coordination
- UI & Web: React, HTML/CSS, UI/UX Design

**Experience / Leadership:**
- Independent Event Operations: Supervised on-ground logistics for Google, WhatsApp, LinkedIn.
- ICEAS LAN Championship: Operations Manager.
- Tech Fest 2023 & TEJAS 2024: Event Organizer & Volunteer.

**Projects:**
1. ML Student Performance Predictor — Machine learning model predicting academic outcomes based on study hours and attendance. (Python, Scikit-learn, Linear Regression)
2. Intelligent Hostel Management System — Prototyping a full-stack solution utilizing Python and ML for predictive resource allocation.
3. Event System & Hardware Override — Python script to automatically shuffle and distribute registered players into groups.
4. Personal Web Portfolio — Streamlined digital portfolio to showcase technical progress and creative design assets (Built with React).

**Contact Info for Nabajit:**
- Email: nabajit2004m@gmail.com
- GitHub: https://github.com/nabajit2004
- LinkedIn: https://www.linkedin.com/in/nabajit2004m

**How to respond:**
- You can answer questions about Nabajit's portfolio AND you have the capability to answer general world knowledge questions across the universe.
- Keep messages SHORT — this is a widget chat, not an essay. Your responses should be 1-3 sentences max unless listing items!
- If the user asks who you are, say exactly: "I am Nexa, an AI assistant representing Nabajit. I can not only help you with his portfolio but also with any knowledge across the universe... 😊"
- If the user says "Hi", "Hello", or similar greetings, ALWAYS reply exactly with: "Hi! I'm Nexa. How may I help you?"
- Be highly conversational, engaging, and interactive — like ChatGPT or Gemini, but strictly representing Nabajit.
- Keep the chat dynamic. Answer the question naturally, and then ask a follow-up question to keep the conversation flowing.`;

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [historySessions, setHistorySessions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
        }
    }, [inputText]);

    // Local Storage save helper
    const saveSessionToLocal = (newHistory) => {
        try {
            const stored = JSON.parse(localStorage.getItem('naba-history') || '[]');
            const existingSessionIndex = stored.findIndex(s => s.sessionId === SESSION_ID);
            if (existingSessionIndex >= 0) {
                stored[existingSessionIndex].messages = newHistory;
            } else {
                stored.push({ sessionId: SESSION_ID, createdAt: Date.now(), messages: newHistory });
            }
            localStorage.setItem('naba-history', JSON.stringify(stored));
        } catch (e) {
            console.error("Could not save to local storage", e);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setMessages([]); // Reset to main menu
        setShowHistory(false);
    };

    // Pull from Local Storage (Serverless alternative!)
    const fetchHistory = () => {
        setIsTyping(true);
        setTimeout(() => {
            try {
                const stored = JSON.parse(localStorage.getItem('naba-history') || '[]');
                stored.sort((a, b) => b.createdAt - a.createdAt);
                setHistorySessions(stored);
                setShowHistory(true);
            } catch (e) {
                alert("Could not load local history.");
            } finally {
                setIsTyping(false);
            }
        }, 300);
    };

    const loadSession = (session) => {
        setMessages(session.messages);
        setShowHistory(false);
    };

    const sendMessage = async (text) => {
        const messageText = text || inputText.trim();
        if (!messageText || isTyping) return;

        const userMsg = { role: 'user', content: messageText };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputText('');
        setIsTyping(true);

        try {
            // Add initial thinking message immediately for faster perceived response
            setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
            setIsTyping(false);

            // Connect using Client-Side Keys via Vercel Dashboard env config!
            const rawKeys = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_KEYS || '';
            const keyArray = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);

            if (keyArray.length === 0 || keyArray[0] === 'YOUR_API_KEY_HERE') {
                throw new Error("Missing VITE_GEMINI_API_KEY environment variable. Please add it to your deployed Vercel site's Settings!");
            }

            // Simple random load-balancing rotation!
            const activeKey = keyArray[Math.floor(Math.random() * keyArray.length)];

            const genAI = new GoogleGenerativeAI(activeKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: SYSTEM_PROMPT
            });

            // Strip local-only placeholders
            const geminiHistory = messages
                .filter(m => !(m.role === 'assistant' && m.content === 'Thinking...'))
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }));

            const chat = model.startChat({ history: geminiHistory });
            const result = await chat.sendMessageStream(messageText);

            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].content = fullText;
                    return newMsgs;
                });
            }

            // Backup seamlessly
            saveSessionToLocal([...newMessages, { role: 'assistant', content: fullText }]);

        } catch (error) {
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content = "Sorry, I couldn't respond right now. Error: " + error.message;
                return newMsgs;
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Bubble */}
            <button className={`chat-widget-bubble ${isOpen ? 'open' : ''}`} onClick={isOpen ? handleClose : handleOpen} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary-color)', background: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {isOpen ? <X size={24} color="var(--primary-color)" /> : <img src="/chatbot-logo.jpg" alt="Chat Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-window">
                    {/* Header */}
                    <div className="chat-widget-header">
                        {(messages.length > 0 || showHistory) && (
                            <button className="chat-widget-back" onClick={() => { setMessages([]); setShowHistory(false); }}>
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div className="chat-widget-avatar" style={{ padding: '2px', background: 'none' }}>
                            <img src="/chatbot-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        <div className="chat-widget-header-info">
                            <h4>Nexa</h4>
                            <span>Online — ready to help</span>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="chat-widget-close" onClick={handleClose}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-widget-messages">
                        {showHistory ? (
                            <div className="chat-widget-history">
                                <h3><Clock size={16} style={{ display: 'inline', marginRight: '8px' }} /> Past Chats</h3>
                                {historySessions.length === 0 ? (
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>No past chats found.</p>
                                ) : (
                                    <ul className="history-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {historySessions.map(session => (
                                            <li
                                                key={session.sessionId}
                                                onClick={() => loadSession(session)}
                                                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
                                            >
                                                <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '5px' }}>
                                                    {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div style={{ fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {session.messages[0]?.content || 'Empty Session'}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="chat-widget-welcome">
                                <div className="welcome-emoji">👋</div>
                                <h3>Hey! I'm Nexa 👋</h3>
                                <p>
                                    I am Nabajit's AI assistant. I can not only help you with his portfolio but also with any knowledge across the universe... 😊
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`widget-msg ${msg.role}`}>
                                        <div className="widget-msg-bubble">
                                            {msg.role === 'assistant' ? (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="widget-typing">
                                        <div className="widget-typing-dot" />
                                        <div className="widget-typing-dot" />
                                        <div className="widget-typing-dot" />
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="chat-widget-input">
                        <textarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            rows={1}
                            disabled={isTyping}
                        />
                        <button
                            className="chat-widget-send"
                            onClick={() => sendMessage()}
                            disabled={!inputText.trim() || isTyping}
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    <div className="chat-widget-footer">
                        Powered by AI • Nexa Assistant
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
