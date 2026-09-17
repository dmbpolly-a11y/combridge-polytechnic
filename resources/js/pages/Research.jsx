import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Research() {
    const { subpage } = useParams();
    const defaultTab = subpage || 'grants-office';
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (subpage) {
            setActiveTab(subpage);
        }
    }, [subpage]);

    return (
        <div className="research-page">
            {/* Banner */}
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #051566 0%, #0C5C3E 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Research & Innovation</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Research, Innovations & Grants</h2>
                            <p className="mb-0 text-white-50 small">Applied engineering solutions, commercial patents & community research</p>
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
                                Research & Innovation
                            </h6>
                            <div className="nav flex-column nav-pills">
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'grants-office' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('grants-office')}
                                >
                                    <i className="fas fa-award me-2"></i>Research & Grants Office
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'research-innovation' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('research-innovation')}
                                >
                                    <i className="fas fa-lightbulb me-2"></i>Innovation Hub
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'collaborations' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('collaborations')}
                                >
                                    <i className="fas fa-handshake me-2"></i>Collaborations & MoUs
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'repository' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('repository')}
                                >
                                    <i className="fas fa-archive me-2"></i>Research Repository
                                </button>
                                <button
                                    className={`nav-link text-start py-2 px-3 ${activeTab === 'downloads' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('downloads')}
                                >
                                    <i className="fas fa-download me-2"></i>Downloads & Guidelines
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                            <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                                <img src="/images/logocom.png" alt="Logo" style={{ height: 60, objectFit: 'contain' }} />
                                <div>
                                    <h3 className="fw-bold mb-0 text-success text-capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                                    <small className="text-muted">Applied Technology & Innovation at Combridge Polytechnic</small>
                                </div>
                            </div>

                            {activeTab === 'grants-office' && (
                                <div>
                                    <p className="lead">
                                        The Research & Grants Office (RGO) facilitates grant sourcing, project management, and technology transfer for both faculty researchers and student innovation teams.
                                    </p>
                                    <div className="p-4 bg-light rounded-3 border mb-3">
                                        <h5 className="fw-bold text-primary mb-2">Priority Research Thrusts</h5>
                                        <ul className="text-muted small mb-0" style={{ lineHeight: 1.8 }}>
                                            <li>Renewable solar energy conversion and micro-grid electrical systems.</li>
                                            <li>Appropriate low-cost agricultural machinery, welding and fabrication technologies.</li>
                                            <li>Mobile applications and digital payment integrations for Ugandan small enterprises.</li>
                                            <li>Waste-to-energy and sustainable construction materials.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'research-innovation' && (
                                <div>
                                    <p className="lead">
                                        Our Innovation Hub acts as an incubator where student capstone projects transform into commercial products and viable technology startups.
                                    </p>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="p-3 bg-light rounded-3 border">
                                                <h6 className="fw-bold text-success"><i className="fas fa-microchip me-2"></i>Hardware Prototyping Lab</h6>
                                                <p className="small text-muted mb-0">Equipped with 3D printers, CNC cutting, PCB etching, and microcontrollers for physical engineering prototypes.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 bg-light rounded-3 border">
                                                <h6 className="fw-bold text-primary"><i className="fas fa-code me-2"></i>Software Incubator</h6>
                                                <p className="small text-muted mb-0">Mentorship from senior software engineers covering cloud, mobile app deployment, and database administration.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'collaborations' && (
                                <div>
                                    <p className="lead">
                                        We collaborate with government agencies, international universities, NGOs, and manufacturing industries to advance vocational skills.
                                    </p>
                                    <div className="p-4 bg-light rounded-3 border">
                                        <h6 className="fw-bold text-dark">Institutional Partners</h6>
                                        <p className="small text-muted mb-0">
                                            Combridge Polytechnic works closely with UBTEB, DIT, national electrical contractors, IT software houses, and vocational training consortiums across Uganda and the East African Community.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'repository' && (
                                <div>
                                    <p className="lead">
                                        Browse recent staff papers, student final-year project dissertations, and technical reports.
                                    </p>
                                    <div className="list-group">
                                        <div className="list-group-item p-3">
                                            <span className="badge bg-primary mb-1">Engineering Journal</span>
                                            <h6 className="fw-bold mb-1">Design and Implementation of Low-Cost IoT Irrigation Controller for Rural Smallholders</h6>
                                            <small className="text-muted">Faculty of Science & Technology &middot; Published 2026</small>
                                        </div>
                                        <div className="list-group-item p-3">
                                            <span className="badge bg-success mb-1">Vocational Trades</span>
                                            <h6 className="fw-bold mb-1">Thermal Efficiency Assessment of Fabricated Biomass Stoves in Central Uganda</h6>
                                            <small className="text-muted">Department of Mechanical Engineering &middot; Published 2026</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'downloads' && (
                                <div>
                                    <p className="lead">
                                        Official guidelines, proposal templates, and research ethics approval forms.
                                    </p>
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="fw-bold mb-0"><i className="fas fa-file-pdf text-danger me-2"></i>Research Policy & Ethics Clearance Guidelines (PDF)</h6>
                                                <small className="text-muted">Official Combridge Polytechnic Research Directorate document.</small>
                                            </div>
                                            <a href="/images/2464-Article Text-6965-2-10-20241129.pdf" download className="btn btn-sm btn-outline-success">Download</a>
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
