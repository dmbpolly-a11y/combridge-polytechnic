import { useState } from 'react';
import { Link } from 'react-router-dom';

const GALLERY_ITEMS = [
    { title: 'Campus Facilities & Lecture Grounds', category: 'Campus', img: '/images/combridge.jpg' },
    { title: 'Technical Workshop & Machinery Practicals', category: 'Workshops', img: '/images/combridg.jpg' },
    { title: 'Students Group Innovation Session', category: 'Students', img: '/images/IMG-20260902-WA0031.jpg' },
    { title: 'Engineering & Practical Demonstrations', category: 'Workshops', img: '/images/IMG-20260902-WA0032.jpg' },
    { title: 'Polytechnic Student Community & Guild', category: 'Students', img: '/images/IMG-20260902-WA0034.jpg' },
    { title: 'Hands-on Technical Training Lab', category: 'Workshops', img: '/images/IMG-20260902-WA0036.jpg' },
    { title: 'Campus Activity & Student Assembly', category: 'Events', img: '/images/IMG-20260902-WA0037.jpg' },
    { title: 'Computer Science & Software Lab', category: 'Academics', img: '/images/com.jpg' },
    { title: 'Vocational Training & Metal Fabrication', category: 'Workshops', img: '/images/comb.jpg' },
    { title: 'Automotive Mechanics Workshop', category: 'Workshops', img: '/images/combr.jpg' },
    { title: 'Library & Reading Center', category: 'Campus', img: '/images/combri.jpg' },
    { title: 'Official Seal of Combridge Polytechnic', category: 'Branding', img: '/images/logocom.png' },
];

export default function Gallery() {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Campus', 'Workshops', 'Students', 'Events', 'Academics'];

    const filtered = filter === 'All'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter(item => item.category === filter);

    return (
        <div className="gallery-page">
            <div className="subpage-banner text-white py-4" style={{ background: 'linear-gradient(135deg, #0C5C3E 0%, #051566 100%)' }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Gallery</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src="/images/logocom.png"
                            alt="Logo"
                            style={{ height: 60, width: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '4px' }}
                        />
                        <div>
                            <h2 className="fw-bold mb-0">Polytechnic Photo & Media Gallery</h2>
                            <p className="mb-0 text-white-50 small">Workshops, Laboratories, Campus Grounds, Ceremonies & Student Life</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                {/* Filter pills */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`btn btn-sm px-3 rounded-pill fw-semibold ${filter === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="row g-4">
                    {filtered.map((item, idx) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <div style={{ height: 230, overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: item.img.includes('logocom.png') ? 'contain' : 'cover',
                                            padding: item.img.includes('logocom.png') ? '20px' : '0',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        className="hover-zoom"
                                    />
                                </div>
                                <div className="card-body p-3">
                                    <span className="badge bg-light text-success border small mb-1">{item.category}</span>
                                    <h6 className="fw-bold mb-0 text-dark">{item.title}</h6>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
