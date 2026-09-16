import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── SVG ICON LIBRARY ───────────────────────────────── */
const Icon = {
    Home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
    Plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    List: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    Bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
    User: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" /></svg>,
    History: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>,
    DollarSign: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    LogOut: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
};

const USER_NAV = [
    { to: '/dashboard', icon: Icon.Home, label: 'Home', end: true },
    { to: '/dashboard/services', icon: Icon.List, label: 'My Requests' },
    { to: '/dashboard/notifications', icon: Icon.Bell, label: 'Notifications' },
    { to: '/dashboard/profile', icon: Icon.User, label: 'Profile' },
];

const PROVIDER_NAV = [
    { to: '/provider', icon: Icon.Home, label: 'Dashboard', end: true },
    { to: '/provider/requests', icon: Icon.Inbox, label: 'Incoming Requests' },
    { to: '/provider/services', icon: Icon.List, label: 'Services' },
    { to: '/provider/history', icon: Icon.History, label: 'Service History & Earnings' },
    { to: '/provider/notifications', icon: Icon.Bell, label: 'Notifications' },
    { to: '/provider/profile', icon: Icon.User, label: 'Profile' },
];

export default function Sidebar({ role }) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const navItems = role === 'provider' ? PROVIDER_NAV : USER_NAV;
    const roleLabel = role === 'provider' ? 'Provider Portal' : 'Customer Portal';

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </div>
                <div>
                    <h2>LocalService</h2>
                    <p>Finder</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="nav-section-title">{roleLabel}</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="avatar">{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.625rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', color: '#94A3B8', font: 'inherit', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; e.currentTarget.style.color = '#FCA5A5'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                    <span style={{ width: 16, height: 16 }}>{Icon.LogOut}</span>
                    Log Out
                </button>
            </div>
        </aside>
    );
}
