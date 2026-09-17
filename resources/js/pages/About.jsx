import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function About() {
    const { subpage } = useParams();
    const defaultTab = subpage || 'mission-vision';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (subpage) {
            setActiveTab(subpage);
        }
    }, [subpage]);

    return (
        <div className="about-page">
            {/* Banner */}
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #063121 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">About Combridge</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">About Combridge Polytechnic</h2>
                            <p className="mb-0 text-white-50 small">Development through Skills and Innovation</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body with Sidebar Navigation */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Sidebar Nav */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: '80px' }}>
                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Background
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'mission-vision' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('mission-vision')}
                                >
                                    <i className="fas fa-bullseye me-2"></i>Mission & Vision
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'our-history' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('our-history')}
                                >
                                    <i className="fas fa-history me-2"></i>Our History
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'anthem' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('anthem')}
                                >
                                    <i className="fas fa-music me-2"></i>Polytechnic Anthem
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'rules-regulations' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('rules-regulations')}
                                >
                                    <i className="fas fa-book me-2"></i>Rules & Regulations
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Governance
                            </h6>
                            <div className="nav flex-column nav-pills mb-3">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'chancellor' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('chancellor')}
                                >
                                    <i className="fas fa-user-tie me-2"></i>Chancellor / Patron
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'board-of-directors' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('board-of-directors')}
                                >
                                    <i className="fas fa-users-cog me-2"></i>Board of Trustees
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'university-senate' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('university-senate')}
                                >
                                    <i className="fas fa-university me-2"></i>Academic Senate
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'university-council' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('university-council')}
                                >
                                    <i className="fas fa-gavel me-2"></i>Polytechnic Council
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'university-policies' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('university-policies')}
                                >
                                    <i className="fas fa-shield-alt me-2"></i>Institutional Policies
                                </button>
                            </div>

                            <h6 className="fw-bold text-uppercase text-success mb-2 px-2" style={{ fontSize: '0.75rem', letterSpacing: '0.8px' }}>
                                Management
                            </h6>
                            <div className="nav flex-column nav-pills">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'vice-chancellor' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('vice-chancellor')}
                                >
                                    <i className="fas fa-user-shield me-2"></i>Principal / Head
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'deputy-vice-chancellor' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('deputy-vice-chancellor')}
                                >
                                    <i className="fas fa-user-friends me-2"></i>Deputy Principal
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'academic-registrar' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('academic-registrar')}
                                >
                                    <i className="fas fa-file-signature me-2"></i>Academic Registrar
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'library' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('library')}
                                >
                                    <i className="fas fa-book-reader me-2"></i>Library Administration
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                            {/* Mission & Vision */}
                            {activeTab === 'mission-vision' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Mission, Vision & Core Values</h3>
                                            <small className="text-muted">Guiding Principles of Combridge Polytechnic</small>
                                        </div>
                                    </div>

                                    <div className="row g-4 mb-4">
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-3 h-100 border-start border-4 border-success bg-light shadow-sm">
                                                <h4 className="fw-bold text-success mb-3"><i className="fas fa-eye me-2"></i>VISION</h4>
                                                <p className="lead mb-0 text-dark fw-semibold" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                                                    Empower African and Global Higher Education to Fuel Skilled, Productive Workforces Globally.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-3 h-100 border-start border-4 border-primary bg-light shadow-sm">
                                                <h4 className="fw-bold text-primary mb-3"><i className="fas fa-rocket me-2"></i>MISSION</h4>
                                                <p className="lead mb-0 text-dark fw-semibold" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                                                    Partner With Institutions to Boost Education Quality, Employability and Economic Growth.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="fw-bold mt-4 mb-3" style={{ color: '#006837' }}>CORE VALUES</h4>
                                    <div className="p-3 mb-4 rounded-3 bg-light border-start border-4 border-success">
                                        <p className="fw-bold fs-5 mb-0" style={{ color: '#006837' }}>
                                            Integrity, Innovation, Inclusion and Collaboration for Sustainable Human Capital Development.
                                        </p>
                                    </div>

                                    <h4 className="fw-bold mt-4 mb-3" style={{ color: '#006837' }}>STRATEGIC GOALS</h4>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <div className="card border-0 bg-light p-3 rounded-3 h-100 shadow-sm">
                                                <div className="d-flex gap-2">
                                                    <i className="fas fa-check-circle text-success mt-1"></i>
                                                    <div>
                                                        <h6 className="fw-bold mb-1">Labour Market Alignment</h6>
                                                        <p className="small text-muted mb-0">Achieve A Strong Alignment Between Graduates' Skills, Competencies And The Labour Market Needs.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card border-0 bg-light p-3 rounded-3 h-100 shadow-sm">
                                                <div className="d-flex gap-2">
                                                    <i className="fas fa-check-circle text-success mt-1"></i>
                                                    <div>
                                                        <h6 className="fw-bold mb-1">Financial Independence</h6>
                                                        <p className="small text-muted mb-0">Ensure Graduates Achieve Skills And Financial Independence For Lifelong Success.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="fw-bold mt-4 mb-3" style={{ color: '#006837' }}>STRATEGIC PILLARS AND OBJECTIVES</h4>
                                    <div className="row g-3">
                                        {[
                                            { title: 'Skills Alignment', desc: 'Strengthen Skills aligning graduates with labor market demands.', icon: 'fas fa-tools' },
                                            { title: 'Institutional Capacity', desc: 'Enhance institutional capacity for quality and relevance.', icon: 'fas fa-university' },
                                            { title: 'Human Capital Growth', desc: 'Drive Human Capital growth supporting productivity and economic progress.', icon: 'fas fa-chart-line' },
                                            { title: 'Global Partnerships', desc: 'Foster partnerships that expand opportunities locally and globally.', icon: 'fas fa-globe' },
                                        ].map((v, i) => (
                                            <div key={i} className="col-md-6">
                                                <div className="card border-0 bg-light p-3 rounded-3 h-100 shadow-sm">
                                                    <h6 className="fw-bold text-success mb-1">
                                                        <i className={`${v.icon} me-2 text-warning`}></i>{v.title}
                                                    </h6>
                                                    <p className="small text-muted mb-0">{v.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Our History */}
                            {activeTab === 'our-history' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Our History & Heritage</h3>
                                            <small className="text-muted">A Journey of Educational Empowerment</small>
                                        </div>
                                    </div>
                                    <p className="lead" style={{ color: '#006837' }}>
                                        <strong>COMBRIDGE INSTITUTE OF HEALTH AND MANAGEMENT SCIENCES</strong> is a subsidiary arm of <strong>COMBRIDGE CENTRE FOR POLYTECHNIC STUDIES</strong>.
                                    </p>
                                    <p>
                                        It is a newly established firm located at <strong>Nyamityobora, Kakoba Division, Mbarara City, 200 meters off Mbarara Masaka Highway</strong>. Combridge Centre for Polytechnic Studies is registered with <strong>Uganda Registration Services Bureau (URSB)</strong> as a private organization which is specialized in the Advisory and Consultancy services in the areas of higher education and health sciences sectors.
                                    </p>
                                    <div className="p-4 bg-light rounded-3 my-4 border-start border-4 border-success shadow-sm">
                                        <h6 className="fw-bold mb-2 text-success">Key Areas of Advisory & Professional Expertise</h6>
                                        <ul className="mb-0 small text-dark" style={{ lineHeight: 1.8 }}>
                                            <li><strong>Clinical & Medical Training:</strong> Medical laboratory skills, clinical placements, and patient care mentorship.</li>
                                            <li><strong>Research & Academic Guidance:</strong> Research tutorials, teaching quality enhancement, and academic growth.</li>
                                            <li><strong>Life Skills & Foreign Languages:</strong> Russian, Chinese, French, Spanish, and Portuguese language coaching.</li>
                                            <li><strong>Entrepreneurship:</strong> Practical training to prepare graduates for self-reliance and innovation.</li>
                                            <li><strong>Institutional Growth:</strong> Management, leadership skills, strategic thinking, and corporate branding.</li>
                                            <li><strong>Partnerships & Collaborations:</strong> Connecting students and employers for internships and community development.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Anthem */}
                            {activeTab === 'anthem' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">The Polytechnic Anthem</h3>
                                            <small className="text-muted">Development through Skills and Innovation</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 text-center border">
                                        <h5 className="fw-bold text-success mb-3">Verse 1</h5>
                                        <p className="fst-italic mb-3">
                                            Arise, Combridge, fountain of light,<br />
                                            With skills and vision shining bright.<br />
                                            In truth and honor we shall stand,<br />
                                            To build and bless our motherland.
                                        </p>
                                        <h5 className="fw-bold text-warning mb-3">Chorus</h5>
                                        <p className="fw-bold fst-italic mb-3 text-primary">
                                            Combridge! Combridge! Our pride and praise,<br />
                                            In innovation guide our days.<br />
                                            Hands of labor, minds profound,<br />
                                            Where true technology is found!
                                        </p>
                                        <h5 className="fw-bold text-success mb-3">Verse 2</h5>
                                        <p className="fst-italic mb-0">
                                            From workshop floor to lecture hall,<br />
                                            We answer duty’s sacred call.<br />
                                            With wisdom, faith and diligence,<br />
                                            We forge a future of excellence!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Rules & Regulations */}
                            {activeTab === 'rules-regulations' && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success">Rules & Regulations</h3>
                                            <small className="text-muted">Code of Discipline and Academic Conduct</small>
                                        </div>
                                    </div>
                                    <p className="text-muted">
                                        To maintain academic excellence, mutual respect, and safe workshop operations, all students must adhere to the institutional code:
                                    </p>
                                    <div className="accordion" id="rulesAccordion">
                                        <div className="card mb-2 border">
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold text-success"><i className="fas fa-user-clock me-2"></i>1. Attendance & Punctuality</h6>
                                                <p className="small text-muted mb-0">Students must maintain at least 80% lecture and workshop attendance to be eligible for semester examinations. Punctuality is required for all laboratory practicals.</p>
                                            </div>
                                        </div>
                                        <div className="card mb-2 border">
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold text-success"><i className="fas fa-hard-hat me-2"></i>2. Workshop Safety & Attire</h6>
                                                <p className="small text-muted mb-0">Protective overalls, safety boots, and goggles must be worn during mechanical, electrical, and welding practical sessions without exception.</p>
                                            </div>
                                        </div>
                                        <div className="card mb-2 border">
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold text-success"><i className="fas fa-award me-2"></i>3. Academic Honesty</h6>
                                                <p className="small text-muted mb-0">Plagiarism, examination malpractice, or forging academic records leads to immediate disciplinary tribunal and possible expulsion.</p>
                                            </div>
                                        </div>
                                        <div className="card mb-2 border">
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold text-success"><i className="fas fa-id-card me-2"></i>4. Identity Cards & Security</h6>
                                                <p className="small text-muted mb-0">Student ID cards must be visible on campus at all times and scanned at library and computer laboratory entrance points.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Governance Tabs */}
                            {['chancellor', 'board-of-directors', 'university-senate', 'university-council', 'university-policies'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Institutional Governance Body</small>
                                        </div>
                                    </div>
                                    <p className="lead">
                                        The governance framework at Combridge Centre for Polytechnic Studies guarantees sound oversight, regulatory accreditation, academic integrity, and strategic growth.
                                    </p>
                                    <div className="row g-4 my-3">
                                        <div className="col-md-4 text-center">
                                            <div className="p-4 bg-light rounded-3">
                                                <img src="/images/logocom.png" alt="Crest" style={{ height: 90, objectFit: 'contain' }} />
                                                <h6 className="fw-bold mt-3 mb-1">Governing Council</h6>
                                                <small className="text-muted">Policy & Strategic Direction</small>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h5 className="fw-bold text-primary">Mandate & Responsibilities</h5>
                                            <ul className="text-muted small" style={{ lineHeight: 1.8 }}>
                                                <li>Approval of annual academic budgets, infrastructure investments, and staff welfare.</li>
                                                <li>Ensuring compliance with National Council for Higher Education (NCHE) and UBTEB examination standards.</li>
                                                <li>Fostering public-private partnerships, research grants, and international university linkage.</li>
                                                <li>Safeguarding institutional assets and quality assurance mechanisms.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Management Tabs */}
                            {['vice-chancellor', 'deputy-vice-chancellor', 'academic-registrar', 'library'].includes(activeTab) && (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                        <img src="/images/logocom.png" alt="Logo" style={{ height: 65, objectFit: 'contain' }} />
                                        <div>
                                            <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                            <small className="text-muted">Principal Officers & Administration</small>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-light rounded-3 mb-4">
                                        <h5 className="fw-bold text-dark mb-2">Office of Administration</h5>
                                        <p className="text-muted small mb-3">
                                            The day-to-day operations, curriculum delivery, student welfare, admissions, and financial accounting are coordinated by experienced administrators dedicated to educational excellence.
                                        </p>
                                        <div className="d-flex flex-wrap gap-3">
                                            <span className="badge bg-success p-2"><i className="fas fa-envelope me-1"></i> info@combridge.ac.ug</span>
                                            <span className="badge bg-primary p-2"><i className="fas fa-phone me-1"></i> +256 700 000 000</span>
                                            <span className="badge bg-secondary p-2"><i className="fas fa-building me-1"></i> Main Administration Block</span>
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
