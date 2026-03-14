'use client';


import { FileText, Printer } from 'lucide-react';
import { useState } from 'react';
import { generateReport } from '@/app/actions/report';
import { useToast } from '@/app/components/ToastProvider';

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

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generateReport(type, period);

            // Trigger download of the generated content
            const blob = new Blob([res.content], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", res.filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Report generated and downloaded', 'success');
        } catch (error) {
            showToast('Failed to generate report', 'error');
        } finally {
            setLoading(false);
        }
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
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Report'}
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
                                            {/* Re-download logic could be here if we stored file content */}
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} title="Print View"><Printer size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
