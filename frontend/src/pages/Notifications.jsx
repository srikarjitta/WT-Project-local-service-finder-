import { useState, useEffect } from 'react';
import { getNotifications, markAllRead } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import toast from 'react-hot-toast';

const TYPE_ICONS = {
    new_request: '📥', request_accepted: '✅', request_submitted: '📋',
    provider_arriving: '🚗', service_started: '🔧', service_completed: '🎉',
    request_cancelled: '🚫', info: 'ℹ️',
};
const TYPE_COLORS = {
    new_request: 'var(--primary)', request_accepted: 'var(--success)', request_submitted: 'var(--info)',
    provider_arriving: 'var(--teal)', service_started: 'var(--teal)', service_completed: 'var(--success)',
    request_cancelled: 'var(--danger)', info: 'var(--text-muted)',
};

export default function Notifications() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState([]);
    const [filter, setFilter] = useState('all');

    const load = async () => {
        try { const r = await getNotifications(); setNotifs(r.data); } catch { }
    };

    useEffect(() => { load(); const iv = setInterval(load, 8000); return () => clearInterval(iv); }, []);

    const handleMarkAll = async () => {
        try { await markAllRead(); toast.success('All marked as read'); load(); } catch { }
    };

    const unread = notifs.filter((n) => !n.is_read).length;
    const filtered = filter === 'unread' ? notifs.filter((n) => !n.is_read) : notifs;

    return (
        <div className="dashboard-layout">
            <Sidebar role={user?.role} />
            <div className="main-content">
                <TopHeader title="Notifications" subtitle={`${unread} unread`} />
                <div className="page">
                    <div className="section-header" style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['all', 'unread'].map((f) => (
                                <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={filter !== f ? { border: '1px solid var(--border)' } : {}}>
                                    {f === 'all' ? 'All' : `Unread (${unread})`}
                                </button>
                            ))}
                        </div>
                        {unread > 0 && <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>✓ Mark All Read</button>}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                            </div>
                            <h3>No notifications</h3>
                            <p>{filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {filtered.map((n) => (
                                <div key={n.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem', background: !n.is_read ? 'var(--primary-pale)' : 'white', borderColor: !n.is_read ? 'var(--primary-pale2)' : 'var(--border)', transition: 'background 0.2s' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: n.is_read ? 'var(--bg-subtle)' : 'var(--primary-pale2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                                        {TYPE_ICONS[n.notification_type] || '🔔'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: !n.is_read ? 600 : 400, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{n.message}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</div>
                                    </div>
                                    {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '4px' }} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
