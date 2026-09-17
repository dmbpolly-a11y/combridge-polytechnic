import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ── Initial Mock Data for Dynamic Interactivity ─────────────────────────────
const INITIAL_DEPARTMENTS = [
    { id: 'clin-med', name: 'College of Clinical & Medicine', head: 'Dr. Arthur Mugisha (Dean)', status: 'Active', staff: 24, students: 480, icon: 'fas fa-heartbeat', color: '#006837' },
    { id: 'edu', name: 'College of Education', head: 'Prof. Sarah Namubiru (Dean)', status: 'Active', staff: 18, students: 390, icon: 'fas fa-chalkboard-teacher', color: '#051566' },
    { id: 'dean-students', name: 'Dean of Students Office', head: 'Mr. Emmanuel Byamukama', status: 'Active', staff: 8, students: 870, icon: 'fas fa-user-graduate', color: '#d97706' },
    { id: 'director', name: 'Office of the Director', head: 'Directorate Executive', status: 'Active', staff: 6, students: 870, icon: 'fas fa-landmark', color: '#c1272d' },
    { id: 'lecturers', name: 'Lecturers & Tutors Council', head: 'Senior Faculty Board', status: 'Active', staff: 42, students: 870, icon: 'fas fa-users-cog', color: '#2563eb' },
    { id: 'bursar', name: 'Bursar & Finance Office', head: 'Chief Financial Officer', status: 'Active', staff: 7, students: 870, icon: 'fas fa-coins', color: '#16a34a' },
    { id: 'students', name: 'Students Guild & Registry', head: 'Guild President & Secretariat', status: 'Active', staff: 5, students: 870, icon: 'fas fa-id-card', color: '#9333ea' },
    { id: 'library', name: 'Polytechnic Library & E-Resources', head: 'Head Librarian', status: 'Active', staff: 6, students: 870, icon: 'fas fa-book-reader', color: '#0284c7' },
    { id: 'store', name: 'Store Keeper & Inventory', head: 'Chief Logistics Officer', status: 'Active', staff: 4, students: 870, icon: 'fas fa-boxes', color: '#ea580c' },
    { id: 'it', name: 'IT & Systems Department', head: 'Director of ICT Services', status: 'Active', staff: 5, students: 870, icon: 'fas fa-laptop-code', color: '#0f766e' },
];

const INITIAL_PROGRAMMES = [
    { code: 'DCM', name: 'Diploma in Clinical Medicine & Community Health', faculty: 'Clinical & Medicine', duration: '3 Years', intake: 'August / January', status: 'Accredited' },
    { code: 'DNUR', name: 'Diploma in Nursing & Midwifery Science', faculty: 'Clinical & Medicine', duration: '3 Years', intake: 'August / January', status: 'Accredited' },
    { code: 'DMLS', name: 'Diploma in Medical Laboratory Technology', faculty: 'Clinical & Medicine', duration: '2 Years', intake: 'August / January', status: 'Accredited' },
    { code: 'DPED', name: 'Diploma in Primary & Early Childhood Education', faculty: 'College of Education', duration: '2 Years', intake: 'August', status: 'Accredited' },
    { code: 'DHSM', name: 'Diploma in Health Services Management', faculty: 'Clinical & Medicine', duration: '2 Years', intake: 'January', status: 'Accredited' },
    { code: 'CLSK', name: 'Certificate in Medical English & Foreign Languages', faculty: 'Life Skills Academy', duration: '6 Months', intake: 'Quarterly', status: 'Active' },
];

