'use client';

import { FileText, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { logReport } from '@/app/actions/report';

interface Transaction {
    id: number;
    description: string | null;
    amount: number;
    date: Date;
    type: string;
    category?: string | null;
}

interface ExportReportButtonProps {
    transactions: Transaction[];
    summary: { income: number; expenses: number };
}

export default function ExportReportButton({ transactions, summary }: ExportReportButtonProps) {
    const [generating, setGenerating] = useState(false);

    const generatePDF = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // 1. Header
            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241); // Primary Color
            doc.text("TaxPal Financial Report", 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            // Draw a line
            doc.setDrawColor(200);
            doc.line(14, 35, pageWidth - 14, 35);

            // 2. Summary Section
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Financial Summary", 14, 48);

            const netIncome = summary.income - summary.expenses;

            autoTable(doc, {
                startY: 55,
                head: [['Metric', 'Amount']],
                body: [
                    ['Total Income', `$${summary.income.toFixed(2)}`],
                    ['Total Expenses', `$${summary.expenses.toFixed(2)}`],
                    ['Net Income', `$${netIncome.toFixed(2)}`],
                    ['Estimated Tax (25%)', `$${(summary.income * 0.25).toFixed(2)}`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [99, 102, 241] },
                styles: { fontSize: 12, cellPadding: 6 },
                columnStyles: { 0: { fontStyle: 'bold' } }
            });

            // Get Y position after first table safely
            const finalY = (doc as any).lastAutoTable?.finalY || 100;

            // 3. Transactions Table
            if (transactions && transactions.length > 0) {
                doc.text("Transaction History", 14, finalY + 15);

                const tableData = transactions.map(t => [
                    new Date(t.date).toLocaleDateString(),
                    t.description || 'No description',
                    t.category || 'Uncategorized',
                    t.type.toUpperCase(),
                    `$${Number(t.amount).toFixed(2)}`
                ]);

                autoTable(doc, {
                    startY: finalY + 22,
                    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [75, 85, 99] },
                    styles: { fontSize: 10 },
                    alternateRowStyles: { fillColor: [245, 247, 250] }
                });
            } else {
                doc.setFontSize(12);
                doc.setTextColor(150);
                doc.text("No transactions found for this period.", 14, finalY + 15);
            }

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('TaxPal - Your Smart Financial Assistant', 14, doc.internal.pageSize.getHeight() - 10);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, doc.internal.pageSize.getHeight() - 10);
            }

            const fileName = `taxpal_report_${new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);

            // Log report generation to backend
            await logReport(new Date().toISOString().slice(0, 7), "Custom PDF Export");

        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate report. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            className="btn btn-secondary"
            disabled={generating}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
        >
            {generating ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Download size={16} />
                    Export Report (PDF)
                </>
            )}
        </button>
    );
}
