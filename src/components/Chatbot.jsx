import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, X, ArrowLeft, MoreVertical, Clock } from 'lucide-react';
import './Chatbot.css';

const SESSION_ID = Math.random().toString(36).substring(7);

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

    // Auto-recovery script to send the key to the backend if they stored it previously
    useEffect(() => {
        const savedKey = localStorage.getItem('naba-widget-key');
        if (savedKey && savedKey.startsWith('AIza')) {
            fetch('http://localhost:5000/api/key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: savedKey })
            }).then(() => {
                localStorage.removeItem('naba-widget-key');
                console.log("Sent recovered key to server.");
            }).catch(e => console.error("Could not auto-recover key", e));
        }
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setMessages([]); // Reset to main menu
        setShowHistory(false);
    };

    const fetchHistory = async () => {
        setIsTyping(true);
        try {
            const res = await fetch('http://localhost:5000/api/history');
            if (res.ok) {
                const data = await res.json();
                setHistorySessions(data);
                setShowHistory(true);
            } else if (res.status === 503) {
                alert("The chat history database is currently disconnected on your machine. Please ensure MongoDB is running.");
            } else {
                alert("Warning: Could not pull chat history right now.");
            }
        } catch (e) {
            console.error("Could not fetch history");
            alert("Warning: Could not connect to the backend server to load history.");
        } finally {
            setIsTyping(false);
        }
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

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: SESSION_ID,
                    message: messageText,
                    history: messages
                })
            });

            if (!response.ok) {
                throw new Error("Could not connect to the backend server.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullText = '';
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.substring(6);
                            if (dataStr === '[DONE]') continue;
                            try {
                                const data = JSON.parse(dataStr);
                                if (data.error) throw new Error(data.error);
                                if (data.text) {
                                    if (fullText === '') {
                                        setMessages(prev => {
                                            const newMsgs = [...prev];
                                            newMsgs[newMsgs.length - 1].content = '';
                                            return newMsgs;
                                        });
                                    }
                                    fullText += data.text;
                                    setMessages(prev => {
                                        const newMsgs = [...prev];
                                        newMsgs[newMsgs.length - 1].content = fullText;
                                        return newMsgs;
                                    });
                                }
                            } catch (e) {
                                if (e.message !== "Unexpected end of JSON input") {
                                    throw e;
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            let errMsg = "Sorry, I couldn't respond right now. ";
            if (error.message?.includes('fetch') || error.message?.includes('connect')) {
                errMsg += "The backend API server may be offline.";
            } else {
                errMsg += "Error: " + error.message;
            }

            // Replace the 'Thinking...' placeholder with the error message
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content = errMsg;
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
