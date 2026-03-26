'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, Cpu, TrendingUp, ShieldAlert, CheckCircle, Clock, 
    ArrowRight, Settings, Play, RefreshCcw, Bell, Layers, 
    Sparkles, ShieldCheck, Mail, Save, FileCheck, Smartphone
} from 'lucide-react';
import { runFullAutomationCycle } from '@/app/actions/automation';
import { useToast } from '@/app/components/ToastProvider';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface AutomationCardProps {
    id: string;
    title: string;
    description: string;
    icon: any;
    status: 'Active' | 'Inactive' | 'Pending';
    type: 'Trigger' | 'Full Process' | 'Action';
    color: string;
}

function AutomationCard({ title, description, icon: Icon, status, type, color }: AutomationCardProps) {
    const isActive = status === 'Active';
    
    return (
        <motion.div variants={item} className="card h-full flex flex-col" style={{ 
            borderLeft: `5px solid ${color}`,
            transition: 'all 0.3s ease'
        }}>
            <div className="flex-between mb-4">
                <div style={{ padding: '10px', background: `${color}15`, color, borderRadius: '14px' }}>
                    <Icon size={24} />
                </div>
                <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    background: isActive ? '#f0fdf4' : '#f8fafc',
                    color: isActive ? '#10b981' : '#64748b',
                    border: `1px solid ${isActive ? '#10b98120' : '#e2e8f0'}`
                }}>
                    {status.toUpperCase()}
                </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted mb-6 flex-grow">{description}</p>
            
            <div className="flex-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{type}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? '#10b981' : '#cbd5e1' }} />
                </div>
            </div>
        </motion.div>
    );
}

export default function AutomationsClient() {
    const { showToast } = useToast();
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<{msg: string, time: string}[]>([]);

    const handleRunCycle = async () => {
        setIsRunning(true);
        try {
            const res = await runFullAutomationCycle();
            if (res.success) {
                const newLogs = res.logs.map(msg => ({ 
                    msg, 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }));
                setLogs(prev => [...newLogs, ...prev]);
                showToast("Full Automation Cycle Complete", "success");
            }
        } catch (err) {
            showToast("Failed to run automation engine", "error");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '14px', color: 'white' }}>
                            <Zap size={24} />
                        </div>
                        <h1 className="text-4xl font-black">FinanceEdge Automations</h1>
                    </div>
                    <p className="text-muted font-medium ml-12">Autonomous agents managing your wealth in the background.</p>
                </div>
                
                <button 
                    disabled={isRunning}
                    onClick={handleRunCycle}
                    className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ 
                        gap: '12px', 
                        padding: '16px 32px', 
                        borderRadius: '20px', 
                        fontWeight: 800,
                        boxShadow: isRunning ? 'none' : '0 15px 30px -10px rgba(79, 70, 229, 0.4)'
                    }}
                >
                    {isRunning ? <RefreshCcw className="animate-spin" size={20} /> : <Play size={20} />}
                    {isRunning ? 'EXECUTING ENGINE...' : 'RUN SMART CYCLE'}
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
                {/* Status Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: 'none', color: 'white' }}>
                        <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                            <Cpu size={22} className="text-primary" />
                            Engine Status
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex-between">
                                <span className="text-sm font-semibold opacity-70">Background Processor</span>
                                <span className="text-xs font-black text-success bg-emerald-500/10 px-2 py-1 rounded">HEALTHY</span>
                            </div>
                            <div className="flex-between">
                                <span className="text-sm font-semibold opacity-70">NLP Classifier</span>
                                <span className="text-xs font-black text-success bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
                            </div>
                            <div className="flex-between">
                                <span className="text-sm font-semibold opacity-70">Last Trigger</span>
                                <span className="text-xs font-black opacity-90">{logs[0]?.time || 'Idle'}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                            <p className="text-[10px] font-black uppercase text-primary mb-2">Internal API Docs</p>
                            <p className="text-xs opacity-80 leading-relaxed mb-2">Magic Link API: POST `api/magic-link` with `userId`, `description`, and `amount` for zero-input logging.</p>
                            <p className="text-xs opacity-60 leading-relaxed italic">System runs a full cycle on the 1st of every month automatically.</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-black text-lg mb-6 flex items-center gap-3">
                            <Layers size={18} className="text-primary" />
                            Operation Logs
                        </h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="space-y-4 pr-2">
                            {logs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Clock size={32} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-xs font-bold text-slate-400">No recent operations.</p>
                                </div>
                            ) : logs.map((log, i) => (
                                <div key={i} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }} className="animate-in slide-in-from-left-2 fade-in">
                                    <p className="text-xs font-bold text-slate-800 mb-1">{log.msg}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{log.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Automations Grid */}
                <motion.div 
                    initial="hidden"
                    animate="show"
                    transition={{ staggerChildren: 0.05 }}
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                        gap: '1.5rem' 
                    }}
                >
                    <AutomationCard 
                        id="auto_cat"
                        title="AI Auto-Categorization"
                        description="Uses NLP to extract labels from raw merchant names via Magic Link and Manual entry."
                        icon={Cpu}
                        status="Active"
                        type="Trigger"
                        color="#6366f1"
                    />
                    <AutomationCard 
                        id="monthly_cycle"
                        title="Monthly Archival"
                        description="Automatically generates board-ready PDF/CSV reports and clears cache for new month."
                        icon={FileCheck}
                        status="Active"
                        type="Full Process"
                        color="#10b981"
                    />
                    <AutomationCard 
                        id="budget_reset"
                        title="Budget Resilience"
                        description="Resets monthly budgets and auto-increases limits if high-confidence overspending is detected."
                        icon={TrendingUp}
                        status="Active"
                        type="Action"
                        color="#f59e0b"
                    />
                    <AutomationCard 
                        id="magic_link"
                        title="Zero-Input Pipeline"
                        description="Allows external systems (Swiggy, Uber) to log expenses directly via Magic Link API."
                        icon={Smartphone}
                        status="Active"
                        type="Trigger"
                        color="#ec4899"
                    />
                    <AutomationCard 
                        id="invest_suggest"
                        title="Wealth Optimization"
                        description="Analyzes idle cash flow and suggests SIP allocations based on current market risk."
                        icon={Sparkles}
                        status="Active"
                        type="Action"
                        color="#8b5cf6"
                    />
                    <AutomationCard 
                        id="security_ai"
                        title="Threat Monitoring"
                        description="Detects anomalous spending spikes and triggers MFA for high-value outflows."
                        icon={ShieldCheck}
                        status="Active"
                        type="Full Process"
                        color="#ef4444"
                    />
                    <AutomationCard 
                        id="reminder_auto"
                        title="Smart Overdue Nudges"
                        description="Automatically identifies overdue split bills and simulates high-priority WhatsApp nudges."
                        icon={Bell}
                        status="Active"
                        type="Action"
                        color="#10b981"
                    />
                    <AutomationCard 
                        id="tax_advisor"
                        title="Tax Yield Sync"
                        description="Periodically checks for tax optimization opportunities under Section 80C/80D."
                        icon={ShieldAlert}
                        status="Active"
                        type="Trigger"
                        color="#1e293b"
                    />
                </motion.div>
            </div>
            
            <div style={{ height: '100px' }} />
        </div>
    );
}
