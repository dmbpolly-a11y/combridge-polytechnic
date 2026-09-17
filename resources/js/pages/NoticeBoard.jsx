import { Link } from 'react-router-dom';

const NOTICES = [
    {
        id: 1,
        title: '6th Graduation Ceremony – Combridge Centre for Polytechnic Studies',
        date: 'Sept. 15, 2026, 9:00 AM',
        target: 'All Graduands & General Public',
        badge: 'Important',
        badgeClass: 'bg-danger',
        content: 'The Academic Registrar informs all graduands who completed their Diploma and Certificate studies in the 2025/2026 academic year that the 6th Graduation Ceremony will be held at the Main Campus Quadrangle. All graduands must clear tuition, library, and departmental requirements before gowns and certificates are issued.',
    },
    {
        id: 2,
        title: 'Admissions Open for August/September & January Intakes',
        date: 'Sept. 10, 2026, 8:30 AM',
        target: 'Prospective Students',
        badge: 'Admissions',
        badgeClass: 'bg-success',
        content: 'Applications are ongoing for Diploma and Certificate programmes in Information Technology, Electrical Engineering, Business Studies, and Automotive Mechanics. Both day and evening classes are available. Prospective students can apply online or pick up forms from the Academic Registrar’s office.',
    },
    {
        id: 3,
        title: 'Academic Forum: Practical Innovation in Technical Vocational Training',
        date: 'Sept. 05, 2026, 10:00 AM',
        target: 'Staff & Students',
        badge: 'Academic',
        badgeClass: 'bg-primary',
        content: 'The Directorate of Research and Industrial Linkages cordially invites all staff, diploma students, and industry partners to the upcoming academic forum showcasing students’ capstone engineering projects and software innovations.',
    },
    {
        id: 4,
        title: 'Invitation for Job Applications for Academic, Workshop & Administrative Positions',
        date: 'Aug. 28, 2026, 11:15 AM',
        target: 'General Public',
        badge: 'Careers',
        badgeClass: 'bg-warning text-dark',
        content: 'Combridge Polytechnic invites qualified candidates to apply for teaching and workshop technician roles in Mechanical Engineering, Computer Networking, and Accounting. Submit CV and certified copies of credentials to the Principal.',
    },
];

export default function NoticeBoard() {
    return (
        <div className="notice-board-page">
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Notice Board</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Official Notice Board</h2>
                            <p className="mb-0 text-white-50 small">Official Announcements, Circulars, and Academic Memorandums</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-8">
                        {NOTICES.map((notice) => (
                            <div key={notice.id} className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-4 border-success">
                                <div className="card-body p-4">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                                        <span className={`badge ${notice.badgeClass}`}>{notice.badge}</span>
                                        <span className="small text-muted"><i className="far fa-calendar-alt me-1"></i>{notice.date}</span>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">{notice.title}</h4>
                                    <div className="mb-3">
                                        <span className="badge bg-light text-dark border small">
                                            <i className="fas fa-users me-1 text-primary"></i>Target: {notice.target}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-0">{notice.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
                            <div className="text-center mb-3">
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge Seal"
                                    style={{ height: 80, objectFit: 'contain' }}
                                />
                            </div>
                            <h5 className="fw-bold text-success text-center mb-2">Need Direct Assistance?</h5>
                            <p className="text-muted small text-center mb-4">
                                For inquiries concerning announcements, examination timetables, and admissions clearance, visit our administration desk.
                            </p>
                            <Link to="/contact" className="btn btn-outline-success w-100 mb-2 fw-semibold">
                                <i className="fas fa-envelope me-2"></i>Contact Administration
                            </Link>
                            <Link to="/admissions/apply" className="btn btn-warning w-100 fw-bold text-dark">
                                <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
