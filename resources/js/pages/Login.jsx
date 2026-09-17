import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login, isAuthenticated, isAdmin, isTeacher, isStudent } = useAuth();
    const navigate   = useNavigate();
    const location   = useLocation();
    const from       = location.state?.from?.pathname || null;

    const [form, setForm]       = useState({ username: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError]     = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    // Redirect if already logged in
    if (isAuthenticated) {
        const dest = from ?? (isAdmin() ? '/admin/dashboard' : isTeacher() ? '/teacher/dashboard' : isStudent() ? '/student/dashboard' : '/');
        navigate(dest, { replace: true });
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Note: Our auth takes email, but the UI says "Username". We'll pass it to login.
            const user = await login(form.username, form.password, true);
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

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        alert(`Reset link sent to ${forgotEmail}`);
        setShowForgotModal(false);
    };

    return (
        <div className="portal-login-body">
            <div className="portal-login-box">
                <div className="portal-login-logo">
                    <img src="/images/logocom.png" alt="Combridge Polytechnic Logo" />
                    <h3>Student Portal</h3>
                    <p>Welcome back! Please <span>login</span> to continue</p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <div className="input-group portal-input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text portal-input-group-text"><i className="fas fa-user"></i></span>
                            </div>
                            <input 
                                type="text" 
                                className="form-control portal-form-control" 
                                autoComplete="off" 
                                placeholder="Username or Registration Number" 
                                name="username" 
                                value={form.username}
                                onChange={handleChange}
                                required 
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <div className="input-group portal-input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text portal-input-group-text"><i className="fas fa-lock"></i></span>
                            </div>
                            <input 
                                type={showPwd ? 'text' : 'password'} 
                                className="form-control portal-form-control" 
                                autoComplete="new-password" 
                                placeholder="Password" 
                                name="password" 
                                value={form.password}
                                onChange={handleChange}
                                required 
                                disabled={loading}
                            />
                            <div className="input-group-append">
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button" 
                                    onClick={() => setShowPwd(!showPwd)}
                                >
                                    <i className={`fas fa-eye${showPwd ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2">
                        <div className="col-md-6 col-12 mb-2 mb-md-0">
                            <Link to="/" className="btn portal-btn-outline-success">
                                <i className="fas fa-arrow-left me-2"></i> Back
                            </Link>
                        </div>
                        <div className="col-md-6 col-12">
                            <button type="submit" className="btn portal-btn-success" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <><i className="fas fa-sign-in-alt me-2"></i> Login</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        <a 
                            href="#" 
                            className="portal-forgot-password" 
                            onClick={(e) => { e.preventDefault(); setShowForgotModal(true); }}
                        >
                            <i className="fas fa-unlock-alt me-1"></i> Forgot Password?
                        </a>
                    </div>
                </form>

                <div className="portal-divider">or</div>

                <div className="text-center">
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                        <i className="fas fa-shield-alt me-1" style={{ color: '#28a745' }}></i>
                        Secure login with reCAPTCHA
                    </small>
                </div>

                <div className="portal-login-footer">
                    &copy; 2026 <span className="brand">Gem Computer Solutions Limited</span>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                                <form onSubmit={handleForgotSubmit}>
                                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white', borderRadius: '16px 16px 0 0' }}>
                                        <h5 className="modal-title"><i className="fas fa-unlock-alt me-2"></i> Reset Password</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowForgotModal(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <p className="text-muted">Enter your registered email address and we'll send you a password reset link.</p>
                                        <div className="form-group mb-3">
                                            <div className="input-group portal-input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text portal-input-group-text"><i className="fas fa-envelope"></i></span>
                                                </div>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    className="form-control portal-form-control" 
                                                    placeholder="Enter your registered email" 
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 px-4 pb-4">
                                        <button type="button" className="btn btn-secondary rounded-3" onClick={() => setShowForgotModal(false)}>Cancel</button>
                                        <button type="submit" className="btn portal-btn-success w-auto px-4"><i className="fas fa-paper-plane me-2"></i> Send Reset Link</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
