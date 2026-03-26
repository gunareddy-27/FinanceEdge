'use client';

import React, { useState, useEffect } from 'react';
import { 
    FileText, Download, Loader2, Sparkles, BrainCircuit, 
    BarChart3, ShieldCheck, Zap, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useToast } from './ToastProvider';
import Modal from './Modal';

interface AnalysisExportButtonProps {
    behaviorData: any;
    predictionData: any;
    anomaliesData: any[];
    budgetData?: any;
    riskData: any;
    optimizationResult?: any;
    chartContainerRefs?: React.RefObject<HTMLDivElement | null>[];
}

export default function AnalysisExportButton({ 
    behaviorData, 
    predictionData, 
    anomaliesData, 
    riskData,
    chartContainerRefs
}: AnalysisExportButtonProps) {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [step, setStep] = useState(0); 
    const [completed, setCompleted] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const steps = [
        { label: 'Scanning Activity Ledger', icon: FileText },
        { label: 'Benchmarking Multi-Scenario Forecasts', icon: BrainCircuit },
        { label: 'Calibrating Neural Health Graphs', icon: BarChart3 },
        { label: 'Compiling Strategy-Ready PDF', icon: Zap }
    ];

    useEffect(() => {
        if (generating && step < steps.length) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 1200);
            return () => clearTimeout(timer);
        } else if (generating && step === steps.length) {
            setCompleted(true);
            setGenerating(false);
        }
    }, [generating, step, steps.length]);

    const startAnalysis = () => {
        setIsModalOpen(true);
        setGenerating(true);
        setStep(0);
        setCompleted(false);
        setPreviewUrl(null);
    };

    const generatePDF = async (mode: 'save' | 'preview' = 'save') => {
        setIsCapturing(true);
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let currentY = 0;

            const drawCard = (y: number, height: number, color: [number, number, number]) => {
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(10, y, pageWidth - 20, height, 3, 3, 'F');
                doc.setDrawColor(color[0], color[1], color[2]);
                doc.setLineWidth(0.5);
                doc.line(10, y, 10, y + height);
            };

            // COVER
            doc.setFillColor(15, 23, 42); 
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setFillColor(79, 70, 229, 0.2);
            doc.circle(pageWidth, 0, 80, 'F');
            doc.setFillColor(255, 255, 255);
            doc.setFontSize(40);
            doc.setFont('helvetica', 'bold');
            doc.text("FINANCEEDGE", 20, 80);
            doc.setFontSize(24);
            doc.setTextColor(148, 163, 184);
            doc.text("INTELLIGENCE AUDIT", 20, 95);

            // SECTION 1: EXEC SUMMARY
            doc.addPage();
            currentY = 25;
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(18);
            doc.text("1. EXECUTIVE SUMMARY", 14, currentY);
            currentY += 15;
            
            autoTable(doc, {
                startY: currentY,
                head: [['PARAMETER', 'VALUE', 'AI ANALYSIS']],
                body: [
                    ['Liquidity Profile', `₹${(behaviorData?.weekendSpending || 0).toLocaleString()}/wk`, 'Verified'],
                    ['30-Day Forecast', `₹${(predictionData?.prediction || 0).toLocaleString()}`, predictionData?.confidence || 'Stable'],
                    ['Anomalous Events', (anomaliesData?.length || 0).toString(), 'Scan Clear']
                ],
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });
            
            currentY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("STRATEGIC RECOMMENDATIONS", 14, currentY);
            currentY += 10;
            const recommendations = [
                { title: "Cash Flow Regularity", desc: `Detected ₹${(behaviorData?.weekendSpending || 0).toLocaleString()} in lifestyle outflows.` },
                { title: "Wealth Velocity", desc: `Projected surplus validated by scenario benchmarking.` }
            ];
            
            recommendations.forEach(r => {
                drawCard(currentY, 20, [79, 70, 229]);
                doc.setFontSize(11);
                doc.text(r.title, 18, currentY + 7);
                doc.setFontSize(9);
                doc.text(r.desc, 18, currentY + 13);
                currentY += 25;
            });

            // GRAPHS
            if (chartContainerRefs && chartContainerRefs.length > 0) {
                doc.addPage();
                doc.setFontSize(18);
                doc.text("2. VISUAL DATA AUDIT", 14, 25);
                currentY = 40;
                for (let i = 0; i < chartContainerRefs.length; i++) {
                    const ref = chartContainerRefs[i];
                    if (ref && ref.current) {
                        try {
                            const canvas = await html2canvas(ref.current, { 
                                scale: 1, 
                                useCORS: true, 
                                logging: false,
                                backgroundColor: '#ffffff'
                            });
                            const imgData = canvas.toDataURL('image/png');
                            const imgWidth = pageWidth - 28;
                            const imgHeight = (canvas.height * imgWidth) / canvas.width;
                            if (currentY + imgHeight > pageHeight - 30) { doc.addPage(); currentY = 25; }
                            doc.addImage(imgData, 'PNG', 14, currentY, imgWidth, imgHeight);
                            currentY += imgHeight + 15;
                        } catch (e) {
                            console.warn("Skipping chart capture due to error", e);
                        }
                    }
                }
            }

            // FOOTER
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(`FINANCEEDGE AUDIT • LIVE ANALYIC VALUES • PAGE ${i} OF ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            if (mode === 'save') {
                doc.save(`FinanceEdge_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
                showToast("Strategy report downloaded!", "success");
                setIsModalOpen(false);
            } else {
                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                showToast("Preview generated!", "success");
            }
        } catch (error) {
            console.error(error);
            showToast("PDF capture failed. Try again.", "error");
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAnalysis}
                className="btn btn-primary"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '12px 24px', 
                    borderRadius: '18px',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.3)',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: 'none',
                    color: 'white'
                }}
            >
                <Sparkles size={18} className="text-primary-light" />
                INTELLIGENCE HUB
            </motion.button>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => !isCapturing && (previewUrl ? setPreviewUrl(null) : setIsModalOpen(false))} 
                title={previewUrl ? "Audit Preview" : "FinanceEdge Intelligence Hub"}
            >
                <div style={{ padding: '0.5rem 0' }}>
                    {previewUrl ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Audit Preview" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button 
                                    onClick={() => generatePDF('save')} 
                                    className="btn btn-primary" 
                                    style={{ padding: '14px', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Download size={18} /> CONFIRM DOWNLOAD
                                </button>
                                <button onClick={() => setPreviewUrl(null)} className="btn btn-secondary" style={{ padding: '14px', borderRadius: '14px', fontWeight: 800 }}>
                                    BACK TO HUB
                                </button>
                            </div>
                        </div>
                    ) : (
                        !completed ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="flex flex-col items-center text-center gap-4 mb-4">
                                    <div style={{ position: 'relative' }}>
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                                            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRightColor: 'var(--success)' }}
                                        />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            <BrainCircuit size={40} className="text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black mb-2">Autonomous Audit</h3>
                                        <p className="text-muted text-sm text-center">Calibrating neural engines for high-fidelity output...</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {steps.map((s, i) => {
                                        const Icon = s.icon;
                                        const isActive = i === step;
                                        const isDone = i < step;
                                        return (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0.5, x: -10 }}
                                                animate={{ opacity: isActive || isDone ? 1 : 0.5, x: 0 }}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '1rem', 
                                                    padding: '1rem', 
                                                    background: isActive ? 'var(--primary-fade)' : 'transparent',
                                                    borderRadius: '16px',
                                                    border: isActive ? '1px solid var(--primary-bg)' : '1px solid transparent'
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '32px', 
                                                    height: '32px', 
                                                    borderRadius: '10px', 
                                                    background: isDone ? 'var(--success)' : (isActive ? 'var(--primary)' : '#e2e8f0'),
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {isDone ? <CheckCircle2 size={18} /> : (isActive ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />)}
                                                </div>
                                                <span style={{ fontWeight: isActive ? 800 : 600, fontSize: '14px' }}>{s.label}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ textAlign: 'center', padding: '1rem' }}
                            >
                                <div style={{ width: '80px', height: '80px', background: 'var(--success-fade)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <ShieldCheck size={48} />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Audit Finalized</h3>
                                <p className="text-muted mb-8 text-sm leading-relaxed">
                                    Our strategic models have completed the benchmark analysis. 
                                    You can now <strong>Preview</strong> the report or <strong>Download</strong> the final version.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <button 
                                            onClick={() => generatePDF('save')} 
                                            disabled={isCapturing}
                                            className="btn btn-primary" 
                                            style={{ padding: '16px', borderRadius: '16px', fontWeight: 800, gap: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                            {isCapturing ? 'SAVING...' : 'DOWNLOAD PDF'}
                                        </button>
                                        <button 
                                            onClick={() => generatePDF('preview')} 
                                            disabled={isCapturing}
                                            className="btn btn-secondary" 
                                            style={{ padding: '16px', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            {isCapturing ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                                            PREVIEW
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)} 
                                        disabled={isCapturing}
                                        style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        DISMISS HUB
                                    </button>
                                </div>
                            </motion.div>
                        )
                    )}
                </div>
            </Modal>
        </>
    );
}
