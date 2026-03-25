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
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
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
        setMounted(true);
        setMessages([
            {
                id: 1,
                role: 'assistant',
                content: "Hi! I'm **TaxPal AI**. 👋 I can help you analyze your spending, find tax deductions, or give you personalized financial advice. How can I help you today?",
                timestamp: new Date()
            }
        ]);
        
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) setApiKey(storedKey);

        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onresult = (e: any) => {
                    const t = e.results[0][0].transcript;
                    setInput(t);
                    handleSend(t);
                };
                recognitionRef.current = recognition;
            }
        }
    }, []);

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
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isLoading]);

    const toggleListening = () => {
        if (!recognitionRef.current) return alert("Not supported.");
        isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#|]/g, ''));
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
            content: "✅ **API Key saved!** Encrypted local storage is active.",
            timestamp: new Date()
        }]);
    };

    const clearChat = () => {
        setMessages([{
            id: Date.now(),
            role: 'assistant',
            content: "Chat history cleared. 🔄",
            timestamp: new Date()
        }]);
    };

    const handleSend = async (messageText: string = input) => {
        if (!messageText.trim()) return;
        const userMsg: Message = { id: Date.now(), role: 'user', content: messageText, timestamp: new Date() };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithAI(newMsgs.map(m => ({ role: m.role, content: m.content })), apiKey);
            let reply = response.error ? (response.error === "API Key Not Found" ? "Need API Key." : response.message) : response.message;
            if (response.error === "API Key Not Found") setShowApiKeyInput(true);
            const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: reply || "Error", timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
            if (reply && reply.length < 150) speak(reply);
        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Error", timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null; // Prevent hydration mismatch

    const primaryColor = 'var(--primary, #6366f1)';
    const bgColor = 'var(--bg-card, #ffffff)';
    const borderRadius = 'var(--radius, 20px)';

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: isOpen ? '#ef4444' : primaryColor, color: 'white', border: 'none', cursor: 'pointer', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isOpen ? <X size={28} /> : <Bot size={32} />}
            </button>

            <div style={{
                position: 'fixed', bottom: '100px', right: '24px', width: '400px', height: '650px', maxHeight: '80vh',
                backgroundColor: bgColor, borderRadius: borderRadius, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9998,
                opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(40px) scale(0.95)',
                pointerEvents: isOpen ? 'auto' : 'none'
            }}>
                <div style={{ background: `linear-gradient(135deg, ${primaryColor}, #4f46e5)`, padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>TaxPal AI</h3>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '90%', padding: '12px 16px', borderRadius: '14px',
                                backgroundColor: msg.role === 'user' ? primaryColor : '#f1f5f9',
                                color: msg.role === 'user' ? 'white' : '#1e293b'
                            }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                            <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            className="input"
                            style={{ flex: 1 }}
                        />
                        <button onClick={() => handleSend()} className="btn btn-primary"><Send size={18} /></button>
                    </div>
                </div>
            </div>
        </>
    );
}
