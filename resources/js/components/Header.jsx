import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Top contact bar + main school header with logo, official name, and contact details.
 * Updated to match Combridge Institute of Health Management Sciences branding.
 */
export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            {/* Top Contact Bar */}
            <div className="top-bar d-none d-lg-block">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="top-contact d-flex align-items-center flex-wrap gap-3">
                            <a href="mailto:combridgecentre@gmail.com" className="text-decoration-none text-muted small">
                                <i className="fas fa-envelope text-success me-1"></i> combridgecentre@gmail.com
                            </a>
                            <span className="text-muted opacity-50">|</span>
                            <a href="tel:+256393256879" className="text-decoration-none text-muted small">
                                <i className="fas fa-phone-alt text-success me-1"></i> +256 393 256879
                            </a>
                            <span className="text-muted opacity-50">|</span>
                            <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted small">
                                <i className="fab fa-whatsapp text-success me-1"></i> +256 787 803099
                            </a>
                            <span className="text-muted opacity-50">|</span>
                            <span className="text-muted small">
                                <i className="fas fa-map-marker-alt text-warning me-1"></i> Mbarara City, Uganda
                            </span>
                        </div>
                        <div className="top-quicklinks d-flex align-items-center gap-3">
                            <Link to="/news" className="text-decoration-none text-muted small">News</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/events" className="text-decoration-none text-muted small">Events</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/notice-board" className="text-decoration-none text-muted small">Notice Board</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/admissions/apply" className="badge bg-warning text-dark text-decoration-none px-2 py-1 fw-bold">
                                Apply Online
                            </Link>

                            <div className="ms-2 ps-2 border-start">
                                {isAuthenticated ? (
                                    <div className="d-inline-flex align-items-center">
                                        <span className="me-2 small fw-semibold">
                                            <i className="fas fa-user-circle me-1 text-primary"></i>
                                            {user?.name}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-danger py-0 px-2 small"
                                            onClick={logout}
                                        >
                                            <i className="fas fa-sign-out-alt me-1"></i>Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-inline-flex align-items-center gap-2">
                                        <Link to="/login" className="btn btn-sm btn-outline-light py-0 px-2 small text-dark border-secondary">
                                            <i className="fas fa-user-graduate me-1 text-success"></i>Student Portal
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header (Only 1 Logo on the left, clean layout) */}
            <header className="main-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <Link to="/" className="d-inline-block">
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge Institute Logo"
                                    className="logo-img"
                                    style={{
                                        maxHeight: '82px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '10px',
                                        padding: '5px',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                                        transition: 'transform 0.3s ease-in-out'
                                    }}
                                />
                            </Link>
                        </div>
                        <div className="col">
                            <h1 className="school-name text-white mb-1" style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                                COMBRIDGE INSTITUTE OF HEALTH MANAGEMENT SCIENCES
                            </h1>
                            <p className="school-subname text-white-50 mb-0 small" style={{ fontWeight: 600 }}>
                                A subsidiary arm of <span className="text-warning">COMBRIDGE CENTRE FOR POLYTECHNIC STUDIES</span>
                            </p>
                            <p className="school-motto mb-0 fw-bold" style={{ color: '#ffdd57', fontStyle: 'italic', fontSize: '0.92rem' }}>
                                "Enriching The Future and Potentials"
                            </p>
                        </div>
                        <div className="col-auto d-none d-lg-block text-end">
                            <Link to="/admissions/apply" className="btn btn-warning fw-bold px-3 py-2 shadow-sm text-dark">
                                <i className="fas fa-edit me-1"></i> Admissions 2026/2027
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
