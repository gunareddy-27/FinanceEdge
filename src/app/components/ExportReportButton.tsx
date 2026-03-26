'use client';

import { FileText, Download, Loader2, Table } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { logReport } from '@/app/actions/report';
import { useToast } from './ToastProvider';

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
    const { showToast } = useToast();
    const [generating, setGenerating] = useState(false);

    const generatePDF = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            doc.setFontSize(22);
            doc.setTextColor(99, 102, 241); // Primary Color
            doc.text("TaxPal Financial Report", 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
            doc.line(14, 35, pageWidth - 14, 35);

            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text("Financial Summary (INR)", 14, 48);

            const netIncome = summary.income - summary.expenses;

            autoTable(doc, {
                startY: 55,
                head: [['Metric', 'Amount']],
                body: [
                    ['Total Income', `₹${summary.income.toLocaleString()}`],
                    ['Total Expenses', `₹${summary.expenses.toLocaleString()}`],
                    ['Net Income', `₹${netIncome.toLocaleString()}`],
                    ['Estimated Tax (25%)', `₹${(summary.income * 0.25).toLocaleString()}`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [99, 102, 241] }
            });

            const finalY = (doc as any).lastAutoTable?.finalY || 100;

            if (transactions && transactions.length > 0) {
                doc.text("Transaction History", 14, finalY + 15);
                const tableData = transactions.map(t => [
                    new Date(t.date).toLocaleDateString(),
                    t.description || 'No description',
                    t.category || 'Uncategorized',
                    t.type.toUpperCase(),
                    `₹${Number(t.amount).toLocaleString()}`
                ]);

                autoTable(doc, {
                    startY: finalY + 22,
                    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [75, 85, 99] }
                });
            }

            doc.save(`taxpal_report_${new Date().toISOString().slice(0, 10)}.pdf`);
            await logReport(new Date().toISOString().slice(0, 7), "Custom PDF Export");
            showToast("PDF Report downloaded successfully", "success");
        } catch (error) {
            showToast("Failed to generate PDF.", "error");
        } finally {
            setGenerating(false);
        }
    };

    const generateExcel = async () => {
        if (transactions.length === 0) {
            showToast("No transactions to export.", "error");
            return;
        }

        setGenerating(true);
        try {
            // Create CSV content (Excel compatible)
            const headers = ["Date", "Description", "Category", "Type", "Amount (INR)"];
            const rows = transactions.map(t => [
                new Date(t.date).toLocaleDateString(),
                `"${t.description || ''}"`,
                `"${t.category || ''}"`,
                t.type.toUpperCase(),
                t.amount
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `taxpal_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast("Excel Ledger (CSV) downloaded successfully", "success");
            await logReport(new Date().toISOString().slice(0, 7), "Excel Export");
        } catch (error) {
            showToast("Failed to generate Excel file.", "error");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
                onClick={generatePDF}
                className="btn btn-secondary"
                disabled={generating}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', borderRadius: '14px' }}
            >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Export PDF
            </button>
            <button
                onClick={generateExcel}
                className="btn btn-primary"
                disabled={generating}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', borderRadius: '14px' }}
            >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Table size={16} />}
                Get Excel (.csv)
            </button>
        </div>
    );
}
