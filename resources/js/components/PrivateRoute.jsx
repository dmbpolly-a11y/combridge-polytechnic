import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route so only authenticated users (optionally with a specific role)
 * can access it. Unauthenticated users are redirected to /login.
 *
 * @param {React.ReactNode} children  - Route content to render
 * @param {string[]}        roles     - Optional array of allowed roles
 */
export default function PrivateRoute({ children, roles = [] }) {
    const { isAuthenticated, loading, hasRole } = useAuth();
    const location = useLocation();

    // While verifying session, show a spinner
    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '60vh' }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border mb-3"
                        style={{ color: 'var(--primary-color)', width: '3rem', height: '3rem' }}
                        role="status"
                    >
                        <span className="visually-hidden">Loading…</span>
                    </div>
                    <p className="text-muted">Verifying session…</p>
                </div>
            </div>
        );
    }

    // Not logged in → redirect to login, preserving intended destination
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    if (roles.length > 0 && !roles.some(r => hasRole(r))) {
        return (
            <div className="container py-5 text-center">
                <i className="fas fa-ban fa-4x text-danger mb-3"></i>
                <h2>Access Denied</h2>
                <p className="text-muted">You do not have permission to view this page.</p>
            </div>
        );
    }

    return children;
}
