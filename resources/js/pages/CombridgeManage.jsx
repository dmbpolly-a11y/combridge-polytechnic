import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ── SHARED MOCK DATA ──────────────────────────────────────────────────────────
const PROGRAMMES_LIST = [
    'Diploma in Clinical Medicine & Community Health',
    'Diploma in Nursing & Midwifery Science',
    'Diploma in Medical Laboratory Technology',
    'Diploma in Primary & Early Childhood Education',
    'Diploma in Health Services Management',
    'Certificate in Medical English & Foreign Languages',
];

const calcGrade = (total) => {
    if (total >= 80) return { grade: 'A',  remarks: 'Excellent' };
    if (total >= 70) return { grade: 'B+', remarks: 'Very Good' };
    if (total >= 60) return { grade: 'B',  remarks: 'Good' };
    if (total >= 55) return { grade: 'C+', remarks: 'Fairly Good' };
    if (total >= 50) return { grade: 'C',  remarks: 'Average' };
    if (total >= 45) return { grade: 'D+', remarks: 'Below Average' };
    return { grade: 'F', remarks: 'Fail' };
};

const fmtUgx = (n) => `UGX ${Number(n).toLocaleString()}`;

const INIT_STUDENTS = [
    { id:'STU001', admNo:'CP/MED/2026/001', name:'Kigozi Ronald',      prog:'Clinical Medicine',  year:'Year 2', phone:'+256 701 123456', status:'Active',   cw:34, exam:52, total:86, grade:'A',  remarks:'Excellent',     attendance:96, lecturer:'Dr. Arthur Mugisha' },
    { id:'STU002', admNo:'CP/MED/2026/002', name:'Ainembabazi Fiona',  prog:'Nursing Sciences',   year:'Year 1', phone:'+256 772 654321', status:'Active',   cw:31, exam:48, total:79, grade:'B+', remarks:'Very Good',      attendance:92, lecturer:'Dr. Arthur Mugisha' },
    { id:'STU003', admNo:'CP/MED/2026/003', name:'Tumuhimbise Ivan',   prog:'Medical Laboratory', year:'Year 2', phone:'+256 788 334455', status:'Active',   cw:28, exam:43, total:71, grade:'B',  remarks:'Good',           attendance:88, lecturer:'Dr. Robert Kasaija' },
    { id:'STU004', admNo:'CP/EDU/2026/004', name:'Nalubega Patricia',  prog:'Primary Education',  year:'Year 1', phone:'+256 756 789012', status:'Active',   cw:35, exam:54, total:89, grade:'A',  remarks:'Excellent',     attendance:98, lecturer:'Prof. Sarah Namubiru' },
    { id:'STU005', admNo:'CP/MED/2026/005', name:'Musinguzi Brian',    prog:'Clinical Medicine',  year:'Year 2', phone:'+256 703 445566', status:'Probation',cw:19, exam:32, total:51, grade:'C',  remarks:'Average',        attendance:74, lecturer:'Dr. Arthur Mugisha' },
    { id:'STU006', admNo:'CP/MED/2026/006', name:'Kemigisha Dianah',   prog:'Nursing Sciences',   year:'Year 1', phone:'+256 787 112233', status:'Active',   cw:32, exam:50, total:82, grade:'A',  remarks:'Very Good',      attendance:94, lecturer:'Dr. Arthur Mugisha' },
    { id:'STU007', admNo:'CP/MED/2026/007', name:'Byamugisha Herbert', prog:'Medical Laboratory', year:'Year 1', phone:'+256 770 998877', status:'Active',   cw:25, exam:38, total:63, grade:'B',  remarks:'Good',           attendance:80, lecturer:'Dr. Robert Kasaija' },
    { id:'STU008', admNo:'CP/HSM/2026/008', name:'Nakazibwe Flavia',   prog:'Health Management',  year:'Year 1', phone:'+256 751 334455', status:'Active',   cw:30, exam:46, total:76, grade:'B+', remarks:'Good',           attendance:90, lecturer:'Mr. John Kabiito' },
];

const INIT_APPLICATIONS = [
    { id:'APP-101', name:'Mukasa Dennis',  programme:'Diploma in Clinical Medicine',      phone:'+256 701 123456', appliedOn:'2026-09-12', status:'Pending Review' },
    { id:'APP-102', name:'Akello Grace',   programme:'Diploma in Nursing Science',        phone:'+256 772 987654', appliedOn:'2026-09-14', status:'Approved' },
    { id:'APP-103', name:'Ocen Emmanuel',  programme:'Medical Laboratory Technology',     phone:'+256 788 334455', appliedOn:'2026-09-15', status:'Approved' },
    { id:'APP-104', name:'Tibakweba Joy',  programme:'Diploma in Primary Education',      phone:'+256 756 223344', appliedOn:'2026-09-16', status:'Pending Review' },
    { id:'APP-105', name:'Amanya Rogers',  programme:'Health Services Management',        phone:'+256 703 667788', appliedOn:'2026-09-16', status:'Rejected' },
];

const INIT_EXAMS = [
    { id:'EX-01', code:'MED 2101',  course:'Clinical Pharmacology & Therapeutics',  setter:'Dr. Arthur Mugisha',     vettedBy:'Dean Clinical Medicine', status:'Approved & Printed',  examDate:'2026-10-14' },
    { id:'EX-02', code:'ANAT 1102', course:'Human Anatomy & Histology II',           setter:'Dr. Robert Kasaija',     vettedBy:'Dean Clinical Medicine', status:'Under Moderation',    examDate:'2026-10-16' },
    { id:'EX-03', code:'NUR 2205',  course:'Advanced Maternal & Child Nursing',      setter:'Sr. Mary Birungi',       vettedBy:'Pending Review',         status:'Pending Review',      examDate:'2026-10-18' },
    { id:'EX-04', code:'PATH 2104', course:'Clinical Pathology & Microbiology',      setter:'Dr. David Twinomugisha', vettedBy:'Dean Clinical Medicine', status:'Approved & Printed',  examDate:'2026-10-21' },
];

const INIT_FEES = [
    { id:'FEE-01', programme:'Diploma in Clinical Medicine',      year:'Year 1', tuition:1800000, functional:250000, total:2050000 },
    { id:'FEE-02', programme:'Diploma in Nursing & Midwifery',    year:'Year 1', tuition:1900000, functional:250000, total:2150000 },
    { id:'FEE-03', programme:'Medical Laboratory Technology',     year:'Year 1', tuition:1700000, functional:250000, total:1950000 },
    { id:'FEE-04', programme:'Diploma in Primary Education',      year:'Year 1', tuition:1200000, functional:200000, total:1400000 },
];

const INIT_PAYMENTS = [
    { id:'PAY-001', admNo:'CP/MED/2026/001', name:'Kigozi Ronald',      amount:1500000, date:'2026-09-02', method:'Mobile Money',  ref:'MM20260902KR', balance:550000 },
    { id:'PAY-002', admNo:'CP/MED/2026/002', name:'Ainembabazi Fiona',  amount:2150000, date:'2026-09-04', method:'Bank Transfer', ref:'BT20260904AF', balance:0 },
    { id:'PAY-003', admNo:'CP/MED/2026/003', name:'Tumuhimbise Ivan',   amount:900000,  date:'2026-09-05', method:'Cash',          ref:'CASH-003',     balance:1050000 },
    { id:'PAY-004', admNo:'CP/EDU/2026/004', name:'Nalubega Patricia',  amount:1400000, date:'2026-09-06', method:'Mobile Money',  ref:'MM20260906NP', balance:0 },
    { id:'PAY-005', admNo:'CP/MED/2026/005', name:'Musinguzi Brian',    amount:500000,  date:'2026-09-10', method:'Cash',          ref:'CASH-005',     balance:1550000 },
];

