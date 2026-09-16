import { useState, useEffect, useMemo } from 'react';
import { getRequests } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

// Simple bar chart component using flex
function SimpleBarChart({ data, title, isCurrency }) {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div style={{ flex: 1, minWidth: 300, padding: '1.5rem', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 160, gap: '0.75rem' }}>
                {data.map((d, i) => {
                    const heightPct = (d.value / maxVal) * 100;
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{isCurrency ? `₹${d.value}` : d.value}</div>
                            <div style={{
                                width: '100%',
                                height: `${Math.max(heightPct, 2)}%`,
                                background: 'var(--primary)',
                                borderRadius: '4px 4px 0 0',
                                opacity: 0.85
                            }} />
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{d.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProviderHistory() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('This Month');

    useEffect(() => {
        getRequests()
            .then((r) => setRequests(r.data.filter((x) => x.status !== 'searching' && x.status !== 'cancelled').sort((a, b) => new Date(b.created_at) - new Date(a.created_at))))
            .catch(() => { });
    }, []);

    // Derived statistics
    const now = new Date();
    const filteredRequests = useMemo(() => {
        return requests.filter(r => {
            const date = new Date(r.created_at);
            if (filter === 'Today') return date.toDateString() === now.toDateString();
            if (filter === 'This Week') {
                const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo;
            }
            if (filter === 'This Month') {
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [requests, filter]);

    const completed = filteredRequests.filter((r) => r.status === 'service_completed');
    const totalEarned = completed.reduce((s, r) => s + (r.estimated_amount || 0), 0);

    const rated = completed.filter(r => r.review);
    const avgRating = rated.length > 0 ? (rated.reduce((s, r) => s + r.review.rating, 0) / rated.length).toFixed(1) : 0;

    // Generate graph data (last 5 days)
    const graphData = useMemo(() => {
        const days = [];
        for (let i = 4; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });

            const dayReqs = requests.filter(r => new Date(r.created_at).toDateString() === d.toDateString() && r.status === 'service_completed');
            const dayEarnings = dayReqs.reduce((s, r) => s + (r.estimated_amount || 0), 0);

            days.push({ label, valEarnings: dayEarnings, valServices: dayReqs.length });
        }
        return days;
    }, [requests]);

    return (
        <div className="dashboard-layout">
            <Sidebar role="provider" />
            <div className="main-content">
                <TopHeader title="Service History & Earnings" subtitle="Track your completed services, ratings, and revenue" />
                <div className="page">

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {['Today', 'This Week', 'This Month', 'All Time'].map((f) => (
                            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={filter !== f ? { border: '1px solid var(--border)' } : {}} onClick={() => setFilter(f)}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                            <div className="stat-label">Total Earnings</div>
                            <div className="stat-value" style={{ color: 'var(--primary)' }}>₹{Math.round(totalEarned)}</div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                            <div className="stat-label">Completed Services</div>
                            <div className="stat-value">{completed.length}</div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                            <div className="stat-label">Average Rating</div>
                            <div className="stat-value">⭐ {avgRating}</div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--navy)' }}>
                            <div className="stat-label">Total Reviews</div>
                            <div className="stat-value">{rated.length}</div>
                        </div>
                    </div>

                    {/* Graphs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <SimpleBarChart data={graphData.map(d => ({ label: d.label, value: d.valEarnings }))} title="Earnings (Last 5 Days)" isCurrency={true} />
                        <SimpleBarChart data={graphData.map(d => ({ label: d.label, value: d.valServices }))} title="Completed Services (Last 5 Days)" isCurrency={false} />
                    </div>

                    {/* Table */}
                    <div className="card" style={{ padding: 0 }}>
                        <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 'var(--radius-lg)' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Service</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>No records found for the selected period.</td></tr>
                                    ) : (
                                        filteredRequests.map((r) => (
                                            <tr key={r.id}>
                                                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <span style={{ fontSize: '1rem' }}>{r.service_category?.icon}</span>
                                                        {r.service_category?.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.user?.name || '—'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.location?.split(',')[0]}</div>
                                                </td>
                                                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{r.estimated_amount || 0}</td>
                                                <td><span className={`badge badge-${r.status}`}>{r.status.replace(/_/g, ' ').replace('service', '').trim()}</span></td>
                                                <td>{r.review ? <span style={{ fontWeight: 600, color: 'var(--warning)' }}>★ {r.review.rating}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
