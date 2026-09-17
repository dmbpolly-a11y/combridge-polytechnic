import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Students() {
    const { subpage } = useParams();
    const defaultTab = subpage || 'life-at-campus';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (subpage) {
            setActiveTab(subpage);
        }
    }, [subpage]);

    return (
        <div className="students-page">
            {/* Banner */}
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #157347 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Students</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Student Affairs & Campus Life</h2>
                            <p className="mb-0 text-white-50 small">Vibrant community, student guilds, sports, welfare & support services</p>
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
                                Student Life
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'life-at-campus' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('life-at-campus')}
                                >
                                    <i className="fas fa-home me-2"></i>Life at Campus
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'students-guild' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('students-guild')}
                                >
                                    <i className="fas fa-vote-yea me-2"></i>Students' Guild
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'games-sports' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('games-sports')}
                                >
                                    <i className="fas fa-futbol me-2"></i>Games & Sports
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'student-union-clubs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('student-union-clubs')}
                                >
                                    <i className="fas fa-users me-2"></i>Clubs & Societies
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'alumni' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('alumni')}
                                >
                                    <i className="fas fa-user-graduate me-2"></i>Alumni Association
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Student Services
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'computing-services' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('computing-services')}
                                >
                                    <i className="fas fa-laptop me-2"></i>Computing & ICT
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'university-health-services' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('university-health-services')}
                                >
                                    <i className="fas fa-heartbeat me-2"></i>Health Services
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'university-security' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('university-security')}
                                >
                                    <i className="fas fa-shield-alt me-2"></i>Campus Security
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'financial-aid' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('financial-aid')}
                                >
                                    <i className="fas fa-hand-holding-usd me-2"></i>Financial Aid
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'religion-and-spirituality' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('religion-and-spirituality')}
                                >
                                    <i className="fas fa-pray me-2"></i>Chaplaincy & Spiritual Care
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Key Links
                            </h6>
                            <div className="nav flex-column nav-pills">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'dean-of-students' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('dean-of-students')}
                                >
                                    <i className="fas fa-user-friends me-2"></i>Dean of Students
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'admission-lists' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('admission-lists')}
                                >
                                    <i className="fas fa-list-alt me-2"></i>Admission Lists
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'graduation-requirements' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('graduation-requirements')}
                                >
                                    <i className="fas fa-graduation-cap me-2"></i>Graduation Clearance
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                            {/* Life at Campus */}
                            {activeTab === 'life-at-campus' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Life at Combridge Polytechnic</h3>
                                            <small className="text-muted">A dynamic environment of learning, friendship, and innovation</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        Campus life at Combridge is vibrant, collaborative, and rewarding. Students from diverse backgrounds unite around a shared passion for hands-on skills, technology, and entrepreneurship.
                                    </p>
                                    <div className="row g-3 my-3">
                                        <div className="col-md-6">
                                            <div className="card h-100 border p-3">
                                                <h5 className="fw-bold text-success"><i className="fas fa-coffee me-2"></i>Student Cafeteria & Lounge</h5>
                                                <p className="small text-muted mb-0">Hygienic catering services providing healthy, affordable meals throughout class days and evening revision periods.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card h-100 border p-3">
                                                <h5 className="fw-bold text-primary"><i className="fas fa-wifi me-2"></i>High-Speed Campus Wi-Fi</h5>
                                                <p className="small text-muted mb-0">Free fiber broadband coverage throughout lecture blocks, library reading zones, and open student quadrangle.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Guild */}
                            {activeTab === 'students-guild' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">The Students' Guild</h3>
                                            <small className="text-muted">Democratic Student Leadership & Advocacy</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        The Guild Government is the recognized voice of all students at Combridge Polytechnic, serving as a liaison between the student body, administration, and community.
                                    </p>
                                    <div className="p-4 bg-light rounded-3 border">
                                        <h5 className="fw-bold text-success mb-2">Guild President's Message</h5>
                                        <p className="fst-italic text-muted">
                                            "Welcome to Combridge Polytechnic! Here, leadership is practiced and talent is nurtured. We are dedicated to ensuring a supportive environment where every student thrives academically and socially."
                                        </p>
                                        <div className="mt-3">
                                            <span className="badge bg-success p-2 me-2">Guild Cabinet Office</span>
                                            <span className="badge bg-primary p-2">guild@combridge.ac.ug</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sports & Clubs */}
                            {['games-sports', 'student-union-clubs'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Extracurricular Activities & Sports Excellence</small>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded-3 text-center border">
                                                <i className="fas fa-futbol fa-2x text-success mb-2"></i>
                                                <h6 className="fw-bold">Polytechnic Football Team</h6>
                                                <small className="text-muted">Inter-institutional leagues & championships.</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded-3 text-center border">
                                                <i className="fas fa-volleyball-ball fa-2x text-warning mb-2"></i>
                                                <h6 className="fw-bold">Volleyball & Netball</h6>
                                                <small className="text-muted">Active men and women campus teams.</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded-3 text-center border">
                                                <i className="fas fa-laptop-code fa-2x text-primary mb-2"></i>
                                                <h6 className="fw-bold">Tech Innovators Club</h6>
                                                <small className="text-muted">Robotics, coding hackathons, electronics tinkering.</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {['computing-services', 'university-health-services', 'university-security', 'financial-aid', 'religion-and-spirituality'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Comprehensive Student Welfare Services</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 border">
                                        <h5 className="fw-bold text-dark mb-2">Service Overview</h5>
                                        <p className="text-muted small">
                                            Combridge Polytechnic maintains dedicated facilities including a staffed campus clinic, 24/7 security guard personnel with CCTV monitoring, subsidized computing labs, and faith-based chaplaincy services.
                                        </p>
                                        <div className="mt-3">
                                            <Link to="/contact" className="btn btn-sm btn-success">Inquire With Student Welfare</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admission Lists & Graduation */}
                            {['dean-of-students', 'admission-lists', 'graduation-requirements', 'alumni'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Official Student Affairs Records</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 border mb-3">
                                        <h5 className="fw-bold text-success mb-2">Notice & Guidelines</h5>
                                        <p className="text-muted small mb-3">
                                            Official lists of admitted students, graduation clearances, and alumni registration are updated every semester by the Academic Registrar and Dean of Students.
                                        </p>
                                        <div className="d-flex gap-2">
                                            <Link to="/admissions/apply" className="btn btn-sm btn-warning fw-bold text-dark">Apply for Next Intake</Link>
                                            <Link to="/login" className="btn btn-sm btn-primary">Check Status on Portal</Link>
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
