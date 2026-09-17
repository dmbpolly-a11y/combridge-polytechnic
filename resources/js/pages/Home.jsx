import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATS = [
    { icon: 'fas fa-user-graduate', color: 'text-primary', value: '850+', label: 'Graduates' },
    { icon: 'fas fa-users', color: 'text-success', value: '2,340+', label: 'Active Students' },
    { icon: 'fas fa-award', color: 'text-info', value: '1,200+', label: 'Alumni Network' },
    { icon: 'fas fa-book-open', color: 'text-warning', value: '25+', label: 'Accredited Programmes' },
];

const STUDY_LEVELS = [
    {
        title: 'Certificate Courses',
        badge: 'Foundation & Skills',
        icon: 'fas fa-certificate',
        color: 'var(--primary-color)',
        desc: 'Practical, industry-recognized certificates designed to build job-ready skills in computing, business, electrical, and mechanical trades.',
        link: '/admissions/undergraduate-courses',
    },
    {
        title: 'Diploma Programmes',
        badge: 'Higher Vocational',
        icon: 'fas fa-graduation-cap',
        color: 'var(--rust-blue)',
        desc: 'Comprehensive 2-year diploma qualifications accredited by national boards, paving paths to employment and higher university degrees.',
        link: '/admissions/diploma-courses',
    },
    {
        title: 'Short Courses',
        badge: 'Professional & Tech',
        icon: 'fas fa-laptop-code',
        color: 'var(--light-green)',
        desc: 'Intensive modular short courses in software programming, networking, digital marketing, computer literacy, and welding/electrical arts.',
        link: '/admissions/short-courses',
    },
    {
        title: 'Scholarships',
        badge: 'Financial Aid',
        icon: 'fas fa-hand-holding-usd',
        color: 'var(--secondary)',
        desc: 'Tuition support, bursaries, and corporate sponsorships enabling deserving candidates to realize their technical career aspirations.',
        link: '/admissions/scholarships',
    },
];

const NOTICES = [
    {
        id: 1,
        title: '6th Annual Graduation Ceremony & Award of Diplomas',
        date: 'Sept. 15, 2026',
        audience: 'Graduands & General Public',
        excerpt: 'Combridge Centre for Polytechnic Studies announces the 6th congregation for the conferment of diplomas and certificates.',
        link: '/notice-board',
    },
    {
        id: 2,
        title: 'Call for Applications - Academic Year 2026/2027 Intakes',
        date: 'Sept. 10, 2026',
        audience: 'Prospective Students',
        excerpt: 'Applications are invited from eligible candidates for August/September and January intakes across all faculties.',
        link: '/admissions/call-for-application',
    },
    {
        id: 3,
        title: 'Academic Forum on Practical Innovation & Technical Skills',
        date: 'Sept. 05, 2026',
        audience: 'Staff & Students',
        excerpt: 'All engineering, vocational, and business students are invited to the upcoming polytechnic innovation exhibition forum.',
        link: '/notice-board',
    },
];

