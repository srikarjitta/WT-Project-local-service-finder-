import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { getRequests, getServices, createRequest, cancelRequest, searchServiceCatalog } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── SVG Icons ──────────────────────────── */
const MapPin = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const Calendar = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;

/* Service category icons using emoji (compact) */
const EMOJI_MAP = { 'Electrician': '⚡', 'Plumber': '🔧', 'Carpenter': '🪚', 'Cleaning': '🧹', 'AC Repair': '❄️', 'Appliance Repair': '🔌', 'Computer/Laptop Repair': '💻', 'Mobile Repair': '📱', 'Vehicle Service': '🚗', 'Home Maintenance': '🏠', 'Tutor': '📚', 'Other': '🛠️' };

const STATUS_STEPS = ['searching', 'accepted', 'provider_arriving', 'service_started', 'service_completed'];
const STATUS_LABELS = { searching: 'Searching', accepted: 'Accepted', provider_arriving: 'Arriving', service_started: 'In Progress', service_completed: 'Completed' };
const STATUS_COLORS = { searching: '#F59E0B', accepted: '#2563EB', provider_arriving: '#0EA5E9', service_started: '#0F766E', service_completed: '#16A34A', cancelled: '#DC2626', no_provider_found: '#94A3B8' };

function StatusTimeline({ status }) {
    const idx = STATUS_STEPS.indexOf(status);
    return (
        <div style={{ padding: '1rem 0' }}>
            <div className="status-steps">
                {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="status-step">
                        <div className={`step-dot ${i < idx ? 'complete' : i === idx ? 'current' : ''}`}>{i < idx ? '✓' : i + 1}</div>
                        <div className={`step-label ${i === idx ? 'active' : ''}`}>{STATUS_LABELS[s]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RequestDetailModal({ req, onClose, onCancel, onReview }) {
    if (!req) return null;
    const isTerminal = ['service_completed', 'cancelled', 'no_provider_found'].includes(req.status);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
                <div className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.1rem' }}>Request #{req.id} — {req.service_category?.name}</h2>
                        <span className={`badge badge-${req.status}`} style={{ marginTop: '0.25rem', display: 'inline-flex' }}>{req.status.replace(/_/g, ' ')}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {!isTerminal && <StatusTimeline status={req.status} />}

                {/* Provider info */}
                {req.provider && (
                    <div className="provider-found-card" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                            <div className="avatar avatar-lg" style={{ background: 'var(--primary-pale2)', color: 'var(--primary)' }}>{req.provider.user?.name?.[0] || 'P'}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{req.provider.business_name || req.provider.user?.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⭐ {req.provider.rating} · {req.provider.experience} yrs experience</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>✓ Provider Accepted Your Request</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.83rem' }}>
                            <div className="info-row">{MapPin} <span style={{ color: 'var(--text-muted)' }}>Phone:</span> {req.provider.user?.phone || 'N/A'}</div>
                            <div className="info-row" style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{req.estimated_amount}</div>
                        </div>
                    </div>
                )}

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.84rem' }}>
                    <div className="info-row">{MapPin} {req.location}</div>
                    <div className="info-row">{Calendar} {req.preferred_date || 'ASAP'}</div>
                    {req.description && <div className="info-row" style={{ gridColumn: '1/-1' }}>📝 {req.description}</div>}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {req.status === 'service_completed' && !req.review && (
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onReview(req)}>⭐ Rate & Review</button>
                    )}
                    {req.status === 'searching' && (
                        <button className="btn btn-danger btn-secondary" style={{ border: '1px solid var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)', flex: 1 }} onClick={() => onCancel(req.id)}>
                            Cancel Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ReviewModal({ req, onClose, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Rate Your Experience</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                    How was your experience with {req.provider?.business_name || req.provider?.user?.name || 'the provider'}?
                </p>
                <div className="stars" style={{ justifyContent: 'center', gap: '0.5rem', fontSize: '2rem', marginBottom: '1.5rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`star ${s <= rating ? 'filled' : 'empty'}`} onClick={() => setRating(s)}>★</span>
                    ))}
                </div>
                <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea className="form-input" rows={3} placeholder="Tell others about your experience..." value={review} onChange={(e) => setReview(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-full btn-lg" onClick={() => onSubmit(req.id, rating, review)}>
                    Submit Review
                </button>
            </div>
        </div>
    );
}

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ description: '', location: user?.location || '', latitude: null, longitude: null, preferred_date: '', preferred_time: '', additional_notes: '' });
    const [selectedModal, setSelectedModal] = useState(null);
    const [reviewModal, setReviewModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const loadData = async () => {
        try {
            const [catRes, reqRes] = await Promise.all([getServices(), getRequests()]);
            setCategories(catRes.data);
            setRequests(reqRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch { }
    };

    // Intelligent Search logic
    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.trim().length === 0) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await searchServiceCatalog(searchQuery);
                setSearchResults(res.data);
            } catch { }
            finally { setIsSearching(false); }
        };
        const timeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => { loadData(); const iv = setInterval(loadData, 6000); return () => clearInterval(iv); }, []);

    const activeReq = requests.find((r) => !['service_completed', 'cancelled', 'no_provider_found'].includes(r.status));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRequest({ service_category_id: selectedCat.id, ...form });
            toast.success('Request submitted! Searching for providers...');
            setShowForm(false); setSelectedCat(null); await loadData();
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to create request'); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        try { await cancelRequest(id); toast.success('Request cancelled'); setSelectedModal(null); await loadData(); }
        catch (err) { toast.error(err.response?.data?.detail || 'Failed to cancel'); }
    };

    const handleReview = async (reqId, rating, review) => {
        try {
            const { createReview } = await import('../services/api');
            await createReview({ request_id: reqId, rating, review });
            toast.success('Review submitted! Thank you.'); setReviewModal(null); await loadData();
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to submit review'); }
    };

    const getGPS = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => { setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` })); toast.success('Location detected!'); },
            () => toast.error('Could not get location')
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar role="user" />
            <div className="main-content">
                <TopHeader title="Dashboard" subtitle={`Good day, ${user?.name?.split(' ')[0]}!`} />
                <div className="page">

                    {/* Active Request Banner */}
                    {activeReq && (
                        <div
                            className="alert alert-info"
                            style={{ marginBottom: '1.5rem', cursor: 'pointer', border: '1.5px solid #BAE6FD' }}
                            onClick={() => setSelectedModal(activeReq)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <div style={{ flex: 1 }}>
                                <strong>
                                    {activeReq.status === 'searching' && '🔍 Searching for a provider...'}
                                    {activeReq.status === 'accepted' && '✅ Provider accepted your request!'}
                                    {activeReq.status === 'provider_arriving' && '🚗 Provider is on the way!'}
                                    {activeReq.status === 'service_started' && '🔧 Service is in progress...'}
                                </strong>
                                <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                                    {activeReq.service_category?.name} — {activeReq.description?.slice(0, 60)}... <u>Click to view details</u>
                                </div>
                            </div>
                            <span className={`badge badge-${activeReq.status}`}>{activeReq.status.replace(/_/g, ' ')}</span>
                        </div>
                    )}

                    {/* Service Selection / Request Form */}
                    {!showForm ? (
                        <div className="card" style={{ marginBottom: '1.5rem', overflow: 'visible' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>What service do you need?</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Search for any service or choose from common categories below</p>

                                {/* Intelligent Search Bar */}
                                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                                    <div style={{ position: 'absolute', left: 16, top: 14, color: 'var(--primary)', fontSize: '1.2rem' }}>🔍</div>
                                    <input
                                        className="form-input"
                                        style={{ paddingLeft: '3rem', paddingRight: '1rem', height: 50, fontSize: '1.05rem', background: '#F8FAFC' }}
                                        placeholder="Search for any service (e.g. Sofa Cleaning, Generator Repair)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {isSearching && <div style={{ position: 'absolute', right: 16, top: 16, border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: 18, height: 18, animation: 'spin 1s linear infinite' }} />}

                                    {/* Search Results Dropdown */}
                                    {searchQuery.trim() && searchResults.length > 0 && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0,
                                            background: '#fff', border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            marginTop: '0.5rem', zIndex: 100, maxHeight: 300, overflowY: 'auto'
                                        }}>
                                            {searchResults.map((res) => (
                                                <div
                                                    key={res.id}
                                                    style={{
                                                        padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)',
                                                        cursor: 'pointer', transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    onClick={() => { setSelectedCat(res); setShowForm(true); setSearchQuery(''); }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ fontSize: '1.5rem', background: 'var(--primary-pale)', width: 40, height: 40, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {res.icon}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{res.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                                {res.is_custom ? 'Custom Service' : 'Standard Service'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-sm btn-primary" style={{ padding: '0.4rem 1rem' }}>Select</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* No results message */}
                                    {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0,
                                            background: '#fff', border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            marginTop: '0.5rem', zIndex: 100, padding: '1.5rem', textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧐</div>
                                            <div style={{ fontWeight: 600, color: 'var(--navy)' }}>No services found</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>We couldn't find any match for "{searchQuery}". Try different keywords.</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Common Categories</h3>
                            <div className="category-grid">
                                {categories.map((c) => (
                                    <div key={c.id} className="category-card" onClick={() => { setSelectedCat(c); setShowForm(true); }}>
                                        <div className="category-icon" style={{ fontSize: '1.5rem' }}>{c.icon || EMOJI_MAP[c.name] || '🛠️'}</div>
                                        <div className="category-name">{c.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="card fade-up" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setSelectedCat(null); }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                                    Back
                                </button>
                                <div>
                                    <h2 style={{ fontSize: '1.05rem' }}>Request {selectedCat?.icon} {selectedCat?.name}</h2>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fill in the details for your service request</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Describe Your Problem *</label>
                                    <textarea className="form-input" placeholder="Explain what needs to be done in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Preferred Date</label>
                                        <input className="form-input" type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Preferred Time</label>
                                        <input className="form-input" type="time" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Service Location *</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input className="form-input" placeholder="Enter your address or area" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required style={{ flex: 1 }} />
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={getGPS} style={{ flexShrink: 0 }}>📍 GPS</button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Additional Notes</label>
                                    <textarea className="form-input" placeholder="Any specific instructions..." value={form.additional_notes} onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} rows={2} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                                    {loading ? <><span className="spinner" /> Submitting...</> : 'Submit Service Request →'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Recent Requests */}
                    <div className="card">
                        <div className="section-header">
                            <h3 className="section-title-sm">Recent Requests</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard/services')}>View All →</button>
                        </div>
                        {requests.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                                </div>
                                <h3>No service requests yet</h3>
                                <p>Select a service above to submit your first request</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {requests.slice(0, 5).map((r) => (
                                    <div key={r.id} className="request-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedModal(r)}>
                                        <div className="request-card-header">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: 40, height: 40, background: 'var(--primary-pale)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                                    {r.service_category?.icon || '🛠️'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.service_category?.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <span className={`badge badge-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="request-card-body">{r.description?.slice(0, 100)}{r.description?.length > 100 ? '...' : ''}</div>
                                        <div className="request-card-footer">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{MapPin} {r.location}</div>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{r.estimated_amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedModal && <RequestDetailModal req={selectedModal} onClose={() => setSelectedModal(null)} onCancel={handleCancel} onReview={(r) => { setReviewModal(r); setSelectedModal(null); }} />}
            {reviewModal && <ReviewModal req={reviewModal} onClose={() => setReviewModal(null)} onSubmit={handleReview} />}
        </div>
    );
}
