'use client';

import { FileText, Download, Loader2, Sparkles, BrainCircuit, BarChart3 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import { useToast } from './ToastProvider';

interface AnalysisExportButtonProps {
    behaviorData: any;
    predictionData: any;
    anomaliesData: any[];
    budgetData: any;
    riskData: any;
    optimizationResult?: any;
    chartContainerRefs?: React.RefObject<HTMLDivElement>[];
}

export default function AnalysisExportButton({ 
    behaviorData, 
    predictionData, 
    anomaliesData, 
    budgetData, 
    riskData,
    optimizationResult,
    chartContainerRefs
}: AnalysisExportButtonProps) {
    const { showToast } = useToast();
    const [generating, setGenerating] = useState(false);

    const generatePDF = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let currentY = 0;

            // Helper for rounded rect with color
            const drawCard = (y: number, height: number, color: [number, number, number]) => {
                doc.setFillColor(248, 250, 252); // slate-50
                doc.roundedRect(10, y, pageWidth - 20, height, 3, 3, 'F');
                doc.setDrawColor(color[0], color[1], color[2]);
                doc.setLineWidth(0.5);
                doc.line(10, y, 10, y + height); // Left accent line
            };

            // 1. IMPROVED HEADER (Cover-style)
            doc.setFillColor(15, 23, 42); 
            doc.rect(0, 0, pageWidth, 50, 'F');
            
            // Decorative elements
            doc.setFillColor(79, 70, 229, 0.1);
            doc.circle(pageWidth, 0, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text("FINANCIAL INTELLIGENCE", 14, 25);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(`AUDIT REPORT • ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 14, 32);
            doc.setTextColor(255, 255, 255);
            doc.text(`${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}`, pageWidth - 14, 32, { align: 'right' });

            currentY = 65;

            // 2. EXECUTIVE SUMMARY CARD
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("I. EXECUTIVE ANALYSIS: BEHAVIORAL PROFILE", 14, currentY);
            currentY += 8;

            const insightText = behaviorData?.insights || 'AI is currently processing your financial movement patterns to establish a baseline.';
            const splitInsights = doc.splitTextToSize(insightText, pageWidth - 36);
            const cardHeight = 25 + (splitInsights.length * 5);
            
            drawCard(currentY, cardHeight, [79, 70, 229]);
            
            doc.setFontSize(11);
            doc.setTextColor(79, 70, 229);
            doc.text(`CLUSTER: ${behaviorData?.profile || 'DETERMINING...'}`, 18, currentY + 10);
            
            doc.setFontSize(10);
            doc.setTextColor(51, 65, 85);
            doc.setFont('helvetica', 'normal');
            doc.text(splitInsights, 18, currentY + 18);
            
            currentY += cardHeight + 15;

            // 3. PREDICTIVE INSIGHTS
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(15, 23, 42);
            doc.text("II. AUTONOMOUS FORECASTING (30-DAY WINDOW)", 14, currentY);

            autoTable(doc, {
                startY: currentY + 6,
                head: [['SCENARIO ENGINE', 'ESTIMATED OUTCOME', 'AI CONFIDENCE']],
                body: [
                    ['LSTM Neural Network', `₹${(predictionData?.prediction || 0).toLocaleString()}`, `${predictionData?.confidence || 'Verifying'}`],
                    ['Weekend Deviation', `₹${(behaviorData?.weekendSpending || 0).toLocaleString()}`, 'Historical'],
                    ['Weekday Baseline', `₹${(behaviorData?.weekdaySpending || 0).toLocaleString()}`, 'Consistent']
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], fontSize: 9, cellPadding: 4 },
                bodyStyles: { fontSize: 9, cellPadding: 4 },
                margin: { left: 14, right: 14 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;

            // 4. RECOMMENDATIONS SECTION (NEW & DETAILED)
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("III. STRATEGIC RECOMMENDATIONS", 14, currentY);
            currentY += 8;

            const recommendations = [
                { 
                    title: "Liquidity Optimization", 
                    desc: behaviorData?.weekendSpending > (behaviorData?.weekdaySpending * 0.5) 
                        ? "High weekend variance detected. Recommend setting a dynamic 'Weekend Shield' budget of ₹2,000 to preserve capital."
                        : "Spend velocity is stable. Recommend moving ₹5,000 to a high-yield 'Opportunity Fund'."
                },
                {
                    title: "Risk Mitigation",
                    desc: anomaliesData.length > 0 
                        ? `Detected ${anomaliesData.length} unusual transactions. System recommends manual audit of '${anomaliesData[0].description}' immediately.`
                        : "Financial shield is healthy. No immediate risk. Continue automated monitoring."
                },
                {
                    title: "Tax Efficiency",
                    desc: "Based on current cash flow, prioritize Section 80C investments this month to offset projected quarterly liabilities."
                }
            ];

            recommendations.forEach(rec => {
                const recHeight = 22;
                if (currentY + recHeight > pageHeight - 30) { doc.addPage(); currentY = 20; }
                
                doc.setDrawColor(226, 232, 240);
                doc.line(14, currentY, pageWidth - 14, currentY);
                
                doc.setFontSize(10);
                doc.setTextColor(15, 23, 42);
                doc.setFont('helvetica', 'bold');
                doc.text(rec.title, 14, currentY + 7);
                
                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.setFont('helvetica', 'normal');
                const splitDesc = doc.splitTextToSize(rec.desc, pageWidth - 35);
                doc.text(splitDesc, 14, currentY + 13);
                
                currentY += 15 + (splitDesc.length * 4);
            });

            // 5. GRAPHS
            if (chartContainerRefs && chartContainerRefs.length > 0) {
                doc.addPage();
                currentY = 25;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(15, 23, 42);
                doc.text("IV. VISUAL DATA AUDIT (SYSTEM GRAPHS)", 14, currentY);
                currentY += 10;

                for (let i = 0; i < chartContainerRefs.length; i++) {
                    const ref = chartContainerRefs[i];
                    if (ref.current) {
                        try {
                            const canvas = await html2canvas(ref.current, { scale: 2, logging: false, backgroundColor: '#ffffff' });
                            const imgData = canvas.toDataURL('image/png');
                            const imgWidth = pageWidth - 28;
                            const imgHeight = (canvas.height * imgWidth) / canvas.width;
                            
                            if (currentY + imgHeight > pageHeight - 25) { doc.addPage(); currentY = 25; }
                            doc.addImage(imgData, 'PNG', 14, currentY, imgWidth, imgHeight);
                            currentY += imgHeight + 15;
                        } catch (err) {}
                    }
                }
            }

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(241, 245, 249);
                doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text(`TaxPal AI Engine • CONFIDENTIAL DOCUMENT • Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            doc.save(`TaxPal_Intellgence_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            showToast("Strategy-ready analysis report generated!", "success");
        } catch (error) {
            console.error("PDF Export Error:", error);
            showToast("Failed to generate report.", "error");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            className="btn btn-primary"
            disabled={generating}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.2)',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: 'none',
                color: 'white'
            }}
        >
            {generating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Sparkles size={16} className="text-primary-light" />
            )}
            {generating ? 'ANALYZING...' : 'PDF ANALYSIS'}
        </button>
    );
}
