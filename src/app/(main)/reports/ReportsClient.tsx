'use client';


import { FileText, Printer, Download } from 'lucide-react';
import { useState } from 'react';
import { generateReport, getReportPreviewData } from '@/app/actions/report';
import { useToast } from '@/app/components/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    id: number;
    reportType: string;
    period: string;
    createdAt: Date;
    filePath: string | null;
}

export default function ReportsClient({ reports }: { reports: Report[] }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('Income Statement');
    const [period, setPeriod] = useState('Current Month');
    const [printData, setPrintData] = useState<any>(null);
    const [isShowingPreview, setIsShowingPreview] = useState(false);

    const handleGenerate = async (reportType?: string, reportPeriod?: string) => {
        setLoading(true);
        const activeType = reportType || type;
        const activePeriod = reportPeriod || period;
        
        try {
            const res = await generateReport(activeType, activePeriod);

            // Trigger download of the generated content
            const blob = new Blob([res.content], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", res.filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Report downloaded successfully', 'success');
        } catch (error) {
            showToast('Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintRequest = async (reportType: string, reportPeriod: string) => {
        setLoading(true);
        try {
            const data = await getReportPreviewData(reportType, reportPeriod);
            setPrintData(data);
            setIsShowingPreview(true);
        } catch (error) {
            showToast('Failed to load print preview', 'error');
        } finally {
            setLoading(false);
        }
    };

    const triggerPrint = () => {
        window.print();
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Financial Reports</h1>
                    <p className="text-muted">Generate and export your financial statements.</p>
                </div>
            </header>

            {/* Generator Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl" style={{ marginBottom: '1.5rem' }}>Generate Report</h3>

                <div className="grid-cols-3" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <label className="label">Report Type</label>
                        <select
                            className="input"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option>Income Statement</option>
                            <option>Expense Report</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Period</label>
                        <select
                            className="input"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option>Current Month</option>
                            <option>Last Quarter</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Format</label>
                        <select className="input" disabled>
                            <option>CSV (Excel Compatible)</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button className="btn btn-secondary">Reset</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePrintRequest(type, period)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Generate & Preview'}
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="card">
                <h3 className="text-xl" style={{ marginBottom: '1.5rem' }}>Recent Reports History</h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Report Name</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Period</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 600 }}>Generated On</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No reports generated yet.
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ padding: 6, background: '#E0E7FF', borderRadius: 4, color: 'var(--primary)' }}>
                                                <FileText size={16} />
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{report.reportType}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 0' }}>{report.period}</td>
                                    <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button 
                                                className="btn btn-secondary" 
                                                style={{ padding: '0.4rem 0.6rem' }} 
                                                title="Print View"
                                                onClick={() => handlePrintRequest(report.reportType, report.period)}
                                                disabled={loading}
                                            >
                                                <Printer size={16} />
                                            </button>
                                            <button 
                                                className="btn btn-secondary" 
                                                style={{ padding: '0.4rem 0.6rem' }} 
                                                title="Download CSV"
                                                onClick={() => handleGenerate(report.reportType, report.period)}
                                                disabled={loading}
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>

            {/* Print Preview Modal */}
            <AnimatePresence>
                {isShowingPreview && printData && (
                    <div className="modal-overlay open" style={{ zIndex: 1000 }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal" 
                            style={{ maxWidth: '850px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div className="flex-between no-print" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                <h2 className="text-2xl">Report Preview</h2>
                                <div className="flex gap-2">
                                    <button className="btn btn-secondary" onClick={() => setIsShowingPreview(false)}>Close</button>
                                    <button className="btn btn-secondary" onClick={() => handleGenerate(printData.type, printData.period)} disabled={loading}>
                                        <Download size={18} /> {loading ? 'Downloading...' : 'Download CSV'}
                                    </button>
                                    <button className="btn btn-primary" onClick={triggerPrint}><Printer size={18} /> Print Now</button>
                                </div>
                            </div>

                            {/* Actual Report Content for Printing */}
                            <div id="printable-report" className="print-section">
                                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                                    <div>
                                        <h1 className="text-3xl" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>TaxPal Financial Report</h1>
                                        <p className="text-muted">{printData.type} — {printData.period}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700 }}>Generated On</div>
                                        <div>{new Date(printData.generatedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                                    <div className="grid-cols-3" style={{ textAlign: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5 }}>Total Volume</div>
                                            <div className="text-xl">₹{printData.transactions.reduce((acc: any, t: any) => acc + t.amount, 0).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5 }}>Total Items</div>
                                            <div className="text-xl">{printData.transactions.length}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5 }}>Status</div>
                                            <div className="text-xl" style={{ color: 'var(--success-text)' }}>Finalized</div>
                                        </div>
                                    </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                                            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Date</th>
                                            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Description</th>
                                            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Category</th>
                                            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Type</th>
                                            <th style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {printData.transactions.map((t: any, idx: number) => (
                                            <tr key={idx}>
                                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{new Date(t.date).toLocaleDateString()}</td>
                                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{t.description}</td>
                                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{t.category}</td>
                                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{t.type}</td>
                                                <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 600 }}>₹{t.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    This is an automatically generated document from TaxPal AI. All figures are based on user-provided transaction data. 
                                    <br />
                                    © {new Date().getFullYear()} TaxPal Analytics
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
