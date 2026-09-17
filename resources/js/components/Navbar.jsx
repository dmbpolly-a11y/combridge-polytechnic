import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Main sticky navigation bar mirroring the University of Saint Joseph (usj.ac.ug) structure.
 * Includes multi-column mega dropdowns for About, Academics, Students, Admissions, and Research.
 */
export default function Navbar() {
    const { isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const closeNav = () => {
        setOpen(false);
        setActiveDropdown(null);
    };

    const toggleDropdown = (name, e) => {
        // For mobile click behavior
        if (window.innerWidth < 992) {
            e.preventDefault();
            setActiveDropdown(activeDropdown === name ? null : name);
        }
    };

    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' active' : ''}`;

    return (
        <nav className="main-nav">
            <div className="container">
                {/* Mobile Header Bar */}
                <div className="d-flex d-lg-none justify-content-between align-items-center py-2">
                    <Link to="/" className="d-flex align-items-center text-white text-decoration-none" onClick={closeNav}>
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: '36px', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', marginRight: '8px' }}
                        />
                        <span className="fw-bold text-uppercase text-truncate" style={{ fontSize: '0.82rem', letterSpacing: '0.3px' }}>
                            Combridge Health & Management Sciences
                        </span>
                    </Link>
                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle navigation"
                    >
                        <i className={`fas fa-${open ? 'times' : 'bars'}`}></i>
                    </button>
                </div>

                {/* Nav links */}
                <ul className={`nav flex-column flex-lg-row align-items-lg-center ${open ? 'd-flex pb-3' : 'd-none d-lg-flex'}`}>
                    {/* Home */}
                    <li className="nav-item">
                        <NavLink to="/" end className={linkClass} onClick={closeNav}>
                            <i className="fas fa-home"></i> Home
                        </NavLink>
                    </li>

                    {/* COMBRIDGE MANAGE (Prominent Portal Link) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'combridge-manage' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle text-dark fw-bold px-3 py-2 rounded-3 me-lg-2 my-1 my-lg-0 shadow-sm"
                            style={{ background: '#ffdd57', border: '1px solid #eab308' }}
                            href="/combridge-manage"
                            onClick={(e) => toggleDropdown('combridge-manage', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'combridge-manage'}
                        >
                            <i className="fas fa-cogs text-dark me-1"></i> Combridge Manage
                        </a>
                        <ul className={`dropdown-menu ${activeDropdown === 'combridge-manage' ? 'show' : ''}`} style={{ minWidth: '280px' }}>
                            <li><h6 className="dropdown-header text-uppercase text-success fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>System Portals</h6></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/admin" onClick={closeNav}><i className="fas fa-shield-alt me-2 text-danger"></i>Admin Portal</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/academic-registrar" onClick={closeNav}><i className="fas fa-user-check me-2 text-primary"></i>Academic Registrar</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/lecturer" onClick={closeNav}><i className="fas fa-chalkboard-teacher me-2 text-success"></i>Lecturer / Tutor Portal</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/dean" onClick={closeNav}><i className="fas fa-graduation-cap me-2 text-warning"></i>Dean Clinical & Medicine</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/deputy-registrar" onClick={closeNav}><i className="fas fa-user-tie me-2 text-info"></i>Deputy Academic Registrar</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/bursar" onClick={closeNav}><i className="fas fa-coins me-2 text-success"></i>Bursar Portal</Link></li>
                            <li><Link className="dropdown-item" to="/combridge-manage/library" onClick={closeNav}><i className="fas fa-book-reader me-2 text-primary"></i>Library Admin Portal</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item fw-bold text-success" to="/combridge-manage" onClick={closeNav}><i className="fas fa-th-large me-2"></i>All Portals Dashboard</Link></li>
                        </ul>
                    </li>

                    {/* 1. ABOUT US (Mega Dropdown) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'about' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="/about"
                            onClick={(e) => toggleDropdown('about', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'about'}
                        >
                            About
                        </a>
                        <div className={`dropdown-menu dropdown-mega ${activeDropdown === 'about' ? 'show' : ''}`}>
                            <div className="row g-3">
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-landmark me-1"></i> Background
                                    </div>
                                    <Link className="dropdown-item" to="/about/mission-vision" onClick={closeNav}>Mission & Vision</Link>
                                    <Link className="dropdown-item" to="/about/our-history" onClick={closeNav}>Our History</Link>
                                    <Link className="dropdown-item" to="/about/anthem" onClick={closeNav}>Polytechnic Anthem</Link>
                                    <Link className="dropdown-item" to="/about/rules-regulations" onClick={closeNav}>Rules & Regulations</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-balance-scale me-1"></i> Governance
                                    </div>
                                    <Link className="dropdown-item" to="/about/chancellor" onClick={closeNav}>Chancellor / Board Patron</Link>
                                    <Link className="dropdown-item" to="/about/board-of-directors" onClick={closeNav}>Board of Trustees</Link>
                                    <Link className="dropdown-item" to="/about/university-senate" onClick={closeNav}>Academic Senate</Link>
                                    <Link className="dropdown-item" to="/about/university-council" onClick={closeNav}>Polytechnic Council</Link>
                                    <Link className="dropdown-item" to="/about/university-policies" onClick={closeNav}>Institutional Policies</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-user-tie me-1"></i> Management
                                    </div>
                                    <Link className="dropdown-item" to="/about/vice-chancellor" onClick={closeNav}>Principal / Executive Head</Link>
                                    <Link className="dropdown-item" to="/about/deputy-vice-chancellor" onClick={closeNav}>Deputy Principal</Link>
                                    <Link className="dropdown-item" to="/about/academic-registrar" onClick={closeNav}>Academic Registrar</Link>
                                    <Link className="dropdown-item" to="/about/library" onClick={closeNav}>Library Administration</Link>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 2. ACADEMICS (Mega Dropdown) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'academics' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="/academics"
                            onClick={(e) => toggleDropdown('academics', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'academics'}
                        >
                            Academics
                        </a>
                        <div className={`dropdown-menu dropdown-mega ${activeDropdown === 'academics' ? 'show' : ''}`}>
                            <div className="row g-3">
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-graduation-cap me-1"></i> Faculties & Schools
                                    </div>
                                    <Link className="dropdown-item" to="/academics/science-technology" onClick={closeNav}>Science & Technology</Link>
                                    <Link className="dropdown-item" to="/academics/business-socialsciences" onClick={closeNav}>Business & Management</Link>
                                    <Link className="dropdown-item" to="/academics/vocational-trades" onClick={closeNav}>Technical & Vocational Trades</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-book-reader me-1"></i> Academic Resources
                                    </div>
                                    <Link className="dropdown-item" to="/academics/library" onClick={closeNav}>Polytechnic Library</Link>
                                    <Link className="dropdown-item" to="/academics/elearning" onClick={closeNav}>E-Learning Portal</Link>
                                    <Link className="dropdown-item" to="/academics/repository" onClick={closeNav}>Digital Repository</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-calendar-alt me-1"></i> Programs & Schedules
                                    </div>
                                    <Link className="dropdown-item" to="/academics/academic-calendar" onClick={closeNav}>Academic Calendar</Link>
                                    <Link className="dropdown-item" to="/academics/timetable" onClick={closeNav}>Teaching Timetable</Link>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 3. STUDENTS (Mega Dropdown) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'students' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="/students"
                            onClick={(e) => toggleDropdown('students', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'students'}
                        >
                            Students
                        </a>
                        <div className={`dropdown-menu dropdown-mega ${activeDropdown === 'students' ? 'show' : ''}`} style={{ maxWidth: '880px' }}>
                            <div className="row g-3">
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-users me-1"></i> Student Life
                                    </div>
                                    <Link className="dropdown-item" to="/students/life-at-campus" onClick={closeNav}>Life at Campus</Link>
                                    <Link className="dropdown-item" to="/students/students-guild" onClick={closeNav}>Students Guild</Link>
                                    <Link className="dropdown-item" to="/students/games-sports" onClick={closeNav}>Games & Sports</Link>
                                    <Link className="dropdown-item" to="/students/student-union-clubs" onClick={closeNav}>Clubs & Societies</Link>
                                    <Link className="dropdown-item" to="/students/rules-regulation" onClick={closeNav}>Code of Conduct</Link>
                                    <Link className="dropdown-item" to="/students/alumni" onClick={closeNav}>Alumni Association</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-hands-helping me-1"></i> Student Services
                                    </div>
                                    <Link className="dropdown-item" to="/students/computing-services" onClick={closeNav}>Computing & ICT</Link>
                                    <Link className="dropdown-item" to="/students/university-library" onClick={closeNav}>Library Services</Link>
                                    <Link className="dropdown-item" to="/students/university-security" onClick={closeNav}>Campus Security</Link>
                                    <Link className="dropdown-item" to="/students/university-health-services" onClick={closeNav}>Health Services</Link>
                                    <Link className="dropdown-item" to="/students/financial-aid" onClick={closeNav}>Financial Aid</Link>
                                    <Link className="dropdown-item" to="/students/religion-and-spirituality" onClick={closeNav}>Chaplaincy & Spiritual Care</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-external-link-alt me-1"></i> Important Links
                                    </div>
                                    <Link className="dropdown-item" to="/students/dean-of-students" onClick={closeNav}>Dean of Students</Link>
                                    <Link className="dropdown-item" to="/students/admission-lists" onClick={closeNav}>Admission Lists</Link>
                                    <Link className="dropdown-item" to="/students/graduation-requirements" onClick={closeNav}>Graduation Requirements</Link>
                                    <Link className="dropdown-item fw-bold text-success" to="/login" onClick={closeNav}>
                                        <i className="fas fa-key me-1"></i> Student Portal Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 4. ADMISSIONS (Mega Dropdown) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'admissions' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="/admissions"
                            onClick={(e) => toggleDropdown('admissions', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'admissions'}
                        >
                            Admissions
                        </a>
                        <div className={`dropdown-menu dropdown-mega ${activeDropdown === 'admissions' ? 'show' : ''}`}>
                            <div className="row g-3">
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-layer-group me-1"></i> Study Programs
                                    </div>
                                    <Link className="dropdown-item" to="/admissions/undergraduate-courses" onClick={closeNav}>Certificate Courses</Link>
                                    <Link className="dropdown-item" to="/admissions/diploma-courses" onClick={closeNav}>Diploma Programmes</Link>
                                    <Link className="dropdown-item" to="/admissions/short-courses" onClick={closeNav}>Short & Skill Courses</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-clipboard-check me-1"></i> Entry Requirements
                                    </div>
                                    <Link className="dropdown-item" to="/admissions/admission-requirements" onClick={closeNav}>Admission Requirements</Link>
                                    <Link className="dropdown-item" to="/admissions/fees-structure" onClick={closeNav}>Fees Structure</Link>
                                    <Link className="dropdown-item" to="/admissions/call-for-application" onClick={closeNav}>Call for Applications</Link>
                                    <Link className="dropdown-item" to="/admissions/application-form" onClick={closeNav}>Download Application Forms</Link>
                                </div>
                                <div className="col-lg-4">
                                    <div className="dropdown-column-title">
                                        <i className="fas fa-laptop me-1"></i> How to Apply
                                    </div>
                                    <Link className="dropdown-item fw-bold text-primary" to="/admissions/apply" onClick={closeNav}>
                                        <i className="fas fa-paper-plane me-1"></i> Apply Online
                                    </Link>
                                    <Link className="dropdown-item" to="/admissions/online-application-guidelines" onClick={closeNav}>Application Guidelines</Link>
                                    <Link className="dropdown-item" to="/admissions/scholarships" onClick={closeNav}>Scholarships & Bursaries</Link>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 5. RESEARCH (Dropdown) */}
                    <li className={`nav-item dropdown ${activeDropdown === 'research' ? 'show' : ''}`}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="/research"
                            onClick={(e) => toggleDropdown('research', e)}
                            role="button"
                            aria-expanded={activeDropdown === 'research'}
                        >
                            Research
                        </a>
                        <ul className={`dropdown-menu ${activeDropdown === 'research' ? 'show' : ''}`} style={{ minWidth: '240px' }}>
                            <li><Link className="dropdown-item" to="/research/grants-office" onClick={closeNav}><i className="fas fa-award me-2 text-muted"></i>Research & Grants Office</Link></li>
                            <li><Link className="dropdown-item" to="/research/research-innovation" onClick={closeNav}><i className="fas fa-lightbulb me-2 text-muted"></i>Research Innovation Hub</Link></li>
                            <li><Link className="dropdown-item" to="/research/collaborations" onClick={closeNav}><i className="fas fa-handshake me-2 text-muted"></i>Partnerships & Collaborations</Link></li>
                            <li><Link className="dropdown-item" to="/research/repository" onClick={closeNav}><i className="fas fa-archive me-2 text-muted"></i>Publications & Repository</Link></li>
                            <li><Link className="dropdown-item" to="/research/downloads" onClick={closeNav}><i className="fas fa-download me-2 text-muted"></i>Research Downloads</Link></li>
                        </ul>
                    </li>

                    {/* 6. NOTICE BOARD */}
                    <li className="nav-item">
                        <NavLink to="/notice-board" className={linkClass} onClick={closeNav}>
                            Notice Board
                        </NavLink>
                    </li>

                    {/* 7. GALLERY */}
                    <li className="nav-item">
                        <NavLink to="/gallery" className={linkClass} onClick={closeNav}>
                            Gallery
                        </NavLink>
                    </li>

                    {/* 8. CONTACT */}
                    <li className="nav-item">
                        <NavLink to="/contact" className={linkClass} onClick={closeNav}>
                            Contact
                        </NavLink>
                    </li>

                    {/* Portal Menu for Authenticated Users */}
                    {isAuthenticated && (
                        <li className="nav-item dropdown ms-lg-auto">
                            <a
                                className="nav-link dropdown-toggle text-warning"
                                href="#"
                                onClick={(e) => toggleDropdown('portal', e)}
                                role="button"
                                aria-expanded={activeDropdown === 'portal'}
                            >
                                <i className="fas fa-user-circle"></i> Portal
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${activeDropdown === 'portal' ? 'show' : ''}`}>
                                {isAdmin() && (
                                    <>
                                        <li><Link className="dropdown-item" to="/admin/dashboard" onClick={closeNav}><i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                    </>
                                )}
                                {isTeacher() && (
                                    <>
                                        <li><Link className="dropdown-item" to="/teacher/dashboard" onClick={closeNav}><i className="fas fa-chalkboard-teacher me-2"></i>Teacher Portal</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                    </>
                                )}
                                {isStudent() && (
                                    <>
                                        <li><Link className="dropdown-item" to="/student/dashboard" onClick={closeNav}><i className="fas fa-user-graduate me-2"></i>Student Portal</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                    </>
                                )}
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    )}

                    {/* Login CTA button if not authenticated */}
                    {!isAuthenticated && (
                        <li className="nav-item ms-lg-auto my-2 my-lg-0">
                            <NavLink to="/login" className="btn btn-sm btn-warning text-dark fw-bold px-3 py-1 text-uppercase" onClick={closeNav}>
                                <i className="fas fa-sign-in-alt me-1"></i> Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