const INIT_BOOKS = [
    { id:'BK-001', title:"Gray's Anatomy",                       author:'Henry Gray',       dept:'Clinical & Medicine', course:'Anatomy & Histology',    qty:12, available:9,  old:4, newBooks:8, status:'Available' },
    { id:'BK-002', title:'Clinical Pharmacology & Therapeutics', author:'D. R. Laurence',   dept:'Clinical & Medicine', course:'Clinical Pharmacology',  qty:8,  available:5,  old:3, newBooks:5, status:'Available' },
    { id:'BK-003', title:'Nursing & Midwifery Essentials',       author:'Janice Brooker',   dept:'Clinical & Medicine', course:'Nursing Sciences',       qty:15, available:12, old:6, newBooks:9, status:'Available' },
    { id:'BK-004', title:'Medical Microbiology',                 author:'Patrick Murray',   dept:'Clinical & Medicine', course:'Microbiology & Pathology',qty:6,  available:2,  old:2, newBooks:4, status:'Low Stock' },
    { id:'BK-005', title:'Foundations of Education',             author:'Allan Ornstein',   dept:'College of Education',course:'Education Psychology',    qty:10, available:8,  old:5, newBooks:5, status:'Available' },
    { id:'BK-006', title:'Health Services Management',           author:'S. M. Shortell',   dept:'Health Management',   course:'Health Services Admin',   qty:7,  available:6,  old:2, newBooks:5, status:'Available' },
];

const INIT_BORROWINGS = [
    { id:'BR-001', bookId:'BK-001', bookTitle:"Gray's Anatomy",            admNo:'CP/MED/2026/001', studentName:'Kigozi Ronald',     issuedOn:'2026-09-10', dueOn:'2026-09-24', returnedOn:null,         status:'Borrowed' },
    { id:'BR-002', bookId:'BK-002', bookTitle:'Clinical Pharmacology',     admNo:'CP/MED/2026/002', studentName:'Ainembabazi Fiona', issuedOn:'2026-09-08', dueOn:'2026-09-22', returnedOn:null,         status:'Borrowed' },
    { id:'BR-003', bookId:'BK-003', bookTitle:'Nursing Essentials',        admNo:'CP/MED/2026/006', studentName:'Kemigisha Dianah',  issuedOn:'2026-09-05', dueOn:'2026-09-19', returnedOn:'2026-09-18', status:'Returned' },
    { id:'BR-004', bookId:'BK-004', bookTitle:'Medical Microbiology',      admNo:'CP/MED/2026/003', studentName:'Tumuhimbise Ivan',  issuedOn:'2026-09-01', dueOn:'2026-09-15', returnedOn:null,         status:'Overdue' },
    { id:'BR-005', bookId:'BK-005', bookTitle:'Foundations of Education',  admNo:'CP/EDU/2026/004', studentName:'Nalubega Patricia', issuedOn:'2026-09-12', dueOn:'2026-09-26', returnedOn:null,         status:'Borrowed' },
];

const INIT_ENTRIES = [
    { id:'LIB-001', admNo:'CP/MED/2026/001', name:'Kigozi Ronald',     libNo:'LN-0001', timeIn:'08:30', timeOut:'10:45', date:'2026-09-17' },
    { id:'LIB-002', admNo:'CP/MED/2026/002', name:'Ainembabazi Fiona', libNo:'LN-0002', timeIn:'09:00', timeOut:'11:00', date:'2026-09-17' },
    { id:'LIB-003', admNo:'CP/EDU/2026/004', name:'Nalubega Patricia', libNo:'LN-0003', timeIn:'10:15', timeOut:null,    date:'2026-09-17' },
];

const PORTALS = [
    { id:'admin',             label:'Admin Portal',               icon:'fas fa-shield-alt',         color:'#c1272d', desc:'Full system control — all departments, users & system-wide operations.' },
    { id:'academic-registrar',label:'Academic Registrar',         icon:'fas fa-user-check',          color:'#006837', desc:'Register students, issue admission numbers, manage programmes & marks.' },
    { id:'lecturer',          label:'Lecturer / Tutor',           icon:'fas fa-chalkboard-teacher',  color:'#2563eb', desc:'Enter marks, calculate totals & grades, manage your students.' },
    { id:'dean',              label:'Dean of Clinical & Medicine', icon:'fas fa-graduation-cap',     color:'#d97706', desc:'View marks, check attendance, monitor exam setup across faculty.' },
    { id:'deputy-registrar',  label:'Deputy Academic Registrar',  icon:'fas fa-user-tie',            color:'#7c3aed', desc:'Edit & upload marks, manage student portal corrections.' },
    { id:'bursar',            label:'Bursar',                     icon:'fas fa-coins',               color:'#0d9488', desc:'Fees structures, record payments, track balances & financial reports.' },
    { id:'library',           label:'Library Admin',              icon:'fas fa-book-reader',         color:'#0284c7', desc:'Register & organise books, issue to students, borrowing history.' },
];

