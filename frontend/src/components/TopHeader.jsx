import { useEffect, useState } from 'react';
import { getNotifications, markAllRead } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BellIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

export default function TopHeader({ title, subtitle }) {
    const { user } = useAuth();
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    const fetchNotifs = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
            setUnread(res.data.filter((n) => !n.is_read).length);
        } catch { }
    };

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAll = async () => {
        try { await markAllRead(); setUnread(0); fetchNotifs(); toast.success('All marked as read'); } catch { }
    };

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <div className="top-header">
            <div className="header-title">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="header-actions">
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost btn-sm notif-btn"
                        onClick={() => setNotifOpen(!notifOpen)}
                        style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.5rem' }}
                    >
                        {BellIcon}
                        {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
                    </button>

                    {notifOpen && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setNotifOpen(false)} />
                            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 340, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden', animation: 'fade-up 0.15s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.1rem', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Notifications {unread > 0 && <span style={{ fontSize: '0.72rem', background: 'var(--primary)', color: 'white', borderRadius: 99, padding: '1px 6px', marginLeft: 4 }}>{unread}</span>}</span>
                                    {unread > 0 && <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Mark all read</button>}
                                </div>
                                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications yet</div>
                                    ) : notifications.slice(0, 10).map((n) => (
                                        <div key={n.id} style={{ padding: '0.75rem 1.1rem', borderBottom: '1px solid var(--border)', background: !n.is_read ? 'var(--primary-pale)' : 'transparent', transition: 'background 0.15s' }}>
                                            <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: !n.is_read ? 600 : 400, marginBottom: '0.2rem' }}>{n.message}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User info */}
                <div className="avatar">{initials}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{user?.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</span>
                </div>
            </div>
        </div>
    );
}
