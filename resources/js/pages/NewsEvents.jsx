import { Link } from 'react-router-dom';

const ARTICLES = [
    {
        id: 1,
        title: 'Combridge Hosts Academic Forum on Practical Innovation & Technical Competence',
        date: 'September 12, 2026',
        category: 'Academic Forum',
        author: 'Directorate of Communications',
        image: '/images/logocom.png',
        content: 'Combridge Centre for Polytechnic Studies hosted a premier academic forum bringing together leading engineering contractors, technology leaders, and academic scholars across Uganda. The symposium addressed how polytechnic institutions can bridge the industrial skills gap through modernized curriculums, artificial intelligence, and workshop entrepreneurship.',
    },
    {
        id: 2,
        title: 'Student Guild Installs New Modern Campus Signposts and Energy-Efficient Solar Lighting',
        date: 'September 08, 2026',
        category: 'Student Life',
        author: 'Guild Media Bureau',
        image: '/images/logocom.png',
        content: 'The 2026/2027 Students’ Guild Government officially commissioned the campus green lighting project, introducing solar security lights and newly fabricated directional signposts manufactured directly by the polytechnic’s welding and electrical engineering students.',
    },
    {
        id: 3,
        title: 'Inaugural Assembly and Orientation Week for New Diploma & Certificate Students',
        date: 'September 01, 2026',
        category: 'Admissions & Orientation',
        author: 'Academic Registrar',
        image: '/images/logocom.png',
        content: 'The Principal, alongside the Academic Registrar and Deans of Faculty, welcomed over 600 fresh students during the orientation ceremony. Freshers were introduced to the polytechnic code of conduct, digital library databases, and workshop safety procedures.',
    },
    {
        id: 4,
        title: 'Mechanical and Automotive Department Partners with Leading Regional Garage Network',
        date: 'August 24, 2026',
        category: 'Partnerships',
        author: 'Industrial Linkages Officer',
        image: '/images/logocom.png',
        content: 'A memorandum of understanding was concluded to facilitate guaranteed industrial internship placements for all second-year diploma students in automotive engineering and welding trades.',
    },
];

export default function NewsEvents() {
    return (
        <div className="news-page">
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">News & Events</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">University News & Press</h2>
                            <p className="mb-0 text-white-50 small">Updates, Stories, Activities, and Campus Events</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {ARTICLES.map((article) => (
                        <div key={article.id} className="col-lg-6">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                                <div className="p-4 bg-light text-center border-bottom" style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        style={{ maxHeight: 110, width: 'auto', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-success">{article.category}</span>
                                        <small className="text-muted"><i className="far fa-calendar-alt me-1"></i>{article.date}</small>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '1.2rem' }}>{article.title}</h4>
                                    <p className="text-muted small flex-grow-1">{article.content}</p>
                                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                                        <small className="text-muted"><i className="fas fa-pen-nib me-1 text-success"></i>{article.author}</small>
                                        <span className="text-success small fw-bold">Read Full Story <i className="fas fa-arrow-right ms-1"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
