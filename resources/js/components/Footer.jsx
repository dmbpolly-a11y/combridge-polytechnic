import { Link } from 'react-router-dom';

/**
 * Site-wide footer matching Combridge Institute of Health Management Sciences branding.
 * Features official logo logocom.png, structured quick links, resources, and contact directory.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer text-white pt-5 pb-3" style={{ background: '#0a1d13', borderTop: '4px solid #006837' }}>
            <div className="container">
                <div className="row g-4">
                    {/* Column 1: Brand & Logo */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <img
                                src="/images/logocom.png"
                                alt="Combridge Institute Logo"
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
                                <h6 className="fw-bold text-uppercase mb-0 text-white" style={{ fontSize: '0.95rem' }}>
                                    COMBRIDGE INSTITUTE
                                </h6>
                                <small className="text-warning fw-semibold d-block">OF HEALTH MANAGEMENT SCIENCES</small>
                                <span className="text-white-50" style={{ fontSize: '0.75rem' }}>
                                    A subsidiary of Combridge Centre for Polytechnic Studies
                                </span>
                            </div>
                        </div>
                        <p className="text-light opacity-75 small mb-3">
                            <em>"Enriching The Future and Potentials"</em> — A premier firm specialized in Advisory, Consultancy, Clinical and Medical Training, Research, and Professional Empowerment in Mbarara City, Uganda.
                        </p>
                        <div className="social-links d-flex gap-2">
                            <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="WhatsApp">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                            <a href="mailto:combridgecentre@gmail.com" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Email">
                                <i className="fas fa-envelope"></i>
                            </a>
                            <a href="tel:+256393256879" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 34, height: 34, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Phone">
                                <i className="fas fa-phone-alt"></i>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Quick Links
                        </h6>
                        <ul className="list-unstyled footer-links small">
                            <li className="mb-2"><Link to="/about" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>About Us</Link></li>
                            <li className="mb-2"><Link to="/academics" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Programmes</Link></li>
                            <li className="mb-2"><Link to="/admissions/apply" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Apply Online</Link></li>
                            <li className="mb-2"><Link to="/research" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Consultancy</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Academic Resources */}
                    <div className="col-lg-3 col-md-6 col-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Portals & Help
                        </h6>
                        <ul className="list-unstyled footer-links small">
                            <li className="mb-2"><Link to="/login" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-lock me-2 text-warning"></i>Student Portal Login</Link></li>
                            <li className="mb-2"><Link to="/notice-board" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Notice Board</Link></li>
                            <li className="mb-2"><Link to="/news" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>News & Updates</Link></li>
                            <li className="mb-2"><Link to="/gallery" className="text-light text-decoration-none opacity-80 hover-opacity-100"><i className="fas fa-angle-right me-2 text-warning"></i>Campus Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Administration (From Image 2) */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="fw-bold text-uppercase text-warning mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Contact Directory
                        </h6>
                        <ul className="list-unstyled text-light opacity-80 small" style={{ lineHeight: 1.8 }}>
                            <li className="mb-2">
                                <i className="fas fa-map-marker-alt me-2 text-warning"></i>
                                Nyamityobora, Kakoba Division, Mbarara City (200m off Mbarara-Masaka Highway)
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-mail-bulk me-2 text-warning"></i>
                                P.O. Box 177267, Mbarara, Uganda
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-phone-alt me-2 text-warning"></i>
                                <a href="tel:+256393256879" className="text-light text-decoration-none">+256 393 256879</a>
                            </li>
                            <li className="mb-2">
                                <i className="fab fa-whatsapp me-2 text-warning"></i>
                                <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none">+256 787 803099</a>
                            </li>
                            <li>
                                <i className="fas fa-envelope me-2 text-warning"></i>
                                <a href="mailto:combridgecentre@gmail.com" className="text-light text-decoration-none">combridgecentre@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary my-4" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
                    <p className="mb-2 mb-md-0">
                        &copy; {year} COMBRIDGE INSTITUTE OF HEALTH MANAGEMENT SCIENCES. Registered with URSB. All rights reserved.
                    </p>
                    <p className="mb-0">
                        Motto: <span className="text-warning">"Enriching The Future and Potentials"</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
