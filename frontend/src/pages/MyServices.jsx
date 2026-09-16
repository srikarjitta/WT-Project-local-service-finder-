import { useState, useEffect } from 'react';
import { getRequests, cancelRequest, createReview } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import toast from 'react-hot-toast';

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
                    <label className="form-label">Review</label>
                    <textarea className="form-input" rows={3} placeholder="Share your experience..." value={review} onChange={(e) => setReview(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-full btn-lg" onClick={() => onSubmit(req.id, rating, review)}>Submit Review</button>
            </div>
        </div>
    );
}

const FILTERS = ['all', 'searching', 'accepted', 'service_started', 'service_completed', 'cancelled'];
const MapPin = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function MyServices() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all');
    const [reviewModal, setReviewModal] = useState(null);

    const load = async () => {
        try { const res = await getRequests(); setRequests(res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); } catch { }
    };
    useEffect(() => { load(); const iv = setInterval(load, 8000); return () => clearInterval(iv); }, []);

    const handleCancel = async (id) => {
        try { await cancelRequest(id); toast.success('Request cancelled'); load(); }
        catch (err) { toast.error(err.response?.data?.detail || 'Failed'); }
    };
    const handleReview = async (reqId, rating, review) => {
        try { await createReview({ request_id: reqId, rating, review }); toast.success('Review submitted!'); setReviewModal(null); load(); }
        catch (err) { toast.error(err.response?.data?.detail || 'Failed'); }
    };

    const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

    return (
        <div className="dashboard-layout">
            <Sidebar role="user" />
            <div className="main-content">
                <TopHeader title="My Requests" subtitle={`${requests.length} total service requests`} />
                <div className="page">
                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {FILTERS.map((f) => (
                            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={filter !== f ? { border: '1px solid var(--border)' } : {}} onClick={() => setFilter(f)}>
                                {f === 'all' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                            </div>
                            <h3>No requests found</h3>
                            <p>{filter === 'all' ? 'Submit your first service request from the Dashboard' : `No requests with status "${filter.replace(/_/g, ' ')}"`}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {filtered.map((r) => (
                                <div key={r.id} className="request-card">
                                    <div className="request-card-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 44, height: 44, background: 'var(--primary-pale)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                                                {r.service_category?.icon || '🛠️'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>{r.service_category?.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>₹{r.estimated_amount}</span>
                                            <span className={`badge badge-${r.status}`}>{r.status.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="request-card-body">{r.description}</div>
                                    {r.provider && (
                                        <div style={{ background: 'var(--primary-pale)', border: '1px solid var(--primary-pale2)', borderRadius: 'var(--radius)', padding: '0.625rem 0.875rem', marginTop: '0.75rem', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                                            <strong style={{ color: 'var(--text-primary)' }}>Provider:</strong>&nbsp;
                                            {r.provider.business_name || r.provider.user?.name} &nbsp;·&nbsp; ⭐ {r.provider.rating} &nbsp;·&nbsp; 📞 {r.provider.user?.phone}
                                        </div>
                                    )}
                                    <div className="request-card-footer">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{MapPin} {r.location}</div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {r.status === 'service_completed' && !r.review && (
                                                <button className="btn btn-primary btn-sm" onClick={() => setReviewModal(r)}>⭐ Rate</button>
                                            )}
                                            {r.status === 'searching' && (
                                                <button className="btn btn-sm" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: 'var(--danger-bg)' }} onClick={() => handleCancel(r.id)}>Cancel</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {reviewModal && <ReviewModal req={reviewModal} onClose={() => setReviewModal(null)} onSubmit={handleReview} />}
        </div>
    );
}
