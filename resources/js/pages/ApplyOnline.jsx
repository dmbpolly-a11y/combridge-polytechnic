import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ApplyOnline() {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [appNumber, setAppNumber] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        gender: 'Male',
        dob: '',
        nationality: 'Ugandan',
        phone: '',
        email: '',
        address: '',
        level: 'Diploma',
        programme: 'Diploma in Information Technology',
        shift: 'Day',
        uceSchool: '',
        uceYear: '',
        uaceSchool: '',
        uaceYear: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const rand = 'CP-' + Math.floor(100000 + Math.random() * 900000);
        setAppNumber(rand);
        setSubmitted(true);
    };

    return (
        <div className="apply-online-page">
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #E27032 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/admissions" className="text-white-50">Admissions</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Apply Online</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Online Admission Application Portal</h2>
                            <p className="mb-0 text-white-50 small">Academic Year 2026/2027 Enrollment</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                            {submitted ? (
                                <div className="text-center py-4">
                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                                        <i className="fas fa-check fa-3x"></i>
                                    </div>
                                    <h3 className="fw-bold text-success mb-2">Application Submitted Successfully!</h3>
                                    <p className="lead text-muted mb-4">
                                        Your application reference number is: <strong className="text-dark bg-light px-3 py-1 rounded border">{appNumber}</strong>
                                    </p>
                                    <div className="alert alert-info text-start p-3 mb-4 small">
                                        <h6 className="fw-bold mb-1"><i className="fas fa-info-circle me-1"></i>Next Steps:</h6>
                                        <ul className="mb-0">
                                            <li>A confirmation has been recorded for <strong>{form.fullName}</strong>.</li>
                                            <li>Please present original academic documents and proof of application fee payment to the Academic Registrar during admission verification.</li>
                                            <li>Keep your application number handy for admission status checks.</li>
                                        </ul>
                                    </div>
                                    <div className="d-flex justify-content-center gap-3">
                                        <Link to="/" className="btn btn-outline-success">Return to Homepage</Link>
                                        <Link to="/login" className="btn btn-success">Go to Portal</Link>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* Progress Indicator */}
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge ${step === 1 ? 'bg-success' : 'bg-secondary'}`}>Step 1</span>
                                            <small className="fw-bold">Bio Data</small>
                                        </div>
                                        <i className="fas fa-chevron-right text-muted small"></i>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge ${step === 2 ? 'bg-success' : 'bg-secondary'}`}>Step 2</span>
                                            <small className="fw-bold">Programme</small>
                                        </div>
                                        <i className="fas fa-chevron-right text-muted small"></i>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge ${step === 3 ? 'bg-success' : 'bg-secondary'}`}>Step 3</span>
                                            <small className="fw-bold">Academics</small>
                                        </div>
                                    </div>

                                    {/* Step 1 */}
                                    {step === 1 && (
                                        <form onSubmit={handleNext}>
                                            <h5 className="fw-bold text-success mb-3">1. Personal & Contact Information</h5>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label small fw-semibold">Full Legal Name *</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        className="form-control"
                                                        required
                                                        value={form.fullName}
                                                        onChange={handleChange}
                                                        placeholder="As appearing on UNEB / academic documents"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Gender *</label>
                                                    <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Date of Birth *</label>
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        className="form-control"
                                                        required
                                                        value={form.dob}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Telephone Number *</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        className="form-control"
                                                        required
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        placeholder="+256 7..."
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        required
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="name@example.com"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-semibold">Home Address / Location</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        value={form.address}
                                                        onChange={handleChange}
                                                        placeholder="e.g. Kampala, Wakiso, Mukono"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 text-end">
                                                <button type="submit" className="btn btn-success px-4 fw-bold">
                                                    Next Step <i className="fas fa-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Step 2 */}
                                    {step === 2 && (
                                        <form onSubmit={handleNext}>
                                            <h5 className="fw-bold text-success mb-3">2. Desired Programme of Study</h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Level of Study *</label>
                                                    <select name="level" className="form-select" value={form.level} onChange={handleChange}>
                                                        <option value="Diploma">Diploma Programme (2 Years)</option>
                                                        <option value="Certificate">Certificate Programme (1-2 Years)</option>
                                                        <option value="Short Course">Short / Professional Course</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">Preferred Study Shift *</label>
                                                    <select name="shift" className="form-select" value={form.shift} onChange={handleChange}>
                                                        <option value="Day">Day Program</option>
                                                        <option value="Evening">Evening Program</option>
                                                        <option value="Weekend">Weekend / In-Service</option>
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-semibold">Choose Programme *</label>
                                                    <select name="programme" className="form-select" value={form.programme} onChange={handleChange}>
                                                        <option value="Diploma in Information Technology">Diploma in Information Technology (DIT)</option>
                                                        <option value="Diploma in Computer Science & Networking">Diploma in Computer Science & Networking</option>
                                                        <option value="Diploma in Electrical Engineering">Diploma in Electrical & Electronics Engineering</option>
                                                        <option value="Diploma in Mechanical & Automotive Engineering">Diploma in Mechanical & Automotive Engineering</option>
                                                        <option value="Diploma in Business Administration">Diploma in Business Administration (DBA)</option>
                                                        <option value="Diploma in Accounting & Finance">Diploma in Accounting & Finance</option>
                                                        <option value="National Certificate in Electrical Installation">National Certificate in Electrical Installation</option>
                                                        <option value="National Certificate in Welding & Fabrication">National Certificate in Welding & Fabrication</option>
                                                        <option value="Certificate in Information & Comm. Tech">Certificate in Information & Comm. Tech (CICT)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-4 d-flex justify-content-between">
                                                <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                                                    <i className="fas fa-arrow-left me-2"></i>Back
                                                </button>
                                                <button type="submit" className="btn btn-success px-4 fw-bold">
                                                    Next Step <i className="fas fa-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Step 3 */}
                                    {step === 3 && (
                                        <form onSubmit={handleSubmit}>
                                            <h5 className="fw-bold text-success mb-3">3. Educational Background</h5>
                                            <div className="row g-3">
                                                <div className="col-md-8">
                                                    <label className="form-label small fw-semibold">O-Level (UCE) School Attended *</label>
                                                    <input
                                                        type="text"
                                                        name="uceSchool"
                                                        className="form-control"
                                                        required
                                                        value={form.uceSchool}
                                                        onChange={handleChange}
                                                        placeholder="Name of Secondary School"
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-semibold">Year Completed *</label>
                                                    <input
                                                        type="number"
                                                        name="uceYear"
                                                        className="form-control"
                                                        required
                                                        value={form.uceYear}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 2023"
                                                    />
                                                </div>
                                                <div className="col-md-8">
                                                    <label className="form-label small fw-semibold">A-Level (UACE) / Prior College School</label>
                                                    <input
                                                        type="text"
                                                        name="uaceSchool"
                                                        className="form-control"
                                                        value={form.uaceSchool}
                                                        onChange={handleChange}
                                                        placeholder="Optional if applying for Certificate"
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-semibold">Year Completed</label>
                                                    <input
                                                        type="number"
                                                        name="uaceYear"
                                                        className="form-control"
                                                        value={form.uaceYear}
                                                        onChange={handleChange}
                                                        placeholder="e.g. 2025"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-3 bg-light rounded-3 my-4 small text-muted border">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="declaration" required />
                                                    <label className="form-check-label text-dark" htmlFor="declaration">
                                                        I certify that all information submitted in this application is accurate and complete to the best of my knowledge.
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
                                                    <i className="fas fa-arrow-left me-2"></i>Back
                                                </button>
                                                <button type="submit" className="btn btn-warning px-4 fw-bold text-dark">
                                                    <i className="fas fa-paper-plane me-2"></i>Complete & Submit Application
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
