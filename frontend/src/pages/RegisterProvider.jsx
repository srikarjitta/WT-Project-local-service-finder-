import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerProvider, getServices, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterProvider() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm_password: '', business_name: '', service_category_id: '', services_offered: '', experience: '', description: '', service_location: '', latitude: null, longitude: null });
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);

    useEffect(() => { getServices().then((r) => setCategories(r.data)).catch(() => { }); }, []);

    const getGPS = () => {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => { setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude, service_location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` })); setGeoLoading(false); toast.success('Location detected!'); },
            () => { setGeoLoading(false); toast.error('Could not get location'); }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
        setLoading(true);
        try {
            const payload = { ...form, service_category_id: form.service_category_id ? parseInt(form.service_category_id) : null, experience: parseInt(form.experience) || 0 };
            const res = await registerProvider(payload);
            localStorage.setItem('token', res.data.access_token);
            const meRes = await getMe();
            login(res.data.access_token, meRes.data);
            toast.success('Account created! Pending verification.');
            navigate('/provider');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed');
        } finally { setLoading(false); }
    };

    const F = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-brand-logo">
                    <div className="auth-brand-logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <span className="auth-brand-logo-name">Local Service Finder</span>
                </div>
                <div className="auth-brand-content">
                    <h1 className="auth-brand-title">Grow your<span className="auth-brand-accent">service business</span></h1>
                    <p className="auth-brand-sub">Join our platform and connect with customers who need your expertise every day.</p>
                    <div className="auth-brand-features">
                        {['Receive job requests automatically', 'Set your own availability', 'Track earnings in one place', 'Build your rating and reputation'].map((t) => (
                            <div key={t} className="auth-brand-feat">
                                <div className="auth-brand-feat-icon">✓</div><span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card" style={{ maxWidth: 520 }}>
                    <button className="auth-back-link" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        Back to Home
                    </button>
                    <h1 className="auth-title">Provider Registration</h1>
                    <p className="auth-subtitle">Join our network of verified service professionals</p>

                    <div className="auth-notice">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                        Your account will be reviewed before you can accept requests. We'll process it as soon as possible.
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Full Name *</label>
                                <input className="auth-input" placeholder="Your name" {...F('name')} required />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Business Name</label>
                                <input className="auth-input" placeholder="Optional" {...F('business_name')} />
                            </div>
                        </div>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Email *</label>
                                <input className="auth-input" type="email" placeholder="your@email.com" {...F('email')} required />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Phone *</label>
                                <input className="auth-input" type="tel" placeholder="Phone number" {...F('phone')} required />
                            </div>
                        </div>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Service Category *</label>
                                <select className="auth-input" {...F('service_category_id')} required>
                                    <option value="">Select category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                </select>
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Years of Experience</label>
                                <input className="auth-input" type="number" min="0" max="50" placeholder="e.g. 5" {...F('experience')} />
                            </div>
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Services Offered</label>
                            <input className="auth-input" placeholder="e.g. Wiring, Fan installation, Switch repair" {...F('services_offered')} />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">About You</label>
                            <textarea className="auth-input" placeholder="Briefly describe your expertise..." {...F('description')} rows={2} />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Service Location</label>
                            <div className="auth-input-with-btn">
                                <input className="auth-input" placeholder="Your service area" {...F('service_location')} />
                                <button type="button" className="btn btn-secondary btn-sm" onClick={getGPS} disabled={geoLoading} style={{ flexShrink: 0 }}>
                                    {geoLoading ? <span className="spinner" /> : '📍'} GPS
                                </button>
                            </div>
                        </div>
                        <div className="auth-input-row">
                            <div className="auth-input-group">
                                <label className="auth-label">Password *</label>
                                <input className="auth-input" type="password" placeholder="Create password" {...F('password')} required />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Confirm *</label>
                                <input className="auth-input" type="password" placeholder="Repeat password" {...F('confirm_password')} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                            {loading ? <><span className="spinner" /> Registering...</> : 'Register as Provider →'}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '1rem' }}>
                        <p className="auth-footer-text">
                            Already registered? <button className="auth-link-btn" onClick={() => navigate('/login?role=provider')}>Log in</button>
                        </p>
                        <p className="auth-footer-text" style={{ marginTop: '0.4rem' }}>
                            Need a service instead? <button className="auth-link-btn" onClick={() => navigate('/register/user')}>Register as User →</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
