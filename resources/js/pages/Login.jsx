import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login, isAuthenticated, isAdmin, isTeacher, isStudent } = useAuth();
    const navigate   = useNavigate();
    const location   = useLocation();
    const from       = location.state?.from?.pathname || null;

    const [form, setForm]       = useState({ email: '', password: '', remember: false });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (isAuthenticated) {
        const dest = from ?? (isAdmin() ? '/admin/dashboard' : isTeacher() ? '/teacher/dashboard' : isStudent() ? '/student/dashboard' : '/');
        navigate(dest, { replace: true });
        return null;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const user = await login(form.email, form.password, form.remember);
            // Determine redirect based on role
            if (from) {
                navigate(from, { replace: true });
            } else {
                const roles = user?.roles?.map(r => typeof r === 'string' ? r : r.name) ?? [];
                if (roles.includes('administrator') || roles.includes('principal')) {
                    navigate('/admin/dashboard', { replace: true });
                } else if (roles.includes('teacher')) {
                    navigate('/teacher/dashboard', { replace: true });
                } else if (roles.includes('student')) {
                    navigate('/student/dashboard', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card fade-in-up">
                {/* Header */}
                <div className="login-card-header">
                    <img
                        src="/images/combridge.jpeg"
                        alt="Combridge Logo"
                        style={{ height: 80, borderRadius: 12, marginBottom: '0.75rem' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <h3 className="fw-bold mb-1">Combridge Polytechnic</h3>
                    <p className="mb-0 opacity-80" style={{ fontSize: '0.9rem' }}>
                        Development through Skills and Innovation
                    </p>
                </div>

                {/* Body */}
                <div className="login-card-body">
                    <h5 className="text-center fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                        Login to Your Account
                    </h5>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">
                                <i className="fas fa-envelope me-2" style={{ color: 'var(--primary-color)' }}></i>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-semibold">
                                <i className="fas fa-lock me-2" style={{ color: 'var(--primary-color)' }}></i>
                                Password
                            </label>
                            <div className="input-group">
                                <input
                                    id="password"
                                    type={showPwd ? 'text' : 'password'}
                                    name="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPwd(p => !p)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    <i className={`fas fa-eye${showPwd ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="mb-4 form-check">
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                className="form-check-input"
                                checked={form.remember}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <label className="form-check-label" htmlFor="remember">
                                Remember Me
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="d-grid mb-3">
                            <button
                                type="submit"
                                className="btn btn-lg fw-bold"
                                style={{ background: 'var(--primary-color)', color: 'white' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt me-2"></i>Login
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/forgot-password" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}>
                                <i className="fas fa-key me-1"></i>Forgot Your Password?
                            </Link>
                        </div>

                        <hr className="my-4" />

                        <div className="text-center">
                            <p className="mb-2 text-muted">Don't have an account?</p>
                            <Link to="/register" className="btn btn-outline-primary">
                                <i className="fas fa-user-plus me-2"></i>Register Now
                            </Link>
                        </div>
                    </form>

                    {/* Footer note */}
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            <i className="fas fa-shield-alt me-1 text-success"></i>
                            Secure Login Portal
                        </small>
                    </div>
                </div>

                {/* Quick Access Guide */}
                <div className="px-4 pb-4">
                    <div className="bg-light rounded p-3">
                        <h6 className="fw-bold mb-3">
                            <i className="fas fa-info-circle me-2 text-primary"></i>Quick Access Guide
                        </h6>
                        <div className="row g-2">
                            {[
                                { icon: 'fas fa-user-tie text-primary', role: 'Admin', desc: 'Full system access' },
                                { icon: 'fas fa-chalkboard-teacher text-success', role: 'Teacher', desc: 'Marks & attendance' },
                                { icon: 'fas fa-user-graduate text-info', role: 'Student', desc: 'View results & fees' },
                                { icon: 'fas fa-book text-warning', role: 'Librarian', desc: 'Manage library' },
                            ].map((g, i) => (
                                <div key={i} className="col-6">
                                    <small className="text-muted">
                                        <i className={`${g.icon} me-1`}></i>
                                        <strong>{g.role}</strong><br />
                                        {g.desc}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
