import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Main sticky navigation bar.
 * Renders role-specific links (Admin, Teacher, Student portals).
 */
export default function Navbar() {
    const { isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' active' : ''}`;

    return (
        <nav className="main-nav">
            <div className="container">
                {/* Mobile toggle */}
                <div className="d-flex d-md-none justify-content-between align-items-center py-2">
                    <span className="text-white fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>
                        Menu
                    </span>
                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle navigation"
                    >
                        <i className={`fas fa-${open ? 'times' : 'bars'}`}></i>
                    </button>
                </div>

                {/* Nav links */}
                <ul className={`nav flex-wrap ${open ? 'd-flex' : 'd-none d-md-flex'}`}>
                    {/* Home */}
                    <li className="nav-item">
                        <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
                            <i className="fas fa-home"></i> Home
                        </NavLink>
                    </li>

                    {/* Admin */}
                    {isAuthenticated && isAdmin() && (
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                data-bs-toggle="dropdown"
                                role="button"
                                aria-expanded="false"
                            >
                                <i className="fas fa-cog"></i> Admin
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/dashboard" onClick={() => setOpen(false)}>
                                        <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/students" onClick={() => setOpen(false)}>
                                        <i className="fas fa-user-graduate me-2"></i>Students
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/teachers" onClick={() => setOpen(false)}>
                                        <i className="fas fa-chalkboard-teacher me-2"></i>Teachers
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/attendance" onClick={() => setOpen(false)}>
                                        <i className="fas fa-calendar-check me-2"></i>Attendance
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/examinations" onClick={() => setOpen(false)}>
                                        <i className="fas fa-file-alt me-2"></i>Examinations
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/fees" onClick={() => setOpen(false)}>
                                        <i className="fas fa-money-bill-wave me-2"></i>Fees
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/admin/library" onClick={() => setOpen(false)}>
                                        <i className="fas fa-book me-2"></i>Library
                                    </NavLink>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    )}

                    {/* Teacher Portal */}
                    {isAuthenticated && isTeacher() && (
                        <li className="nav-item">
                            <NavLink to="/teacher/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                                <i className="fas fa-chalkboard-teacher"></i> Teacher Portal
                            </NavLink>
                        </li>
                    )}

                    {/* Student Portal */}
                    {isAuthenticated && isStudent() && (
                        <li className="nav-item">
                            <NavLink to="/student/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                                <i className="fas fa-user-graduate"></i> Student Portal
                            </NavLink>
                        </li>
                    )}

                    {/* Public Links */}
                    <li className="nav-item">
                        <a className="nav-link" href="/#about" onClick={() => setOpen(false)}>
                            <i className="fas fa-info-circle"></i> About Us
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/#programmes" onClick={() => setOpen(false)}>
                            <i className="fas fa-graduation-cap"></i> Programmes
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/#admissions" onClick={() => setOpen(false)}>
                            <i className="fas fa-file-alt"></i> Admissions
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/#contact" onClick={() => setOpen(false)}>
                            <i className="fas fa-envelope"></i> Contact
                        </a>
                    </li>

                    {/* Login if not authenticated */}
                    {!isAuthenticated && (
                        <li className="nav-item ms-auto">
                            <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                                <i className="fas fa-sign-in-alt"></i> Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