const NEWS = [
    {
        id: 1,
        title: 'Combridge Hosts Annual Academic Forum on Skills and Technology in Uganda',
        date: 'September 12, 2026',
        category: 'Academic Forum',
        badge: 'bg-primary',
        image: '/images/logocom.png',
        excerpt: 'Industry leaders and academia converged at the main campus to discuss hands-on skills training and AI in engineering education.',
        link: '/news',
    },
    {
        id: 2,
        title: 'Student Guild Installs New Innovation Signage and Campus Solar Lighting',
        date: 'September 08, 2026',
        category: 'Campus Life',
        badge: 'bg-success',
        image: '/images/logocom.png',
        excerpt: 'The Students Guild completed the green campus initiative providing solar illumination across polytechnic walkways.',
        link: '/news',
    },
    {
        id: 3,
        title: 'Inaugural Assembly and Orientation for 2026/2027 Fresh Students',
        date: 'September 01, 2026',
        category: 'Orientation',
        badge: 'bg-info text-dark',
        image: '/images/logocom.png',
        excerpt: 'Principal and Academic Registrar welcomed over 600 incoming diploma and certificate students into our community.',
        link: '/news',
    },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchLevel, setSearchLevel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/admissions/${searchLevel ? searchLevel : 'diploma-courses'}`);
    };

    return (
        <div className="home-page">
            {/* ── 1. USJ-Style Hero with Course Finder ────────────────── */}
            <section className="hero-section text-white py-5 position-relative">
                <div className="container position-relative py-3">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-8">
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(5px)' }}>
                                <i className="fas fa-graduation-cap text-warning"></i>
                                <span className="small fw-semibold">Academic Year 2026/2027 Admissions Open</span>
                            </div>
                            <h1 className="display-4 fw-bold mb-3">
                                Combridge Centre for Polytechnic Studies
                            </h1>
                            <p className="lead opacity-90 mb-4" style={{ fontSize: '1.25rem', maxWidth: '680px' }}>
                                <em>Development through Skills and Innovation</em> — Empowering students with hands-on, industry-aligned technical, business, and vocational education in Kampala, Uganda.
                            </p>

                            {/* USJ-Style Programme Finder Box */}
                            <div className="card shadow-lg p-3 bg-white text-dark rounded-4 mb-4" style={{ maxWidth: '680px' }}>
                                <div className="card-body p-2">
                                    <h6 className="fw-bold mb-2 text-success">
                                        <i className="fas fa-search me-2"></i>Course & Programme Finder
                                    </h6>
                                    <form onSubmit={handleSearch} className="row g-2 align-items-center">
                                        <div className="col-md-5">
                                            <select
                                                className="form-select"
                                                value={searchLevel}
                                                onChange={(e) => setSearchLevel(e.target.value)}
                                            >
                                                <option value="">All Study Levels</option>
                                                <option value="diploma-courses">Diploma Programmes (2 Yrs)</option>
                                                <option value="undergraduate-courses">Certificate Courses (1-2 Yrs)</option>
                                                <option value="short-courses">Short & Professional Skills</option>
                                                <option value="scholarships">Scholarship Schemes</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. IT, Electrical, Accounting"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <button type="submit" className="btn btn-success w-100 fw-bold">
                                                Search
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Quick CTA buttons */}
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/admissions/apply" className="btn btn-warning btn-lg px-4 fw-bold text-dark shadow-sm">
                                    <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                                </Link>
                                <Link to="/academics" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                                    <i className="fas fa-book-reader me-2"></i>Explore Programmes
                                </Link>
                                {isAuthenticated ? (
                                    <Link to="/student/dashboard" className="btn btn-light btn-lg px-4 fw-semibold text-success">
                                        <i className="fas fa-user-circle me-2"></i>My Portal
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                                        <i className="fas fa-lock me-2"></i>Student Portal
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Crest / Logo on right side */}
                        <div className="col-lg-4 text-center d-none d-lg-block">
                            <div className="p-4 bg-white rounded-circle shadow-lg d-inline-flex align-items-center justify-content-center" style={{ width: 270, height: 270 }}>
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge Polytechnic Official Logo"
                                    style={{ maxHeight: 210, width: 'auto', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="mt-3 text-white-50 small">
                                Official Seal of Combridge Polytechnic
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Statistics Counter matching USJ ──────────────────── */}
            <section className="py-4 bg-white border-bottom shadow-sm">
                <div className="container">
                    <div className="row g-4 text-center">
                        {STATS.map((s, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="p-3">
                                    <i className={`${s.icon} fa-2x ${s.color} mb-2`}></i>
                                    <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>{s.value}</h3>
                                    <span className="text-muted small fw-semibold text-uppercase">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Study Levels Showcase (USJ Style) ───────────────── */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-uppercase fw-bold text-success small">Excellence in Tertiary Education</span>
                        <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Our Study Levels & Pathways</h2>
                        <p className="text-muted" style={{ maxWidth: 650, margin: '0 auto' }}>
                            Combridge Polytechnic delivers comprehensive, hands-on curricula recognized nationwide by examination bodies and industry employers.
                        </p>
                    </div>

                    <div className="row g-4">
                        {STUDY_LEVELS.map((item, idx) => (
                            <div key={idx} className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white"
                                            style={{ width: 50, height: 50, background: item.color }}
                                        >
                                            <i className={`${item.icon} fa-lg`}></i>
                                        </div>
                                        <span className="badge bg-secondary text-white small">{item.badge}</span>
                                    </div>
                                    <h5 className="fw-bold mb-2">{item.title}</h5>
                                    <p className="text-muted small flex-grow-1">{item.desc}</p>
                                    <Link to={item.link} className="btn btn-outline-success btn-sm w-100 fw-bold mt-2">
                                        View Courses & Apply <i className="fas fa-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Notice Board & Announcements ───────────────────── */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                        <div>
                            <span className="badge bg-danger mb-2">Notice Board</span>
                            <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>Official Announcements</h2>
                        </div>
                        <Link to="/notice-board" className="btn btn-outline-primary btn-sm mt-3 mt-md-0 fw-semibold">
                            View All Notices <i className="fas fa-external-link-alt ms-1"></i>
                        </Link>
                    </div>

                    <div className="row g-4">
                        {NOTICES.map((notice) => (
                            <div key={notice.id} className="col-lg-4 col-md-6">
                                <div className="card h-100 border-start border-4 border-success shadow-sm rounded-3 p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-light text-success border border-success small">
                                            {notice.audience}
                                        </span>
                                        <small className="text-muted"><i className="far fa-calendar-alt me-1"></i>{notice.date}</small>
                                    </div>
                                    <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                                        <Link to={notice.link} className="text-dark text-decoration-none">
                                            {notice.title}
                                        </Link>
                                    </h5>
                                    <p className="text-muted small mb-3">{notice.excerpt}</p>
                                    <Link to={notice.link} className="small fw-bold text-success text-decoration-none mt-auto">
                                        Read Announcement <i className="fas fa-chevron-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Apply Online Promo Banner with Logo ─────────────── */}
            <section className="py-5" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container text-white">
                    <div className="row align-items-center g-4">
                        <div className="col-md-2 text-center">
                            <div className="bg-white p-3 rounded-circle d-inline-block shadow">
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge Logo"
                                    style={{ height: 90, width: 90, objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <h3 className="fw-bold mb-2">Apply Online with Ease</h3>
                            <p className="mb-0 opacity-90">
                                Submit your application digitally, upload academic documents, and track your admission progress directly from our online admissions portal. Your next career opportunity is one step away.
                            </p>
                        </div>
                        <div className="col-md-3 text-md-end text-center">
                            <Link to="/admissions/apply" className="btn btn-warning btn-lg px-4 fw-bold text-dark shadow">
                                <i className="fas fa-edit me-2"></i>Start Application
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. University News Section (USJ Layout) ────────────── */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span className="text-uppercase fw-bold text-success small">Polytechnic Life</span>
                            <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>Latest News & Events</h2>
                        </div>
                        <Link to="/news" className="btn btn-outline-success btn-sm fw-semibold">
                            More News <i className="fas fa-arrow-right ms-1"></i>
                        </Link>
                    </div>

                    <div className="row g-4">
                        {NEWS.map((n) => (
                            <div key={n.id} className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                    <div className="p-4 bg-white text-center border-bottom" style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={n.image}
                                            alt={n.title}
                                            style={{ maxHeight: 110, width: 'auto', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className={`badge ${n.badge}`}>{n.category}</span>
                                            <small className="text-muted"><i className="far fa-clock me-1"></i>{n.date}</small>
                                        </div>
                                        <h5 className="card-title fw-bold" style={{ fontSize: '1.05rem' }}>{n.title}</h5>
                                        <p className="card-text text-muted small flex-grow-1">{n.excerpt}</p>
                                        <Link to={n.link} className="btn btn-sm btn-outline-primary fw-semibold mt-2">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. About Summary & Why Choose Combridge ────────────── */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <img
                                    src="/images/logocom.png"
                                    alt="Combridge"
                                    style={{ height: 50, objectFit: 'contain' }}
                                />
                                <div>
                                    <span className="text-uppercase fw-bold text-success small">About Combridge Polytechnic</span>
                                    <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                                        Center for Applied Technology & Skills
                                    </h2>
                                </div>
                            </div>
                            <p className="lead text-muted" style={{ fontSize: '1.1rem' }}>
                                Combridge Centre for Polytechnic Studies provides quality vocational, scientific, and technical education, equipping learners with skills that transform communities.
                            </p>
                            <p className="text-muted">
                                We blend rigorous theoretical foundations with comprehensive workshop and laboratory practice. Our graduates excel across industries, government departments, and self-made entrepreneurial ventures.
                            </p>
                            <div className="row g-3 mt-2">
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <h6 className="fw-bold mb-1"><i className="fas fa-check-circle text-success me-2"></i>Accredited Curricula</h6>
                                        <small className="text-muted">National examination board & ministry recognized.</small>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <h6 className="fw-bold mb-1"><i className="fas fa-tools text-primary me-2"></i>Equipped Workshops</h6>
                                        <small className="text-muted">Modern computer labs and technical workshops.</small>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <h6 className="fw-bold mb-1"><i className="fas fa-user-friends text-info me-2"></i>Industry Mentorship</h6>
                                        <small className="text-muted">Internship placements with leading employers.</small>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <h6 className="fw-bold mb-1"><i className="fas fa-hand-holding-heart text-warning me-2"></i>Affordable Tuition</h6>
                                        <small className="text-muted">Flexible payment terms and bursaries available.</small>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link to="/about" className="btn btn-success me-3 fw-semibold">
                                    Learn More About Us <i className="fas fa-arrow-right ms-1"></i>
                                </Link>
                                <Link to="/contact" className="btn btn-outline-secondary fw-semibold">
                                    Visit Campus
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 shadow-lg rounded-4 p-4" style={{ background: 'linear-gradient(145deg, #f9fbf9 0%, #edf4ef 100%)' }}>
                                <div className="text-center mb-4">
                                    <img
                                        src="/images/logocom.png"
                                        alt="Logo"
                                        style={{ height: 100, objectFit: 'contain', marginBottom: 10 }}
                                    />
                                    <h4 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Admissions Quick Checklist</h4>
                                    <p className="text-muted small">Everything you need to complete your enrollment</p>
                                </div>
                                <ul className="list-group list-group-flush rounded-3">
                                    <li className="list-group-item bg-transparent d-flex align-items-center">
                                        <i className="fas fa-check-square text-success me-3 fa-lg"></i>
                                        <div>
                                            <strong>UCE / O-Level or Equivalent:</strong>
                                            <div className="small text-muted">Minimum 5 passes for Certificate programmes.</div>
                                        </div>
                                    </li>
                                    <li className="list-group-item bg-transparent d-flex align-items-center">
                                        <i className="fas fa-check-square text-success me-3 fa-lg"></i>
                                        <div>
                                            <strong>UACE / A-Level or Certificate:</strong>
                                            <div className="small text-muted">1 Principal pass and 2 subsidiary passes or recognized certificate for Diploma programmes.</div>
                                        </div>
                                    </li>
                                    <li className="list-group-item bg-transparent d-flex align-items-center">
                                        <i className="fas fa-check-square text-success me-3 fa-lg"></i>
                                        <div>
                                            <strong>Academic Transcripts & Pass Slips:</strong>
                                            <div className="small text-muted">Originals & certified photocopies.</div>
                                        </div>
                                    </li>
                                    <li className="list-group-item bg-transparent d-flex align-items-center">
                                        <i className="fas fa-check-square text-success me-3 fa-lg"></i>
                                        <div>
                                            <strong>Passport Size Photographs:</strong>
                                            <div className="small text-muted">4 recent color passport photos.</div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <Link to="/admissions/apply" className="btn btn-warning w-100 fw-bold py-2 text-dark">
                                        <i className="fas fa-paper-plane me-2"></i>Proceed to Online Application Form
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
