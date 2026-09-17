import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Academics() {
    const { subpage } = useParams();
    const defaultTab = subpage || 'science-technology';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (subpage) {
            setActiveTab(subpage);
        }
    }, [subpage]);

    return (
        <div className="academics-page">
            {/* Banner */}
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Academics</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Academic Faculties & Resources</h2>
                            <p className="mb-0 text-white-50 small">Accredited Diplomas, Certificates, Practical Curricula</p>
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
                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Faculties & Schools
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'science-technology' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('science-technology')}
                                >
                                    <i className="fas fa-microchip me-2"></i>Science & Technology
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'business-socialsciences' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('business-socialsciences')}
                                >
                                    <i className="fas fa-chart-line me-2"></i>Business & Management
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'vocational-trades' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('vocational-trades')}
                                >
                                    <i className="fas fa-tools me-2"></i>Technical & Trades
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Academic Resources
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'library' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('library')}
                                >
                                    <i className="fas fa-book me-2"></i>Polytechnic Library
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'elearning' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('elearning')}
                                >
                                    <i className="fas fa-laptop me-2"></i>E-Learning Portal
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'repository' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('repository')}
                                >
                                    <i className="fas fa-database me-2"></i>Digital Repository
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Schedules & Programs
                            </h6>
                            <div className="nav flex-column nav-pills">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'academic-calendar' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('academic-calendar')}
                                >
                                    <i className="fas fa-calendar-alt me-2"></i>Academic Calendar
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'timetable' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('timetable')}
                                >
                                    <i className="fas fa-clock me-2"></i>Teaching Timetable
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                            {/* Faculty of Science & Tech */}
                            {activeTab === 'science-technology' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Faculty of Science & Information Technology</h3>
                                            <small className="text-muted">Computing, Software Systems, Telecommunications</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        The Faculty of Science & Technology prepares students to pioneer and navigate the 4th Industrial Revolution through practical coding, hardware diagnostics, and networking.
                                    </p>
                                    <h5 className="fw-bold text-primary mt-4 mb-3">Offered Programmes</h5>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle border">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Programme Title</th>
                                                    <th>Award Level</th>
                                                    <th>Duration</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Information Technology (DIT)</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years (4 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Computer Science & Networking</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years (4 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Certificate in Information & Comm. Tech (CICT)</td>
                                                    <td><span className="badge bg-primary">Certificate</span></td>
                                                    <td>1 Year (2 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Software Development & Web Design</td>
                                                    <td><span className="badge bg-info text-dark">Certificate</span></td>
                                                    <td>6 Months</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Faculty of Business */}
                            {activeTab === 'business-socialsciences' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Faculty of Business & Social Sciences</h3>
                                            <small className="text-muted">Accountancy, Procurement, Marketing & Entrepreneurship</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        Empowering modern business managers and startup founders with modern accounting software, procurement law, taxation, and digital marketing acumen.
                                    </p>
                                    <h5 className="fw-bold text-primary mt-4 mb-3">Offered Programmes</h5>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle border">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Programme Title</th>
                                                    <th>Award Level</th>
                                                    <th>Duration</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Business Administration (DBA)</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years (4 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Accounting & Finance</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years (4 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Procurement & Supply Chain Management</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years (4 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Certificate in Business Studies (CBS)</td>
                                                    <td><span className="badge bg-primary">Certificate</span></td>
                                                    <td>1 Year (2 Sems)</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Vocational Trades */}
                            {activeTab === 'vocational-trades' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">School of Technical & Vocational Trades</h3>
                                            <small className="text-muted">Electrical Engineering, Automotive, Welding & Civil Works</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        Direct hands-on craftsmanship in heavy machinery, electrical power wiring, automotive systems, welding, fabrication, and plumbing.
                                    </p>
                                    <h5 className="fw-bold text-primary mt-4 mb-3">Workshop Trades</h5>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle border">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Trade Specialization</th>
                                                    <th>Award Level</th>
                                                    <th>Duration</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Electrical & Electronics Engineering</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Diploma in Mechanical & Automotive Engineering</td>
                                                    <td><span className="badge bg-success">Diploma</span></td>
                                                    <td>2 Years</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">National Certificate in Electrical Installation</td>
                                                    <td><span className="badge bg-primary">Certificate</span></td>
                                                    <td>2 Years</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">National Certificate in Welding & Metal Fabrication</td>
                                                    <td><span className="badge bg-primary">Certificate</span></td>
                                                    <td>2 Years</td>
                                                    <td><Link to="/admissions/apply" className="btn btn-sm btn-outline-success">Apply</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Library & E-Learning */}
                            {['library', 'elearning', 'repository'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Digital & Physical Research Facilities</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 mb-4 border">
                                        <h5 className="fw-bold text-success"><i className="fas fa-wifi me-2"></i>Digital Access & E-Resources</h5>
                                        <p className="text-muted mb-3">
                                            The Combridge Library is equipped with open-access research workstations, subscriptions to international engineering journals, IEEE papers, and automated catalog systems.
                                        </p>
                                        <div className="d-flex flex-wrap gap-2">
                                            <a href="#" className="btn btn-sm btn-primary"><i className="fas fa-external-link-alt me-1"></i>Access E-Catalog</a>
                                            <a href="#" className="btn btn-sm btn-outline-secondary"><i className="fas fa-download me-1"></i>Past Exam Papers</a>
                                            <Link to="/login" className="btn btn-sm btn-success"><i className="fas fa-lock me-1"></i>E-Learning Login</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Academic Calendar & Timetable */}
                            {['academic-calendar', 'timetable'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Current Academic Year 2026/2027 Schedule</small>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead className="table-success">
                                                <tr>
                                                    <th>Event / Activity</th>
                                                    <th>Dates</th>
                                                    <th>Target Groups</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Semester 1 Commencement & Orientation</td>
                                                    <td>August 25 - September 5, 2026</td>
                                                    <td>All New & Continuing Students</td>
                                                </tr>
                                                <tr>
                                                    <td>Normal Lectures & Workshop Practicals</td>
                                                    <td>September 8 - November 28, 2026</td>
                                                    <td>All Faculties</td>
                                                </tr>
                                                <tr>
                                                    <td>Mid-Semester Assessment Tests (Coursework)</td>
                                                    <td>October 20 - October 25, 2026</td>
                                                    <td>All Classes</td>
                                                </tr>
                                                <tr>
                                                    <td>End of Semester Examinations</td>
                                                    <td>December 1 - December 18, 2026</td>
                                                    <td>All Candidates</td>
                                                </tr>
                                                <tr>
                                                    <td>Annual Graduation Ceremony</td>
                                                    <td>December 22, 2026</td>
                                                    <td>Graduands & Guests</td>
                                                </tr>
                                            </tbody>
                                        </table>
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
