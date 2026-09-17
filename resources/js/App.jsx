import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header      from './components/Header';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';

// Pages
import Home            from './pages/Home';
import About           from './pages/About';
import Academics       from './pages/Academics';
import Students        from './pages/Students';
import Admissions      from './pages/Admissions';
import ApplyOnline     from './pages/ApplyOnline';
import Research        from './pages/Research';
import NewsEvents      from './pages/NewsEvents';
import NoticeBoard     from './pages/NoticeBoard';
import Gallery         from './pages/Gallery';
import Contact         from './pages/Contact';
import Login           from './pages/Login';
import AdminDashboard  from './pages/admin/Dashboard';
import NotFound        from './pages/NotFound';

import './styles/app.css';

/**
 * Layout wrapper — Header + Navbar + <main> content + Footer.
 * Login page uses its own full-screen layout so we skip the wrapper for it.
 */
function Layout({ children }) {
    return (
        <>
            <Header />
            <Navbar />
            <main>
                <Suspense fallback={
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner-border" style={{ color: 'var(--primary-color)' }} role="status">
                            <span className="visually-hidden">Loading…</span>
                        </div>
                    </div>
                }>
                    {children}
                </Suspense>
            </main>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* ── 1. Public Home ───────────────────────────── */}
                    <Route path="/" element={<Layout><Home /></Layout>} />

                    {/* ── 2. Cloned USJ Pages & Subpages ────────────── */}
                    {/* About */}
                    <Route path="/about" element={<Layout><About /></Layout>} />
                    <Route path="/about/:subpage" element={<Layout><About /></Layout>} />

                    {/* Academics */}
                    <Route path="/academics" element={<Layout><Academics /></Layout>} />
                    <Route path="/academics/:subpage" element={<Layout><Academics /></Layout>} />

                    {/* Students */}
                    <Route path="/students" element={<Layout><Students /></Layout>} />
                    <Route path="/students/:subpage" element={<Layout><Students /></Layout>} />

                    {/* Admissions */}
                    <Route path="/admissions" element={<Layout><Admissions /></Layout>} />
                    <Route path="/admissions/apply" element={<Layout><ApplyOnline /></Layout>} />
                    <Route path="/admissions/:subpage" element={<Layout><Admissions /></Layout>} />

                    {/* Research */}
                    <Route path="/research" element={<Layout><Research /></Layout>} />
                    <Route path="/research/:subpage" element={<Layout><Research /></Layout>} />

                    {/* News & Events */}
                    <Route path="/news" element={<Layout><NewsEvents /></Layout>} />
                    <Route path="/news/:id" element={<Layout><NewsEvents /></Layout>} />
                    <Route path="/events" element={<Layout><NewsEvents /></Layout>} />

                    {/* Notice Board */}
                    <Route path="/notice-board" element={<Layout><NoticeBoard /></Layout>} />

                    {/* Gallery */}
                    <Route path="/gallery" element={<Layout><Gallery /></Layout>} />

                    {/* Contact */}
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />

                    {/* ── 3. Auth (no header/footer) ───────────────── */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Login />} />

                    {/* ── 4. Admin (protected) ─────────────────────── */}
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute roles={['administrator', 'principal']}>
                            <Layout><AdminDashboard /></Layout>
                        </PrivateRoute>
                    } />

                    {/* ── 5. Teacher portal (protected) ────────────── */}
                    <Route path="/teacher/dashboard" element={
                        <PrivateRoute roles={['teacher']}>
                            <Layout>
                                <div className="container py-5 text-center">
                                    <i className="fas fa-chalkboard-teacher fa-4x mb-3 text-success"></i>
                                    <h2>Teacher Portal</h2>
                                    <p className="text-muted">Combridge Staff System — manage marks, lesson logs, and timetable.</p>
                                </div>
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* ── 6. Student portal (protected) ────────────── */}
                    <Route path="/student/dashboard" element={
                        <PrivateRoute roles={['student']}>
                            <Layout>
                                <div className="container py-5 text-center">
                                    <i className="fas fa-user-graduate fa-4x mb-3 text-success"></i>
                                    <h2>Student Portal</h2>
                                    <p className="text-muted">Welcome to the student portal — view coursework marks, timetable, and clearance.</p>
                                </div>
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* ── 7. 404 ───────────────────────────────────── */}
                    <Route path="*" element={
                        <Layout><NotFound /></Layout>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
