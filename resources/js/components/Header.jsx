import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Top contact bar + main school header with logo, name, and badge.
 */
export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            {/* Top Bar matching USJ style */}
            <div className="top-bar d-none d-lg-block">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="top-contact">
                            <a href="mailto:info@combridge.ac.ug" className="text-decoration-none text-muted me-3">
                                <i className="fas fa-envelope text-success me-1"></i> info@combridge.ac.ug
                            </a>
                            <a href="tel:+256700000000" className="text-decoration-none text-muted">
                                <i className="fas fa-phone-alt text-success me-1"></i> (+256) 700 000 000
                            </a>
                        </div>
                        <div className="top-quicklinks d-flex align-items-center gap-3">
                            <Link to="/news" className="text-decoration-none text-muted small">News</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/events" className="text-decoration-none text-muted small">Events</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/academics/academic-calendar" className="text-decoration-none text-muted small">Academic Calendar</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/notice-board" className="text-decoration-none text-muted small">Notice Board</Link>
                            <span className="text-muted opacity-50">|</span>
                            <Link to="/academics/timetable" className="text-decoration-none text-muted small">Timetable</Link>
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
                                        <Link to="/login" className="btn btn-sm btn-outline-primary py-0 px-2 small">
                                            <i className="fas fa-user-graduate me-1"></i>Student Portal
                                        </Link>
                                        <Link to="/login" className="btn btn-sm btn-success py-0 px-2 small text-white">
                                            <i className="fas fa-chalkboard-teacher me-1"></i>Staff Portal
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="main-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-2 col-3">
                            <Link to="/">
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge Polytechnic Logo"
                                    className="logo-img"
                                    style={{
                                        maxHeight: '75px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        padding: '4px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }}
                                />
                            </Link>
                        </div>
                        <div className="col-md-8 col-9">
                            <h1 className="school-name">
                                Combridge Centre for Polytechnic Studies
                            </h1>
                            <p className="school-motto mb-0">
                                Development through Skills and Innovation
                            </p>
                            <p className="mb-0 text-white-50">
                                <small><i className="fas fa-map-marker-alt me-1 text-warning"></i>Kampala, Uganda | Registered & Accredited Institution</small>
                            </p>
                        </div>
                        <div className="col-md-2 text-end d-none d-md-block">
                            <img
                                src="/images/logocom.png"
                                alt="Combridge Crest"
                                className="school-badge"
                                style={{
                                    maxHeight: '70px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