const INIT_AUTH_USERS = {
    'admin':              { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'academic-registrar': { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'lecturer':           { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'dean':               { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'deputy-registrar':   { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'bursar':             { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
    'library':            { username: 'cpiss.ac.ug', password: '12345', loggedIn: false },
};

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
function PortalHeader({ icon, color, title, subtitle, username, onOpenSettings, onLogout }) {
    return (
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-3 rounded-3" style={{ background: color + '15', borderLeft: `5px solid ${color}` }}>
            <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 52, height: 52, background: color }}>
                    <i className={`${icon} fa-lg`}></i>
                </div>
                <div>
                    <h4 className="fw-bold mb-0" style={{ color }}>{title}</h4>
                    <p className="text-muted mb-0 small">{subtitle}</p>
                </div>
            </div>
            <div className="d-flex align-items-center gap-2">
                <span className="badge bg-dark px-3 py-2 fw-normal" style={{ fontSize: '0.8rem' }}>
                    <i className="fas fa-user-circle me-1 text-warning"></i> User: <strong>{username}</strong>
                </span>
                <button className="btn btn-sm btn-outline-dark fw-semibold" onClick={onOpenSettings} title="Change Username & Password">
                    <i className="fas fa-cog me-1"></i> Profile Settings
                </button>
                <button className="btn btn-sm btn-danger fw-semibold" onClick={onLogout} title="Logout of Portal">
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, val, icon, color }) {
    return (
        <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100" style={{ borderTop: `3px solid ${color}` }}>
                <i className={`${icon} fa-lg mb-1`} style={{ color }}></i>
                <div className="fw-bold" style={{ fontSize: '1.1rem', color }}>{val}</div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{label}</small>
            </div>
        </div>
    );
}

// ── PORTAL LOGIN FORM ─────────────────────────────────────────────────────────
function PortalLogin({ portal, authInfo, onLogin, onQuickLogin }) {
    const [unameInput, setUnameInput] = useState('cpiss.ac.ug');
    const [passInput, setPassInput]   = useState('12345');
    const [errMsg, setErrMsg]         = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (unameInput.trim() === authInfo.username && passInput === authInfo.password) {
            setErrMsg('');
            onLogin();
        } else {
            setErrMsg(`❌ Invalid credentials! Default username: "${authInfo.username}" and password: "${authInfo.password}"`);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: 460, width: '100%' }}>
                <div className="p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${portal.color} 0%, #002b16 100%)` }}>
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-white mb-2 shadow" style={{ width: 64, height: 64 }}>
                        <i className={`${portal.icon} fa-2x`} style={{ color: portal.color }}></i>
                    </div>
                    <h4 className="fw-bold text-white mb-1">{portal.label} Access</h4>
                    <p className="text-white-50 small mb-0">Combridge Institute Portal Authentication</p>
                </div>

                <div className="card-body p-4">
                    {/* Default Credentials Notice */}
                    <div className="alert alert-warning border-warning d-flex align-items-start gap-2 mb-4 py-2 px-3 small rounded-3">
                        <i className="fas fa-key text-warning fa-lg mt-1"></i>
                        <div>
                            <strong>Default Credentials:</strong><br />
                            Username: <code className="bg-white px-1 py-0.5 rounded border text-dark fw-bold">cpiss.ac.ug</code><br />
                            Password: <code className="bg-white px-1 py-0.5 rounded border text-dark fw-bold">12345</code>
                        </div>
                    </div>

                    {errMsg && (
                        <div className="alert alert-danger py-2 small mb-3">
                            {errMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted">Username / Email</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="fas fa-user text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={unameInput}
                                    onChange={e => setUnameInput(e.target.value)}
                                    placeholder="cpiss.ac.ug"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={passInput}
                                    onChange={e => setPassInput(e.target.value)}
                                    placeholder="12345"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn w-100 text-white fw-bold py-2 shadow-sm mb-2" style={{ background: portal.color }}>
                            <i className="fas fa-sign-in-alt me-2"></i> Log In to {portal.label}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm w-100 fw-semibold"
                            onClick={() => { setUnameInput(authInfo.username); setPassInput(authInfo.password); onQuickLogin(); }}
                        >
                            <i className="fas fa-bolt text-warning me-1"></i> Quick Sign-In (Auto-Fill)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ── PROFILE & SECURITY SETTINGS MODAL ─────────────────────────────────────────
function ProfileModal({ portal, authInfo, onSave, onClose }) {
    const [newUsername, setNewUsername] = useState(authInfo.username);
    const [newPassword, setNewPassword] = useState(authInfo.password);
    const [confirmPass, setConfirmPass] = useState(authInfo.password);
    const [msg, setMsg]                 = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPass) {
            setMsg('❌ Passwords do not match!');
            return;
        }
        if (!newUsername.trim() || !newPassword.trim()) {
            setMsg('❌ Username and password cannot be empty!');
            return;
        }
        onSave(newUsername.trim(), newPassword);
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow-lg">
                    <div className="modal-header text-white" style={{ background: portal.color }}>
                        <h5 className="modal-title fw-bold">
                            <i className="fas fa-user-cog me-2"></i>Profile & Security — {portal.label}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleUpdate}>
                        <div className="modal-body p-4">
                            {msg && <div className="alert alert-danger py-2 small mb-3">{msg}</div>}
                            <p className="text-muted small mb-3">
                                You can change your username and password for <strong>{portal.label}</strong> below.
                            </p>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">Current / New Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-success btn-sm fw-bold">
                                <i className="fas fa-save me-1"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ── MAIN COMBRIDGE MANAGE COMPONENT ───────────────────────────────────────────
export default function CombridgeManage() {
    const { portal: portalId } = useParams();
    const navigate = useNavigate();
    const activePortal = portalId || 'overview';

    // State
    const [authUsers, setAuthUsers]   = useState(INIT_AUTH_USERS);
    const [students, setStudents]     = useState(INIT_STUDENTS);
    const [apps, setApps]             = useState(INIT_APPLICATIONS);
    const [exams, setExams]           = useState(INIT_EXAMS);
    const [fees, setFees]             = useState(INIT_FEES);
    const [payments, setPayments]     = useState(INIT_PAYMENTS);
    const [books, setBooks]           = useState(INIT_BOOKS);
    const [borrowings, setBorrowings] = useState(INIT_BORROWINGS);
    const [entries, setEntries]       = useState(INIT_ENTRIES);
    const [toast, setToast]           = useState('');
    const [marks, setMarks]           = useState({});
    const [showSettings, setShowSettings] = useState(false);
    const [searchQuery, setSearchQuery]   = useState('');

    const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4500); };

    // Auth handlers
    const loginPortal = (pId) => {
        setAuthUsers(prev => ({ ...prev, [pId]: { ...prev[pId], loggedIn: true } }));
        notify(`✅ Logged into ${PORTALS.find(p => p.id === pId)?.label || 'Portal'} successfully.`);
    };
    const logoutPortal = (pId) => {
        setAuthUsers(prev => ({ ...prev, [pId]: { ...prev[pId], loggedIn: false } }));
        notify('Logged out.');
    };
    const updateCredentials = (pId, newUname, newPass) => {
        setAuthUsers(prev => ({ ...prev, [pId]: { username: newUname, password: newPass, loggedIn: true } }));
        setShowSettings(false);
        notify(`✅ Profile updated! New Username: "${newUname}". Password saved.`);
    };

    // Marks
    const updateMark = (id, field, val) => {
        const max = field === 'cw' ? 40 : 60;
        setMarks(p => ({ ...p, [id]: { ...(p[id] || {}), [field]: Math.max(0, Math.min(max, +val || 0)) } }));
    };
    const saveMark = (id) => {
        setStudents(p => p.map(s => {
            if (s.id !== id) return s;
            const upd = { cw: s.cw, exam: s.exam, ...(marks[id] || {}) };
            const total = upd.cw + upd.exam;
            const { grade, remarks } = calcGrade(total);
            return { ...s, ...upd, total, grade, remarks };
        }));
        setMarks(p => { const n = { ...p }; delete n[id]; return n; });
        notify('✅ Marks saved — total, grade, and remarks auto-calculated.');
    };

    // Registration
    const [regForm, setRegForm] = useState({ name: '', programme: PROGRAMMES_LIST[0], year: 'Year 1', phone: '' });
    const handleRegister = (e) => {
        e.preventDefault();
        const n = students.length + 1;
        const pfx = regForm.programme.includes('Nursing') ? 'CP/NUR'
            : regForm.programme.includes('Education') ? 'CP/EDU'
            : regForm.programme.includes('Lab') ? 'CP/LAB'
            : regForm.programme.includes('Health') ? 'CP/HSM' : 'CP/MED';
        const admNo = `${pfx}/2026/${String(n).padStart(3, '0')}`;
        setStudents(p => [{ id: `STU${String(n).padStart(3,'0')}`, admNo, name: regForm.name, prog: regForm.programme.split(' in ')[1] || regForm.programme, year: regForm.year, phone: regForm.phone, status: 'Active', cw: 0, exam: 0, total: 0, grade: '—', remarks: 'Pending', attendance: 100, lecturer: 'Unassigned' }, ...p]);
        setRegForm({ name: '', programme: PROGRAMMES_LIST[0], year: 'Year 1', phone: '' });
        notify(`✅ Student registered! Admission No: ${admNo}`);
    };

    // Fees
    const [feeForm, setFeeForm] = useState({ programme: PROGRAMMES_LIST[0], year: 'Year 1', tuition: '', functional: '' });
    const addFee = (e) => {
        e.preventDefault();
        const tuition = +feeForm.tuition, functional = +feeForm.functional;
        setFees(p => [...p, { id: `FEE-${String(p.length+1).padStart(2,'0')}`, programme: feeForm.programme, year: feeForm.year, tuition, functional, total: tuition + functional }]);
        setFeeForm({ programme: PROGRAMMES_LIST[0], year: 'Year 1', tuition: '', functional: '' });
        notify('✅ Fees structure created.');
    };

    // Payments
    const [payForm, setPayForm] = useState({ admNo: '', name: '', amount: '', method: 'Mobile Money' });
    const addPayment = (e) => {
        e.preventDefault();
        const feeRec = fees[0];
        const prevPaid = payments.filter(p => p.admNo === payForm.admNo).reduce((a, b) => a + b.amount, 0);
        const balance = Math.max(0, (feeRec ? feeRec.total : 2050000) - prevPaid - +payForm.amount);
        setPayments(p => [...p, { id: `PAY-${String(p.length+1).padStart(3,'0')}`, admNo: payForm.admNo, name: payForm.name, amount: +payForm.amount, date: new Date().toISOString().split('T')[0], method: payForm.method, ref: `REF-${Date.now()}`, balance }]);
        setPayForm({ admNo: '', name: '', amount: '', method: 'Mobile Money' });
        notify(`✅ Payment of ${fmtUgx(payForm.amount)} recorded.`);
    };

    // Books
    const [bookForm, setBookForm] = useState({ title: '', author: '', dept: 'Clinical & Medicine', course: '', qty: '', old: '', newBooks: '' });
    const addBook = (e) => {
        e.preventDefault();
        const qty = +bookForm.qty;
        setBooks(p => [...p, { id: `BK-${String(p.length+1).padStart(3,'0')}`, title: bookForm.title, author: bookForm.author, dept: bookForm.dept, course: bookForm.course, qty, available: qty, old: +bookForm.old, newBooks: +bookForm.newBooks, status: qty > 3 ? 'Available' : 'Low Stock' }]);
        setBookForm({ title: '', author: '', dept: 'Clinical & Medicine', course: '', qty: '', old: '', newBooks: '' });
        notify('✅ Book registered in library.');
    };

    // Issue / Return
    const [issueForm, setIssueForm] = useState({ bookId: '', admNo: '', studentName: '' });
    const issueBook = (e) => {
        e.preventDefault();
        const bk = books.find(b => b.id === issueForm.bookId);
        if (!bk || bk.available < 1) { notify('❌ Book not available for issue.'); return; }
        const due = new Date(); due.setDate(due.getDate() + 14);
        setBorrowings(p => [...p, { id: `BR-${String(p.length+1).padStart(3,'0')}`, bookId: bk.id, bookTitle: bk.title, admNo: issueForm.admNo, studentName: issueForm.studentName, issuedOn: new Date().toISOString().split('T')[0], dueOn: due.toISOString().split('T')[0], returnedOn: null, status: 'Borrowed' }]);
        setBooks(p => p.map(b => b.id === bk.id ? { ...b, available: b.available - 1 } : b));
        setIssueForm({ bookId: '', admNo: '', studentName: '' });
        notify(`✅ "${bk.title}" issued to ${issueForm.studentName}.`);
    };
    const returnBook = (brId) => {
        setBorrowings(p => p.map(b => {
            if (b.id !== brId) return b;
            setBooks(bb => bb.map(bk => bk.id === b.bookId ? { ...bk, available: bk.available + 1 } : bk));
            return { ...b, returnedOn: new Date().toISOString().split('T')[0], status: 'Returned' };
        }));
        notify('✅ Book marked as returned.');
    };

    // Library entry
    const [entryForm, setEntryForm] = useState({ admNo: '', name: '' });
    const addEntry = (e) => {
        e.preventDefault();
        const libNo = `LN-${String(entries.length + 1).padStart(4, '0')}`;
        setEntries(p => [...p, { id: `LIB-${String(p.length+1).padStart(3,'0')}`, admNo: entryForm.admNo, name: entryForm.name, libNo, timeIn: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), timeOut: null, date: new Date().toISOString().split('T')[0] }]);
        setEntryForm({ admNo: '', name: '' });
        notify(`✅ Entry recorded. Library Number: ${libNo}`);
    };
    const exitEntry = (id) => {
        setEntries(p => p.map(e => e.id === id ? { ...e, timeOut: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) } : e));
        notify('✅ Exit time recorded.');
    };

    // Deletes
    const deleteStudent  = (id) => { setStudents(p => p.filter(s => s.id !== id)); notify('🗑 Student removed.'); };
    const deleteFee      = (id) => { setFees(p => p.filter(f => f.id !== id)); notify('🗑 Fee structure deleted.'); };
    const deletePayment  = (id) => { setPayments(p => p.filter(f => f.id !== id)); notify('🗑 Payment record deleted.'); };
    const deleteBook     = (id) => { setBooks(p => p.filter(b => b.id !== id)); notify('🗑 Book removed.'); };
    const updateAppStatus   = (id, st) => { setApps(p => p.map(a => a.id === id ? { ...a, status: st } : a)); notify(`✅ Application ${st}.`); };
    const updateExamStatus  = (id, st) => { setExams(p => p.map(e => e.id === id ? { ...e, status: st } : e)); notify(`✅ Exam ${st}.`); };

    const curPortalObj = PORTALS.find(p => p.id === activePortal);
    const curAuthInfo  = authUsers[activePortal] || { username: 'cpiss.ac.ug', password: '12345', loggedIn: false };

    const renderPortalContent = () => {
        if (activePortal === 'overview') {
            return <Overview navigate={navigate} authUsers={authUsers} />;
        }

        if (!curPortalObj) {
            return <div className="alert alert-danger">Portal not found.</div>;
        }

        // If not logged in, show login page!
        if (!curAuthInfo.loggedIn) {
            return (
                <PortalLogin
                    portal={curPortalObj}
                    authInfo={curAuthInfo}
                    onLogin={() => loginPortal(activePortal)}
                    onQuickLogin={() => loginPortal(activePortal)}
                />
            );
        }

        const shared = {
            students, marks, updateMark, saveMark, deleteStudent, searchQuery, setSearchQuery,
            username: curAuthInfo.username,
            onOpenSettings: () => setShowSettings(true),
            onLogout: () => logoutPortal(activePortal)
        };

        switch (activePortal) {
            case 'admin':
                return <AdminPortal students={students} exams={exams} fees={fees} payments={payments} books={books} borrowings={borrowings} {...shared} />;
            case 'academic-registrar':
                return <RegistrarPortal students={students} apps={apps} programmes={PROGRAMMES_LIST} regForm={regForm} setRegForm={setRegForm} handleRegister={handleRegister} updateAppStatus={updateAppStatus} deleteStudent={deleteStudent} {...shared} />;
            case 'lecturer':
                return <LecturerPortal {...shared} />;
            case 'dean':
                return <DeanPortal students={students} exams={exams} updateExamStatus={updateExamStatus} {...shared} />;
            case 'deputy-registrar':
                return <DeputyPortal {...shared} />;
            case 'bursar':
                return <BursarPortal fees={fees} payments={payments} feeForm={feeForm} setFeeForm={setFeeForm} addFee={addFee} deleteFee={deleteFee} payForm={payForm} setPayForm={setPayForm} addPayment={addPayment} deletePayment={deletePayment} programmes={PROGRAMMES_LIST} {...shared} />;
            case 'library':
                return <LibraryPortal books={books} borrowings={borrowings} entries={entries} bookForm={bookForm} setBookForm={setBookForm} addBook={addBook} deleteBook={deleteBook} issueForm={issueForm} setIssueForm={setIssueForm} issueBook={issueBook} returnBook={returnBook} entryForm={entryForm} setEntryForm={setEntryForm} addEntry={addEntry} exitEntry={exitEntry} {...shared} />;
            default:
                return <Overview navigate={navigate} authUsers={authUsers} />;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            {/* Toast Notification */}
            {toast && (
                <div style={{ position:'fixed', top:20, right:20, zIndex:9999, background:'#006837', color:'#fff', padding:'12px 22px', borderRadius:10, fontWeight:600, boxShadow:'0 4px 20px rgba(0,0,0,0.25)', maxWidth:420, animation:'fadeInDown 0.3s ease' }}>
                    {toast}
                </div>
            )}

            {/* Profile Settings Modal */}
            {showSettings && curPortalObj && (
                <ProfileModal
                    portal={curPortalObj}
                    authInfo={curAuthInfo}
                    onSave={(u, p) => updateCredentials(activePortal, u, p)}
                    onClose={() => setShowSettings(false)}
                />
            )}

            {/* Page Header */}
            <div className="py-4 text-white" style={{ background:'linear-gradient(135deg,#006837 0%,#004d28 100%)', borderBottom:'4px solid #ffdd57' }}>
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <img src="/images/logocom.png" alt="Logo" style={{ height:54, borderRadius:6, background:'#fff', padding:4 }} />
                            <div>
                                <h2 className="fw-bold mb-0 text-white" style={{ fontSize:'clamp(1.2rem,3vw,1.8rem)' }}>
                                    <i className="fas fa-th-large me-2 text-warning"></i>Combridge Manage
                                </h2>
                                <p className="mb-0 text-white-50 small">University Management System — Combridge Institute of Health Management Sciences</p>
                            </div>
                        </div>

                        {/* Search Bar across all portals */}
                        <div className="d-none d-md-block" style={{ width: 280 }}>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-0"><i className="fas fa-search text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search records..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portal Tab Bar */}
            <div style={{ background:'#004d28', borderBottom:'2px solid rgba(255,255,255,0.1)', overflowX:'auto' }}>
                <div className="container">
                    <div className="d-flex gap-1 py-1" style={{ whiteSpace:'nowrap' }}>
                        <button onClick={() => navigate('/combridge-manage')} style={{ background: activePortal==='overview'?'#ffdd57':'transparent', color: activePortal==='overview'?'#000':'#fff', border:'none', padding:'8px 14px', fontWeight:600, fontSize:'0.8rem', transition:'all 0.2s', cursor:'pointer', borderRadius:2 }}>
                            <i className="fas fa-th me-1"></i>Overview
                        </button>
                        {PORTALS.map(p => {
                            const isLogged = authUsers[p.id]?.loggedIn;
                            return (
                                <button key={p.id} onClick={() => navigate(`/combridge-manage/${p.id}`)}
                                    style={{ background: activePortal===p.id?'#ffdd57':'transparent', color: activePortal===p.id?'#000':'#fff', border:'none', padding:'8px 14px', fontWeight:600, fontSize:'0.8rem', transition:'all 0.2s', cursor:'pointer', borderRadius:2 }}>
                                    <i className={`${p.icon} me-1`}></i>{p.label} {isLogged ? <i className="fas fa-check-circle text-warning ms-1" style={{ fontSize: '0.7rem' }}></i> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container py-4">{renderPortalContent()}</div>
        </div>
    );
}

// ── OVERVIEW PAGE ─────────────────────────────────────────────────────────────
function Overview({ navigate, authUsers }) {
    return (
        <div>
            <div className="text-center mb-4">
                <h3 className="fw-bold" style={{ color:'#006837' }}>University Management Portals</h3>
                <p className="text-muted">Select a portal below to sign in or access management operations</p>
                <div className="badge bg-success-subtle text-success border border-success px-3 py-2">
                    <i className="fas fa-key me-1"></i> Default Login Credentials for All Portals: Username: <strong>cpiss.ac.ug</strong> | Password: <strong>12345</strong>
                </div>
            </div>
            <div className="row g-4">
                {PORTALS.map(p => {
                    const isLogged = authUsers[p.id]?.loggedIn;
                    return (
                        <div key={p.id} className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow rounded-4 h-100 position-relative overflow-hidden"
                                style={{ cursor:'pointer', transition:'transform 0.25s,box-shadow 0.25s', borderTop:`5px solid ${p.color}` }}
                                onClick={() => navigate(`/combridge-manage/${p.id}`)}
                                onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                                onMouseLeave={e => e.currentTarget.style.transform=''}>
                                {isLogged && (
                                    <span className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-bl fw-bold" style={{ fontSize: '0.7rem' }}>
                                        <i className="fas fa-check me-1"></i> Active Session
                                    </span>
                                )}
                                <div className="card-body p-4 text-center">
                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width:70, height:70, background:p.color+'22' }}>
                                        <i className={`${p.icon} fa-2x`} style={{ color:p.color }}></i>
                                    </div>
                                    <h5 className="fw-bold mb-2">{p.label}</h5>
                                    <p className="text-muted small mb-3">{p.desc}</p>
                                    <button className="btn btn-sm text-white fw-semibold px-4" style={{ background:p.color, border:'none', borderRadius:20 }}>
                                        {isLogged ? 'Enter Portal Dashboard' : 'Sign In to Portal'} <i className="fas fa-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── ADMIN PORTAL ──────────────────────────────────────────────────────────────
function AdminPortal({ students, exams, fees, payments, books, username, onOpenSettings, onLogout, searchQuery }) {
    const DEPTS = [
        { name:'College of Clinical & Medicine', icon:'fas fa-heartbeat',         color:'#006837', head:'Dr. Arthur Mugisha (Dean)', staff:24 },
        { name:'College of Education',            icon:'fas fa-chalkboard-teacher', color:'#051566', head:'Prof. Sarah Namubiru (Dean)', staff:18 },
        { name:'Dean of Students Office',         icon:'fas fa-user-graduate',      color:'#d97706', head:'Mr. Emmanuel Byamukama', staff:8 },
        { name:'Office of the Director',          icon:'fas fa-landmark',            color:'#c1272d', head:'Directorate Executive', staff:6 },
        { name:'Lecturers & Tutors Council',      icon:'fas fa-users-cog',           color:'#2563eb', head:'Senior Faculty Board', staff:42 },
        { name:'Bursar & Finance Office',         icon:'fas fa-coins',               color:'#16a34a', head:'Chief Financial Officer', staff:7 },
        { name:'Students Guild & Registry',       icon:'fas fa-id-card',             color:'#9333ea', head:'Guild President & Secretariat', staff:5 },
        { name:'Polytechnic Library',             icon:'fas fa-book-reader',         color:'#0284c7', head:'Head Librarian', staff:6 },
        { name:'Store Keeper & Inventory',        icon:'fas fa-boxes',               color:'#ea580c', head:'Chief Logistics Officer', staff:4 },
        { name:'IT & Systems Department',         icon:'fas fa-laptop-code',         color:'#0f766e', head:'Director of ICT Services', staff:5 },
    ];
    const totalRevenue = payments.reduce((a,b) => a + b.amount, 0);
    const totalBooks   = books.reduce((a,b) => a + b.qty, 0);

    const filteredDepts = DEPTS.filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.head.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-shield-alt" color="#c1272d" title="Admin Portal" subtitle="System Administrator — Full Control Dashboard" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />
            <div className="row g-3 mb-4">
                <StatCard label="Total Students"   val={students.length} icon="fas fa-users"          color="#006837" />
                <StatCard label="Total Depts"      val={DEPTS.length}    icon="fas fa-sitemap"        color="#2563eb" />
                <StatCard label="Exam Papers"      val={exams.length}    icon="fas fa-file-alt"       color="#d97706" />
                <StatCard label="Revenue Collected" val={fmtUgx(totalRevenue)} icon="fas fa-coins"   color="#0d9488" />
                <StatCard label="Library Books"    val={totalBooks}      icon="fas fa-book"           color="#0284c7" />
                <StatCard label="Programmes"       val={6}               icon="fas fa-graduation-cap" color="#c1272d" />
            </div>

            <h5 className="fw-bold mb-3" style={{ color:'#006837' }}><i className="fas fa-sitemap me-2"></i>Departments Under System Administration</h5>
            <div className="row g-3">
                {filteredDepts.map((d,i) => (
                    <div key={i} className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3" style={{ borderLeft:`4px solid ${d.color}` }}>
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white" style={{ width:44, height:44, background:d.color }}>
                                    <i className={`${d.icon} fa-sm`}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-0">{d.name}</h6>
                                    <small className="text-muted">{d.head}</small>
                                    <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
                                        <span className="badge bg-light text-dark"><i className="fas fa-user-friends me-1"></i>{d.staff} Active Staff</span>
                                        <span className="badge bg-success"><i className="fas fa-check-circle me-1"></i>Operational</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── ACADEMIC REGISTRAR PORTAL ─────────────────────────────────────────────────
function RegistrarPortal({ students, apps, programmes, regForm, setRegForm, handleRegister, updateAppStatus, deleteStudent, username, onOpenSettings, onLogout, searchQuery }) {
    const [tab, setTab] = useState('register');

    const filteredStudents = students.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredApps     = apps.filter(a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.programme.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-user-check" color="#006837" title="Academic Registrar Portal" subtitle="Admissions, Student Registration & Programme Management" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                <button className={`btn btn-sm fw-bold ${tab==='register'?'btn-success':'btn-light'}`} onClick={()=>setTab('register')}><i className="fas fa-user-plus me-1"></i>New Registration</button>
                <button className={`btn btn-sm fw-bold ${tab==='students'?'btn-success':'btn-light'}`} onClick={()=>setTab('students')}><i className="fas fa-list me-1"></i>Students ({students.length})</button>
                <button className={`btn btn-sm fw-bold ${tab==='apps'?'btn-success':'btn-light'}`} onClick={()=>setTab('apps')}><i className="fas fa-inbox me-1"></i>Applications ({apps.length})</button>
                <button className={`btn btn-sm fw-bold ${tab==='programmes'?'btn-success':'btn-light'}`} onClick={()=>setTab('programmes')}><i className="fas fa-graduation-cap me-1"></i>Programmes ({programmes.length})</button>
            </div>

            {tab === 'register' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: 640 }}>
                    <h5 className="fw-bold mb-3" style={{ color:'#006837' }}><i className="fas fa-id-card me-2"></i>Register New Student</h5>
                    <p className="text-muted small">System will automatically generate official admission number (e.g. <code>CP/MED/2026/009</code>).</p>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Full Name</label>
                            <input type="text" className="form-control" required value={regForm.name} onChange={e=>setRegForm({...regForm, name:e.target.value})} placeholder="e.g. Tumusiime David" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Programme</label>
                            <select className="form-select" value={regForm.programme} onChange={e=>setRegForm({...regForm, programme:e.target.value})}>
                                {programmes.map((p,i)=><option key={i} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <label className="form-label fw-bold small">Year of Study</label>
                                <select className="form-select" value={regForm.year} onChange={e=>setRegForm({...regForm, year:e.target.value})}>
                                    <option>Year 1</option><option>Year 2</option><option>Year 3</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-bold small">Phone Number</label>
                                <input type="text" className="form-control" required value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})} placeholder="+256 770 000000" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success fw-bold px-4"><i className="fas fa-check me-1"></i>Generate Admission & Register</button>
                    </form>
                </div>
            )}

            {tab === 'students' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr><th>Admission No</th><th>Name</th><th>Programme</th><th>Year</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(s=>(
                                    <tr key={s.id}>
                                        <td><code className="fw-bold text-success">{s.admNo}</code></td>
                                        <td className="fw-bold">{s.name}</td>
                                        <td className="small">{s.prog}</td>
                                        <td><span className="badge bg-light text-dark">{s.year}</span></td>
                                        <td className="small">{s.phone}</td>
                                        <td><span className={`badge ${s.status==='Active'?'bg-success':'bg-warning'}`}>{s.status}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteStudent(s.id)} title="Delete Student"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'apps' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr><th>App ID</th><th>Applicant Name</th><th>Programme Applied</th><th>Phone</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filteredApps.map(a=>(
                                    <tr key={a.id}>
                                        <td><code>{a.id}</code></td>
                                        <td className="fw-bold">{a.name}</td>
                                        <td className="small">{a.programme}</td>
                                        <td className="small">{a.phone}</td>
                                        <td className="small">{a.appliedOn}</td>
                                        <td><span className={`badge ${a.status==='Approved'?'bg-success':a.status==='Rejected'?'bg-danger':'bg-warning'}`}>{a.status}</span></td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-success" onClick={()=>updateAppStatus(a.id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger" onClick={()=>updateAppStatus(a.id, 'Rejected')}>Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'programmes' && (
                <div className="row g-3">
                    {programmes.map((p,i)=>(
                        <div key={i} className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center gap-3">
                                <i className="fas fa-graduation-cap fa-2x text-success"></i>
                                <div>
                                    <h6 className="fw-bold mb-1">{p}</h6>
                                    <small className="text-muted">Accredited by NCHE & Allied Health Professionals Council</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── LECTURER PORTAL ───────────────────────────────────────────────────────────
function LecturerPortal({ students, marks, updateMark, saveMark, username, onOpenSettings, onLogout, searchQuery }) {
    const filteredStudents = students.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admNo.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-chalkboard-teacher" color="#2563eb" title="Lecturer / Tutor Portal" subtitle="Enter Coursework & Exam Marks — Auto-calculate Grade & Remarks" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 bg-light border-bottom d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-primary"><i className="fas fa-book me-2"></i>Course: Clinical Pharmacology & Therapeutics (MED 2101)</span>
                    <span className="badge bg-primary">{students.length} Students Assigned</span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small">
                            <tr><th>Adm No</th><th>Student Name</th><th>CW (Max 40)</th><th>Exam (Max 60)</th><th>Total (100)</th><th>Grade</th><th>Remarks</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(s => {
                                const m = marks[s.id] || {};
                                const cwVal = m.cw !== undefined ? m.cw : s.cw;
                                const examVal = m.exam !== undefined ? m.exam : s.exam;
                                const tot = cwVal + examVal;
                                const { grade, remarks } = calcGrade(tot);

                                return (
                                    <tr key={s.id}>
                                        <td><code>{s.admNo}</code></td>
                                        <td className="fw-bold">{s.name}</td>
                                        <td style={{ width: 110 }}>
                                            <input type="number" className="form-control form-control-sm text-center" min="0" max="40" value={cwVal} onChange={e => updateMark(s.id, 'cw', e.target.value)} />
                                        </td>
                                        <td style={{ width: 110 }}>
                                            <input type="number" className="form-control form-control-sm text-center" min="0" max="60" value={examVal} onChange={e => updateMark(s.id, 'exam', e.target.value)} />
                                        </td>
                                        <td><span className="fw-bold text-dark">{tot}</span></td>
                                        <td><span className={`badge ${grade==='A'||grade==='B+'||grade==='B'?'bg-success':grade==='F'?'bg-danger':'bg-warning'}`}>{grade}</span></td>
                                        <td><small className="text-muted">{remarks}</small></td>
                                        <td>
                                            <button className="btn btn-sm btn-primary fw-semibold" onClick={() => saveMark(s.id)}>
                                                <i className="fas fa-save me-1"></i>Save
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── DEAN PORTAL ───────────────────────────────────────────────────────────────
function DeanPortal({ students, exams, updateExamStatus, username, onOpenSettings, onLogout, searchQuery }) {
    const filteredExams = exams.filter(e => !searchQuery || e.course.toLowerCase().includes(searchQuery.toLowerCase()) || e.setter.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-graduation-cap" color="#d97706" title="Dean Faculty of Clinical Medicine" subtitle="Monitor Marks, Attendance & Moderated Examinations" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <h5 className="fw-bold mb-3" style={{ color: '#d97706' }}><i className="fas fa-file-signature me-2"></i>Exam Vetting & Moderation</h5>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small">
                            <tr><th>Code</th><th>Course Unit</th><th>Setter</th><th>Exam Date</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredExams.map(ex => (
                                <tr key={ex.id}>
                                    <td><code className="fw-bold text-warning">{ex.code}</code></td>
                                    <td className="fw-bold">{ex.course}</td>
                                    <td className="small">{ex.setter}</td>
                                    <td className="small">{ex.examDate}</td>
                                    <td><span className={`badge ${ex.status.includes('Approved') ? 'bg-success' : 'bg-warning'}`}>{ex.status}</span></td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button className="btn btn-success" onClick={() => updateExamStatus(ex.id, 'Approved & Printed')}>Approve</button>
                                            <button className="btn btn-warning" onClick={() => updateExamStatus(ex.id, 'Under Moderation')}>Moderate</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h5 className="fw-bold mb-3" style={{ color: '#d97706' }}><i className="fas fa-user-check me-2"></i>Student Attendance Overview</h5>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small">
                            <tr><th>Admission No</th><th>Student Name</th><th>Programme</th><th>Lecturer</th><th>Attendance %</th></tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td><code>{s.admNo}</code></td>
                                    <td className="fw-bold">{s.name}</td>
                                    <td className="small">{s.prog}</td>
                                    <td className="small">{s.lecturer}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress flex-grow-1" style={{ height: 8 }}>
                                                <div className={`progress-bar ${s.attendance >= 85 ? 'bg-success' : 'bg-danger'}`} style={{ width: `${s.attendance}%` }}></div>
                                            </div>
                                            <span className="fw-bold small">{s.attendance}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── DEPUTY REGISTRAR PORTAL ───────────────────────────────────────────────────
function DeputyPortal({ students, marks, updateMark, saveMark, username, onOpenSettings, onLogout, searchQuery }) {
    const filteredStudents = students.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admNo.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-user-tie" color="#7c3aed" title="Deputy Academic Registrar" subtitle="Manage Student Portal Entries, Corrections & Uploaded Marks" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <div className="alert alert-info border-info d-flex align-items-center gap-2 mb-4">
                <i className="fas fa-info-circle fa-lg"></i>
                <span className="small">Deputy Registrar holds administrative permissions to modify locked marks, correct student profiles, and approve transcript uploads.</span>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 bg-light border-bottom fw-bold text-purple">
                    <i className="fas fa-edit me-2"></i>Student Portal Marks Entry & Corrections
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small">
                            <tr><th>Adm No</th><th>Student Name</th><th>Coursework</th><th>Exam Mark</th><th>Total</th><th>Grade</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(s => {
                                const m = marks[s.id] || {};
                                const cwVal = m.cw !== undefined ? m.cw : s.cw;
                                const examVal = m.exam !== undefined ? m.exam : s.exam;
                                const tot = cwVal + examVal;
                                const { grade } = calcGrade(tot);

                                return (
                                    <tr key={s.id}>
                                        <td><code>{s.admNo}</code></td>
                                        <td className="fw-bold">{s.name}</td>
                                        <td style={{ width: 110 }}>
                                            <input type="number" className="form-control form-control-sm text-center" value={cwVal} onChange={e => updateMark(s.id, 'cw', e.target.value)} />
                                        </td>
                                        <td style={{ width: 110 }}>
                                            <input type="number" className="form-control form-control-sm text-center" value={examVal} onChange={e => updateMark(s.id, 'exam', e.target.value)} />
                                        </td>
                                        <td className="fw-bold">{tot}</td>
                                        <td><span className="badge bg-secondary">{grade}</span></td>
                                        <td>
                                            <button className="btn btn-sm text-white fw-semibold" style={{ background: '#7c3aed' }} onClick={() => saveMark(s.id)}>
                                                <i className="fas fa-upload me-1"></i>Override & Upload
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── BURSAR PORTAL ─────────────────────────────────────────────────────────────
function BursarPortal({ fees, payments, feeForm, setFeeForm, addFee, deleteFee, payForm, setPayForm, addPayment, deletePayment, programmes, username, onOpenSettings, onLogout, searchQuery }) {
    const [tab, setTab] = useState('payments');

    const totalCollected = payments.reduce((a, b) => a + b.amount, 0);

    const filteredPayments = payments.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.admNo.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredFees     = fees.filter(f => !searchQuery || f.programme.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-coins" color="#0d9488" title="Bursar & Finance Portal" subtitle="Fee Structure Setup, Student Payments & Balance Tracking" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <div className="row g-3 mb-4">
                <StatCard label="Total Collected" val={fmtUgx(totalCollected)} icon="fas fa-wallet" color="#0d9488" />
                <StatCard label="Payments Recorded" val={payments.length} icon="fas fa-receipt" color="#2563eb" />
                <StatCard label="Fee Structures" val={fees.length} icon="fas fa-file-invoice" color="#d97706" />
            </div>

            <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                <button className={`btn btn-sm fw-bold ${tab==='payments'?'btn-teal text-white':'btn-light'}`} style={{ background: tab==='payments'?'#0d9488':'' }} onClick={()=>setTab('payments')}><i className="fas fa-money-check-alt me-1"></i>Payments List ({payments.length})</button>
                <button className={`btn btn-sm fw-bold ${tab==='new-pay'?'btn-teal text-white':'btn-light'}`} style={{ background: tab==='new-pay'?'#0d9488':'' }} onClick={()=>setTab('new-pay')}><i className="fas fa-plus me-1"></i>Record Payment</button>
                <button className={`btn btn-sm fw-bold ${tab==='fees'?'btn-teal text-white':'btn-light'}`} style={{ background: tab==='fees'?'#0d9488':'' }} onClick={()=>setTab('fees')}><i className="fas fa-tags me-1"></i>Fees Structures ({fees.length})</button>
            </div>

            {tab === 'payments' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr><th>Pay ID</th><th>Adm No</th><th>Student Name</th><th>Amount Paid</th><th>Date</th><th>Method</th><th>Ref</th><th>Balance</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(p => (
                                    <tr key={p.id}>
                                        <td><code>{p.id}</code></td>
                                        <td><code className="text-teal fw-bold">{p.admNo}</code></td>
                                        <td className="fw-bold">{p.name}</td>
                                        <td className="fw-bold text-success">{fmtUgx(p.amount)}</td>
                                        <td className="small">{p.date}</td>
                                        <td><span className="badge bg-light text-dark">{p.method}</span></td>
                                        <td className="small text-muted">{p.ref}</td>
                                        <td className="fw-bold text-danger">{fmtUgx(p.balance)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger" onClick={()=>deletePayment(p.id)} title="Delete Payment"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'new-pay' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: 540 }}>
                    <h5 className="fw-bold mb-3 text-teal" style={{ color:'#0d9488' }}><i className="fas fa-cash-register me-2"></i>Record Student Fee Payment</h5>
                    <form onSubmit={addPayment}>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Admission Number</label>
                            <input type="text" className="form-control" required value={payForm.admNo} onChange={e=>setPayForm({...payForm, admNo:e.target.value})} placeholder="e.g. CP/MED/2026/001" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Student Full Name</label>
                            <input type="text" className="form-control" required value={payForm.name} onChange={e=>setPayForm({...payForm, name:e.target.value})} placeholder="e.g. Kigozi Ronald" />
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <label className="form-label fw-bold small">Amount Paid (UGX)</label>
                                <input type="number" className="form-control" required value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} placeholder="e.g. 1500000" />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-bold small">Payment Method</label>
                                <select className="form-select" value={payForm.method} onChange={e=>setPayForm({...payForm, method:e.target.value})}>
                                    <option>Mobile Money</option><option>Bank Transfer</option><option>Cash</option><option>Bank Draft</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn text-white fw-bold px-4" style={{ background:'#0d9488' }}><i className="fas fa-check me-1"></i>Record & Print Receipt</button>
                    </form>
                </div>
            )}

            {tab === 'fees' && (
                <div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ maxWidth: 640 }}>
                        <h6 className="fw-bold mb-3 text-teal"><i className="fas fa-plus me-1"></i>Create Fee Structure</h6>
                        <form onSubmit={addFee} className="row g-3">
                            <div className="col-12">
                                <select className="form-select" value={feeForm.programme} onChange={e=>setFeeForm({...feeForm, programme:e.target.value})}>
                                    {programmes.map((p,i)=><option key={i} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="col-4">
                                <input type="text" className="form-control" value={feeForm.year} onChange={e=>setFeeForm({...feeForm, year:e.target.value})} placeholder="Year" />
                            </div>
                            <div className="col-4">
                                <input type="number" className="form-control" required value={feeForm.tuition} onChange={e=>setFeeForm({...feeForm, tuition:e.target.value})} placeholder="Tuition" />
                            </div>
                            <div className="col-4">
                                <input type="number" className="form-control" required value={feeForm.functional} onChange={e=>setFeeForm({...feeForm, functional:e.target.value})} placeholder="Functional" />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-sm text-white fw-bold" style={{ background:'#0d9488' }}>Save Fee Structure</button>
                            </div>
                        </form>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light small">
                                    <tr><th>Programme</th><th>Year</th><th>Tuition</th><th>Functional</th><th>Total Fees</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {filteredFees.map(f=>(
                                        <tr key={f.id}>
                                            <td className="fw-bold">{f.programme}</td>
                                            <td>{f.year}</td>
                                            <td>{fmtUgx(f.tuition)}</td>
                                            <td>{fmtUgx(f.functional)}</td>
                                            <td className="fw-bold text-success">{fmtUgx(f.total)}</td>
                                            <td><button className="btn btn-sm btn-outline-danger" onClick={()=>deleteFee(f.id)}><i className="fas fa-trash"></i></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── LIBRARY PORTAL ────────────────────────────────────────────────────────────
function LibraryPortal({ books, borrowings, entries, bookForm, setBookForm, addBook, deleteBook, issueForm, setIssueForm, issueBook, returnBook, entryForm, setEntryForm, addEntry, exitEntry, username, onOpenSettings, onLogout, searchQuery }) {
    const [tab, setTab] = useState('inventory');

    const totalBooks = books.reduce((a,b)=>a+b.qty,0);
    const totalAvail = books.reduce((a,b)=>a+b.available,0);

    const filteredBooks      = books.filter(b => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredBorrowings = borrowings.filter(br => !searchQuery || br.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || br.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <PortalHeader icon="fas fa-book-reader" color="#0284c7" title="Library Administration Portal" subtitle="Organise Books by Department, Issue Books & Track Student Attendance" username={username} onOpenSettings={onOpenSettings} onLogout={onLogout} />

            <div className="row g-3 mb-4">
                <StatCard label="Total Inventory" val={totalBooks} icon="fas fa-book" color="#0284c7" />
                <StatCard label="Available Copies" val={totalAvail} icon="fas fa-check-circle" color="#16a34a" />
                <StatCard label="Active Borrowed" val={borrowings.filter(b=>b.status==='Borrowed').length} icon="fas fa-hand-holding-book" color="#d97706" />
                <StatCard label="Daily Entries" val={entries.length} icon="fas fa-door-open" color="#7c3aed" />
            </div>

            <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                <button className={`btn btn-sm fw-bold ${tab==='inventory'?'btn-primary':'btn-light'}`} onClick={()=>setTab('inventory')}><i className="fas fa-books me-1"></i>Book Inventory ({books.length})</button>
                <button className={`btn btn-sm fw-bold ${tab==='add-book'?'btn-primary':'btn-light'}`} onClick={()=>setTab('add-book')}><i className="fas fa-plus me-1"></i>Register Book</button>
                <button className={`btn btn-sm fw-bold ${tab==='issue'?'btn-primary':'btn-light'}`} onClick={()=>setTab('issue')}><i className="fas fa-hand-holding me-1"></i>Issue / Return</button>
                <button className={`btn btn-sm fw-bold ${tab==='entries'?'btn-primary':'btn-light'}`} onClick={()=>setTab('entries')}><i className="fas fa-users-class me-1"></i>Student Entry Log ({entries.length})</button>
            </div>

            {tab === 'inventory' && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light small">
                                <tr><th>Book Code</th><th>Title</th><th>Author</th><th>Department</th><th>Course Unit</th><th>Total Copies</th><th>Available</th><th>New / Old</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map(b=>(
                                    <tr key={b.id}>
                                        <td><code>{b.id}</code></td>
                                        <td className="fw-bold">{b.title}</td>
                                        <td className="small">{b.author}</td>
                                        <td className="small">{b.dept}</td>
                                        <td className="small">{b.course}</td>
                                        <td className="fw-bold">{b.qty}</td>
                                        <td><span className="badge bg-success">{b.available}</span></td>
                                        <td className="small">{b.newBooks} New / {b.old} Old</td>
                                        <td><span className={`badge ${b.status==='Available'?'bg-success':'bg-warning'}`}>{b.status}</span></td>
                                        <td><button className="btn btn-sm btn-outline-danger" onClick={()=>deleteBook(b.id)}><i className="fas fa-trash"></i></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'add-book' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: 640 }}>
                    <h5 className="fw-bold mb-3 text-primary"><i className="fas fa-book-medical me-2"></i>Register New Library Book</h5>
                    <form onSubmit={addBook}>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Book Title</label>
                            <input type="text" className="form-control" required value={bookForm.title} onChange={e=>setBookForm({...bookForm, title:e.target.value})} placeholder="e.g. Gray's Anatomy 42nd Edition" />
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-bold small">Author</label>
                                <input type="text" className="form-control" required value={bookForm.author} onChange={e=>setBookForm({...bookForm, author:e.target.value})} placeholder="e.g. Henry Gray" />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-bold small">Department</label>
                                <select className="form-select" value={bookForm.dept} onChange={e=>setBookForm({...bookForm, dept:e.target.value})}>
                                    <option>Clinical & Medicine</option><option>College of Education</option><option>Health Management</option><option>General Library</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold small">Course Unit</label>
                            <input type="text" className="form-control" required value={bookForm.course} onChange={e=>setBookForm({...bookForm, course:e.target.value})} placeholder="e.g. Anatomy & Histology" />
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-4"><label className="form-label fw-bold small">Total Qty</label><input type="number" className="form-control" required value={bookForm.qty} onChange={e=>setBookForm({...bookForm, qty:e.target.value})} /></div>
                            <div className="col-4"><label className="form-label fw-bold small">New Copies</label><input type="number" className="form-control" value={bookForm.newBooks} onChange={e=>setBookForm({...bookForm, newBooks:e.target.value})} /></div>
                            <div className="col-4"><label className="form-label fw-bold small">Old Copies</label><input type="number" className="form-control" value={bookForm.old} onChange={e=>setBookForm({...bookForm, old:e.target.value})} /></div>
                        </div>
                        <button type="submit" className="btn btn-primary fw-bold px-4"><i className="fas fa-check me-1"></i>Save Book to Catalog</button>
                    </form>
                </div>
            )}

            {tab === 'issue' && (
                <div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ maxWidth: 640 }}>
                        <h6 className="fw-bold mb-3 text-primary"><i className="fas fa-hand-holding me-1"></i>Issue Book to Student</h6>
                        <form onSubmit={issueBook} className="row g-3">
                            <div className="col-12">
                                <select className="form-select" value={issueForm.bookId} onChange={e=>setIssueForm({...issueForm, bookId:e.target.value})}>
                                    <option value="">-- Select Book from Catalog --</option>
                                    {books.map(b=><option key={b.id} value={b.id}>{b.title} ({b.available} available)</option>)}
                                </select>
                            </div>
                            <div className="col-6"><input type="text" className="form-control" required value={issueForm.admNo} onChange={e=>setIssueForm({...issueForm, admNo:e.target.value})} placeholder="Student Adm No" /></div>
                            <div className="col-6"><input type="text" className="form-control" required value={issueForm.studentName} onChange={e=>setIssueForm({...issueForm, studentName:e.target.value})} placeholder="Student Name" /></div>
                            <div className="col-12"><button type="submit" className="btn btn-sm btn-primary fw-bold">Issue Book</button></div>
                        </form>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light small">
                                    <tr><th>Issue ID</th><th>Book Title</th><th>Student Adm No</th><th>Student Name</th><th>Issued On</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {filteredBorrowings.map(br=>(
                                        <tr key={br.id}>
                                            <td><code>{br.id}</code></td>
                                            <td className="fw-bold">{br.bookTitle}</td>
                                            <td><code>{br.admNo}</code></td>
                                            <td className="small">{br.studentName}</td>
                                            <td className="small">{br.issuedOn}</td>
                                            <td className="small">{br.dueOn}</td>
                                            <td><span className={`badge ${br.status==='Returned'?'bg-success':br.status==='Overdue'?'bg-danger':'bg-warning'}`}>{br.status}</span></td>
                                            <td>
                                                {br.status !== 'Returned' && (
                                                    <button className="btn btn-sm btn-success" onClick={()=>returnBook(br.id)}><i className="fas fa-undo me-1"></i>Mark Returned</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'entries' && (
                <div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ maxWidth: 540 }}>
                        <h6 className="fw-bold mb-3 text-primary"><i className="fas fa-id-badge me-1"></i>Record Student Library Entrance</h6>
                        <form onSubmit={addEntry} className="row g-3">
                            <div className="col-6"><input type="text" className="form-control" required value={entryForm.admNo} onChange={e=>setEntryForm({...entryForm, admNo:e.target.value})} placeholder="Admission No" /></div>
                            <div className="col-6"><input type="text" className="form-control" required value={entryForm.name} onChange={e=>setEntryForm({...entryForm, name:e.target.value})} placeholder="Student Name" /></div>
                            <div className="col-12"><button type="submit" className="btn btn-sm btn-primary fw-bold">Record Entry & Generate Library No</button></div>
                        </form>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light small">
                                    <tr><th>Entry ID</th><th>Library Card No</th><th>Admission No</th><th>Student Name</th><th>Time In</th><th>Time Out</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {entries.map(en=>(
                                        <tr key={en.id}>
                                            <td><code>{en.id}</code></td>
                                            <td><span className="badge bg-purple text-white" style={{ background:'#7c3aed' }}>{en.libNo}</span></td>
                                            <td><code>{en.admNo}</code></td>
                                            <td className="fw-bold">{en.name}</td>
                                            <td className="small">{en.timeIn}</td>
                                            <td className="small">{en.timeOut || <span className="text-warning fw-bold">In Library</span>}</td>
                                            <td>
                                                {!en.timeOut && (
                                                    <button className="btn btn-sm btn-outline-primary" onClick={()=>exitEntry(en.id)}><i className="fas fa-sign-out-alt me-1"></i>Clock Exit</button>
                                                )}
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
    );
}
