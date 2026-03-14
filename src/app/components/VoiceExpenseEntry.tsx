'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RefreshCw } from 'lucide-react';

interface VoiceExpenseEntryProps {
    onVoiceParsed: (data: { amount: number; description: string; category?: string }) => void;
}

export default function VoiceExpenseEntry({ onVoiceParsed }: VoiceExpenseEntryProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

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
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    parseExpenseVoice(transcript);
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

    const parseExpenseVoice = (text: string) => {
        // Example: "Add expense 500 rupees for food"
        let amount = 0;
        let description = text;
        let category = "Miscellaneous";

        const amountRegex = /\b(\d+)\b/; // Find a number
        const match = text.match(amountRegex);
        if (match) {
            amount = parseInt(match[1], 10);
            description = text.replace(match[0], '').trim();
        }

        if (text.includes('food') || text.includes('lunch') || text.includes('dinner')) category = 'Meals';
        if (text.includes('travel') || text.includes('uber') || text.includes('flight')) category = 'Travel';
        if (text.includes('office') || text.includes('supplies')) category = 'Office';

        onVoiceParsed({ amount, description: text, category });
    };

    return (
        <button
            type="button"
            onClick={toggleListening}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: isListening ? '#fee2e2' : '#f8fafc',
                color: isListening ? '#ef4444' : '#64748b',
                border: '1px dashed',
                borderColor: isListening ? '#ef4444' : '#cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s',
                marginTop: '8px'
            }}
        >
            {isListening ? (
                <>
                    <MicOff size={18} className="animate-pulse" />
                    Listening... Speak now
                </>
            ) : (
                <>
                    <Mic size={18} />
                    Voice Expense Entry
                </>
            )}
        </button>
    );
}
