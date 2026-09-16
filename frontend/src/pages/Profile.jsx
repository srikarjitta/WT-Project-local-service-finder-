import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { useAuth } from '../context/AuthContext';
import { updateProviderProfile } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, setUser } = useAuth();
    const isProvider = user?.role === 'provider';
    const provider = user?.provider;
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ description: provider?.description || '', services_offered: provider?.services_offered || '', service_location: provider?.service_location || '', experience: provider?.experience || 0 });

    const handleSave = async () => {
        try {
            if (isProvider) await updateProviderProfile(form);
            toast.success('Profile updated!');
            setEditing(false);
        } catch { toast.error('Failed to update profile'); }
    };

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <div className="dashboard-layout">
            <Sidebar role={user?.role} />
            <div className="main-content">
                <TopHeader title="Profile" subtitle="Your account information" />
                <div className="page">
                    <div className="grid-2">
                        {/* Personal Info */}
                        <div className="card">
                            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                                <div className="avatar avatar-xl" style={{ margin: '0 auto 1rem' }}>{initials}</div>
                                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{user?.role} Account</p>
                                {isProvider && <span className={`badge badge-${provider?.verification_status}`} style={{ marginTop: '0.5rem', display: 'inline-flex' }}>{provider?.verification_status}</span>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    { label: 'Email', value: user?.email, icon: '📧' },
                                    { label: 'Phone', value: user?.phone, icon: '📞' },
                                    { label: 'Location', value: user?.location || 'Not set', icon: '📍' },
                                    { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A', icon: '📅' },
                                ].map((item) => (
                                    <div key={item.label} className="info-row" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                                        <span>{item.icon}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', minWidth: 80 }}>{item.label}</span>
                                        <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Provider Details */}
                        {isProvider ? (
                            <div className="card">
                                <div className="section-header" style={{ marginBottom: '1.25rem' }}>
                                    <h3 className="section-title-sm">Provider Details</h3>
                                    <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)' }} onClick={() => setEditing(!editing)}>
                                        {editing ? 'Cancel' : '✏️ Edit'}
                                    </button>
                                </div>

                                {!editing ? (
                                    <div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                            {[
                                                { label: 'Rating', val: `⭐ ${provider?.rating?.toFixed(1)}`, sub: `${provider?.total_ratings} reviews` },
                                                { label: 'Experience', val: `${provider?.experience}y`, sub: 'Years' },
                                                { label: 'Earned', val: `₹${Math.round(provider?.total_earnings || 0)}`, sub: 'Total' },
                                            ].map((s) => (
                                                <div key={s.label} style={{ background: 'var(--primary-pale)', borderRadius: 'var(--radius)', padding: '0.75rem', textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{s.val}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.sub}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {provider?.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.875rem' }}>{provider.description}</p>}
                                        {provider?.services_offered && (
                                            <div style={{ padding: '0.625rem 0.875rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Services Offered</div>
                                                {provider.services_offered}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="form-group"><label className="form-label">Bio / Description</label><textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                                        <div className="form-group"><label className="form-label">Services Offered</label><input className="form-input" value={form.services_offered} onChange={(e) => setForm({ ...form, services_offered: e.target.value })} /></div>
                                        <div className="form-group"><label className="form-label">Service Location</label><input className="form-input" value={form.service_location} onChange={(e) => setForm({ ...form, service_location: e.target.value })} /></div>
                                        <div className="form-group"><label className="form-label">Years of Experience</label><input className="form-input" type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
                                        <button className="btn btn-primary btn-full" onClick={handleSave}>Save Changes</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="card">
                                <h3 className="section-title-sm" style={{ marginBottom: '1.25rem' }}>Account Summary</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <p>As a customer, you can browse services, submit requests, and track provider status in real time.</p>
                                    <p>Rate your providers after each completed service to help the community.</p>
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <a href="/dashboard" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                                            Go to Dashboard →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
