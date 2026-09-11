import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api/client';

const QUICK_ACTIONS = [
    { to: '/admin/students/create', icon: 'fas fa-user-plus',      label: 'Add Student',       color: 'outline-primary' },
    { to: '/admin/attendance',      icon: 'fas fa-clipboard-check', label: 'Mark Attendance',   color: 'outline-success' },
    { to: '/admin/fees',            icon: 'fas fa-money-bill',      label: 'Collect Fees',      color: 'outline-warning' },
    { to: '/admin/announcements',   icon: 'fas fa-bullhorn',        label: 'New Announcement',  color: 'outline-info'    },
    { to: '/admin/reports',         icon: 'fas fa-file-alt',        label: 'Generate Report',   color: 'outline-secondary' },
];

function StatCard({ title, value, icon, iconBg, linkTo, linkLabel, linkColor }) {
    return (
        <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100 stat-card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-muted mb-1">{title}</h6>
                            <h2 className="mb-0 fw-bold" style={{ color: 'var(--primary-color)' }}>{value}</h2>
                            <small className="text-success"><i className="fas fa-arrow-up me-1"></i>Active</small>
                        </div>
                        <div className="stat-icon" style={{ background: iconBg }}>
                            <i className={`${icon} fa-lg`}></i>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light border-0">
                    <Link to={linkTo} className={`btn btn-sm btn-${linkColor} w-100`}>
                        <i className="fas fa-eye me-1"></i>{linkLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();

    const [stats,        setStats]        = useState(null);
    const [attendance,   setAttendance]   = useState(null);
    const [financial,    setFinancial]    = useState(null);
    const [students,     setStudents]     = useState([]);
    const [announcements,setAnnouncements]= useState([]);
    const [exams,        setExams]        = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [apiError,     setApiError]     = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            adminAPI.stats(),
            adminAPI.attendanceToday(),
            adminAPI.financialSummary(),
            adminAPI.recentStudents(),
            adminAPI.announcements(),
            adminAPI.upcomingExams(),
        ])
        .then(([s, a, f, st, an, ex]) => {
            setStats(s.data);
            setAttendance(a.data);
            setFinancial(f.data);
            setStudents(st.data?.students ?? []);
            setAnnouncements(an.data?.announcements ?? []);
            setExams(ex.data?.exams ?? []);
        })
        .catch((err) => {
            // Graceful degradation — show demo data if API not ready
            console.warn('API not ready, showing demo data:', err.message);
            setApiError('Live data unavailable — displaying demo values');
            setStats({ total_students: 487, total_teachers: 52, total_classes: 18, total_programmes: 12 });
            setAttendance({ student_present_today: 312, teacher_present_today: 47 });
            setFinancial({ total_fees_collected: 'UGX 24,500,000', pending_fees: 'UGX 8,200,000', payments_today: 14 });
            setStudents([]);
            setAnnouncements([]);
            setExams([]);
        })
        .finally(() => setLoading(false));
    }, []);

    const year = new Date().getFullYear();

    return (
        <div className="container-fluid py-4">
            {/* API warning banner */}
            {apiError && (
                <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
                    <i className="fas fa-exclamation-triangle"></i>
                    {apiError}
                </div>
            )}

            {/* Page Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div
                        className="card border-0 shadow"
                        style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--rust-blue) 100%)', color: 'white' }}
                    >
                        <div className="card-body py-4">
                            <h2 className="mb-1">
                                <i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard
                            </h2>
                            <p className="mb-0">
                                Welcome back, <strong>{user?.name}</strong>! — Academic Year {year}/{year + 1}
                            </p>
                            <small className="opacity-75">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            {loading ? (
                <div className="row mb-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="col-md-3 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body placeholder-glow">
                                    <span className="placeholder col-8 mb-2 d-block"></span>
                                    <span className="placeholder col-5 mb-1 d-block" style={{ height: 36 }}></span>
                                    <span className="placeholder col-4 d-block"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="row mb-4">
                    <StatCard
                        title="Total Students" value={stats?.total_students ?? 0}
                        icon="fas fa-user-graduate" iconBg="rgba(12,92,62,0.1)"
                        linkTo="/admin/students" linkLabel="View Students" linkColor="outline-primary"
                    />
                    <StatCard
                        title="Total Teachers" value={stats?.total_teachers ?? 0}
                        icon="fas fa-chalkboard-teacher" iconBg="rgba(70,170,106,0.1)"
                        linkTo="/admin/teachers" linkLabel="View Teachers" linkColor="outline-success"
                    />
                    <StatCard
                        title="Active Classes" value={stats?.total_classes ?? 0}
                        icon="fas fa-door-open" iconBg="rgba(13,202,240,0.1)"
                        linkTo="/admin/programmes" linkLabel="View Classes" linkColor="outline-info"
                    />
                    <StatCard
                        title="Fees Collected" value={financial?.total_fees_collected ?? '—'}
                        icon="fas fa-money-bill-wave" iconBg="rgba(255,193,7,0.1)"
                        linkTo="/admin/fees" linkLabel="View Fees" linkColor="outline-warning"
                    />
                </div>
            )}

            {/* Attendance & Financial Summary */}
            <div className="row mb-4">
                {/* Attendance */}
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-calendar-check text-primary me-2"></i>Today's Attendance
                            </h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="placeholder-glow">
                                    <span className="placeholder col-12 d-block" style={{ height: 80 }}></span>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="text-center p-3 rounded" style={{ background: 'rgba(12,92,62,0.05)' }}>
                                            <h6 className="text-muted mb-2">Students Present</h6>
                                            <h3 className="mb-0 fw-bold" style={{ color: 'var(--primary-color)' }}>
                                                {attendance?.student_present_today ?? 0}
                                            </h3>
                                            <small className="text-muted">out of {stats?.total_students ?? 0}</small>
                                            <div className="progress mt-2" style={{ height: 6 }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${stats?.total_students ? Math.round((attendance?.student_present_today / stats.total_students) * 100) : 0}%`,
                                                        background: 'var(--primary-color)',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-3 rounded" style={{ background: 'rgba(70,170,106,0.05)' }}>
                                            <h6 className="text-muted mb-2">Teachers Present</h6>
                                            <h3 className="mb-0 fw-bold text-success">
                                                {attendance?.teacher_present_today ?? 0}
                                            </h3>
                                            <small className="text-muted">out of {stats?.total_teachers ?? 0}</small>
                                            <div className="progress mt-2" style={{ height: 6 }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    style={{
                                                        width: `${stats?.total_teachers ? Math.round((attendance?.teacher_present_today / stats.total_teachers) * 100) : 0}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-3">
                                <Link to="/admin/attendance" className="btn btn-primary w-100">
                                    <i className="fas fa-clipboard-list me-2"></i>View Full Attendance
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-chart-line text-warning me-2"></i>Financial Summary
                            </h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="placeholder-glow">
                                    <span className="placeholder col-12 d-block" style={{ height: 100 }}></span>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Total Collected (Year)</span>
                                            <strong style={{ color: 'var(--primary-color)' }}>
                                                {financial?.total_fees_collected ?? '—'}
                                            </strong>
                                        </div>
                                        <div className="progress" style={{ height: 8 }}>
                                            <div className="progress-bar" style={{ width: '70%', background: 'var(--primary-color)' }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Pending Fees</span>
                                            <strong className="text-danger">{financial?.pending_fees ?? '—'}</strong>
                                        </div>
                                        <div className="progress" style={{ height: 8 }}>
                                            <div className="progress-bar bg-danger" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                    <div className="alert alert-info mb-0">
                                        <i className="fas fa-info-circle me-2"></i>
                                        <strong>{financial?.payments_today ?? 0}</strong> payments received today
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="row mb-4">
                {/* Recent Students */}
                <div className="col-md-8 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-clock text-info me-2"></i>Recent Activity
                            </h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="placeholder-glow">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="d-flex align-items-center mb-3">
                                            <span className="placeholder rounded-circle me-3" style={{ width: 40, height: 40 }}></span>
                                            <div className="flex-grow-1">
                                                <span className="placeholder col-8 d-block mb-1"></span>
                                                <span className="placeholder col-5 d-block"></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : students.length === 0 ? (
                                <p className="text-muted text-center my-4">
                                    <i className="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                                    No recent registrations
                                </p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {students.map((s, i) => (
                                        <li key={i} className="list-group-item px-0">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-primary text-white p-2 me-3" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fas fa-user-plus"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <strong>{s.name}</strong> registered as a new student<br />
                                                    <small className="text-muted">{s.admission_number} — {s.created_at}</small>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-bolt text-warning me-2"></i>Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                {QUICK_ACTIONS.map((qa, i) => (
                                    <Link key={i} to={qa.to} className={`btn btn-${qa.color} text-start`}>
                                        <i className={`${qa.icon} me-2`}></i>{qa.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements & Exams */}
            <div className="row">
                {/* Announcements */}
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-bullhorn text-danger me-2"></i>Latest Announcements
                            </h5>
                        </div>
                        <div className="card-body">
                            {announcements.length === 0 ? (
                                <p className="text-muted text-center mb-0">No recent announcements</p>
                            ) : announcements.map((a, i) => (
                                <div key={i} className={`mb-3 ${i < announcements.length - 1 ? 'pb-3 border-bottom' : ''}`}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className={`badge bg-${a.priority === 'urgent' ? 'danger' : a.priority === 'high' ? 'warning' : 'info'}`}>
                                            {a.priority}
                                        </span>
                                        <small className="text-muted">{a.published_at}</small>
                                    </div>
                                    <h6 className="fw-bold mb-1">{a.title}</h6>
                                    <p className="mb-0 text-muted small">{a.content?.substring(0, 100)}…</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="col-md-6 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-calendar-alt text-success me-2"></i>Upcoming Exams
                            </h5>
                        </div>
                        <div className="card-body">
                            {exams.length === 0 ? (
                                <p className="text-muted text-center mb-0">No upcoming exams scheduled</p>
                            ) : exams.map((ex, i) => (
                                <div key={i} className={`mb-3 ${i < exams.length - 1 ? 'pb-3 border-bottom' : ''}`}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="badge bg-info">{ex.exam_type}</span>
                                        <small className="text-muted">{ex.exam_date}</small>
                                    </div>
                                    <h6 className="fw-bold mb-1">{ex.subject}</h6>
                                    <p className="mb-0 text-muted small">{ex.class_name} — {ex.start_time} to {ex.end_time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
