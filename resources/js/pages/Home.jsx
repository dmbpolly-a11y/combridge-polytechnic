import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HERO_IMAGES = [
    {
        src: '/images/com.jpg',
        title: 'Clinical & Medical Training Skills Laboratory',
        subtitle: 'Hands-on practicals and real-world medical confidence'
    },
    {
        src: '/images/comb.jpg',
        title: 'Research Tutorials & Academic Coaching',
        subtitle: 'Strengthening teaching quality and academic success'
    },
    {
        src: '/images/combr.jpg',
        title: 'Institutional Growth & Capacity Building',
        subtitle: 'Strategic thinking, management, and leadership skills'
    },
    {
        src: '/images/combri.jpg',
        title: 'Medical Skills & Clinical Mentorship',
        subtitle: 'Direct hospital placement and expert mentorship'
    },
    {
        src: '/images/combrid.jpg',
        title: 'Entrepreneurship & Skills Development',
        subtitle: 'Practical training for diverse careers and self-employment'
    },
    {
        src: '/images/combridg.jpg',
        title: 'International Languages & Life Skills',
        subtitle: 'Russian, Chinese, French, Spanish & Portuguese coaching'
    },
    {
        src: '/images/combridge.jpg',
        title: 'Mbarara City Campus Facilities',
        subtitle: 'Nyamityobora, Kakoba Division, 200m off Mbarara-Masaka Highway'
    },
];

const STATS = [
    { icon: 'fas fa-user-md', color: 'text-success', value: '1,200+', label: 'Health Trainees' },
    { icon: 'fas fa-graduation-cap', color: 'text-primary', value: '98%', label: 'Employment Rate' },
    { icon: 'fas fa-globe-africa', color: 'text-info', value: '5+', label: 'Global Languages' },
    { icon: 'fas fa-handshake', color: 'text-warning', value: '30+', label: 'Clinical Partners' },
];

const STUDY_LEVELS = [
    {
        title: 'Clinical & Medical Training',
        badge: 'Healthcare & Nursing',
        icon: 'fas fa-stethoscope',
        color: '#006837',
        desc: 'Health training, clinical placement, medical skills laboratory training, and mentorship programs that give students real-world experience and clinical confidence.',
        link: '/admissions/undergraduate-courses',
    },
    {
        title: 'Research & Academic Mentorship',
        badge: 'Higher Education',
        icon: 'fas fa-microscope',
        color: '#051566',
        desc: 'Research tutorials, coaching, research guidance, and support for strengthening teaching quality, academic publications, and student career success.',
        link: '/research',
    },
    {
        title: 'International Languages & Life Skills',
        badge: 'Global Competence',
        icon: 'fas fa-language',
        color: '#28a745',
        desc: 'Certified language proficiency courses in Russian, Chinese, French, Spanish, and Portuguese alongside essential professional soft skills.',
        link: '/admissions/short-courses',
    },
    {
        title: 'Entrepreneurship & Institutional Growth',
        badge: 'Leadership & Finance',
        icon: 'fas fa-chart-line',
        color: '#d97706',
        desc: 'Staff development, management skills training, capacity building, strategic finance, leadership skills, and branding for sustainable institutional impact.',
        link: '/admissions/scholarships',
    },
];

