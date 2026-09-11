import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROGRAMMES = [
    {
        icon: 'fas fa-laptop-code',
        color: 'var(--primary-color)',
        title: 'Information Technology',
        btnClass: 'btn-primary',
        courses: ['Diploma in IT', 'Software Development', 'Computer Networks', 'Web Design'],
    },
    {
        icon: 'fas fa-calculator',
        color: 'var(--light-green)',
        title: 'Business Studies',
        btnClass: 'btn-success',
        courses: ['Business Administration', 'Accounting', 'Marketing', 'Entrepreneurship'],
    },
    {
        icon: 'fas fa-tools',
        color: 'var(--rust-blue)',
        title: 'Technical Trades',
        btnClass: 'btn-info text-white',
        courses: ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Plumbing & Welding'],
    },
];

const STATS = [
    { icon: 'fas fa-users',              color: 'text-primary', value: '500+', label: 'Active Students' },
    { icon: 'fas fa-chalkboard-teacher', color: 'text-success', value: '50+',  label: 'Qualified Teachers' },
    { icon: 'fas fa-book-open',          color: 'text-info',    value: '20+',  label: 'Programmes' },
    { icon: 'fas fa-trophy',             color: 'text-warning', value: '15+',  label: 'Years of Excellence' },
];

const NEWS = [
    {
        badge: 'bg-primary',
        label: 'New',
        title: `Academic Year ${new Date().getFullYear()} Registration`,
        text: 'Registration for the new academic year is now open. Students can register online through the student portal.',
        daysAgo: 0,
    },
    {
        badge: 'bg-success',
        label: 'Event',
        title: 'Graduation Ceremony',
        text: 'The annual graduation ceremony will take place next month. All graduands are encouraged to clear their fees.',
        daysAgo: -7,
    },
    {
        badge: 'bg-info',
        label: 'Notice',
        title: 'Library Services',
        text: 'The library is now open for extended hours. Students can access resources from 7 AM to 9 PM on weekdays.',
        daysAgo: 2,
    },
];

function formatDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Home() {
    const { isAuthenticated } = useAuth();
    const heroRef = useRef(null);

    // Smooth scroll to hash on load
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Intersection observer for count-up animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('count-up');
            }),
            { threshold: 0.3 }
        );
        document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="hero-section" ref={heroRef}>
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-md-8 fade-in-up">
                            <span className="badge text-white mb-3 px-3 py-2" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                                🎓 Admissions Open for {new Date().getFullYear()}
                            </span>
                            <h1 className="display-4 fw-bold mb-3">
                                Welcome to Combridge Centre for Polytechnic Studies
                            </h1>
                            <p className="lead mb-4 opacity-90">
                                Development through Skills and Innovation — Empowering the next generation of technical professionals in Uganda.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <a href="#programmes" className="btn btn-light btn-lg px-4 fw-semibold">
                                    <i className="fas fa-graduation-cap me-2"></i>Our Programmes
                                </a>
                                <a href="#admissions" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                                    <i className="fas fa-file-alt me-2"></i>Apply Now
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 text-center d-none d-md-block">
                            <img
                                src="/images/badge.png"
                                alt="School Badge"
                                style={{ maxHeight: 260, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Quick Stats ───────────────────────────────────────── */}
            <section className="content-section bg-light">
                <div className="container">
                    <div className="row g-4 text-center">
                        {STATS.map((s, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="card h-100 py-4">
                                    <div className="card-body">
                                        <i className={`${s.icon} fa-3x ${s.color} mb-3`}></i>
                                        <h3 className="fw-bold stat-number">{s.value}</h3>
                                        <p className="text-muted mb-0">{s.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── About ─────────────────────────────────────────────── */}
            <section id="about" className="content-section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h2 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>About Us</h2>
                            <p className="lead">
                                Providing quality technical and vocational education to equip students with industry-relevant skills.
                            </p>
                            <p>
                                Located in Kampala, Uganda, Combridge Centre for Polytechnic Studies is a leading institution dedicated to providing quality technical and vocational education.
                            </p>
                            <ul className="list-unstyled">
                                {['Accredited Programmes', 'Modern Facilities', 'Experienced Faculty', 'Industry Partnerships'].map((item, i) => (
                                    <li key={i} className="mb-2">
                                        <i className="fas fa-check-circle text-success me-2"></i>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <div className="card h-100">
                                <div className="card-body p-4">
                                    <h4 className="card-title fw-bold">Why Choose Us?</h4>
                                    {[
                                        { icon: 'fas fa-star text-warning', title: 'Quality Education', text: 'Our programmes are designed to meet international standards and industry requirements.' },
                                        { icon: 'fas fa-briefcase text-primary', title: 'Career-Focused', text: 'We prepare students for successful careers through practical training and internships.' },
                                        { icon: 'fas fa-certificate text-success', title: 'Recognized Certificates', text: 'Our certificates and diplomas are nationally and internationally recognized.' },
                                    ].map((item, i) => (
                                        <div key={i} className={i > 0 ? 'mt-3' : ''}>
                                            <h6 className="fw-bold"><i className={`${item.icon} me-2`}></i>{item.title}</h6>
                                            <p className="text-muted">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Programmes ────────────────────────────────────────── */}
            <section id="programmes" className="content-section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Our Programmes</h2>
                        <p className="lead text-muted">Choose from our wide range of technical and vocational programmes</p>
                    </div>
                    <div className="row g-4">
                        {PROGRAMMES.map((prog, i) => (
                            <div key={i} className="col-md-4">
                                <div className="card h-100">
                                    <div className="card-body p-4">
                                        <div className="text-center mb-3">
                                            <i className={`${prog.icon} fa-3x`} style={{ color: prog.color }}></i>
                                        </div>
                                        <h5 className="card-title fw-bold text-center">{prog.title}</h5>
                                        <ul className="list-unstyled mt-3">
                                            {prog.courses.map((c, j) => (
                                                <li key={j} className="mb-2">
                                                    <i className="fas fa-angle-right text-primary me-2"></i>{c}
                                                </li>
                                            ))}
                                        </ul>
                                        <a href="#admissions" className={`btn ${prog.btnClass} w-100 mt-3`}>Apply Now</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Admissions ────────────────────────────────────────── */}
            <section id="admissions" className="content-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 mx-auto text-center">
                            <h2 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>Admissions Open</h2>
                            <p className="lead mb-4">Join us and start your journey to professional excellence</p>
                            <div className="card">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold mb-4">Admission Requirements</h4>
                                    <div className="row text-start">
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Certificate Programmes:</h6>
                                            <ul>
                                                <li>UCE or equivalent</li>
                                                <li>Minimum of 5 passes</li>
                                                <li>Application form</li>
                                                <li>Passport photos</li>
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Diploma Programmes:</h6>
                                            <ul>
                                                <li>UACE or equivalent</li>
                                                <li>Minimum of 2 principal passes</li>
                                                <li>Application form</li>
                                                <li>Academic transcripts</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4 d-flex flex-wrap gap-3 justify-content-center">
                                        {isAuthenticated ? (
                                            <Link to="/admin/dashboard" className="btn btn-primary btn-lg">
                                                <i className="fas fa-tachometer-alt me-2"></i>Go to Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link to="/login" className="btn btn-primary btn-lg">
                                                    <i className="fas fa-sign-in-alt me-2"></i>Login to Apply
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── News ──────────────────────────────────────────────── */}
            <section className="content-section bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Latest News & Announcements</h2>
                    </div>
                    <div className="row g-4">
                        {NEWS.map((n, i) => (
                            <div key={i} className="col-md-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className={`badge ${n.badge}`}>{n.label}</span>
                                            <small className="text-muted">{formatDate(n.daysAgo)}</small>
                                        </div>
                                        <h5 className="card-title fw-bold">{n.title}</h5>
                                        <p className="card-text text-muted">{n.text}</p>
                                        <a href="#" className={`btn btn-sm btn-outline-${n.badge.replace('bg-', '')}`}>Read More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact ───────────────────────────────────────────── */}
            <section id="contact" className="content-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Contact Us</h2>
                        <p className="lead text-muted">Get in touch with us for more information</p>
                    </div>
                    <div className="row g-4">
                        {[
                            { icon: 'fas fa-map-marker-alt text-danger', title: 'Location', text: 'Kampala, Uganda' },
                            { icon: 'fas fa-phone text-success', title: 'Phone', text: '+256 700 000 000 / +256 800 000 000' },
                            { icon: 'fas fa-envelope text-primary', title: 'Email', text: 'info@combridge.ac.ug' },
                        ].map((c, i) => (
                            <div key={i} className="col-md-4">
                                <div className="card h-100 text-center">
                                    <div className="card-body py-4">
                                        <i className={`${c.icon} fa-3x mb-3`}></i>
                                        <h5 className="fw-bold">{c.title}</h5>
                                        <p className="text-muted mb-0">{c.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
