import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Top contact bar + main school header with logo, name, and badge.
 */
export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar d-none d-md-block">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <i className="fas fa-envelope me-1"></i>
                            <span>info@combridge.ac.ug</span>
                            <span className="ms-3">
                                <i className="fas fa-phone me-1"></i>
                                +256 700 000 000
                            </span>
                        </div>
                        <div className="col-md-6 text-end">
                            {isAuthenticated ? (
                                <>
                                    <span className="me-3">
                                        <i className="fas fa-user-circle me-1"></i>
                                        {user?.name}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-link text-decoration-none text-dark p-0"
                                        onClick={logout}
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i>Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-decoration-none me-3 text-dark">
                                        <i className="fas fa-sign-in-alt me-1"></i>Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="main-header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-2 col-3">
                            <img
                                src="/images/combridge.jpeg"
                                alt="Combridge Logo"
                                className="logo-img"
                            />
                        </div>
                        <div className="col-md-8 col-9">
                            <h1 className="school-name">
                                Combridge Centre for Polytechnic Studies
                            </h1>
                            <p className="school-motto mb-0">
                                Development through Skills and Innovation
                            </p>
                            <p className="mb-0">
                                <small>Kampala, Uganda</small>
                            </p>
                        </div>
                        <div className="col-md-2 text-end d-none d-md-block">
                            <img
                                src="/images/badge.png"
                                alt="School Badge"
                                className="school-badge"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
