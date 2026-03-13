'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Trash2, Mic, MicOff, Sparkles, HelpCircle, History } from 'lucide-react';
import { chatWithAI } from '@/app/actions/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'assistant',
            content: "Hi! I'm **TaxPal AI**. 👋 I can help you analyze your spending, find tax deductions, or give you personalized financial advice. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [loadingMessage, setLoadingMessage] = useState('Consulting TaxPal AI...');
    const loadingMessages = [
        'Analyzing your transactions...',
        'Consulting tax regulations...',
        'Calculating financial summaries...',
        'Formulating personalized advice...',
        'Evaluating saving opportunities...'
    ];

    useEffect(() => {
        let interval: any;
        if (isLoading) {
            let i = 0;
            interval = setInterval(() => {
                setLoadingMessage(loadingMessages[i % loadingMessages.length]);
                i++;
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]);

    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    handleSend(transcript);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            // Strip markdown for cleaner speech
            const cleanText = text.replace(/[*_#|]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            window.speechSynthesis.speak(utterance);
        }
    };

    const saveApiKey = (key: string) => {
        localStorage.setItem('openai_api_key', key);
        setApiKey(key);
        setShowApiKeyInput(false);
        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: "✅ **API Key saved!** Encrypted local storage is active. Ask me anything!",
            timestamp: new Date()
        }]);
    };

    const clearChat = () => {
        setMessages([{
            id: Date.now(),
            role: 'assistant',
            content: "Chat history cleared. I'm ready for new questions! 🔄",
            timestamp: new Date()
        }]);
    };

    const handleSend = async (messageText: string = input) => {
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const apiMessages = newMessages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await chatWithAI(apiMessages, apiKey);

            let replyContent = "I'm having trouble connecting right now. Please try again in a moment.";

            if (response.error) {
                console.error(response.error);
                if (response.error === "API Key Not Found") {
                    replyContent = "I need an **OpenAI API Key** to provide advanced reasoning. Please enter it below.";
                    setShowApiKeyInput(true);
                } else {
                    replyContent = response.message || "An error occurred while processing your request.";
                }
            } else if (response.message) {
                replyContent = response.message;
            }

            const aiMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: replyContent,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            if (replyContent.length < 150) {
                speak(replyContent);
            }

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "⚠️ **System Error:** I encountered a technical glitch. Please refresh or try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Styles
    const primaryColor = 'var(--primary, #6366f1)';
    const bgColor = 'var(--bg-card, #ffffff)';
    const textColor = 'var(--text-main, #0f172a)';
    const borderRadius = 'var(--radius, 20px)';

    const suggestions = [
        { label: "Financial Health", q: "What is my current financial status?" },
        { label: "Tax Tips", q: "Give me some tax saving tips for this year." },
        { label: "Budget Advice", q: "How should I budget my variable income?" },
        { label: "Subscriptions", q: "Review my monthly subscriptions" },
        { label: "Investment", q: "Help me choose an investment strategy" }
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#ef4444' : primaryColor,
                    color: 'white',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'rotate(0deg) scale(1)'
                }}
                aria-label="Toggle AI Chat"
            >
                {isOpen ? <X size={28} /> : (
                    <div style={{ position: 'relative' }}>
                        <Bot size={32} />
                        <span style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#4ade80',
                            borderRadius: '50%',
                            border: '2px solid white'
                        }}></span>
                    </div>
                )}
            </button>

            <div style={{
                position: 'fixed',
                bottom: '100px',
                right: '24px',
                width: '400px',
                height: '650px',
                maxHeight: '80vh',
                backgroundColor: bgColor,
                borderRadius: borderRadius,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 9998,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(40px) scale(0.95)',
                pointerEvents: isOpen ? 'auto' : 'none',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
            }}>
                {/* Header */}
                <div style={{
                    background: `linear-gradient(135deg, ${primaryColor}, #4f46e5)`,
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        opacity: 0.1,
                        transform: 'rotate(15deg)'
                    }}>
                        <Sparkles size={100} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '8px',
                            borderRadius: '12px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '0.025em' }}>TaxPal AI</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                                <span style={{ fontSize: '12px', opacity: 0.9, fontWeight: '500' }}>Active Advisor</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={clearChat} title="Reset Chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s' }}>
                            <History size={18} />
                        </button>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    backgroundColor: '#fff',
                    backgroundImage: 'radial-gradient(#e5e7eb 0.5px, transparent 0.5px)',
                    backgroundSize: '20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                maxWidth: '90%',
                                padding: '14px 18px',
                                borderRadius: '18px',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                backgroundColor: msg.role === 'user' ? primaryColor : '#f1f5f9',
                                color: msg.role === 'user' ? 'white' : '#1e293b',
                                boxShadow: msg.role === 'assistant' ? '0 2px 10px rgba(0,0,0,0.03)' : '0 4px 12px rgba(99, 102, 241, 0.15)',
                                overflowWrap: 'anywhere'
                            }}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                            <span style={{
                                fontSize: '10px',
                                color: '#94a3b8',
                                marginTop: '4px',
                                padding: '0 4px'
                            }}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '12px 18px', backgroundColor: '#f1f5f9', borderRadius: '18px', borderBottomLeftRadius: '4px', display: 'flex', gap: '4px' }}>
                                <span className="dot-animation" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%' }}></span>
                                <span className="dot-animation" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                                <span className="dot-animation" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animationDelay: '0.4s' }}></span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', animation: 'fadeInOut 2s infinite' }}>{loadingMessage}</span>
                        </div>
                    )}

                    {showApiKeyInput && (
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: `2px dashed ${primaryColor}`,
                            margin: '10px 0'
                        }}>
                            <div style={{ display: 'flex', items: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Sparkles size={18} color={primaryColor} />
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>Unlock Advanced AI</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>
                                For deeper insights and smarter advice, please provide your OpenAI API Key.
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="password"
                                    placeholder="Paste your sk-..."
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveApiKey((e.target as HTMLInputElement).value);
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        const inp = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                        saveApiKey(inp.value);
                                    }}
                                    style={{
                                        backgroundColor: primaryColor,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px 16px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '13px'
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '0 0 16px 0', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9' }}>
                    {/* Suggestions Bar */}
                    <div style={{
                        padding: '12px 16px',
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(s.q)}
                                disabled={isLoading}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    color: '#475569',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = primaryColor;
                                    e.currentTarget.style.color = primaryColor;
                                    e.currentTarget.style.background = '#f5f7ff';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.color = '#475569';
                                    e.currentTarget.style.background = '#f8fafc';
                                }}
                            >
                                <Sparkles size={12} />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Field */}
                    <div style={{ padding: '0 16px' }}>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '16px',
                            padding: '4px 8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <button
                                onClick={toggleListening}
                                style={{
                                    padding: '8px',
                                    borderRadius: '12px',
                                    backgroundColor: isListening ? '#fee2e2' : 'transparent',
                                    color: isListening ? '#ef4444' : '#64748b',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex'
                                }}
                                title="Voice Command"
                            >
                                {isListening ? <Mic size={20} className="pulse-slow" /> : <Mic size={20} />}
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me about your finances..."
                                style={{
                                    flex: 1,
                                    padding: '12px 0',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '14px',
                                    color: '#334155',
                                    outline: 'none'
                                }}
                                disabled={isLoading}
                            />

                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                style={{
                                    backgroundColor: input.trim() ? primaryColor : 'transparent',
                                    color: input.trim() ? 'white' : '#cbd5e1',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    cursor: input.trim() ? 'pointer' : 'default',
                                    display: 'flex',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.2); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    @keyframes dot-animation {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                    }
                    @keyframes fadeInOut {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                    }
                    .dot-animation {
                        animation: dot-animation 1s infinite;
                    }
                    .pulse-slow {
                        animation: pulse 2s infinite;
                    }
                    ::-webkit-scrollbar {
                        width: 5px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #cbd5e1;
                    }
                    .prose table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 8px 0;
                        font-size: 13px;
                    }
                    .prose th, .prose td {
                        border: 1px solid #e2e8f0;
                        padding: 6px 8px;
                        text-align: left;
                    }
                    .prose th {
                        background-color: #f8fafc;
                    }
                    .prose ul, .prose ol {
                        padding-left: 20px;
                        margin: 8px 0;
                    }
                    .prose p {
                        margin: 8px 0;
                    }
                    .prose h3 {
                        margin: 12px 0 6px 0;
                        font-size: 15px;
                        font-weight: 700;
                    }
                `}</style>
            </div>
        </>
    );
}
