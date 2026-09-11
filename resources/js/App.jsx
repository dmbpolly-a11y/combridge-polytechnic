import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header      from './components/Header';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';

// Pages
import Home            from './pages/Home';
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
                    {/* ── Public ───────────────────────────────────── */}
                    <Route path="/" element={
                        <Layout><Home /></Layout>
                    } />

                    {/* ── Auth (no header/footer) ───────────────────── */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Login />} />  {/* placeholder */}

                    {/* ── Admin (protected) ─────────────────────────── */}
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute roles={['administrator', 'principal']}>
                            <Layout><AdminDashboard /></Layout>
                        </PrivateRoute>
                    } />

                    {/* ── Teacher portal (protected) ────────────────── */}
                    <Route path="/teacher/dashboard" element={
                        <PrivateRoute roles={['teacher']}>
                            <Layout>
                                <div className="container py-5 text-center">
                                    <i className="fas fa-chalkboard-teacher fa-4x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                    <h2>Teacher Portal</h2>
                                    <p className="text-muted">Coming soon — manage attendance, marks, and more.</p>
                                </div>
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* ── Student portal (protected) ────────────────── */}
                    <Route path="/student/dashboard" element={
                        <PrivateRoute roles={['student']}>
                            <Layout>
                                <div className="container py-5 text-center">
                                    <i className="fas fa-user-graduate fa-4x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                    <h2>Student Portal</h2>
                                    <p className="text-muted">Coming soon — view results, fees, and timetable.</p>
                                </div>
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* ── 404 ───────────────────────────────────────── */}
                    <Route path="*" element={
                        <Layout><NotFound /></Layout>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