const CONSULTANCY_SERVICES = [
    {
        title: 'Clinical and Medical Training',
        desc: 'Health training, clinical placement, conduct medical skills laboratory training, and mentorship programs that give students real-world experience and confidence.',
        icon: 'fas fa-hospital-user'
    },
    {
        title: 'Research and Academic Development',
        desc: 'Provides research tutorials, coaching research guidance, and support for strengthening teaching quality and student success.',
        icon: 'fas fa-brain'
    },
    {
        title: 'Life Skills Coaching',
        desc: 'Offers life skills courses (Russian, Chinese, French, Spanish, and Portuguese) alongside critical communication and soft skills.',
        icon: 'fas fa-comments'
    },
    {
        title: 'Entrepreneurship and Skills Development',
        desc: 'Practical training to prepare graduates for diverse careers, technical innovation, and self-employment.',
        icon: 'fas fa-lightbulb'
    },
    {
        title: 'Training and Institutional Growth',
        desc: 'Provides staff development, management skills training and capacity building, and performance, finance strategic thinking, leadership skills, and effective branding to ensure institutional impact and reputation.',
        icon: 'fas fa-seedling'
    },
    {
        title: 'Partnerships and Collaborations',
        desc: 'Builds strong partnerships for students, graduates, employers, and institutions to create opportunities, internships, mentorships, and collaborative projects that drive community development.',
        icon: 'fas fa-hands-helping'
    },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchLevel, setSearchLevel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSlide, setActiveSlide] = useState(0);

    // Auto-advance hero carousel with smooth animation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % HERO_IMAGES.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setActiveSlide(prev => (prev + 1) % HERO_IMAGES.length);
    };

    const prevSlide = () => {
        setActiveSlide(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/admissions/${searchLevel ? searchLevel : 'diploma-courses'}`);
    };

    return (
        <div className="home-page">
            {/* ── 1. Hero Section with Animated Image Carousel ────────────────── */}
            <section className="hero-section text-white py-4 py-lg-5 position-relative" style={{ background: 'linear-gradient(135deg, #004d28 0%, #006837 50%, #051566 100%)' }}>
                <div className="container position-relative py-2">
                    <div className="row align-items-center g-4">
                        {/* Left: Text & CTA */}
                        <div className="col-lg-7">
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(5px)' }}>
                                <i className="fas fa-certificate text-warning"></i>
                                <span className="small fw-semibold">Accredited by Uganda Registration Services Bureau (URSB)</span>
                            </div>

                            <h1 className="hero-title fw-bold mb-2 text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1.2 }}>
                                COMBRIDGE INSTITUTE OF HEALTH MANAGEMENT SCIENCES
                            </h1>

                            <h5 className="text-warning fw-semibold mb-2" style={{ fontSize: '1.1rem' }}>
                                A subsidiary arm of Combridge Centre for Polytechnic Studies
                            </h5>

                            <p className="hero-motto fw-bold mb-3" style={{ color: '#ffdd57', fontStyle: 'italic', fontSize: '1.25rem' }}>
                                "Enriching The Future and Potentials"
                            </p>

                            <p className="lead opacity-90 mb-4" style={{ fontSize: '1rem', maxWidth: '620px', lineHeight: 1.6 }}>
                                Specialized in Advisory, Consultancy, and World-Class Training in Health Sciences, Medical Skills, Life Skills, and Institutional Capacity Building in Mbarara City, Uganda.
                            </p>

                            {/* Programme Finder Box */}
                            <div className="card shadow-lg p-3 bg-white text-dark rounded-4 mb-4" style={{ maxWidth: '620px' }}>
                                <div className="card-body p-1">
                                    <h6 className="fw-bold mb-2 text-success">
                                        <i className="fas fa-search me-2"></i>Find Courses & Training Programmes
                                    </h6>
                                    <form onSubmit={handleSearch} className="row g-2 align-items-center">
                                        <div className="col-md-5 col-12">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchLevel}
                                                onChange={(e) => setSearchLevel(e.target.value)}
                                            >
                                                <option value="">All Programmes</option>
                                                <option value="undergraduate-courses">Clinical & Medical Training</option>
                                                <option value="diploma-courses">Management & Health Diplomas</option>
                                                <option value="short-courses">Life Skills & Foreign Languages</option>
                                                <option value="scholarships">Advisory & Consultancy</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="e.g. Clinical, Nursing, French"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3 col-12">
                                            <button type="submit" className="btn btn-sm btn-success w-100 fw-bold">
                                                Explore
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Quick CTA buttons */}
                            <div className="d-flex flex-wrap gap-2 pt-1">
                                <Link to="/admissions/apply" className="btn btn-warning px-4 py-2 fw-bold text-dark shadow-sm">
                                    <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                                </Link>
                                <Link to="/contact" className="btn btn-outline-light px-4 py-2 fw-semibold">
                                    <i className="fas fa-phone-alt me-2"></i>Contact Admissions
                                </Link>
                                {isAuthenticated ? (
                                    <Link to="/student/dashboard" className="btn btn-light px-4 py-2 fw-semibold text-success">
                                        <i className="fas fa-user-circle me-2"></i>My Portal
                                    </Link>
                                ) : (
                                    <Link to="/login" className="btn btn-outline-light px-4 py-2 fw-semibold">
                                        <i className="fas fa-lock me-2"></i>Student Portal
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right: Animated Images Carousel */}
                        <div className="col-lg-5">
                            <div className="hero-carousel-wrapper position-relative rounded-4 overflow-hidden shadow-lg" style={{ background: '#000', border: '3px solid rgba(255,255,255,0.2)' }}>
                                <div className="hero-slide-container" style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
                                    {HERO_IMAGES.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="hero-slide-item"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: idx === activeSlide ? 1 : 0,
                                                transform: idx === activeSlide ? 'scale(1)' : 'scale(1.04)',
                                                transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                                                pointerEvents: idx === activeSlide ? 'auto' : 'none'
                                            }}
                                        >
                                            <img
                                                src={img.src}
                                                alt={img.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                            {/* Gradient Caption Overlay */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                                                    padding: '24px 16px 14px',
                                                    color: '#fff'
                                                }}
                                            >
                                                <span className="badge bg-success mb-1 small">Photo {idx + 1} of {HERO_IMAGES.length}</span>
                                                <h6 className="fw-bold mb-1 text-white" style={{ fontSize: '0.95rem' }}>{img.title}</h6>
                                                <p className="mb-0 text-white-50" style={{ fontSize: '0.8rem' }}>{img.subtitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Carousel Controls */}
                                <button
                                    className="btn btn-sm btn-dark position-absolute start-0 top-50 translate-middle-y ms-2 rounded-circle opacity-75 hover-opacity-100 shadow"
                                    style={{ width: 36, height: 36, zIndex: 10, padding: 0 }}
                                    onClick={prevSlide}
                                    aria-label="Previous slide"
                                >
                                    <i className="fas fa-chevron-left text-white"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-dark position-absolute end-0 top-50 translate-middle-y me-2 rounded-circle opacity-75 hover-opacity-100 shadow"
                                    style={{ width: 36, height: 36, zIndex: 10, padding: 0 }}
                                    onClick={nextSlide}
                                    aria-label="Next slide"
                                >
                                    <i className="fas fa-chevron-right text-white"></i>
                                </button>

                                {/* Dot Indicators */}
                                <div className="position-absolute bottom-0 start-50 translate-middle-x pb-1 d-flex gap-1" style={{ zIndex: 10 }}>
                                    {HERO_IMAGES.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveSlide(i)}
                                            style={{
                                                width: i === activeSlide ? '20px' : '7px',
                                                height: '7px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                background: i === activeSlide ? '#ffdd57' : 'rgba(255,255,255,0.5)',
                                                transition: 'all 0.3s ease-in-out',
                                                padding: 0
                                            }}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Official Contact Details Strip (From Image 2) ────────────────── */}
            <section className="py-3 text-white" style={{ background: '#006837', borderBottom: '3px solid #ffdd57' }}>
                <div className="container">
                    <div className="row g-3 align-items-center text-center text-md-start">
                        <div className="col-lg-3 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            <i className="fas fa-envelope fa-lg text-warning"></i>
                            <div>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.75rem' }}>Official Email</small>
                                <a href="mailto:combridgecentre@gmail.com" className="text-white text-decoration-none fw-semibold small">
                                    combridgecentre@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            <i className="fas fa-phone-alt fa-lg text-warning"></i>
                            <div>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.75rem' }}>Telephone & WhatsApp</small>
                                <span className="text-white fw-semibold small">
                                    +256 393 256879 / <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="text-warning text-decoration-none">+256 787 803099</a>
                                </span>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            <i className="fas fa-mail-bulk fa-lg text-warning"></i>
                            <div>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.75rem' }}>Postal Address</small>
                                <span className="text-white fw-semibold small">P.O. Box 177267, Mbarara</span>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            <i className="fas fa-map-marker-alt fa-lg text-warning"></i>
                            <div>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.75rem' }}>Physical Campus</small>
                                <span className="text-white fw-semibold small">Nyamityobora, Kakoba, Mbarara City</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Official Institutional Profile (From Image 2) ────────────────── */}
            <section className="py-5 bg-white">
                <div className="container">
                    {/* Background Header Pill */}
                    <div className="mb-4">
                        <span className="badge px-4 py-2 text-uppercase fw-bold shadow-sm" style={{ background: '#006837', fontSize: '1rem', letterSpacing: '0.5px' }}>
                            BACKGROUND
                        </span>
                        <div className="card border-0 shadow-sm rounded-4 p-4 mt-3" style={{ background: '#f8fdf9', borderLeft: '5px solid #006837' }}>
                            <p className="lead mb-2" style={{ fontSize: '1.05rem', color: '#1a1a1a', lineHeight: 1.7 }}>
                                <strong style={{ color: '#c1272d' }}>COMBRIDGE INSTITUTE OF HEALTH AND MANAGEMENT SCIENCES</strong> is a subsidiary arm of <strong style={{ color: '#006837' }}>COMBRIDGE CENTRE FOR POLYTECHNIC STUDIES</strong>.
                                A newly established firm located at <strong>Nyamityobora, Kakoba Division, Mbarara City, 200 meters off Mbarara Masaka Highway</strong>.
                            </p>
                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Combridge Centre for Polytechnic Studies is registered with <strong>Uganda Registration Services Bureau (URSB)</strong> as a private organization specialized in Advisory and Consultancy services in the areas of higher education and health training sectors.
                            </p>
                        </div>
                    </div>

                    {/* Two-Column Framework matching Image 2 */}
                    <div className="row g-4 pt-2">
                        {/* Left Column: Advisory & Consultancy Services */}
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    Advisory and Consultancy Services
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {CONSULTANCY_SERVICES.map((srv, i) => (
                                    <div key={i} className="card border-0 shadow-sm rounded-3 p-3 bg-light hover-shadow transition-all" style={{ borderLeft: '4px solid #006837' }}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 40, height: 40, background: '#006837' }}>
                                                <i className={`${srv.icon} fa-sm`}></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#c1272d', fontSize: '0.95rem' }}>
                                                    {srv.title}
                                                </h6>
                                                <p className="text-muted mb-0 small" style={{ lineHeight: 1.5 }}>
                                                    {srv.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Strategic Goals, Vision, Mission, Core Values, Pillars */}
                        <div className="col-lg-6">
                            {/* Strategic Goals */}
                            <div className="mb-4">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm mb-2 d-inline-block" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    STRATEGIC GOALS
                                </span>
                                <div className="card border-0 shadow-sm rounded-3 p-3 bg-light">
                                    <ul className="mb-0 ps-3 small text-dark" style={{ lineHeight: 1.8 }}>
                                        <li><strong>Achieve A Strong Alignment</strong> Between Graduates' Skills, Competencies And The Labour Market Needs</li>
                                        <li><strong>Ensure Graduates Achieve Skills</strong> And Financial Independence For Lifelong Success</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="mb-4">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm mb-2 d-inline-block" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    VISION
                                </span>
                                <div className="card border-0 shadow-sm rounded-3 p-3 bg-light">
                                    <p className="mb-0 small fw-semibold text-dark">
                                        Empower African and Global Higher Education to Fuel Skilled, Productive Workforces Globally
                                    </p>
                                </div>
                            </div>

                            {/* Mission */}
                            <div className="mb-4">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm mb-2 d-inline-block" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    MISSION
                                </span>
                                <div className="card border-0 shadow-sm rounded-3 p-3 bg-light">
                                    <p className="mb-0 small fw-semibold text-dark">
                                        Partner With Institutions to Boost Education Quality, Employability and Economic Growth
                                    </p>
                                </div>
                            </div>

                            {/* Core Values */}
                            <div className="mb-4">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm mb-2 d-inline-block" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    CORE VALUES
                                </span>
                                <div className="card border-0 shadow-sm rounded-3 p-3 bg-light">
                                    <p className="mb-0 small fw-bold" style={{ color: '#006837' }}>
                                        Integrity, Innovation, Inclusion and Collaboration for Sustainable Human Capital Development
                                    </p>
                                </div>
                            </div>

                            {/* Strategic Pillars and Objectives */}
                            <div className="mb-2">
                                <span className="badge px-3 py-2 text-uppercase fw-bold shadow-sm mb-2 d-inline-block" style={{ background: '#006837', fontSize: '0.9rem' }}>
                                    STRATEGIC PILLARS AND OBJECTIVES
                                </span>
                                <div className="card border-0 shadow-sm rounded-3 p-3 bg-light">
                                    <ul className="mb-0 ps-3 small text-dark" style={{ lineHeight: 1.8 }}>
                                        <li>Strengthen Skills aligning graduates with labor market demands</li>
                                        <li>Enhance institutional capacity for quality and relevance</li>
                                        <li>Drive Human Capital growth supporting productivity and economic progress</li>
                                        <li>Foster partnerships that expand opportunities locally and globally</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. Statistics Counter ──────────────────── */}
            <section className="py-4 bg-light border-top border-bottom">
                <div className="container">
                    <div className="row g-4 text-center">
                        {STATS.map((s, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="p-3 bg-white rounded-3 shadow-sm">
                                    <i className={`${s.icon} fa-2x ${s.color} mb-2`}></i>
                                    <h3 className="fw-bold mb-0" style={{ color: '#006837' }}>{s.value}</h3>
                                    <span className="text-muted small fw-semibold text-uppercase">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Study Levels & Pathways ───────────────── */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-uppercase fw-bold text-success small">Educational Excellence</span>
                        <h2 className="fw-bold" style={{ color: '#006837' }}>Our Disciplines & Pathways</h2>
                        <p className="text-muted" style={{ maxWidth: 650, margin: '0 auto' }}>
                            Combridge delivers market-driven, practical health, vocational, and advisory curricula designed to create job-ready professionals.
                        </p>
                    </div>

                    <div className="row g-4">
                        {STUDY_LEVELS.map((item, idx) => (
                            <div key={idx} className="col-md-6 col-lg-3">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 d-flex flex-column hover-shadow transition-all">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white"
                                            style={{ width: 50, height: 50, background: item.color }}
                                        >
                                            <i className={`${item.icon} fa-lg`}></i>
                                        </div>
                                        <span className="badge bg-light text-dark border small">{item.badge}</span>
                                    </div>
                                    <h5 className="fw-bold mb-2">{item.title}</h5>
                                    <p className="text-muted small flex-grow-1" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                                    <Link to={item.link} className="btn btn-sm btn-outline-success rounded-pill fw-semibold mt-2 align-self-start">
                                        Learn More <i className="fas fa-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Call to Action Banner ───────────────── */}
            <section className="py-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #004d28 0%, #006837 100%)' }}>
                <div className="container py-2">
                    <h2 className="fw-bold mb-3">Begin Your Professional Journey Today</h2>
                    <p className="lead opacity-90 mb-4" style={{ maxWidth: 700, margin: '0 auto' }}>
                        Enroll in our health sciences, clinical mentorship, and life skills diploma and certificate courses in Mbarara City.
                    </p>
                    <div className="d-flex justify-content-center flex-wrap gap-3">
                        <Link to="/admissions/apply" className="btn btn-warning btn-lg px-4 fw-bold text-dark shadow">
                            <i className="fas fa-paper-plane me-2"></i>Apply Online Now
                        </Link>
                        <a href="https://wa.me/256787803099" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg px-4 fw-bold">
                            <i className="fab fa-whatsapp me-2"></i>Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
