import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { getMyProviderServices, addProviderService, removeProviderService, searchServiceCatalog } from '../services/api';
import toast from 'react-hot-toast';

export default function ProviderServices() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadServices = async () => {
        try {
            const res = await getMyProviderServices();
            setServices(res.data);
        } catch { }
    };

    useEffect(() => { loadServices(); }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (search.trim().length === 0) { setResults([]); return; }
            try {
                const res = await searchServiceCatalog(search);
                setResults(res.data);
            } catch { }
        };
        const timeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleAdd = async (service = null) => {
        setLoading(true);
        try {
            if (service) {
                await addProviderService({ service_id: service.id });
                toast.success('Service added!');
            } else {
                if (!search.trim()) return;
                await addProviderService({ service_name: search.trim() });
                toast.success('Custom service created and added!');
            }
            setSearch('');
            setResults([]);
            await loadServices();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to add service');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (psId) => {
        try {
            await removeProviderService(psId);
            toast.success('Service removed');
            await loadServices();
        } catch (err) {
            toast.error('Failed to remove service');
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar role="provider" />
            <div className="main-content">
                <TopHeader title="My Services" subtitle="Manage the list of services you provide" />
                <div className="page">
                    <div className="card" style={{ marginBottom: '1.5rem', overflow: 'visible' }}>
                        <h2 className="section-title-sm" style={{ marginBottom: '1rem' }}>Add Service</h2>
                        <div style={{ position: 'relative' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Search or enter a service you provide</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <span style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }}>🔍</span>
                                        <input
                                            className="form-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="e.g. RO Water Purifier Repair"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!search.trim() || loading}
                                        onClick={() => handleAdd(null)}
                                        style={{ flexShrink: 0 }}
                                    >
                                        + Add New
                                    </button>
                                </div>
                            </div>

                            {/* Search Results Dropdown */}
                            {search.trim() && results.length > 0 && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0,
                                    background: '#fff', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    marginTop: '0.25rem', zIndex: 50, maxHeight: 250, overflowY: 'auto'
                                }}>
                                    {results.map((res) => (
                                        <div
                                            key={res.id}
                                            style={{
                                                padding: '0.75rem 1rem', display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => handleAdd(res)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '1.2rem' }}>{res.icon}</span>
                                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{res.name}</span>
                                            </div>
                                            <button className="btn btn-sm btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Select</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="section-title-sm" style={{ marginBottom: '1rem' }}>MY SERVICES</h2>
                        {services.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🛠️</div>
                                <h3>No services added yet</h3>
                                <p>Use the search bar above to add services to your profile.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {services.map((s) => (
                                    <div
                                        key={s.ps_id}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            background: 'var(--primary-pale)', border: '1px solid var(--primary-pale2)',
                                            padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-xl)',
                                            color: 'var(--navy)', fontWeight: 500, fontSize: '0.9rem'
                                        }}
                                    >
                                        <span>{s.icon} {s.name}</span>
                                        <button
                                            onClick={() => handleRemove(s.ps_id)}
                                            style={{
                                                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
