import { supabase } from '../lib/supabase';

// ── Auth API (Supabase Auth) ──────────────────────────────────────────────────

export const authAPI = {
    /**
     * Sign in with email + password via Supabase Auth.
     * Returns { user, session } on success.
     */
    login: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    /**
     * Sign out the current session.
     */
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get current session user.
     */
    me: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },
};

// ── Database helpers ───────────────────────────────────────────────────────────

/**
 * Generic helper to query a Supabase table.
 * Returns data or throws on error.
 */
async function query(table, { select = '*', filters = {}, limit, order } = {}) {
    let q = supabase.from(table).select(select);

    Object.entries(filters).forEach(([col, val]) => {
        q = q.eq(col, val);
    });

    if (order) q = q.order(order.column, { ascending: order.asc ?? true });
    if (limit)  q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;
    return data;
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminAPI = {
    stats: async () => {
        const [students, teachers, classes, programmes] = await Promise.all([
            supabase.from('students').select('id', { count: 'exact', head: true }),
            supabase.from('teachers').select('id', { count: 'exact', head: true }),
            supabase.from('school_classes').select('id', { count: 'exact', head: true }),
            supabase.from('programmes').select('id', { count: 'exact', head: true }),
        ]);
        return {
            total_students:   students.count  ?? 0,
            total_teachers:   teachers.count  ?? 0,
            total_classes:    classes.count   ?? 0,
            total_programmes: programmes.count ?? 0,
        };
    },

    attendanceToday: async () => {
        const today = new Date().toISOString().split('T')[0];
        const [studentPresent, teacherPresent] = await Promise.all([
            supabase.from('student_attendances')
                .select('id', { count: 'exact', head: true })
                .eq('date', today).eq('status', 'present'),
            supabase.from('teacher_attendances')
                .select('id', { count: 'exact', head: true })
                .eq('date', today).eq('status', 'present'),
        ]);
        return {
            student_present_today: studentPresent.count ?? 0,
            teacher_present_today: teacherPresent.count ?? 0,
        };
    },

    financialSummary: async () => {
        const currentYear = new Date().getFullYear();
        const yearStart = `${currentYear}-01-01`;

        const { data: payments } = await supabase
            .from('fee_payments')
            .select('amount')
            .gte('payment_date', yearStart);

        const totalCollected = (payments ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);

        const { data: balances } = await supabase
            .from('fee_balances')
            .select('balance_amount')
            .gt('balance_amount', 0);

        const pendingFees = (balances ?? []).reduce((sum, b) => sum + (b.balance_amount ?? 0), 0);

        const today = new Date().toISOString().split('T')[0];
        const { count: paymentsToday } = await supabase
            .from('fee_payments')
            .select('id', { count: 'exact', head: true })
            .eq('payment_date', today);

        return {
            total_fees_collected: totalCollected,
            pending_fees: pendingFees,
            payments_today: paymentsToday ?? 0,
        };
    },

    recentStudents: async () => {
        return query('students', {
            select: 'id, admission_number, created_at, users(name)',
            order: { column: 'created_at', asc: false },
            limit: 5,
        });
    },

    announcements: async () => {
        return query('announcements', {
            select: 'id, title, content, priority, published_at',
            filters: { status: 'published' },
            order: { column: 'published_at', asc: false },
            limit: 5,
        });
    },

    upcomingExams: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('examinations')
            .select('id, exam_type, exam_date, start_time, end_time, subjects(name), school_classes(name)')
            .gte('exam_date', today)
            .order('exam_date', { ascending: true })
            .limit(5);
        if (error) throw error;
        return data;
    },
};

// ── Student API ───────────────────────────────────────────────────────────────

export const studentAPI = {
    list: (filters = {}) => query('students', {
        select: 'id, admission_number, created_at, status, users(name, email), programmes(name), school_classes(name)',
        filters,
        order: { column: 'created_at', asc: false },
    }),

    get: async (id) => {
        const { data, error } = await supabase
            .from('students')
            .select('*, users(*), programmes(*), school_classes(*), departments(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    create: async (payload) => {
        const { data, error } = await supabase.from('students').insert(payload).select().single();
        if (error) throw error;
        return data;
    },

    update: async (id, payload) => {
        const { data, error } = await supabase.from('students').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    delete: async (id) => {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
    },
};

// ── Teacher API ───────────────────────────────────────────────────────────────

export const teacherAPI = {
    list: () => query('teachers', {
        select: 'id, employee_number, created_at, status, users(name, email), departments(name)',
        order: { column: 'created_at', asc: false },
    }),

    get: async (id) => {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, users(*), departments(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },
};

// ── Fee API ───────────────────────────────────────────────────────────────────

export const feeAPI = {
    payments: () => query('fee_payments', {
        select: 'id, amount, payment_date, payment_method, receipt_number, students(admission_number, users(name))',
        order: { column: 'payment_date', asc: false },
    }),

    structures: () => query('fee_structures', {
        select: '*',
        order: { column: 'academic_year', asc: false },
    }),

    balances: () => query('fee_balances', {
        select: '*, students(admission_number, users(name))',
    }),

    collectFee: async (payload) => {
        const { data, error } = await supabase.from('fee_payments').insert(payload).select().single();
        if (error) throw error;
        return data;
    },

    studentStatement: async (studentId) => {
        const { data, error } = await supabase
            .from('fee_payments')
            .select('*')
            .eq('student_id', studentId)
            .order('payment_date', { ascending: false });
        if (error) throw error;
        return data;
    },
};

// ── Examination API ───────────────────────────────────────────────────────────

export const examAPI = {
    list: () => query('examinations', {
        select: 'id, exam_type, exam_date, start_time, end_time, status, subjects(name), school_classes(name)',
        order: { column: 'exam_date', asc: false },
    }),

    get: async (id) => {
        const { data, error } = await supabase
            .from('examinations')
            .select('*, subjects(*), school_classes(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    results: async (examId) => {
        const { data, error } = await supabase
            .from('exam_results')
            .select('*, students(admission_number, users(name))')
            .eq('examination_id', examId);
        if (error) throw error;
        return data;
    },

    storeMarks: async (marks) => {
        const { data, error } = await supabase.from('exam_results').upsert(marks).select();
        if (error) throw error;
        return data;
    },
};

// ── Announcement API ──────────────────────────────────────────────────────────

export const announcementAPI = {
    list: () => query('announcements', {
        select: 'id, title, content, priority, status, published_at, target_audience, users(name)',
        order: { column: 'created_at', asc: false },
    }),

    get: async (id) => {
        const { data, error } = await supabase.from('announcements').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    create: async (payload) => {
        const { data, error } = await supabase.from('announcements').insert(payload).select().single();
        if (error) throw error;
        return data;
    },

    update: async (id, payload) => {
        const { data, error } = await supabase.from('announcements').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    delete: async (id) => {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
    },
};

export default supabase;