const INITIAL_STUDENTS = [
    { id: 'STU001', admNo: 'CP/MED/2026/001', name: 'Kigozi Ronald', prog: 'Clinical Medicine', year: 'Year 2', status: 'Active', coursework: 34, exam: 52, total: 86, grade: 'A', attendance: '96%', lecturer: 'Dr. Arthur Mugisha' },
    { id: 'STU002', admNo: 'CP/MED/2026/002', name: 'Ainembabazi Fiona', prog: 'Nursing Sciences', year: 'Year 1', status: 'Active', coursework: 31, exam: 48, total: 79, grade: 'B+', attendance: '92%', lecturer: 'Dr. Arthur Mugisha' },
    { id: 'STU003', admNo: 'CP/MED/2026/003', name: 'Tumuhimbise Ivan', prog: 'Medical Laboratory', year: 'Year 2', status: 'Active', coursework: 28, exam: 43, total: 71, grade: 'B', attendance: '88%', lecturer: 'Dr. Robert Kasaija' },
    { id: 'STU004', admNo: 'CP/EDU/2026/004', name: 'Nalubega Patricia', prog: 'Primary Education', year: 'Year 1', status: 'Active', coursework: 35, exam: 54, total: 89, grade: 'A', attendance: '98%', lecturer: 'Prof. Sarah Namubiru' },
    { id: 'STU005', admNo: 'CP/MED/2026/005', name: 'Musinguzi Brian', prog: 'Clinical Medicine', year: 'Year 2', status: 'Probation', coursework: 19, exam: 32, total: 51, grade: 'D+', attendance: '74%', lecturer: 'Dr. Arthur Mugisha' },
    { id: 'STU006', admNo: 'CP/MED/2026/006', name: 'Kemigisha Dianah', prog: 'Nursing Sciences', year: 'Year 1', status: 'Active', coursework: 32, exam: 50, total: 82, grade: 'A', attendance: '94%', lecturer: 'Dr. Arthur Mugisha' },
];

const INITIAL_APPLICATIONS = [
    { id: 'APP-101', name: 'Mukasa Dennis', programme: 'Diploma in Clinical Medicine', phone: '+256 701 123456', appliedOn: '2026-09-12', status: 'Pending Review' },
    { id: 'APP-102', name: 'Akello Grace', programme: 'Diploma in Nursing Science', phone: '+256 772 987654', appliedOn: '2026-09-14', status: 'Approved' },
    { id: 'APP-103', name: 'Ocen Emmanuel', programme: 'Medical Laboratory Technology', phone: '+256 788 334455', appliedOn: '2026-09-15', status: 'Approved' },
];

const INITIAL_EXAMS = [
    { id: 'EX-01', code: 'MED 2101', course: 'Clinical Pharmacology & Therapeutics', setter: 'Dr. Arthur Mugisha', vettedBy: 'Dean Clinical Medicine', status: 'Approved & Printed', examDate: '2026-10-14' },
    { id: 'EX-02', code: 'ANAT 1102', course: 'Human Anatomy & Histology II', setter: 'Dr. Robert Kasaija', vettedBy: 'Dean Clinical Medicine', status: 'Under Moderation', examDate: '2026-10-16' },
    { id: 'EX-03', code: 'NUR 2205', course: 'Advanced Maternal & Child Nursing', setter: 'Sr. Mary Birungi', vettedBy: 'Dean Clinical Medicine', status: 'Pending Review', examDate: '2026-10-18' },
    { id: 'EX-04', code: 'PATH 2104', course: 'Clinical Pathology & Microbiology', setter: 'Dr. David Twinomugisha', vettedBy: 'Dean Clinical Medicine', status: 'Approved & Printed', examDate: '2026-10-21' },
];

