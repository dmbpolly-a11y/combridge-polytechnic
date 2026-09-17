import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Admissions() {
    const { subpage } = useParams();
    const defaultTab = subpage || 'admission-requirements';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (subpage) {
            setActiveTab(subpage);
        }
    }, [subpage]);

    return (
        <div className="admissions-page">
            {/* Banner */}
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #E27032 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Admissions</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Admissions & Study Programs</h2>
                            <p className="mb-0 text-white-50 small">Join Combridge Polytechnic — Start Your Practical Technical Career</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Sidebar Nav */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '80px' }}>
                            <div className="mb-3">
                                <Link to="/admissions/apply" className="btn btn-warning w-100 fw-bold text-dark shadow-sm">
                                    <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                                </Link>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Programs Offered
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'diploma-courses' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('diploma-courses')}
                                >
                                    <i className="fas fa-graduation-cap me-2"></i>Diploma Programmes
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'undergraduate-courses' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('undergraduate-courses')}
                                >
                                    <i className="fas fa-certificate me-2"></i>Certificate Courses
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'short-courses' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('short-courses')}
                                >
                                    <i className="fas fa-laptop-code me-2"></i>Short & Skill Courses
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Entry Requirements
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'admission-requirements' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('admission-requirements')}
                                >
                                    <i className="fas fa-clipboard-check me-2"></i>Requirements
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'fees-structure' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('fees-structure')}
                                >
                                    <i className="fas fa-money-bill-wave me-2"></i>Fees Structure
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'call-for-application' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('call-for-application')}
                                >
                                    <i className="fas fa-bullhorn me-2"></i>Call for Applications
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'application-form' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('application-form')}
                                >
                                    <i className="fas fa-file-pdf me-2"></i>Download Forms
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                How to Apply
                            </h6>
                            <div className="nav flex-column nav-pills">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'online-application-guidelines' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('online-application-guidelines')}
                                >
                                    <i className="fas fa-info-circle me-2"></i>Application Guidelines
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'scholarships' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('scholarships')}
                                >
                                    <i className="fas fa-award me-2"></i>Scholarships & Bursaries
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                            {/* Admission Requirements */}
                            {activeTab === 'admission-requirements' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">General Admission Requirements</h3>
                                            <small className="text-muted">Criteria for Ugandan and International Applicants</small>
                                        </div>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="card h-100 border p-3">
                                                <h5 className="fw-bold text-primary mb-2"><i className="fas fa-graduation-cap me-2"></i>Diploma Programmes</h5>
                                                <ul className="small text-muted mb-0" style={{ lineHeight: 1.8 }}>
                                                    <li>Uganda Advanced Certificate of Education (UACE) with at least <strong>1 Principal Pass</strong> and <strong>2 Subsidiary Passes</strong> in relevant subjects, OR</li>
                                                    <li>A recognized Certificate in a related technical/business discipline from an accredited institution.</li>
                                                    <li>O-Level (UCE) certificate with at least 5 passes including English and Mathematics.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card h-100 border p-3">
                                                <h5 className="fw-bold text-success mb-2"><i className="fas fa-certificate me-2"></i>Certificate Programmes</h5>
                                                <ul className="small text-muted mb-0" style={{ lineHeight: 1.8 }}>
                                                    <li>Uganda Certificate of Education (UCE / O-Level) with at least <strong>5 passes</strong> obtained at the same sitting, OR</li>
                                                    <li>Equivalent qualification recognized by the National Curriculum Development Centre / Ministry of Education.</li>
                                                    <li>Passes in English, Mathematics and relevant science or technical subjects are an added advantage.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-light rounded-3 border">
                                        <h5 className="fw-bold text-dark mb-2">Required Application Documents</h5>
                                        <ul className="text-muted small mb-0">
                                            <li>Duly completed Combridge Polytechnic application form (online or hardcopy).</li>
                                            <li>Certified photocopies of UCE & UACE pass slips or equivalent transcripts.</li>
                                            <li>Four (4) recent identical passport size color photographs.</li>
                                            <li>Photocopy of National ID or Passport (for international students).</li>
                                            <li>Copy of bank slip or mobile receipt for non-refundable application fee (UGX 30,000).</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Fees Structure */}
                            {activeTab === 'fees-structure' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Approved Fees Structure (2026/2027)</h3>
                                            <small className="text-muted">Tuition, Functional Fees & Payment Breakdown</small>
                                        </div>
                                    </div>
                                    <div className="table-responsive mb-4">
                                        <table className="table table-hover table-bordered align-middle">
                                            <thead className="table-success">
                                                <tr>
                                                    <th>Programme Category</th>
                                                    <th>Tuition Per Semester (UGX)</th>
                                                    <th>Functional Fees</th>
                                                    <th>Total / Semester</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">Diploma in IT & Computing Sciences</td>
                                                    <td>650,000</td>
                                                    <td>180,000</td>
                                                    <td className="fw-bold text-success">UGX 830,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Electrical / Mechanical Engineering</td>
                                                    <td>700,000</td>
                                                    <td>220,000</td>
                                                    <td className="fw-bold text-success">UGX 920,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Business Administration / Finance</td>
                                                    <td>550,000</td>
                                                    <td>150,000</td>
                                                    <td className="fw-bold text-success">UGX 700,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">National Certificates (Electrical, Welding, Plumbing)</td>
                                                    <td>480,000</td>
                                                    <td>160,000</td>
                                                    <td className="fw-bold text-success">UGX 640,000</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Certificate in Information Technology (CICT)</td>
                                                    <td>450,000</td>
                                                    <td>140,000</td>
                                                    <td className="fw-bold text-success">UGX 590,000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="alert alert-info py-2 small">
                                        <i className="fas fa-info-circle me-1"></i> Tuition can be paid in three (3) flexible installments per semester. Contact the Bursar's Office for payment advice slips.
                                    </div>
                                </div>
                            )}

                            {/* Call for Application */}
                            {activeTab === 'call-for-application' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Call for Applications: 2026/2027 Intakes</h3>
                                            <small className="text-muted">August/September and January Semester Intakes</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        The Academic Registrar, Combridge Centre for Polytechnic Studies, invites applications for admission into undergraduate Diploma, National Certificate, and Professional Short Courses.
                                    </p>
                                    <div className="p-4 bg-light rounded-3 border mb-3">
                                        <h5 className="fw-bold text-dark mb-2">Key Admission Dates</h5>
                                        <ul className="text-muted small mb-0">
                                            <li><strong>Application Deadline:</strong> Open throughout the current intake cycle.</li>
                                            <li><strong>Orientation Week:</strong> Begins last week of August.</li>
                                            <li><strong>Study Shifts:</strong> Day, Evening, and Weekend (In-Service) schedules available.</li>
                                        </ul>
                                    </div>
                                    <Link to="/admissions/apply" className="btn btn-warning fw-bold text-dark">
                                        <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                                    </Link>
                                </div>
                            )}

                            {/* Download Forms */}
                            {activeTab === 'application-form' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Download Printable Application Forms</h3>
                                            <small className="text-muted">PDF application forms for offline submission</small>
                                        </div>
                                    </div>
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="fw-bold mb-1"><i className="fas fa-file-pdf text-danger me-2"></i>Diploma & Certificate Application Form (2026/2027)</h6>
                                                <small className="text-muted">Official standard admission application form in printable PDF format.</small>
                                            </div>
                                            <a href="/images/2464-Article Text-6965-2-10-20241129.pdf" download className="btn btn-sm btn-outline-success">
                                                <i className="fas fa-download me-1"></i>Download PDF
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Guidelines & Scholarships */}
                            {['online-application-guidelines', 'scholarships', 'diploma-courses', 'undergraduate-courses', 'short-courses'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Admissions & Student Financial Assistance</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 border">
                                        <h5 className="fw-bold text-dark mb-2">Step-by-Step Guidance</h5>
                                        <p className="text-muted small mb-3">
                                            Combridge Polytechnic maintains an open-door policy providing bursaries, corporate sponsorships, and practical enrollment assistance to all qualifying applicants.
                                        </p>
                                        <div className="d-flex gap-2">
                                            <Link to="/admissions/apply" className="btn btn-sm btn-success">Fill Online Application Form</Link>
                                            <Link to="/contact" className="btn btn-sm btn-outline-primary">Contact Admissions Officer</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
