import { Link } from 'react-router-dom';

/**
 * Site-wide footer matching the Blade layout design.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row g-4">
                    {/* About */}
                    <div className="col-md-4">
                        <h5>Combridge Polytechnic</h5>
                        <p className="text-light opacity-75" style={{ fontSize: '0.9rem' }}>
                            Providing quality technical and vocational education since 2010.
                            Empowering students with skills for a better future.
                        </p>
                        <div className="social-links mt-3">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <a href="/#about">About Us</a>
                            <a href="/#programmes">Programmes</a>
                            <a href="/#admissions">Admissions</a>
                            <a href="/#contact">Contact</a>
                            <Link to="/login">Student / Staff Login</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="col-md-4">
                        <h5>Contact Information</h5>
                        <p className="text-light opacity-75" style={{ fontSize: '0.9rem', lineHeight: 2 }}>
                            <i className="fas fa-map-marker-alt me-2 text-warning"></i>
                            Kampala, Uganda<br />
                            <i className="fas fa-phone me-2 text-warning"></i>
                            +256 700 000 000<br />
                            <i className="fas fa-phone me-2 text-warning"></i>
                            +256 800 000 000<br />
                            <i className="fas fa-envelope me-2 text-warning"></i>
                            info@combridge.ac.ug
                        </p>
                    </div>
                </div>

                <hr className="mt-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <div className="text-center pb-2">
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.85rem' }}>
                        &copy; {year} Combridge Centre for Polytechnic Studies. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
