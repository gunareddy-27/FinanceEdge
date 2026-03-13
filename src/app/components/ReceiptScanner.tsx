'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCw, Upload, Check } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface ReceiptData {
    merchant: string;
    date: Date | null;
    amount: number | null;
}

interface ReceiptScannerProps {
    onScanComplete: (data: ReceiptData) => void;
}

export default function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            const text = result.data.text;
            const parsedData = parseReceiptText(text);
            onScanComplete(parsedData);

        } catch (error) {
            console.error("OCR Error:", error);
            alert("Failed to read receipt. Please try again.");
        } finally {
            setIsScanning(false);
            setProgress(0);
        }
    };

    // Advanced Parser for Receipts
    const parseReceiptText = (text: string): ReceiptData => {
        const lines = text.split('\n');

        let merchant = "";
        let date: Date | null = null;
        let amount: number | null = null;

        // 1. Find Total Amount (Look for "Total", "Amount", or highest number with decimal)
        const amountRegex = /(\$|£|€)?\s?(\d+\.\d{2})/;
        let potentialAmounts: number[] = [];

        lines.forEach(line => {
            const lower = line.toLowerCase();
            const match = line.match(amountRegex);

            if (match) {
                const val = parseFloat(match[2]);
                if (lower.includes('total') || lower.includes('amount') || lower.includes('balance')) {
                    amount = val;
                }
                potentialAmounts.push(val);
            }
        });

        if (!amount && potentialAmounts.length > 0) {
            // Heuristic: The largest number is usually the total
            amount = Math.max(...potentialAmounts);
        }

        // 2. Find Date (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
        const dateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}[/-]\d{1,2}[/-]\d{1,2})/;
        for (const line of lines) {
            const match = line.match(dateRegex);
            if (match) {
                // Try to parse
                const d = new Date(match[0]);
                if (!isNaN(d.getTime())) {
                    date = d;
                    break;
                }
            }
        }

        // 3. Find Merchant (Usually the first non-empty line with text)
        for (const line of lines) {
            const clean = line.trim();
            if (clean && clean.length > 3 && !clean.match(/\d/)) {
                // Ignore lines that look like dates or totals
                merchant = clean;
                break;
            }
        }

        return {
            merchant: merchant || "Unknown Merchant",
            date: date || new Date(),
            amount: amount || 0
        };
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isScanning ? '#e2e8f0' : '#f0f9ff',
                    color: isScanning ? '#64748b' : '#0284c7',
                    border: '1px dashed #0ea5e9',
                    borderRadius: '8px',
                    cursor: isScanning ? 'wait' : 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'all 0.2s'
                }}
            >
                {isScanning ? (
                    <>
                        <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        Scanning Receipt... {progress}%
                    </>
                ) : (
                    <>
                        <Camera size={18} />
                        Auto-Fill from Receipt
                    </>
                )}
            </button>
            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
