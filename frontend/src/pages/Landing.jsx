import { useNavigate } from 'react-router-dom';
import './Landing.css';

const SERVICES = [
    { icon: '⚡', name: 'Electrician' }, { icon: '🔧', name: 'Plumber' },
    { icon: '🪚', name: 'Carpenter' }, { icon: '🧹', name: 'Cleaning' },
    { icon: '❄️', name: 'AC Repair' }, { icon: '🔌', name: 'Appliance' },
    { icon: '💻', name: 'Computer' }, { icon: '📱', name: 'Mobile' },
    { icon: '🚗', name: 'Vehicle' }, { icon: '🏠', name: 'Maintenance' },
    { icon: '📚', name: 'Tutor' }, { icon: '🛠️', name: 'Other' },
];

const FEATURES = [
    { icon: '🛡️', title: 'Verified Providers', desc: 'Every provider is background-checked and verified before they can join our platform.' },
    { icon: '⚡', title: 'Fast Matching', desc: 'Get matched with available providers near you within minutes of submitting your request.' },
    { icon: '📍', title: 'Location-Based', desc: 'Our platform automatically finds professionals closest to your location.' },
    { icon: '⭐', title: 'Rated Service', desc: 'Real ratings from real customers help you choose the best provider every time.' },
    { icon: '🔔', title: 'Live Tracking', desc: 'Track your service request in real time — from searching to completion.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'See the estimated cost upfront. No surprises, no hidden fees.' },
];

const STEPS = [
    { n: 1, title: 'Choose a Service', desc: 'Pick from 12 categories or search for what you need.' },
    { n: 2, title: 'Describe the Problem', desc: 'Tell us what needs to be done and share your location.' },
    { n: 3, title: 'Provider Accepts', desc: 'A nearby verified provider accepts your request.' },
    { n: 4, title: 'Service Complete', desc: 'Rate your experience once the job is done.' },
];

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="landing">

            {/* ── NAV ───────────────────────────────── */}
            <nav className="l-nav">
                <div className="l-nav-brand">
                    <div className="l-logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="l-brand-name">Local Service Finder</span>
                </div>
                <div className="l-nav-links">
                    <a href="#services" className="l-nav-link">Services</a>
                    <a href="#how" className="l-nav-link">How It Works</a>
                    <a href="#why" className="l-nav-link">Why Us</a>
                </div>
                <div className="l-nav-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Log In</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register/user')}>Get Started</button>
                </div>
            </nav>

            {/* ── HERO ──────────────────────────────── */}
            <section className="l-hero">
                <div className="l-hero-content">
                    <div className="l-hero-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Trusted by 10,000+ customers
                    </div>
                    <h1 className="l-hero-title">
                        Reliable Local Services,<br />
                        <span className="l-hero-accent">Whenever You Need Them</span>
                    </h1>
                    <p className="l-hero-sub">
                        Connect with verified, nearby service professionals in minutes.
                        Electricians, plumbers, cleaners and more — all at your fingertips.
                    </p>
                    <div className="l-hero-actions">
                        <button className="btn btn-primary btn-xl" onClick={() => navigate('/register/user')}>
                            Find a Service
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                        <button className="btn btn-secondary btn-xl" onClick={() => navigate('/register/provider')}>
                            Become a Provider
                        </button>
                    </div>
                    <div className="l-hero-stats">
                        <div className="l-stat"><span className="l-stat-n">1,200+</span><span className="l-stat-l">Services Done</span></div>
                        <div className="l-stat-div" />
                        <div className="l-stat"><span className="l-stat-n">500+</span><span className="l-stat-l">Verified Pros</span></div>
                        <div className="l-stat-div" />
                        <div className="l-stat"><span className="l-stat-n">4.8/5</span><span className="l-stat-l">Avg. Rating</span></div>
                    </div>
                </div>

                <div className="l-hero-visual">
                    <div className="l-card-float l-card-main">
                        <div className="l-card-header">
                            <div className="l-card-icon-wrap blue">⚡</div>
                            <div>
                                <div className="l-card-title">Provider Found!</div>
                                <div className="l-card-sub">Ravi Kumar • Electrician</div>
                            </div>
                            <div className="l-online-dot" />
                        </div>
                        <div className="l-divider" />
                        <div className="l-card-row">
                            <span className="l-card-label">⭐ Rating</span>
                            <span className="l-card-val">4.9 (52 reviews)</span>
                        </div>
                        <div className="l-card-row">
                            <span className="l-card-label">📍 Distance</span>
                            <span className="l-card-val">2.4 km away</span>
                        </div>
                        <div className="l-card-row">
                            <span className="l-card-label">⏱️ ETA</span>
                            <span className="l-card-val l-text-green">~15 minutes</span>
                        </div>
                    </div>

                    <div className="l-card-float l-card-notif">
                        <div className="l-notif-dot" />
                        <div className="l-notif-title">New Service Request</div>
                        <div className="l-notif-desc">Electrician • Jubilee Hills • 1.8 km</div>
                        <div className="l-notif-actions">
                            <button className="l-btn-accept">Accept</button>
                            <button className="l-btn-reject">Decline</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES ──────────────────────────── */}
            <section id="services" className="l-section l-section-white">
                <div className="container">
                    <div className="l-section-hdr">
                        <h2 className="l-section-title">Services We Offer</h2>
                        <p className="l-section-sub">Professional help for every home need, delivered to your doorstep</p>
                    </div>
                    <div className="l-services-grid">
                        {SERVICES.map((s) => (
                            <button key={s.name} className="l-service-tile" onClick={() => navigate('/register/user')}>
                                <span className="l-service-emoji">{s.icon}</span>
                                <span className="l-service-name">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────── */}
            <section id="how" className="l-section l-section-blue-tint">
                <div className="container">
                    <div className="l-section-hdr">
                        <h2 className="l-section-title">How It Works</h2>
                        <p className="l-section-sub">Get your service done in four simple steps</p>
                    </div>
                    <div className="l-steps">
                        {STEPS.map((s, i) => (
                            <div key={s.n} className="l-step">
                                <div className="l-step-n">{s.n}</div>
                                {i < STEPS.length - 1 && <div className="l-step-connector" />}
                                <h3 className="l-step-title">{s.title}</h3>
                                <p className="l-step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY US ────────────────────────────── */}
            <section id="why" className="l-section l-section-white">
                <div className="container">
                    <div className="l-section-hdr">
                        <h2 className="l-section-title">Why Choose Us?</h2>
                        <p className="l-section-sub">Built around trust, simplicity and reliability</p>
                    </div>
                    <div className="l-features">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="l-feature">
                                <div className="l-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────── */}
            <section className="l-cta">
                <div className="container">
                    <div className="l-cta-box">
                        <h2>Ready to find a trusted professional?</h2>
                        <p>Join thousands of satisfied customers who rely on Local Service Finder every day.</p>
                        <div className="l-cta-actions">
                            <button className="btn btn-primary btn-xl" onClick={() => navigate('/login')}>Login as User</button>
                            <button className="btn btn-secondary btn-xl" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} onClick={() => navigate('/login?role=provider')}>Login as Provider</button>
                        </div>
                        <div className="l-demo-creds">
                            <strong>Demo Credentials —</strong>&nbsp;
                            User: user@demo.com / demo123 &nbsp;|&nbsp;
                            Provider: provider@demo.com / demo123
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────── */}
            <footer className="l-footer">
                <div className="container">
                    <div className="l-footer-brand">
                        <div className="l-logo-mark l-logo-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span>Local Service Finder</span>
                    </div>
                    <p className="l-footer-copy">© 2026 Local Service Finder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
