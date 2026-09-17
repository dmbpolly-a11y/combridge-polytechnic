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
    { id:'STU006', admNo:'CP/MED/2026/006', name:'Kemigisha Dianah',   prog:'Nursing Sciences',   year:'Year 1', phone:'+256 787 112233', status:'Active',   cw:32, exam:50, total:82, grade:'A-', remarks:'Very Good',      attendance:94, lecturer:'Dr. Arthur Mugisha' },
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
    { id:'EX-03', code:'NUR 2205',  course:'Advanced Maternal & Child Nursing',      setter:'Sr. Mary Birungi',       vettedBy:'Pending',                status:'Pending Review',      examDate:'2026-10-18' },
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

// ── SHARED UI HELPERS ─────────────────────────────────────────────────────────
function PortalHeader({ icon, color, title, subtitle }) {
    return (
        <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: color + '18', borderLeft: `5px solid ${color}` }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 54, height: 54, background: color }}>
                <i className={`${icon} fa-lg`}></i>
            </div>
            <div>
                <h4 className="fw-bold mb-0" style={{ color }}>{title}</h4>
                <p className="text-muted mb-0 small">{subtitle}</p>
            </div>
        </div>
    );
}

function TabBar({ tabs, active, setActive, color = '#006837' }) {
    return (
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2" style={{ borderBottom: '2px solid #e9ecef' }}>
            {tabs.map(t => (
                <button key={t.id} onClick={() => setActive(t.id)}
                    className="btn btn-sm fw-semibold"
                    style={{ transition: 'all 0.2s', background: active === t.id ? color : '#f1f5f9', color: active === t.id ? '#fff' : '#334155', border: 'none' }}>
                    {t.label}
                </button>
            ))}
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

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CombridgeManage() {
    const { portal: portalId } = useParams();
    const navigate = useNavigate();
    const activePortal = portalId || 'overview';

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

    const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4500); };

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
        notify('✅ Marks saved — grade and remarks auto-calculated.');
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

    const renderPortal = () => {
        const shared = { students, marks, updateMark, saveMark, deleteStudent };
        switch (activePortal) {
            case 'admin':              return <AdminPortal students={students} exams={exams} fees={fees} payments={payments} books={books} borrowings={borrowings} />;
            case 'academic-registrar': return <RegistrarPortal students={students} apps={apps} programmes={PROGRAMMES_LIST} regForm={regForm} setRegForm={setRegForm} handleRegister={handleRegister} updateAppStatus={updateAppStatus} deleteStudent={deleteStudent} />;
            case 'lecturer':           return <LecturerPortal {...shared} />;
            case 'dean':               return <DeanPortal students={students} exams={exams} updateExamStatus={updateExamStatus} />;
            case 'deputy-registrar':   return <DeputyPortal {...shared} />;
            case 'bursar':             return <BursarPortal fees={fees} payments={payments} feeForm={feeForm} setFeeForm={setFeeForm} addFee={addFee} deleteFee={deleteFee} payForm={payForm} setPayForm={setPayForm} addPayment={addPayment} deletePayment={deletePayment} programmes={PROGRAMMES_LIST} />;
            case 'library':            return <LibraryPortal books={books} borrowings={borrowings} entries={entries} bookForm={bookForm} setBookForm={setBookForm} addBook={addBook} deleteBook={deleteBook} issueForm={issueForm} setIssueForm={setIssueForm} issueBook={issueBook} returnBook={returnBook} entryForm={entryForm} setEntryForm={setEntryForm} addEntry={addEntry} exitEntry={exitEntry} />;
            default:                   return <Overview navigate={navigate} />;
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

            {/* Page Header */}
            <div className="py-4 text-white" style={{ background:'linear-gradient(135deg,#006837 0%,#004d28 100%)', borderBottom:'4px solid #ffdd57' }}>
                <div className="container">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <img src="/images/logocom.png" alt="Logo" style={{ height:54, borderRadius:6, background:'#fff', padding:4 }} />
                        <div>
                            <h2 className="fw-bold mb-0 text-white" style={{ fontSize:'clamp(1.2rem,3vw,1.8rem)' }}>
                                <i className="fas fa-th-large me-2 text-warning"></i>Combridge Manage
                            </h2>
                            <p className="mb-0 text-white-50 small">University Management System — Combridge Institute of Health Management Sciences</p>
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
                        {PORTALS.map(p => (
                            <button key={p.id} onClick={() => navigate(`/combridge-manage/${p.id}`)}
                                style={{ background: activePortal===p.id?'#ffdd57':'transparent', color: activePortal===p.id?'#000':'#fff', border:'none', padding:'8px 14px', fontWeight:600, fontSize:'0.8rem', transition:'all 0.2s', cursor:'pointer', borderRadius:2 }}>
                                <i className={`${p.icon} me-1`}></i>{p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container py-4">{renderPortal()}</div>
        </div>
    );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({ navigate }) {
    return (
        <div>
            <div className="text-center mb-5">
                <h3 className="fw-bold" style={{ color:'#006837' }}>University Management Portals</h3>
                <p className="text-muted">Select a portal below to access its management dashboard and tools</p>
            </div>
            <div className="row g-4">
                {PORTALS.map(p => (
                    <div key={p.id} className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow rounded-4 h-100"
                            style={{ cursor:'pointer', transition:'transform 0.25s,box-shadow 0.25s', borderTop:`5px solid ${p.color}` }}
                            onClick={() => navigate(`/combridge-manage/${p.id}`)}
                            onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                            onMouseLeave={e => e.currentTarget.style.transform=''}>
                            <div className="card-body p-4 text-center">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width:70, height:70, background:p.color+'22' }}>
                                    <i className={`${p.icon} fa-2x`} style={{ color:p.color }}></i>
                                </div>
                                <h5 className="fw-bold mb-2">{p.label}</h5>
                                <p className="text-muted small mb-3">{p.desc}</p>
                                <button className="btn btn-sm text-white fw-semibold px-4" style={{ background:p.color, border:'none', borderRadius:20 }}>
                                    Open Portal <i className="fas fa-arrow-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── ADMIN PORTAL ──────────────────────────────────────────────────────────────
function AdminPortal({ students, exams, fees, payments, books, borrowings }) {
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
    return (
        <div>
            <PortalHeader icon="fas fa-shield-alt" color="#c1272d" title="Admin Portal" subtitle="System Administrator — Full Control Dashboard" />
            <div className="row g-3 mb-4">
                <StatCard label="Total Students"   val={students.length} icon="fas fa-users"          color="#006837" />
                <StatCard label="Total Depts"      val={DEPTS.length}    icon="fas fa-sitemap"        color="#2563eb" />
                <StatCard label="Exam Papers"      val={exams.length}    icon="fas fa-file-alt"       color="#d97706" />
                <StatCard label="Revenue Collected" val={fmtUgx(totalRevenue)} icon="fas fa-coins"   color="#0d9488" />
                <StatCard label="Library Books"    val={totalBooks}      icon="fas fa-book"           color="#0284c7" />
                <StatCard label="Programmes"       val={6}               icon="fas fa-graduation-cap" color="#c1272d" />
            </div>
            <h5 className="fw-bold mb-3" style={{ color:'#006837' }}><i className="fas fa-sitemap me-2"></i>Departments Under Administration</h5>
            <div className="row g-3">
                {DEPTS.map((d,i) => (
                    <div key={i} className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3" style={{ borderLeft:`4px solid ${d.color}` }}>
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white" style={{ width:44, height:44, background:d.color }}>
                                    <i className={`${d.icon} fa-sm`}></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">{d.name}</h6>
                                    <small className="text-muted">{d.head}</small>
                                    <div><small className="text-success fw-semibold"><strong>{d.staff}</strong> Staff Members</small></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── ACADEMIC REGISTRAR ────────────────────────────────────────────────────────
function RegistrarPortal({ students, apps, programmes, regForm, setRegForm, handleRegister, updateAppStatus, deleteStudent }) {
    const [tab, setTab] = useState('students');
    return (
        <div>
            <PortalHeader icon="fas fa-user-check" color="#006837" title="Academic Registrar" subtitle="Student Registration · Admissions · Programmes · Marks Management" />
            <TabBar tabs={[{id:'students',label:'Students Register'},{id:'register',label:'Register New Student'},{id:'apps',label:'Incoming Applications'},{id:'programmes',label:'Programmes'}]} active={tab} setActive={setTab} />

            {tab === 'students' && (
                <div className="table-responsive">
                    <h6 className="fw-bold mb-3">All Registered Students ({students.length})</h6>
                    <table className="table table-hover table-sm align-middle">
                        <thead className="table-dark"><tr><th>Adm No</th><th>Name</th><th>Programme</th><th>Year</th><th>Status</th><th>Total</th><th>Grade</th><th>Action</th></tr></thead>
                        <tbody>{students.map(s => (
                            <tr key={s.id}>
                                <td><small className="font-monospace text-success fw-bold">{s.admNo}</small></td>
                                <td className="fw-semibold">{s.name}</td>
                                <td><small>{s.prog}</small></td>
                                <td><small>{s.year}</small></td>
                                <td><span className={`badge ${s.status==='Active'?'bg-success':s.status==='Probation'?'bg-warning text-dark':'bg-danger'}`}>{s.status}</span></td>
                                <td className="fw-bold">{s.total}</td>
                                <td><span className="badge bg-primary">{s.grade}</span></td>
                                <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteStudent(s.id)}><i className="fas fa-trash"></i></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'register' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth:580 }}>
                    <h6 className="fw-bold mb-3" style={{ color:'#006837' }}><i className="fas fa-user-plus me-2"></i>Register New Student</h6>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3"><label className="form-label fw-semibold small">Full Name *</label><input className="form-control" required value={regForm.name} onChange={e => setRegForm(p => ({...p, name:e.target.value}))} placeholder="e.g. Kigozi Ronald" /></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Programme *</label><select className="form-select" value={regForm.programme} onChange={e => setRegForm(p => ({...p, programme:e.target.value}))}>{programmes.map(pr => <option key={pr}>{pr}</option>)}</select></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Year of Study</label><select className="form-select" value={regForm.year} onChange={e => setRegForm(p => ({...p, year:e.target.value}))}><option>Year 1</option><option>Year 2</option><option>Year 3</option></select></div>
                        <div className="mb-4"><label className="form-label fw-semibold small">Phone Number</label><input className="form-control" value={regForm.phone} onChange={e => setRegForm(p => ({...p, phone:e.target.value}))} placeholder="+256 7XX XXX XXX" /></div>
                        <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#006837', border:'none', borderRadius:8 }}><i className="fas fa-id-card me-2"></i>Register & Auto-Generate Admission Number</button>
                    </form>
                </div>
            )}

            {tab === 'apps' && (
                <div className="table-responsive">
                    <h6 className="fw-bold mb-3">Incoming Applications ({apps.length})</h6>
                    <table className="table table-hover table-sm align-middle">
                        <thead className="table-dark"><tr><th>ID</th><th>Applicant</th><th>Programme</th><th>Phone</th><th>Applied On</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{apps.map(a => (
                            <tr key={a.id}>
                                <td><small className="font-monospace fw-bold">{a.id}</small></td>
                                <td className="fw-semibold">{a.name}</td>
                                <td><small>{a.programme}</small></td>
                                <td><small>{a.phone}</small></td>
                                <td><small>{a.appliedOn}</small></td>
                                <td><span className={`badge ${a.status==='Approved'?'bg-success':a.status==='Rejected'?'bg-danger':'bg-warning text-dark'}`}>{a.status}</span></td>
                                <td className="d-flex gap-1">
                                    {a.status==='Pending Review' && <>
                                        <button className="btn btn-sm btn-success" onClick={() => updateAppStatus(a.id,'Approved')}>Approve</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => updateAppStatus(a.id,'Rejected')}>Reject</button>
                                    </>}
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'programmes' && (
                <div className="row g-3">
                    {programmes.map((prog, i) => (
                        <div key={i} className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-3 p-3" style={{ borderLeft:'4px solid #006837' }}>
                                <h6 className="fw-bold mb-1">{prog}</h6>
                                <small className="text-muted">Students enrolled: {students.filter(s => s.prog && prog.toLowerCase().includes(s.prog.toLowerCase().split(' ')[0])).length}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── LECTURER PORTAL ───────────────────────────────────────────────────────────
function LecturerPortal({ students, marks, updateMark, saveMark, deleteStudent }) {
    return (
        <div>
            <PortalHeader icon="fas fa-chalkboard-teacher" color="#2563eb" title="Lecturer / Tutor Portal" subtitle="Enter Marks · Auto-Calculate Grade · Manage Students" />
            <div className="alert border-0 rounded-3 mb-4 small" style={{ background:'#eff6ff', borderLeft:'4px solid #2563eb' }}>
                <i className="fas fa-info-circle me-2 text-primary"></i>
                <strong>Grading:</strong> Coursework /40 + Exam /60 = Total /100 &nbsp;|&nbsp; A(≥80) B+(≥70) B(≥60) C+(≥55) C(≥50) D+(≥45) F(&lt;45)
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle">
                    <thead className="table-dark">
                        <tr><th>Adm No</th><th>Name</th><th>Programme</th><th>CW /40</th><th>Exam /60</th><th>Total</th><th>Grade</th><th>Remarks</th><th>Attend%</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {students.map(s => {
                            const buf = marks[s.id] || {};
                            const cw = buf.cw ?? s.cw, exam = buf.exam ?? s.exam;
                            const total = cw + exam;
                            const { grade, remarks } = calcGrade(total);
                            return (
                                <tr key={s.id}>
                                    <td><small className="font-monospace text-success fw-bold">{s.admNo}</small></td>
                                    <td className="fw-semibold">{s.name}</td>
                                    <td><small>{s.prog}</small></td>
                                    <td><input type="number" min="0" max="40" className="form-control form-control-sm" style={{ width:65 }} value={cw} onChange={e => updateMark(s.id,'cw',e.target.value)} /></td>
                                    <td><input type="number" min="0" max="60" className="form-control form-control-sm" style={{ width:65 }} value={exam} onChange={e => updateMark(s.id,'exam',e.target.value)} /></td>
                                    <td className="fw-bold" style={{ color: total>=50?'#006837':'#c1272d' }}>{total}</td>
                                    <td><span className={`badge ${total>=70?'bg-success':total>=50?'bg-warning text-dark':'bg-danger'}`}>{grade}</span></td>
                                    <td><small>{remarks}</small></td>
                                    <td><span className={`badge ${s.attendance>=80?'bg-success':s.attendance>=60?'bg-warning text-dark':'bg-danger'}`}>{s.attendance}%</span></td>
                                    <td className="d-flex gap-1">
                                        <button className="btn btn-sm btn-success" title="Save Marks" onClick={() => saveMark(s.id)}><i className="fas fa-save"></i></button>
                                        <button className="btn btn-sm btn-outline-danger" title="Remove" onClick={() => deleteStudent(s.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── DEAN PORTAL ───────────────────────────────────────────────────────────────
function DeanPortal({ students, exams, updateExamStatus }) {
    const [tab, setTab] = useState('marks');
    return (
        <div>
            <PortalHeader icon="fas fa-graduation-cap" color="#d97706" title="Dean of Clinical & Medicine" subtitle="Faculty Marks · Attendance · Exam Oversight" />
            <TabBar tabs={[{id:'marks',label:'Student Marks'},{id:'attendance',label:'Attendance'},{id:'exams',label:'Exam Papers'}]} active={tab} setActive={setTab} color="#d97706" />

            {tab === 'marks' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#d97706', color:'#fff' }}><tr><th>Adm No</th><th>Name</th><th>Programme</th><th>CW</th><th>Exam</th><th>Total</th><th>Grade</th><th>Remarks</th></tr></thead>
                        <tbody>{students.map(s => (
                            <tr key={s.id}>
                                <td><small className="font-monospace fw-bold text-success">{s.admNo}</small></td>
                                <td>{s.name}</td><td><small>{s.prog}</small></td>
                                <td>{s.cw}</td><td>{s.exam}</td>
                                <td className="fw-bold" style={{ color: s.total>=50?'#006837':'#c1272d' }}>{s.total}</td>
                                <td><span className={`badge ${s.total>=70?'bg-success':s.total>=50?'bg-warning text-dark':'bg-danger'}`}>{s.grade}</span></td>
                                <td><small>{s.remarks}</small></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'attendance' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#d97706', color:'#fff' }}><tr><th>Adm No</th><th>Name</th><th>Programme</th><th>Attendance</th><th>Standing</th></tr></thead>
                        <tbody>{students.map(s => (
                            <tr key={s.id}>
                                <td><small className="font-monospace fw-bold">{s.admNo}</small></td><td>{s.name}</td><td><small>{s.prog}</small></td>
                                <td style={{ minWidth:160 }}>
                                    <div className="progress mb-1" style={{ height:8 }}>
                                        <div className="progress-bar" style={{ width:`${s.attendance}%`, background: s.attendance>=80?'#006837':s.attendance>=60?'#d97706':'#c1272d' }}></div>
                                    </div>
                                    <small className="fw-bold">{s.attendance}%</small>
                                </td>
                                <td><span className={`badge ${s.attendance>=80?'bg-success':s.attendance>=60?'bg-warning text-dark':'bg-danger'}`}>{s.attendance>=80?'Good Standing':s.attendance>=60?'Warning':'Critical'}</span></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'exams' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#d97706', color:'#fff' }}><tr><th>Code</th><th>Course</th><th>Setter</th><th>Vetted By</th><th>Exam Date</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>{exams.map(e => (
                            <tr key={e.id}>
                                <td><small className="font-monospace fw-bold">{e.code}</small></td>
                                <td>{e.course}</td><td><small>{e.setter}</small></td><td><small>{e.vettedBy}</small></td><td><small>{e.examDate}</small></td>
                                <td><span className={`badge ${e.status==='Approved & Printed'?'bg-success':e.status==='Under Moderation'?'bg-warning text-dark':'bg-secondary'}`}>{e.status}</span></td>
                                <td>{e.status!=='Approved & Printed' && <button className="btn btn-sm btn-success" onClick={() => updateExamStatus(e.id,'Approved & Printed')}>Approve</button>}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── DEPUTY REGISTRAR ──────────────────────────────────────────────────────────
function DeputyPortal({ students, marks, updateMark, saveMark }) {
    return (
        <div>
            <PortalHeader icon="fas fa-user-tie" color="#7c3aed" title="Deputy Academic Registrar" subtitle="Edit Marks · Corrections · Upload from Academic Registrar" />
            <div className="alert border-0 rounded-3 mb-4 small" style={{ background:'#f5f3ff', borderLeft:'4px solid #7c3aed' }}>
                <i className="fas fa-edit me-2" style={{ color:'#7c3aed' }}></i>
                Edit any student's coursework or exam marks. Grades and remarks are automatically recalculated on save.
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-sm align-middle">
                    <thead style={{ background:'#7c3aed', color:'#fff' }}>
                        <tr><th>Adm No</th><th>Student Name</th><th>Programme</th><th>Edit CW /40</th><th>Edit Exam /60</th><th>Total</th><th>Grade</th><th>Remarks</th><th>Save</th></tr>
                    </thead>
                    <tbody>
                        {students.map(s => {
                            const buf = marks[s.id] || {};
                            const cw = buf.cw ?? s.cw, exam = buf.exam ?? s.exam;
                            const total = cw + exam;
                            const { grade, remarks } = calcGrade(total);
                            return (
                                <tr key={s.id}>
                                    <td><small className="font-monospace fw-bold text-success">{s.admNo}</small></td>
                                    <td className="fw-semibold">{s.name}</td>
                                    <td><small>{s.prog}</small></td>
                                    <td><input type="number" min="0" max="40" className="form-control form-control-sm" style={{ width:65 }} value={cw} onChange={e => updateMark(s.id,'cw',e.target.value)} /></td>
                                    <td><input type="number" min="0" max="60" className="form-control form-control-sm" style={{ width:65 }} value={exam} onChange={e => updateMark(s.id,'exam',e.target.value)} /></td>
                                    <td className="fw-bold" style={{ color: total>=50?'#006837':'#c1272d' }}>{total}</td>
                                    <td><span className={`badge ${total>=70?'bg-success':total>=50?'bg-warning text-dark':'bg-danger'}`}>{grade}</span></td>
                                    <td><small>{remarks}</small></td>
                                    <td><button className="btn btn-sm fw-semibold text-white" style={{ background:'#7c3aed', border:'none' }} onClick={() => saveMark(s.id)}><i className="fas fa-save me-1"></i>Save</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── BURSAR PORTAL ─────────────────────────────────────────────────────────────
function BursarPortal({ fees, payments, feeForm, setFeeForm, addFee, deleteFee, payForm, setPayForm, addPayment, deletePayment, programmes }) {
    const [tab, setTab] = useState('fees');
    const totalRevenue  = payments.reduce((a,b) => a + b.amount, 0);
    const totalBalance  = payments.reduce((a,b) => a + b.balance, 0);
    return (
        <div>
            <PortalHeader icon="fas fa-coins" color="#0d9488" title="Bursar" subtitle="Fees Structures · Payments · Track Balances · Financial Reports" />
            <div className="row g-3 mb-4">
                <StatCard label="Total Collected"    val={fmtUgx(totalRevenue)} icon="fas fa-wallet"            color="#0d9488" />
                <StatCard label="Outstanding Balance" val={fmtUgx(totalBalance)} icon="fas fa-exclamation-circle" color="#c1272d" />
                <StatCard label="Transactions"        val={payments.length}      icon="fas fa-receipt"            color="#2563eb" />
                <StatCard label="Fee Structures"      val={fees.length}          icon="fas fa-file-invoice"       color="#d97706" />
            </div>
            <TabBar tabs={[{id:'fees',label:'Fee Structures'},{id:'add-fee',label:'Create Fee Structure'},{id:'payments',label:'All Payments'},{id:'record',label:'Record Payment'},{id:'report',label:'Financial Report'}]} active={tab} setActive={setTab} color="#0d9488" />

            {tab === 'fees' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#0d9488', color:'#fff' }}><tr><th>ID</th><th>Programme</th><th>Year</th><th>Tuition (UGX)</th><th>Functional (UGX)</th><th>Total (UGX)</th><th>Action</th></tr></thead>
                        <tbody>{fees.map(f => (
                            <tr key={f.id}>
                                <td><small className="font-monospace fw-bold">{f.id}</small></td>
                                <td>{f.programme}</td><td>{f.year}</td>
                                <td>{fmtUgx(f.tuition)}</td><td>{fmtUgx(f.functional)}</td>
                                <td className="fw-bold text-success">{fmtUgx(f.total)}</td>
                                <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteFee(f.id)}><i className="fas fa-trash"></i></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'add-fee' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth:580 }}>
                    <h6 className="fw-bold mb-3" style={{ color:'#0d9488' }}>Create New Fee Structure</h6>
                    <form onSubmit={addFee}>
                        <div className="mb-3"><label className="form-label fw-semibold small">Programme</label><select className="form-select" value={feeForm.programme} onChange={e => setFeeForm(p => ({...p,programme:e.target.value}))}>{programmes.map(pr => <option key={pr}>{pr}</option>)}</select></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Year</label><select className="form-select" value={feeForm.year} onChange={e => setFeeForm(p => ({...p,year:e.target.value}))}><option>Year 1</option><option>Year 2</option><option>Year 3</option></select></div>
                        <div className="row g-3 mb-4">
                            <div className="col"><label className="form-label fw-semibold small">Tuition Fee (UGX)</label><input type="number" className="form-control" required value={feeForm.tuition} onChange={e => setFeeForm(p => ({...p,tuition:e.target.value}))} placeholder="1800000" /></div>
                            <div className="col"><label className="form-label fw-semibold small">Functional Fee (UGX)</label><input type="number" className="form-control" required value={feeForm.functional} onChange={e => setFeeForm(p => ({...p,functional:e.target.value}))} placeholder="250000" /></div>
                        </div>
                        <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#0d9488', border:'none', borderRadius:8 }}><i className="fas fa-plus me-2"></i>Create Fee Structure</button>
                    </form>
                </div>
            )}

            {tab === 'payments' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#0d9488', color:'#fff' }}><tr><th>Ref</th><th>Adm No</th><th>Student</th><th>Amount Paid</th><th>Date</th><th>Method</th><th>Balance</th><th>Action</th></tr></thead>
                        <tbody>{payments.map(p => (
                            <tr key={p.id}>
                                <td><small className="font-monospace fw-bold">{p.ref}</small></td>
                                <td><small>{p.admNo}</small></td><td>{p.name}</td>
                                <td className="fw-bold text-success">{fmtUgx(p.amount)}</td>
                                <td><small>{p.date}</small></td><td><small>{p.method}</small></td>
                                <td className={`fw-bold ${p.balance>0?'text-danger':'text-success'}`}>{fmtUgx(p.balance)}</td>
                                <td><button className="btn btn-sm btn-outline-danger" onClick={() => deletePayment(p.id)}><i className="fas fa-trash"></i></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'record' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth:580 }}>
                    <h6 className="fw-bold mb-3" style={{ color:'#0d9488' }}>Record Student Payment</h6>
                    <form onSubmit={addPayment}>
                        <div className="mb-3"><label className="form-label fw-semibold small">Admission Number *</label><input className="form-control" required value={payForm.admNo} onChange={e => setPayForm(p => ({...p,admNo:e.target.value}))} placeholder="CP/MED/2026/001" /></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Student Name *</label><input className="form-control" required value={payForm.name} onChange={e => setPayForm(p => ({...p,name:e.target.value}))} /></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Amount Paid (UGX) *</label><input type="number" className="form-control" required value={payForm.amount} onChange={e => setPayForm(p => ({...p,amount:e.target.value}))} placeholder="e.g. 1000000" /></div>
                        <div className="mb-4"><label className="form-label fw-semibold small">Payment Method</label><select className="form-select" value={payForm.method} onChange={e => setPayForm(p => ({...p,method:e.target.value}))}><option>Mobile Money</option><option>Bank Transfer</option><option>Cash</option></select></div>
                        <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#0d9488', border:'none', borderRadius:8 }}><i className="fas fa-receipt me-2"></i>Record Payment</button>
                    </form>
                </div>
            )}

            {tab === 'report' && (
                <div>
                    <h6 className="fw-bold mb-3" style={{ color:'#0d9488' }}>Financial Summary Report</h6>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4"><div className="card border-0 shadow-sm p-4 text-center rounded-3"><div className="fw-bold text-success fs-5">{fmtUgx(totalRevenue)}</div><small className="text-muted">Total Revenue Collected</small></div></div>
                        <div className="col-md-4"><div className="card border-0 shadow-sm p-4 text-center rounded-3"><div className="fw-bold text-danger fs-5">{fmtUgx(totalBalance)}</div><small className="text-muted">Total Outstanding Balance</small></div></div>
                        <div className="col-md-4"><div className="card border-0 shadow-sm p-4 text-center rounded-3"><div className="fw-bold text-primary fs-5">{payments.length}</div><small className="text-muted">Total Transactions</small></div></div>
                    </div>
                    <h6 className="fw-bold mb-2">Fee Structures Overview</h6>
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead className="table-success"><tr><th>Programme</th><th>Year</th><th>Tuition</th><th>Functional</th><th>Total Fee</th></tr></thead>
                            <tbody>{fees.map(f => <tr key={f.id}><td>{f.programme}</td><td>{f.year}</td><td>{fmtUgx(f.tuition)}</td><td>{fmtUgx(f.functional)}</td><td className="fw-bold">{fmtUgx(f.total)}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── LIBRARY PORTAL ────────────────────────────────────────────────────────────
function LibraryPortal({ books, borrowings, entries, bookForm, setBookForm, addBook, deleteBook, issueForm, setIssueForm, issueBook, returnBook, entryForm, setEntryForm, addEntry, exitEntry }) {
    const [tab, setTab] = useState('inventory');
    const totalBooks = books.reduce((a,b) => a + b.qty, 0);
    const totalOld   = books.reduce((a,b) => a + b.old, 0);
    const totalNew   = books.reduce((a,b) => a + b.newBooks, 0);
    const totalAvail = books.reduce((a,b) => a + b.available, 0);
    return (
        <div>
            <PortalHeader icon="fas fa-book-reader" color="#0284c7" title="Library Admin" subtitle="Book Registration · Organise by Dept · Issue & Return · Entry Records" />
            <div className="row g-3 mb-4">
                <StatCard label="Total Books"  val={totalBooks}  icon="fas fa-book"                  color="#0284c7" />
                <StatCard label="Available"    val={totalAvail}  icon="fas fa-check-circle"          color="#006837" />
                <StatCard label="Old Books"    val={totalOld}    icon="fas fa-history"               color="#d97706" />
                <StatCard label="New Books"    val={totalNew}    icon="fas fa-star"                  color="#7c3aed" />
                <StatCard label="Borrowed"     val={borrowings.filter(b=>b.status==='Borrowed').length} icon="fas fa-hand-holding" color="#2563eb" />
                <StatCard label="Overdue"      val={borrowings.filter(b=>b.status==='Overdue').length}  icon="fas fa-exclamation-triangle" color="#c1272d" />
            </div>
            <TabBar tabs={[{id:'inventory',label:'Book Inventory'},{id:'add-book',label:'Register Book'},{id:'issue',label:'Issue Book'},{id:'borrowings',label:'Borrowing History'},{id:'entry',label:'Student Entry / Exit'}]} active={tab} setActive={setTab} color="#0284c7" />

            {tab === 'inventory' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#0284c7', color:'#fff' }}><tr><th>ID</th><th>Title</th><th>Author</th><th>Department</th><th>Course Unit</th><th>Total</th><th>Avail.</th><th>Old</th><th>New</th><th>Status</th><th>Del</th></tr></thead>
                        <tbody>{books.map(b => (
                            <tr key={b.id}>
                                <td><small className="font-monospace fw-bold">{b.id}</small></td>
                                <td className="fw-semibold">{b.title}</td><td><small>{b.author}</small></td>
                                <td><small>{b.dept}</small></td><td><small>{b.course}</small></td>
                                <td className="fw-bold">{b.qty}</td><td className="fw-bold text-success">{b.available}</td>
                                <td>{b.old}</td><td>{b.newBooks}</td>
                                <td><span className={`badge ${b.status==='Available'?'bg-success':'bg-warning text-dark'}`}>{b.status}</span></td>
                                <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteBook(b.id)}><i className="fas fa-trash"></i></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'add-book' && (
                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth:600 }}>
                    <h6 className="fw-bold mb-3" style={{ color:'#0284c7' }}><i className="fas fa-plus-circle me-2"></i>Register New Book</h6>
                    <form onSubmit={addBook}>
                        <div className="mb-3"><label className="form-label fw-semibold small">Book Title *</label><input className="form-control" required value={bookForm.title} onChange={e => setBookForm(p => ({...p,title:e.target.value}))} /></div>
                        <div className="mb-3"><label className="form-label fw-semibold small">Author *</label><input className="form-control" required value={bookForm.author} onChange={e => setBookForm(p => ({...p,author:e.target.value}))} /></div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6"><label className="form-label fw-semibold small">Department</label><select className="form-select" value={bookForm.dept} onChange={e => setBookForm(p => ({...p,dept:e.target.value}))}><option>Clinical & Medicine</option><option>College of Education</option><option>Health Management</option><option>IT & Systems</option><option>Life Skills Academy</option></select></div>
                            <div className="col-md-6"><label className="form-label fw-semibold small">Course / Unit</label><input className="form-control" value={bookForm.course} onChange={e => setBookForm(p => ({...p,course:e.target.value}))} placeholder="e.g. Anatomy & Histology" /></div>
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4"><label className="form-label fw-semibold small">Total Quantity *</label><input type="number" className="form-control" required min="1" value={bookForm.qty} onChange={e => setBookForm(p => ({...p,qty:e.target.value}))} /></div>
                            <div className="col-md-4"><label className="form-label fw-semibold small">Old Books</label><input type="number" className="form-control" min="0" value={bookForm.old} onChange={e => setBookForm(p => ({...p,old:e.target.value}))} /></div>
                            <div className="col-md-4"><label className="form-label fw-semibold small">New Books</label><input type="number" className="form-control" min="0" value={bookForm.newBooks} onChange={e => setBookForm(p => ({...p,newBooks:e.target.value}))} /></div>
                        </div>
                        <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#0284c7', border:'none', borderRadius:8 }}><i className="fas fa-book me-2"></i>Register Book in Library</button>
                    </form>
                </div>
            )}

            {tab === 'issue' && (
                <div className="row g-4">
                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h6 className="fw-bold mb-3" style={{ color:'#0284c7' }}>Issue Book to Student</h6>
                            <form onSubmit={issueBook}>
                                <div className="mb-3"><label className="form-label fw-semibold small">Select Book *</label>
                                    <select className="form-select" required value={issueForm.bookId} onChange={e => setIssueForm(p => ({...p,bookId:e.target.value}))}>
                                        <option value="">-- Select Available Book --</option>
                                        {books.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title} (Avail: {b.available})</option>)}
                                    </select>
                                </div>
                                <div className="mb-3"><label className="form-label fw-semibold small">Student Adm No *</label><input className="form-control" required value={issueForm.admNo} onChange={e => setIssueForm(p => ({...p,admNo:e.target.value}))} placeholder="CP/MED/2026/001" /></div>
                                <div className="mb-4"><label className="form-label fw-semibold small">Student Name *</label><input className="form-control" required value={issueForm.studentName} onChange={e => setIssueForm(p => ({...p,studentName:e.target.value}))} /></div>
                                <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#0284c7', border:'none', borderRadius:8 }}><i className="fas fa-hand-holding me-2"></i>Issue Book (14 Days)</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <h6 className="fw-bold mb-3">Currently Borrowed / Overdue</h6>
                        <div className="table-responsive"><table className="table table-sm">
                            <thead className="table-info"><tr><th>Book</th><th>Student</th><th>Issued</th><th>Due</th><th>Status</th><th>Return</th></tr></thead>
                            <tbody>{borrowings.filter(b => b.status !== 'Returned').map(b => (
                                <tr key={b.id}>
                                    <td><small>{b.bookTitle}</small></td><td><small>{b.studentName}</small></td>
                                    <td><small>{b.issuedOn}</small></td><td><small>{b.dueOn}</small></td>
                                    <td><span className={`badge ${b.status==='Borrowed'?'bg-primary':'bg-danger'}`}>{b.status}</span></td>
                                    <td><button className="btn btn-sm btn-success" onClick={() => returnBook(b.id)}><i className="fas fa-undo me-1"></i>Return</button></td>
                                </tr>
                            ))}</tbody>
                        </table></div>
                    </div>
                </div>
            )}

            {tab === 'borrowings' && (
                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle">
                        <thead style={{ background:'#0284c7', color:'#fff' }}><tr><th>ID</th><th>Book</th><th>Adm No</th><th>Student</th><th>Issued On</th><th>Due On</th><th>Returned On</th><th>Status</th></tr></thead>
                        <tbody>{borrowings.map(b => (
                            <tr key={b.id}>
                                <td><small className="font-monospace fw-bold">{b.id}</small></td>
                                <td>{b.bookTitle}</td><td><small className="font-monospace">{b.admNo}</small></td><td>{b.studentName}</td>
                                <td><small>{b.issuedOn}</small></td><td><small>{b.dueOn}</small></td><td><small>{b.returnedOn || '—'}</small></td>
                                <td><span className={`badge ${b.status==='Returned'?'bg-success':b.status==='Overdue'?'bg-danger':'bg-primary'}`}>{b.status}</span></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}

            {tab === 'entry' && (
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h6 className="fw-bold mb-3" style={{ color:'#0284c7' }}>Record Student Library Entry</h6>
                            <form onSubmit={addEntry}>
                                <div className="mb-3"><label className="form-label fw-semibold small">Admission Number *</label><input className="form-control" required value={entryForm.admNo} onChange={e => setEntryForm(p => ({...p,admNo:e.target.value}))} placeholder="CP/MED/2026/001" /></div>
                                <div className="mb-4"><label className="form-label fw-semibold small">Student Name *</label><input className="form-control" required value={entryForm.name} onChange={e => setEntryForm(p => ({...p,name:e.target.value}))} /></div>
                                <button type="submit" className="btn fw-bold text-white w-100 py-2" style={{ background:'#0284c7', border:'none', borderRadius:8 }}><i className="fas fa-sign-in-alt me-2"></i>Record Entry & Issue Library No</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h6 className="fw-bold mb-3">Today's Library Entry / Exit Log</h6>
                        <div className="table-responsive"><table className="table table-sm align-middle">
                            <thead className="table-info"><tr><th>Library No</th><th>Adm No</th><th>Student Name</th><th>Date</th><th>Time In</th><th>Time Out</th><th>Status</th><th>Exit</th></tr></thead>
                            <tbody>{entries.map(e => (
                                <tr key={e.id}>
                                    <td><span className="badge bg-primary">{e.libNo}</span></td>
                                    <td><small className="font-monospace">{e.admNo}</small></td>
                                    <td className="fw-semibold">{e.name}</td>
                                    <td><small>{e.date}</small></td>
                                    <td><small className="text-success fw-bold">{e.timeIn}</small></td>
                                    <td><small className={e.timeOut ? 'text-danger fw-bold' : 'text-muted'}>{e.timeOut || '—'}</small></td>
                                    <td><span className={`badge ${e.timeOut ? 'bg-secondary' : 'bg-success'}`}>{e.timeOut ? 'Left' : 'Inside'}</span></td>
                                    <td>{!e.timeOut && <button className="btn btn-sm btn-warning text-dark fw-bold" onClick={() => exitEntry(e.id)}><i className="fas fa-sign-out-alt me-1"></i>Exit</button>}</td>
                                </tr>
                            ))}</tbody>
                        </table></div>
                    </div>
                </div>
            )}
        </div>
    );
}
