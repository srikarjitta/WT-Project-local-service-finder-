import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const ROLE_TABS = [
    {
        id: 'user', label: 'User',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
        id: 'provider', label: 'Provider',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
    },
];

const BRAND_FEATURES = [
    {
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
        text: 'All providers are verified and background-checked',
    },
    {
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        text: 'Get matched with nearby professionals in minutes',
    },
    {
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
        text: 'Real ratings and reviews from real customers',
    },
    {
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
        text: 'Live tracking from request to completion',
    },
];

export default function Login() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { login } = useAuth();
    const defaultRole = params.get('role') === 'provider' ? 'provider' : 'user';

    const [role, setRole] = useState(defaultRole);
    const [form, setForm] = useState({ email_or_phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(form);
            const { access_token, role: userRole } = res.data;

            // Enforce that the user logs in from the correct role tab
            if (userRole !== role) {
                toast.error(`This account belongs to a ${userRole === 'provider' ? 'Provider' : 'User'}. Please switch tabs.`);
                setLoading(false);
                return;
            }

            localStorage.setItem('token', access_token);
            const meRes = await getMe();
            login(access_token, meRes.data);

            if (userRole === 'provider') navigate('/provider');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (r) => {
        if (r === 'user') setForm({ email_or_phone: 'user@demo.com', password: 'demo123' });
        else setForm({ email_or_phone: 'provider@demo.com', password: 'demo123' });
        setRole(r);
    };

    const subtitle = role === 'provider'
        ? 'Login to your provider account'
        : 'Login to your user account';

    return (
        <div className="auth-page">
            {/* LEFT — Brand Panel */}
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <span className="auth-brand-logo-name">Local Service Finder</span>
                </div>
                <div className="auth-brand-content">
                    <h1 className="auth-brand-title">
                        Trusted Professionals,
                        <span className="auth-brand-accent">At Your Doorstep</span>
                    </h1>
                    <p className="auth-brand-sub">
                        Connect with verified, nearby service providers for any home or business need — quickly and reliably.
                    </p>
                    <div className="auth-brand-features">
                        {BRAND_FEATURES.map((f) => (
                            <div key={f.text} className="auth-brand-feat">
                                <div className="auth-brand-feat-icon">{f.icon}</div>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative bottom bar */}
                <div className="auth-brand-bottom">
                    <span>Request a local service.</span>
                    <span className="auth-brand-dot" />
                    <span>Get connected with a nearby available provider.</span>
                </div>
            </div>

            {/* RIGHT — Form Panel */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <button type="button" className="auth-back-link" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        Back to Home
                    </button>

                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">{subtitle}</p>

                    {/* Role Tabs */}
                    <div className="role-tabs">
                        {ROLE_TABS.map((r) => (
                            <button
                                type="button"
                                key={r.id}
                                className={`role-tab ${role === r.id ? 'active' : ''}`}
                                onClick={() => setRole(r.id)} // Don't clear inputs just because they switched tabs
                            >
                                <span className="role-tab-icon">{r.icon}</span>
                                <span className="role-tab-label">{r.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Demo Quick-Fill */}
                    <div className="demo-fill">
                        <span className="demo-fill-label">Quick demo:</span>
                        <button type="button" className="demo-fill-btn" onClick={() => fillDemo('user')}>User</button>
                        <button type="button" className="demo-fill-btn" onClick={() => fillDemo('provider')}>Provider</button>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-group">
                            <label className="auth-label" htmlFor="email_or_phone">Email or Phone Number</label>
                            <input
                                id="email_or_phone"
                                name="email_or_phone"
                                className="auth-input"
                                type="text"
                                placeholder="Enter your email or phone"
                                value={form.email_or_phone}
                                onChange={(e) => setForm({ ...form, email_or_phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label" htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    name="password"
                                    className="auth-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                            {loading
                                ? <><span className="spinner" /> Logging in...</>
                                : <>Log In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                            }
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <button type="button" className="auth-link-btn" onClick={() => navigate(`/register/${role}`)}>
                                Register here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
