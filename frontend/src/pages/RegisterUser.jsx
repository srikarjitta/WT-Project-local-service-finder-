import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterUser() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm_password: '', location: '', latitude: null, longitude: null });
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);

    const getGPS = () => {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
                setGeoLoading(false);
                toast.success('Location detected!');
            },
            () => { setGeoLoading(false); toast.error('Could not get location'); }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
        setLoading(true);
        try {
            const res = await registerUser(form);
            localStorage.setItem('token', res.data.access_token);
            const meRes = await getMe();
            login(res.data.access_token, meRes.data);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed');
        } finally { setLoading(false); }
    };

    const F = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

    return (
        <div className="auth-page">
            {/* LEFT */}
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="auth-brand-logo-name">Local Service Finder</span>
                </div>
                <div className="auth-brand-content">
                    <h1 className="auth-brand-title">Find skilled<span className="auth-brand-accent">professionals near you</span></h1>
                    <p className="auth-brand-sub">Create a free account and get access to hundreds of verified service providers in your area.</p>
                    <div className="auth-brand-features">
                        {['No booking fees', 'Live request tracking', 'Verified professionals only', 'Rate & review your experience'].map((t) => (
                            <div key={t} className="auth-brand-feat">
                                <div className="auth-brand-feat-icon">✓</div>
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="auth-form-side">
                <div className="auth-card" style={{ maxWidth: 480 }}>
                    <button className="auth-back-link" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        Back to Home
                    </button>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Sign up to start finding local services</p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Full Name *</label>
                                <input className="auth-input" placeholder="Your full name" {...F('name')} required />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Phone Number *</label>
                                <input className="auth-input" type="tel" placeholder="10-digit number" {...F('phone')} required />
                            </div>
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address *</label>
                            <input className="auth-input" type="email" placeholder="your@email.com" {...F('email')} required />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Your Location</label>
                            <div className="auth-input-with-btn">
                                <input className="auth-input" placeholder="Area / address" {...F('location')} />
                                <button type="button" className="btn btn-secondary btn-sm" onClick={getGPS} disabled={geoLoading} style={{ flexShrink: 0 }}>
                                    {geoLoading ? <span className="spinner" /> : '📍'} GPS
                                </button>
                            </div>
                        </div>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Password *</label>
                                <input className="auth-input" type="password" placeholder="Min 6 characters" {...F('password')} required />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Confirm Password *</label>
                                <input className="auth-input" type="password" placeholder="Repeat password" {...F('confirm_password')} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Creating Account...</> : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '1rem' }}>
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <button className="auth-link-btn" onClick={() => navigate('/login')}>Log in</button>
                        </p>
                        <p className="auth-footer-text" style={{ marginTop: '0.4rem' }}>
                            Are you a service provider?{' '}
                            <button className="auth-link-btn" onClick={() => navigate('/register/provider')}>Register as Provider →</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
