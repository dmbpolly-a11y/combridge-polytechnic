import { Link } from 'react-router-dom';

/**
 * Site-wide footer matching the University of Saint Joseph (usj.ac.ug) layout and Combridge branding.
 * Features official logo logocom.png, structured quick links, resources, and contact directory.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer bg-dark text-white pt-5 pb-3" style={{ background: '#131e1a' }}>
            <div className="container">
                <div className="row g-4">
                    {/* Column 1: Brand & Logo */}
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <img
                                src="/images/logocom.png"
                                alt="Combridge Polytechnic Logo"
                                style={{
                                    height: '65px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    padding: '4px'
                                }}
                            />
                            <div>
                                <h6 className="fw-bold text-uppercase mb-0 text-white">Combridge</h6>
                                <small className="text-light opacity-75">Centre for Polytechnic Studies</small>
                            </div>
                        </div>
                        <p className="text-light opacity-75 small mb-3">
                            A premier tertiary polytechnic institution committed to practical technical education, innovation, entrepreneurship, and hands-on professional empowerment.
                        </p>
                        <div className="social-links d-flex gap-2">
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Useful Links (Matching USJ) */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3">Useful Links</h6>
                        <ul className="list-unstyled footer-links small">
                            <li className="mb-2"><Link to="/about/our-history" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>About Combridge</Link></li>
                            <li className="mb-2"><Link to="/students/admission-lists" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Admissions Lists</Link></li>
                            <li className="mb-2"><Link to="/admissions/apply" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Online Application</Link></li>
                            <li className="mb-2"><Link to="/admissions/fees-structure" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Fees Structure</Link></li>
                            <li className="mb-2"><Link to="/research/downloads" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Downloads & Forms</Link></li>
                            <li className="mb-2"><Link to="/notice-board" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Notice Board</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Academic Resources (Matching USJ) */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3">Resources</h6>
                        <ul className="list-unstyled footer-links small">
                            <li className="mb-2"><Link to="/academics/library" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Polytechnic Library</Link></li>
                            <li className="mb-2"><Link to="/academics/timetable" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Teaching Timetable</Link></li>
                            <li className="mb-2"><Link to="/academics/academic-calendar" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Academic Calendar</Link></li>
                            <li className="mb-2"><Link to="/research/grants-office" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Research & Innovation</Link></li>
                            <li className="mb-2"><Link to="/gallery" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Campus Gallery</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Student Portal Login</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Administration (Matching USJ) */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3">Contact Information</h6>
                        <ul className="list-unstyled text-light opacity-80 small" style={{ lineHeight: 2 }}>
                            <li>
                                <i className="fas fa-map-marker-alt me-2 text-warning"></i>
                                Main Campus, Kampala, Uganda
                            </li>
                            <li>
                                <i className="fas fa-phone-alt me-2 text-warning"></i>
                                <a href="tel:+256700000000" className="text-light text-decoration-none">(+256) 700 000 000</a>
                            </li>
                            <li>
                                <i className="fas fa-phone-alt me-2 text-warning"></i>
                                <a href="tel:+256705706680" className="text-light text-decoration-none">(+256) 705 706 680</a>
                            </li>
                            <li>
                                <i className="fas fa-envelope me-2 text-warning"></i>
                                <a href="mailto:info@combridge.ac.ug" className="text-light text-decoration-none">info@combridge.ac.ug</a>
                            </li>
                            <li>
                                <i className="fas fa-globe me-2 text-warning"></i>
                                www.combridge.ac.ug
                            </li>
                        </ul>
                        <div className="mt-3">
                            <Link to="/admissions/apply" className="btn btn-sm btn-warning text-dark fw-bold w-100">
                                <i className="fas fa-pencil-alt me-1"></i> Apply Online Now
                            </Link>
                        </div>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-light opacity-75">
                    <p className="mb-2 mb-md-0">
                        &copy; {year} Combridge Centre for Polytechnic Studies. All Rights Reserved.
                    </p>
                    <div className="d-flex gap-3">
                        <Link to="/about/rules-regulations" className="text-light text-decoration-none">Privacy Policy</Link>
                        <span>&middot;</span>
                        <Link to="/about/university-policies" className="text-light text-decoration-none">Institutional Policies</Link>
                        <span>&middot;</span>
                        <Link to="/contact" className="text-light text-decoration-none">Contact Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
