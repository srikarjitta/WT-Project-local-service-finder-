import { useState, useEffect } from 'react';
import { getRequests, acceptRequest, rejectRequest, providerArriving, startService, completeService, updateAvailability, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import toast from 'react-hot-toast';

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const phi1 = Math.PI * lat1 / 180, phi2 = Math.PI * lat2 / 180;
    const dphi = Math.PI * (lat2 - lat1) / 180, dlambda = Math.PI * (lon2 - lon1) / 180;
    const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Icons */
const MapPin = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const Clock = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const Phone = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.49 13.47a19.79 19.79 0 01-3.07-8.67A2 2 0 012.4 2.84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 9.06a16 16 0 006 6l-.3-1.29a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;

function IncomingRequestCard({ req, provider, onAccept, onReject }) {
    const dist = (provider?.latitude && provider?.longitude && req.latitude && req.longitude)
        ? haversine(provider.latitude, provider.longitude, req.latitude, req.longitude).toFixed(1)
        : null;

    return (
        <div className="card fade-up" style={{ borderLeft: '4px solid var(--primary)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--primary-pale)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                        {req.service_category?.icon || '🛠️'}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>{req.service_category?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{req.description?.slice(0, 60)}...</div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>₹{req.estimated_amount}</span>
                    <span className="badge badge-new">NEW</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div className="info-row">{MapPin} {dist ? `${dist} km away` : req.location?.slice(0, 25)}</div>
                <div className="info-row"><span style={{ width: 13 }}>👤</span> {req.user?.name || 'Customer'}</div>
                <div className="info-row">{Clock} {new Date(req.created_at).toLocaleTimeString()}</div>
                <div className="info-row">{MapPin} {req.location?.slice(0, 25)}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => onAccept(req.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                    Accept Request
                </button>
                <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid var(--border)' }} onClick={() => onReject(req.id)}>
                    Decline
                </button>
            </div>
        </div>
    );
}

function ActiveServiceCard({ req, onArriving, onStart, onComplete }) {
    const STATUS_STEPS = ['accepted', 'provider_arriving', 'service_started', 'service_completed'];
    const STATUS_LABELS = { accepted: 'Accepted', provider_arriving: 'Arriving', service_started: 'In Progress', service_completed: 'Completed' };
    const idx = STATUS_STEPS.indexOf(req.status);

    return (
        <div style={{ background: 'var(--primary-pale)', border: '1.5px solid var(--primary-pale2)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: 6 }}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                    Current Job
                </h3>
                <span className={`badge badge-${req.status}`}>{req.status.replace(/_/g, ' ')}</span>
            </div>

            {/* Mini timeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.25rem' }}>
                {STATUS_STEPS.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: i <= idx ? 'var(--primary)' : 'white', border: `2px solid ${i <= idx ? 'var(--primary)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: i <= idx ? 'white' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                                {i < idx ? '✓' : i + 1}
                            </div>
                            <div style={{ fontSize: '0.6rem', marginTop: '3px', color: i === idx ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i === idx ? 700 : 400, textAlign: 'center', maxWidth: 48 }}>{STATUS_LABELS[s]}</div>
                        </div>
                        {i < STATUS_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? 'var(--primary)' : 'var(--border)', margin: '0 2px', marginBottom: '1rem' }} />}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div className="info-row"><span>👤</span> {req.user?.name}</div>
                <div className="info-row">{Phone} {req.user?.phone}</div>
                <div className="info-row">{MapPin} {req.location?.slice(0, 30)}</div>
                <div className="info-row"><span>💰</span> ₹{req.estimated_amount}</div>
                {req.description && <div className="info-row" style={{ gridColumn: '1/-1' }}><span>📝</span> {req.description?.slice(0, 60)}</div>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {req.status === 'accepted' && <button className="btn btn-warning" style={{ flex: 1 }} onClick={() => onArriving(req.id)}>🚗 I'm Heading Over</button>}
                {req.status === 'provider_arriving' && <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onStart(req.id)}>🔧 Start Job</button>}
                {req.status === 'service_started' && <button className="btn btn-success" style={{ flex: 1 }} onClick={() => onComplete(req.id)}>✅ Mark Complete</button>}
            </div>
        </div>
    );
}

export default function ProviderDashboard() {
    const { user, setUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [provider, setProvider] = useState(user?.provider || null);
    const [isOnline, setIsOnline] = useState(user?.provider?.availability_status === 'online');
    const [toggleLoading, setToggleLoading] = useState(false);
    const [rejectedIds, setRejectedIds] = useState(new Set());

    const loadData = async () => {
        try {
            const meRes = await getMe();
            setUser(meRes.data);
            setProvider(meRes.data.provider);
            setIsOnline(meRes.data.provider?.availability_status === 'online');
            const reqRes = await getRequests();
            setRequests(reqRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch { }
    };

    useEffect(() => { loadData(); const iv = setInterval(loadData, 5000); return () => clearInterval(iv); }, []);

    const toggleOnline = async () => {
        setToggleLoading(true);
        try {
            const newStatus = isOnline ? 'offline' : 'online';
            await updateAvailability({ status: newStatus });
            setIsOnline(!isOnline);
            toast.success(`You are now ${newStatus}`);
            await loadData();
        } catch { toast.error('Failed to update status'); }
        finally { setToggleLoading(false); }
    };

    const handleAccept = async (id) => {
        try { await acceptRequest(id); toast.success('Request accepted! Head to the customer.'); await loadData(); }
        catch (err) { toast.error(err.response?.data?.detail || 'Failed to accept'); await loadData(); }
    };
    const handleReject = async (id) => {
        await rejectRequest(id);
        setRejectedIds((prev) => new Set([...prev, id]));
    };
    const handleArriving = async (id) => { try { await providerArriving(id); toast.success('Customer notified!'); await loadData(); } catch { } };
    const handleStart = async (id) => { try { await startService(id); toast.success('Service started!'); await loadData(); } catch { } };
    const handleComplete = async (id) => { try { await completeService(id); toast.success('Service completed! 🎉'); await loadData(); } catch { } };

    const isVerified = provider?.verification_status === 'approved';
    const currentService = requests.find((r) => ['accepted', 'provider_arriving', 'service_started'].includes(r.status) && r.provider_id === provider?.id);
    const incomingReqs = requests.filter((r) => r.status === 'searching' && !rejectedIds.has(r.id));
    const today = new Date().toDateString();
    const todayCompleted = requests.filter((r) => r.status === 'service_completed' && new Date(r.created_at).toDateString() === today);

    return (
        <div className="dashboard-layout">
            <Sidebar role="provider" />
            <div className="main-content">
                <TopHeader title="Provider Dashboard" subtitle={isOnline ? '🟢 Online — Ready to accept requests' : '⚫ Offline — Go online to receive requests'} />
                <div className="page">

                    {/* Online Toggle */}
                    <div className="toggle-container" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Availability Status</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {isOnline ? 'You are visible to customers and can receive requests' : 'You are hidden from customers. Go online to get requests.'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isOnline ? 'var(--success)' : 'var(--text-muted)' }}>
                                {isOnline ? '● ONLINE' : '○ OFFLINE'}
                            </span>
                            <label className="toggle">
                                <input type="checkbox" checked={isOnline} onChange={toggleOnline} disabled={toggleLoading} />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                        {[
                            { icon: '📋', val: requests.length, label: 'Total Requests' },
                            { icon: '✅', val: todayCompleted.length, label: 'Completed Today' },
                            { icon: '⭐', val: provider?.rating?.toFixed(1) || '—', label: 'Your Rating' },
                            { icon: '💰', val: `₹${Math.round(provider?.total_earnings || 0)}`, label: 'Total Earnings' },
                        ].map((s) => (
                            <div key={s.label} className="stat-card">
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                                <div className="stat-value">{s.val}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Active Service */}
                    {currentService && <ActiveServiceCard req={currentService} onArriving={handleArriving} onStart={handleStart} onComplete={handleComplete} />}

                    {/* Incoming Requests */}
                    <div className="card">
                        <div className="section-header" style={{ marginBottom: '1rem' }}>
                            <h3 className="section-title-sm">Incoming Requests</h3>
                            {incomingReqs.length > 0 && <span className="badge badge-new">{incomingReqs.length} new</span>}
                        </div>

                        {!isOnline ? (
                            <div className="empty-state">
                                <div className="empty-state-icon" style={{ background: 'var(--bg-subtle)', fontSize: '1.5rem' }}>⚫</div>
                                <h3>You are offline</h3>
                                <p>Toggle your status to Online to start receiving service requests</p>
                            </div>
                        ) : incomingReqs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" /></svg>
                                </div>
                                <h3>Waiting for requests</h3>
                                <p>New service requests in your area will appear here automatically</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {incomingReqs.map((r) => (
                                    <IncomingRequestCard key={r.id} req={r} provider={provider} onAccept={handleAccept} onReject={handleReject} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
