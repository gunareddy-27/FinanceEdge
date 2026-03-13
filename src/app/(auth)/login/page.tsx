'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/dashboard');
    };

    return (
        <div className="login-split-layout">
            {/* Left Side: Visual & Brand */}
            <div className="login-visual-side">
                <div className="login-visual-pattern" />

                {/* Abstract Blobs for visual interest */}
                <div className="login-visual-blob" style={{ width: 300, height: 300, background: '#818cf8', top: '10%', right: '-10%', opacity: 0.4 }}></div>
                <div className="login-visual-blob" style={{ width: 250, height: 250, background: '#c084fc', bottom: '10%', left: '-10%', opacity: 0.3 }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)' }}>
                            F
                        </div>
                        <span className="text-2xl" style={{ color: 'white' }}>FinanceEdge</span>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '480px' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Master your <br />
                        <span style={{ color: '#818cf8' }}>financial future.</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Join thousands of freelancers and small business owners who trust FinanceEdge for intelligent tax planning and expense tracking.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            'Real-time tax estimation',
                            'Automated expense categorization',
                            'AI-driven financial insights'
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle2 size={20} color="#818cf8" />
                                <span style={{ fontWeight: 500 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 10, opacity: 0.7, fontSize: '0.875rem' }}>
                    © 2026 FinanceEdge Inc. Secure & Encrypted.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="login-form-side">
                <div className="login-form-container">
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 className="text-3xl" style={{ marginBottom: '0.5rem' }}>Welcome back</h2>
                        <p className="text-muted">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <label htmlFor="email">Email address</label>
                            <Mail size={18} style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <label htmlFor="password">Password</label>
                            <Lock size={18} style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                        </div>

                        <div className="flex-between" style={{ marginBottom: '2rem' }}>
                            <div className="flex-items-center" style={{ gap: '0.5rem' }}>
                                <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                                <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Remember me</label>
                            </div>
                            <Link href="#" className="text-sm" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: 'linear-gradient(to right, var(--primary), var(--primary-hover))'
                            }}
                            disabled={loading}
                        >
                            <span style={{ paddingLeft: '0.5rem' }}>{loading ? 'Verifying...' : 'Sign in'}</span>
                            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: 4 }}>
                                <ArrowRight size={20} />
                            </div>
                        </button>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Don't have an account?{' '}
                                <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                                    Create account
                                </Link>
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.6 }}>
                            <ShieldCheck size={14} color="var(--text-muted)" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>256-bit SSL Encryption</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
