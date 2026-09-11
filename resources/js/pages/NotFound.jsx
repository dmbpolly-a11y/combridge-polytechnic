import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{ minHeight: '70vh', padding: '2rem' }}
        >
            <div style={{ fontSize: '6rem', lineHeight: 1 }}>🎓</div>
            <h1 className="display-1 fw-bold mt-3" style={{ color: 'var(--primary-color)' }}>404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="text-muted mb-4" style={{ maxWidth: 400 }}>
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>
            <div className="d-flex gap-3">
                <Link to="/" className="btn btn-primary btn-lg">
                    <i className="fas fa-home me-2"></i>Go Home
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                </Link>
            </div>
        </div>
    );
}
