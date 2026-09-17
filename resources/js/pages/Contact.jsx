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
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #004d28 0%, #006837 50%, #051566 100%)' }}>
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
                            style={{ height: 65, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Contact Combridge Institute</h2>
                            <p className="mb-0 text-white-50 small">
                                Combridge Institute of Health Management Sciences — <em>"Enriching The Future and Potentials"</em>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4 mb-5">
                    {/* Location Card */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-map-marker-alt fa-2x text-danger"></i>
                            </div>
                            <h5 className="fw-bold">Physical Location</h5>
                            <p className="text-muted small mb-0">
                                <strong>Nyamityobora, Kakoba Division</strong><br />
                                Mbarara City, Uganda<br />
                                <span className="text-success fw-semibold">200 meters off Mbarara-Masaka Highway</span><br />
                                <strong>P.O. Box 177267, Mbarara</strong>
                            </p>
                        </div>
                    </div>

                    {/* Telephone Card */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-phone-alt fa-2x text-success"></i>
                            </div>
                            <h5 className="fw-bold">Telephone & WhatsApp</h5>
                            <p className="text-muted small mb-0">
                                <strong>Official Line:</strong> <a href="tel:+256393256879" className="text-decoration-none text-dark">+256 393 256879</a><br />
                                <strong>WhatsApp Helpline:</strong> <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-success fw-bold">+256 787 803099</a><br />
                                <strong>Admissions Desk:</strong> Monday – Saturday (8:00 AM – 5:00 PM)
                            </p>
                        </div>
                    </div>

                    {/* Email Card */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <i className="fas fa-envelope fa-2x text-primary"></i>
                            </div>
                            <h5 className="fw-bold">Email & Registration</h5>
                            <p className="text-muted small mb-0">
                                <strong>Direct Email:</strong> <a href="mailto:combridgecentre@gmail.com" className="text-decoration-none text-success">combridgecentre@gmail.com</a><br />
                                <strong>Subsidiary of:</strong> Combridge Centre for Polytechnic Studies<br />
                                <strong>Accreditation:</strong> Registered with Uganda Registration Services Bureau (URSB)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h4 className="fw-bold text-success mb-2">Send Us an Inquiry</h4>
                            <p className="text-muted small mb-4">
                                Fill out the form below and an admissions counselor or departmental coordinator will reach back promptly.
                            </p>

                            {submitted ? (
                                <div className="alert alert-success p-4 text-center">
                                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                                    <h5 className="fw-bold">Thank You for Reaching Out!</h5>
                                    <p className="mb-0">Your inquiry has been received. Our administration in Mbarara will contact you via email or telephone shortly.</p>
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
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Telephone / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                required
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+256 700 000000"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Area of Interest</label>
                                            <select
                                                className="form-select"
                                                value={form.department}
                                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                            >
                                                <option>Clinical and Medical Training</option>
                                                <option>Research and Academic Development</option>
                                                <option>Life Skills Coaching (Russian, Chinese, French, etc.)</option>
                                                <option>Entrepreneurship & Skills Development</option>
                                                <option>Training & Institutional Growth</option>
                                                <option>Partnerships & Collaborations</option>
                                                <option>Admissions & General Inquiries</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Your Message *</label>
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                required
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder="Please specify the training course or advisory service you are interested in..."
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success px-4 py-2 fw-bold">
                                                <i className="fas fa-paper-plane me-2"></i>Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #004d28 0%, #006837 100%)' }}>
                            <h4 className="fw-bold mb-3 text-warning">Quick Campus Info</h4>
                            <p className="small opacity-90 mb-4">
                                Combridge Institute of Health Management Sciences is readily accessible in Mbarara City, welcoming prospective trainees, healthcare interns, and research partners.
                            </p>

                            <div className="mb-3 d-flex gap-3">
                                <i className="fas fa-clock fa-lg text-warning mt-1"></i>
                                <div>
                                    <h6 className="fw-bold mb-0">Office Hours</h6>
                                    <small className="opacity-75">Mon – Fri: 8:00 AM – 5:00 PM<br />Sat: 9:00 AM – 1:00 PM</small>
                                </div>
                            </div>

                            <div className="mb-3 d-flex gap-3">
                                <i className="fas fa-directions fa-lg text-warning mt-1"></i>
                                <div>
                                    <h6 className="fw-bold mb-0">Campus Directions</h6>
                                    <small className="opacity-75">Located at Nyamityobora, Kakoba Division, Mbarara City, 200m off Mbarara-Masaka Highway.</small>
                                </div>
                            </div>

                            <div className="mb-4 d-flex gap-3">
                                <i className="fab fa-whatsapp fa-lg text-warning mt-1"></i>
                                <div>
                                    <h6 className="fw-bold mb-0">Direct WhatsApp Support</h6>
                                    <small className="opacity-75">+256 787 803099 (Instant Chat for Admissions)</small>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-top border-white-50">
                                <a
                                    href="https://wa.me/256787803099"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-warning w-100 fw-bold text-dark"
                                >
                                    <i className="fab fa-whatsapp me-2"></i>Message Us on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