export default function UniversityManagement() {
    const { portal: portalId } = useParams();
    const navigate = useNavigate();

    // Active portal state (default to 'overview' or matching route)
    const activePortal = portalId || 'overview';

    // State collections
    const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
    const [programmes, setProgrammes] = useState(INITIAL_PROGRAMMES);
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
    const [exams, setExams] = useState(INITIAL_EXAMS);

    // Toast/Alert message state
    const [actionMessage, setActionMessage] = useState('');

    const showNotification = (msg) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(''), 4000);
    };

    // ── Academic Registrar: New Student Form State ───────────────────────────
    const [newReg, setNewReg] = useState({
        name: '',
        programme: 'Diploma in Clinical Medicine & Community Health',
        year: 'Year 1',
        phone: '',
    });

    const handleRegisterStudent = (e) => {
        e.preventDefault();
        const nextId = `STU00${students.length + 1}`;
        const prefix = newReg.programme.includes('Clinical') ? 'CP/MED' : newReg.programme.includes('Education') ? 'CP/EDU' : 'CP/GEN';
        const generatedAdm = `${prefix}/2026/0${students.length + 1}`;

        const freshStudent = {
            id: nextId,
            admNo: generatedAdm,
            name: newReg.name,
            prog: newReg.programme.split(' in ')[1] || newReg.programme,
            year: newReg.year,
            status: 'Active',
            coursework: 0,
            exam: 0,
            total: 0,
            grade: 'Pending',
            attendance: '100%',
            lecturer: 'Dr. Arthur Mugisha'
        };

        setStudents(prev => [freshStudent, ...prev]);
        setNewReg({ name: '', programme: 'Diploma in Clinical Medicine & Community Health', year: 'Year 1', phone: '' });
        showNotification(`Student registered successfully! Generated Admission No: ${generatedAdm}`);
    };

    // ── Lecturer: Enter / Edit Marks State ────────────────────────────────────
    const [marksBuffer, setMarksBuffer] = useState({});

    const handleMarksChange = (studentId, field, val) => {
        const numeric = Math.max(0, Math.min(field === 'coursework' ? 40 : 60, Number(val) || 0));
        setMarksBuffer(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [field]: numeric
            }
        }));
    };

    const handleSaveMarks = (studentId) => {
        const updates = marksBuffer[studentId] || {};
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const cw = updates.coursework !== undefined ? updates.coursework : s.coursework;
                const ex = updates.exam !== undefined ? updates.exam : s.exam;
                const tot = cw + ex;
                const gr = tot >= 80 ? 'A' : tot >= 75 ? 'B+' : tot >= 70 ? 'B' : tot >= 65 ? 'C+' : tot >= 60 ? 'C' : tot >= 50 ? 'D' : 'F';
                return { ...s, coursework: cw, exam: ex, total: tot, grade: gr };
            }
            return s;
        }));
        showNotification(`Marks saved successfully for student ID: ${studentId}`);
    };

    // ── Lecturer: Import Fresh Students from Registrar ───────────────────────
    const handleImportFromRegistrar = () => {
        showNotification(`Synchronized with Academic Registrar! 6 students updated in your teaching roster.`);
    };

    // ── Dean Clinical & Medicine: Moderate Exam ──────────────────────────────
    const handleToggleExamStatus = (examId) => {
        setExams(prev => prev.map(ex => {
            if (ex.id === examId) {
                const nextStatus = ex.status === 'Approved & Printed' ? 'Requires Revision' : 'Approved & Printed';
                return { ...ex, status: nextStatus };
            }
            return ex;
        }));
        showNotification(`Exam moderation status updated by Dean of Clinical & Medicine.`);
    };

    // ── Deputy Registrar: Upload / Sync Marks to Official Database ───────────
    const handleSyncDeputyMarks = () => {
        showNotification(`All lecturer marks synchronized with Central Academic Registrar Ledger! Student Portal marks updated.`);
    };

    return (
        <div className="university-management-page bg-light py-4 min-vh-100">
            {/* Header Banner */}
            <div className="container mb-4">
                <div className="card border-0 rounded-4 shadow-sm text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #004d28 0%, #006837 50%, #051566 100%)' }}>
                    <div className="card-body p-4 p-lg-5">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2 bg-white bg-opacity-25">
                                    <i className="fas fa-shield-alt text-warning"></i>
                                    <span className="small fw-bold">Internal Institutional Governance & Portals</span>
                                </div>
                                <h1 className="fw-bold mb-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.3rem)' }}>
                                    University Management & Role Portals
                                </h1>
                                <p className="lead mb-0 opacity-90 small" style={{ maxWidth: 750 }}>
                                    Comprehensive management system connecting the <strong>Admin (Head of Deans & Departments)</strong>, <strong>Academic Registrar</strong>, <strong>Lecturers & Tutors</strong>, <strong>Dean of Clinical & Medicine</strong>, and <strong>Deputy Academic Registrar</strong>.
                                </p>
                            </div>
                            <div className="text-end d-none d-md-block">
                                <span className="badge bg-warning text-dark px-3 py-2 fw-bold fs-6 shadow-sm">
                                    <i className="fas fa-university me-1"></i> Combridge Institute
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Notification Banner */}
                {actionMessage && (
                    <div className="alert alert-success alert-dismissible fade show mt-3 shadow-sm d-flex align-items-center gap-2" role="alert">
                        <i className="fas fa-check-circle fa-lg text-success"></i>
                        <div><strong>System Notice:</strong> {actionMessage}</div>
                        <button type="button" className="btn-close" onClick={() => setActionMessage('')} aria-label="Close"></button>
                    </div>
                )}

                {/* Role Switcher Tabs */}
                <div className="card border-0 rounded-4 shadow-sm mt-4 p-2 bg-white">
                    <div className="nav nav-pills nav-fill flex-column flex-md-row gap-2">
                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'overview' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management')}
                        >
                            <i className="fas fa-th-large me-2"></i>Portals Overview
                        </button>

                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'admin' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management/admin')}
                        >
                            <i className="fas fa-user-shield me-2"></i>Admin Portal
                        </button>

                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'academic-registrar' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management/academic-registrar')}
                        >
                            <i className="fas fa-user-tie me-2"></i>Academic Registrar
                        </button>

                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'lecturer' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management/lecturer')}
                        >
                            <i className="fas fa-chalkboard-teacher me-2"></i>Lecturer / Tutor
                        </button>

                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'dean-clinical-medicine' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management/dean-clinical-medicine')}
                        >
                            <i className="fas fa-stethoscope me-2"></i>Dean Clinical & Med.
                        </button>

                        <button
                            className={`nav-link py-2 px-3 rounded-3 fw-bold text-start text-md-center ${activePortal === 'deputy-registrar' ? 'active bg-success text-white' : 'text-dark'}`}
                            onClick={() => navigate('/university-management/deputy-registrar')}
                        >
                            <i className="fas fa-tasks me-2"></i>Deputy Registrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Portal Viewports */}
            <div className="container">
                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 1: OVERVIEW & PORTAL HUB
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'overview' && (
                    <div className="fade-in">
                        <div className="row g-4 mb-4">
                            {/* Role Card 1: Admin */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-shadow transition-all" style={{ borderTop: '5px solid #006837' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, background: '#006837' }}>
                                            <i className="fas fa-crown fa-lg"></i>
                                        </div>
                                        <span className="badge bg-success bg-opacity-10 text-success fw-bold">Master Control</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">Admin Portal</h4>
                                    <p className="text-muted small mb-3">
                                        Controls the whole system, serves as the <strong>Head of Deans</strong>, and oversees all 10 academic and administrative departments.
                                    </p>
                                    <div className="small text-muted mb-4">
                                        <i className="fas fa-check text-success me-1"></i> 10 Managed Departments<br />
                                        <i className="fas fa-check text-success me-1"></i> Head of Faculty Deans<br />
                                        <i className="fas fa-check text-success me-1"></i> Overall Institutional Command
                                    </div>
                                    <button onClick={() => navigate('/university-management/admin')} className="btn btn-success w-100 fw-bold mt-auto">
                                        Access Admin Portal <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Role Card 2: Academic Registrar */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-shadow transition-all" style={{ borderTop: '5px solid #051566' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, background: '#051566' }}>
                                            <i className="fas fa-user-tie fa-lg"></i>
                                        </div>
                                        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">Academic Registry</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">Academic Registrar</h4>
                                    <p className="text-muted small mb-3">
                                        Registers students, generates admission numbers, receives & processes admissions, configures academic programmes, and manages marks entry.
                                    </p>
                                    <div className="small text-muted mb-4">
                                        <i className="fas fa-check text-primary me-1"></i> Student Registration & Adm. Numbers<br />
                                        <i className="fas fa-check text-primary me-1"></i> Programme & Curriculum Setting<br />
                                        <i className="fas fa-check text-primary me-1"></i> Central Marks Management
                                    </div>
                                    <button onClick={() => navigate('/university-management/academic-registrar')} className="btn btn-outline-primary w-100 fw-bold mt-auto">
                                        Access Registrar Portal <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Role Card 3: Lecturer / Tutor */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-shadow transition-all" style={{ borderTop: '5px solid #d97706' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, background: '#d97706' }}>
                                            <i className="fas fa-chalkboard-teacher fa-lg"></i>
                                        </div>
                                        <span className="badge bg-warning bg-opacity-10 text-dark fw-bold">Teaching Faculty</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">Lecturer / Tutor Portal</h4>
                                    <p className="text-muted small mb-3">
                                        Enables tutors to view their teaching rosters, import students directly from the Academic Registrar, and enter coursework and examination marks.
                                    </p>
                                    <div className="small text-muted mb-4">
                                        <i className="fas fa-check text-warning me-1"></i> Course Roster & Student Lists<br />
                                        <i className="fas fa-check text-warning me-1"></i> Import from Registrar Database<br />
                                        <i className="fas fa-check text-warning me-1"></i> Direct Marks & Exam Scores Entry
                                    </div>
                                    <button onClick={() => navigate('/university-management/lecturer')} className="btn btn-warning w-100 fw-bold text-dark mt-auto">
                                        Access Lecturer Portal <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Role Card 4: Dean Faculty of Clinical & Medicine */}
                            <div className="col-lg-6 col-md-6">
                                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-shadow transition-all" style={{ borderTop: '5px solid #c1272d' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, background: '#c1272d' }}>
                                            <i className="fas fa-user-md fa-lg"></i>
                                        </div>
                                        <span className="badge bg-danger bg-opacity-10 text-danger fw-bold">Dean Oversight</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">Dean, Faculty of Clinical & Medicine</h4>
                                    <p className="text-muted small mb-3">
                                        Dedicated portal for the Dean to monitor faculty student marks, check ward & classroom attendances, and review how exams are moderated and set.
                                    </p>
                                    <div className="small text-muted mb-4">
                                        <i className="fas fa-check text-danger me-1"></i> Health Sciences Performance & Marks<br />
                                        <i className="fas fa-check text-danger me-1"></i> Clinical & Ward Attendance Checks<br />
                                        <i className="fas fa-check text-danger me-1"></i> Exam Setting Moderation & Approvals
                                    </div>
                                    <button onClick={() => navigate('/university-management/dean-clinical-medicine')} className="btn btn-outline-danger w-100 fw-bold mt-auto">
                                        Access Dean Clinical Portal <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Role Card 5: Deputy Academic Registrar */}
                            <div className="col-lg-6 col-md-12">
                                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white hover-shadow transition-all" style={{ borderTop: '5px solid #2563eb' }}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, background: '#2563eb' }}>
                                            <i className="fas fa-tasks fa-lg"></i>
                                        </div>
                                        <span className="badge bg-info bg-opacity-10 text-primary fw-bold">Student Portal Operations</span>
                                    </div>
                                    <h4 className="fw-bold mb-1">Deputy Academic Registrar</h4>
                                    <p className="text-muted small mb-3">
                                        Manages student portal operations, edits and audits submitted marks, and uploads/synchronizes grade rosters directly with the Academic Registrar master portal.
                                    </p>
                                    <div className="small text-muted mb-4">
                                        <i className="fas fa-check text-primary me-1"></i> Student Portal Administration<br />
                                        <i className="fas fa-check text-primary me-1"></i> Edit & Validate Student Scores<br />
                                        <i className="fas fa-check text-primary me-1"></i> Synchronize with Academic Registrar
                                    </div>
                                    <button onClick={() => navigate('/university-management/deputy-registrar')} className="btn btn-outline-primary w-100 fw-bold mt-auto">
                                        Access Deputy Registrar Portal <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 2: ADMIN PORTAL (HEAD OF DEANS & 10 DEPARTMENTS)
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'admin' && (
                    <div className="fade-in">
                        {/* Admin Overview Banner */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <span className="badge bg-success text-white px-3 py-1 mb-2">Master Administrator</span>
                                    <h3 className="fw-bold text-success mb-1">System Command & Head of Deans</h3>
                                    <p className="text-muted small mb-0">
                                        Executive authority controlling the institutional database and directly heading all 10 departments of Combridge Institute.
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={() => showNotification("System Audit Log generated. All 10 departments online.")} className="btn btn-sm btn-outline-success fw-bold">
                                        <i className="fas fa-clipboard-list me-1"></i> Generate System Audit
                                    </button>
                                    <button onClick={() => showNotification("All 10 departmental data caches refreshed.")} className="btn btn-sm btn-success fw-bold">
                                        <i className="fas fa-sync-alt me-1"></i> Sync All Departments
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 10 Managed Departments */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <h5 className="fw-bold text-success mb-3">
                                <i className="fas fa-sitemap me-2"></i>10 Managed Departments & Administrative Units
                            </h5>
                            <div className="row g-3">
                                {departments.map((dept, i) => (
                                    <div key={dept.id} className="col-lg-6">
                                        <div className="card border-0 bg-light rounded-3 p-3 h-100 shadow-sm transition-all hover-shadow" style={{ borderLeft: `5px solid ${dept.color}` }}>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 36, height: 36, background: dept.color }}>
                                                        <i className={`${dept.icon} fa-sm`}></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="fw-bold mb-0 text-dark">{dept.name}</h6>
                                                        <small className="text-muted">{dept.head}</small>
                                                    </div>
                                                </div>
                                                <span className="badge bg-success bg-opacity-25 text-success fw-bold">{dept.status}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top small text-muted">
                                                <span><i className="fas fa-user-friends me-1"></i>Staff: <strong>{dept.staff}</strong></span>
                                                <span><i className="fas fa-user-graduate me-1"></i>Enrolled: <strong>{dept.students}</strong></span>
                                                <button
                                                    onClick={() => showNotification(`Opened control panel for ${dept.name}`)}
                                                    className="btn btn-sm btn-outline-secondary py-0 px-2 small"
                                                >
                                                    Manage Unit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 3: ACADEMIC REGISTRAR PORTAL
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'academic-registrar' && (
                    <div className="fade-in">
                        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div>
                                    <span className="badge bg-primary text-white px-3 py-1 mb-2">Office of the Academic Registrar</span>
                                    <h3 className="fw-bold text-primary mb-1">Student Admissions, Registration & Programme Setting</h3>
                                    <p className="text-muted small mb-0">
                                        Direct issuance of official admission numbers, registration of incoming trainees, accredited programmes management, and central marks control.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Student Registration Box */}
                        <div className="row g-4 mb-4">
                            <div className="col-lg-5">
                                <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                                    <h5 className="fw-bold text-primary mb-3">
                                        <i className="fas fa-user-plus me-2"></i>Register New Student & Issue Adm. No.
                                    </h5>
                                    <form onSubmit={handleRegisterStudent}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Student Full Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                placeholder="e.g. Mugisha Alex"
                                                value={newReg.name}
                                                onChange={(e) => setNewReg({ ...newReg, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Academic Programme *</label>
                                            <select
                                                className="form-select"
                                                value={newReg.programme}
                                                onChange={(e) => setNewReg({ ...newReg, programme: e.target.value })}
                                            >
                                                {programmes.map((p, i) => (
                                                    <option key={i} value={p.name}>{p.name} ({p.code})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Year of Study</label>
                                            <select
                                                className="form-select"
                                                value={newReg.year}
                                                onChange={(e) => setNewReg({ ...newReg, year: e.target.value })}
                                            >
                                                <option>Year 1</option>
                                                <option>Year 2</option>
                                                <option>Year 3</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Contact Telephone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="+256 700 000000"
                                                value={newReg.phone}
                                                onChange={(e) => setNewReg({ ...newReg, phone: e.target.value })}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100 fw-bold">
                                            <i className="fas fa-id-badge me-1"></i> Register & Generate Admission Number
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Received Admissions Queue */}
                            <div className="col-lg-7">
                                <div className="card border-0 rounded-4 shadow-sm p-4 bg-white h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold text-primary mb-0">
                                            <i className="fas fa-inbox me-2"></i>Receive & Review Online Admissions
                                        </h5>
                                        <span className="badge bg-warning text-dark">{applications.length} Pending</span>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle small">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>App ID</th>
                                                    <th>Applicant</th>
                                                    <th>Programme</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applications.map((app) => (
                                                    <tr key={app.id}>
                                                        <td className="fw-bold">{app.id}</td>
                                                        <td>{app.name}</td>
                                                        <td className="text-truncate" style={{ maxWidth: 140 }}>{app.programme}</td>
                                                        <td>{app.appliedOn}</td>
                                                        <td>
                                                            <span className={`badge ${app.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a));
                                                                    showNotification(`Application ${app.id} approved by Academic Registrar!`);
                                                                }}
                                                                className="btn btn-sm btn-outline-success py-0 px-2"
                                                            >
                                                                Accept
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Accredited Programmes Management & Student Directory */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fas fa-list-alt me-2"></i>Set Programmes & Curricula
                            </h5>
                            <div className="table-responsive mb-4">
                                <table className="table table-bordered table-striped small align-middle">
                                    <thead className="table-primary text-white">
                                        <tr>
                                            <th>Code</th>
                                            <th>Programme Title</th>
                                            <th>Faculty / College</th>
                                            <th>Duration</th>
                                            <th>Intake Cycles</th>
                                            <th>Accreditation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programmes.map((p, i) => (
                                            <tr key={i}>
                                                <td className="fw-bold">{p.code}</td>
                                                <td>{p.name}</td>
                                                <td>{p.faculty}</td>
                                                <td>{p.duration}</td>
                                                <td>{p.intake}</td>
                                                <td><span className="badge bg-success">{p.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Registered Students & Status List */}
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fas fa-users me-2"></i>Enrolled Students Directory & Status
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle small">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Adm. Number</th>
                                            <th>Full Name</th>
                                            <th>Programme</th>
                                            <th>Year</th>
                                            <th>Status</th>
                                            <th>Assigned Lecturer</th>
                                            <th>Marks Entry Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((st) => (
                                            <tr key={st.id}>
                                                <td className="fw-bold text-primary">{st.admNo}</td>
                                                <td>{st.name}</td>
                                                <td>{st.prog}</td>
                                                <td>{st.year}</td>
                                                <td>
                                                    <span className={`badge ${st.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                                        {st.status}
                                                    </span>
                                                </td>
                                                <td>{st.lecturer}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        Total: {st.total}/100 ({st.grade})
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 4: LECTURER / TUTOR PORTAL
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'lecturer' && (
                    <div className="fade-in">
                        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div>
                                    <span className="badge bg-warning text-dark px-3 py-1 mb-2">Teaching Faculty Portal</span>
                                    <h3 className="fw-bold text-dark mb-1">Lecturer & Tutor Marksheet & Course Roster</h3>
                                    <p className="text-muted small mb-0">
                                        Assigned Lecturer: <strong>Dr. Arthur Mugisha</strong> | Department of Clinical Medicine & Health Sciences.
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={handleImportFromRegistrar} className="btn btn-sm btn-outline-primary fw-bold">
                                        <i className="fas fa-file-import me-1"></i> Import Students from Registrar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Marks Entry Sheet */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                                <h5 className="fw-bold text-success mb-0">
                                    <i className="fas fa-edit me-2"></i>Students You Teach — Marks Entry Sheet
                                </h5>
                                <span className="small text-muted">
                                    Coursework (/40) + Exam (/60) = Total (/100)
                                </span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered align-middle small">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Adm. Number</th>
                                            <th>Student Name</th>
                                            <th>Course / Programme</th>
                                            <th style={{ width: '130px' }}>Coursework (/40)</th>
                                            <th style={{ width: '130px' }}>Exam (/60)</th>
                                            <th>Total (/100)</th>
                                            <th>Grade</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((st) => (
                                            <tr key={st.id}>
                                                <td className="fw-bold text-success">{st.admNo}</td>
                                                <td className="fw-semibold">{st.name}</td>
                                                <td>{st.prog}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        max="40"
                                                        min="0"
                                                        className="form-control form-control-sm"
                                                        defaultValue={st.coursework}
                                                        onChange={(e) => handleMarksChange(st.id, 'coursework', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        max="60"
                                                        min="0"
                                                        className="form-control form-control-sm"
                                                        defaultValue={st.exam}
                                                        onChange={(e) => handleMarksChange(st.id, 'exam', e.target.value)}
                                                    />
                                                </td>
                                                <td className="fw-bold fs-6 text-center text-primary">
                                                    {st.total}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${st.grade === 'A' ? 'bg-success' : st.grade === 'F' ? 'bg-danger' : 'bg-info text-dark'}`}>
                                                        {st.grade}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleSaveMarks(st.id)}
                                                        className="btn btn-sm btn-success py-1 px-2 fw-bold"
                                                    >
                                                        <i className="fas fa-save me-1"></i> Save
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 5: DEAN FACULTY OF CLINICAL & MEDICINE
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'dean-clinical-medicine' && (
                    <div className="fade-in">
                        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div>
                                    <span className="badge bg-danger text-white px-3 py-1 mb-2">Faculty Leadership</span>
                                    <h3 className="fw-bold text-danger mb-1">Dean, Faculty of Clinical Medicine & Healthcare Sciences</h3>
                                    <p className="text-muted small mb-0">
                                        Dean Oversight: Performance Analytics, Ward & Classroom Attendance Monitoring, and Examination Setting Moderation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Exam Setting Moderation */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <h5 className="fw-bold text-danger mb-3">
                                <i className="fas fa-file-medical-alt me-2"></i>Review How Exams are Set & Vetted
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle small">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Exam Code</th>
                                            <th>Course Name</th>
                                            <th>Paper Setter</th>
                                            <th>Exam Date</th>
                                            <th>Moderation Status</th>
                                            <th>Dean Review Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((ex) => (
                                            <tr key={ex.id}>
                                                <td className="fw-bold text-danger">{ex.code}</td>
                                                <td>{ex.course}</td>
                                                <td>{ex.setter}</td>
                                                <td>{ex.examDate}</td>
                                                <td>
                                                    <span className={`badge ${ex.status === 'Approved & Printed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {ex.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleToggleExamStatus(ex.id)}
                                                        className="btn btn-sm btn-outline-danger py-0 px-2 fw-bold"
                                                    >
                                                        <i className="fas fa-check-double me-1"></i>
                                                        {ex.status === 'Approved & Printed' ? 'Flag for Edit' : 'Approve Setting'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 2: Clinical Attendance & Ward Rotation */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <h5 className="fw-bold text-danger mb-3">
                                <i className="fas fa-clipboard-check me-2"></i>Clinical Rotations & Attendance Records
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-bordered small align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Adm. Number</th>
                                            <th>Student Name</th>
                                            <th>Clinical Programme</th>
                                            <th>Attendance Rate</th>
                                            <th>Ward Clearance Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((st) => (
                                            <tr key={st.id}>
                                                <td className="fw-bold">{st.admNo}</td>
                                                <td>{st.name}</td>
                                                <td>{st.prog}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                            <div
                                                                className="progress-bar bg-success"
                                                                style={{ width: st.attendance }}
                                                            ></div>
                                                        </div>
                                                        <span className="fw-bold">{st.attendance}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-success bg-opacity-25 text-success">
                                                        Eligible for Practicals
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    VIEW 6: DEPUTY ACADEMIC REGISTRAR PORTAL
                   ════════════════════════════════════════════════════════════════════ */}
                {activePortal === 'deputy-registrar' && (
                    <div className="fade-in">
                        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4 bg-white">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <div>
                                    <span className="badge bg-info text-white px-3 py-1 mb-2">Operational Registry</span>
                                    <h3 className="fw-bold text-primary mb-1">Deputy Academic Registrar Operations</h3>
                                    <p className="text-muted small mb-0">
                                        Manage student portal marks, review lecturer submissions, edit discrepancy marks, and upload final rosters to Academic Registrar.
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={handleSyncDeputyMarks} className="btn btn-sm btn-primary fw-bold">
                                        <i className="fas fa-cloud-upload-alt me-1"></i> Upload & Sync to Registrar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Marks Management & Synchronization Table */}
                        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white mb-4">
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fas fa-tasks me-2"></i>Student Portal Marks Review & Edit Suite
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle small">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Adm. Number</th>
                                            <th>Student Name</th>
                                            <th>Coursework (/40)</th>
                                            <th>Exam (/60)</th>
                                            <th>Total (/100)</th>
                                            <th>Final Grade</th>
                                            <th>Portal Status</th>
                                            <th>Deputy Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((st) => (
                                            <tr key={st.id}>
                                                <td className="fw-bold text-primary">{st.admNo}</td>
                                                <td>{st.name}</td>
                                                <td>{st.coursework}</td>
                                                <td>{st.exam}</td>
                                                <td className="fw-bold text-success">{st.total}</td>
                                                <td>
                                                    <span className={`badge ${st.grade === 'A' ? 'bg-success' : 'bg-primary'}`}>
                                                        {st.grade}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-success bg-opacity-25 text-success">
                                                        Published to Portal
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => {
                                                            handleSaveMarks(st.id);
                                                            showNotification(`Deputy Registrar verified marks for ${st.name}`);
                                                        }}
                                                        className="btn btn-sm btn-outline-primary py-0 px-2"
                                                    >
                                                        Approve / Sync
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
