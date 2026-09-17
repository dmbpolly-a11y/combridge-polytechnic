import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        department: 'Admissions & Inquiries',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Contact Us</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Contact Combridge Polytechnic</h2>
                            <p className="mb-0 text-white-50 small">We are here to answer your questions and welcome you to campus</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-map-marker-alt fa-2x text-danger"></i>
                            </div>
                            <h5 className="fw-bold">Main Campus</h5>
                            <p className="text-muted small mb-0">
                                Combridge Centre for Polytechnic Studies<br />
                                Kampala, Uganda<br />
                                P.O. Box 000, Kampala
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-phone-alt fa-2x text-success"></i>
                            </div>
                            <h5 className="fw-bold">Telephone Contacts</h5>
                            <p className="text-muted small mb-0">
                                <strong>Admissions Office:</strong> (+256) 700 000 000<br />
                                <strong>Registrar Helpline:</strong> (+256) 705 706 680<br />
                                <strong>Accounts / Bursar:</strong> (+256) 800 000 000
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-envelope fa-2x text-primary"></i>
                            </div>
                            <h5 className="fw-bold">Email & Online</h5>
                            <p className="text-muted small mb-0">
                                <strong>General:</strong> info@combridge.ac.ug<br />
                                <strong>Admissions:</strong> admissions@combridge.ac.ug<br />
                                <strong>Website:</strong> www.combridge.ac.ug
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h4 className="fw-bold text-success mb-2">Send Us an Inquiry</h4>
                            <p className="text-muted small mb-4">
                                Fill out the form below and an admissions counselor or departmental head will reach back promptly.
                            </p>

                            {submitted ? (
                                <div className="alert alert-success p-4 text-center">
                                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                                    <h5 className="fw-bold">Thank You for Reaching Out!</h5>
                                    <p className="mb-0">Your inquiry has been received. Our administration will contact you via email or telephone shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Full Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="e.g. Ronald Kigozi"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Email Address *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="e.g. name@example.com"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Phone Number *</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+256 7..."
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Department / Topic</label>
                                            <select
                                                className="form-select"
                                                value={form.department}
                                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                            >
                                                <option value="Admissions & Inquiries">Admissions & New Inquiries</option>
                                                <option value="Academic Registrar">Academic Registrar (Results/Transcripts)</option>
                                                <option value="Bursar & Fees">Bursar (Fees Payment & Balances)</option>
                                                <option value="Technical Trades">Technical & Engineering Workshops</option>
                                                <option value="General Administration">General Administration</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Your Message *</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                required
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder="Please describe your question or inquiry in detail..."
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success fw-bold px-4 py-2">
                                                <i className="fas fa-paper-plane me-2"></i>Submit Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-light d-flex flex-column justify-content-between">
                            <div>
                                <div className="text-center mb-3">
                                    <img
                                        src="/images/logocom.png"
                                        alt="Logo"
                                        style={{ height: 80, objectFit: 'contain' }}
                                    />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Office Working Hours</h5>
                                <ul className="list-unstyled small text-muted mb-4" style={{ lineHeight: 2 }}>
                                    <li><strong>Monday &ndash; Friday:</strong> 8:00 AM &ndash; 5:00 PM</li>
                                    <li><strong>Saturday (Weekend Program):</strong> 8:30 AM &ndash; 4:00 PM</li>
                                    <li><strong>Sunday & Public Holidays:</strong> Closed</li>
                                </ul>

                                <h5 className="fw-bold text-dark mb-2">Campus Location Guide</h5>
                                <p className="small text-muted mb-0">
                                    Our campus is centrally located with easily accessible public transport routes, ample secure student parking, and welcoming administration gates.
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-top">
                                <Link to="/admissions/apply" className="btn btn-warning w-100 fw-bold text-dark">
                                    <i className="fas fa-edit me-2"></i>Apply Online for Admission
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
