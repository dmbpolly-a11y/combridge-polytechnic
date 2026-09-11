import axios from 'axios';

/**
 * Axios instance configured for the Laravel API backend.
 * - baseURL points to Laravel (proxied by Vite in dev)
 * - Automatically reads XSRF-TOKEN cookie for CSRF protection
 * - Credentials included for session/cookie auth (Sanctum)
 */
const client = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// ── Request interceptor: attach XSRF token from cookie ──────────────────────
client.interceptors.request.use((config) => {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

// ── Response interceptor: handle 401 globally ───────────────────────────────
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear local auth state and redirect to login
            localStorage.removeItem('combridge_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[2] : null;
}

// ── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
    /** Fetch CSRF cookie before any POST */
    csrf: ()      => client.get('/sanctum/csrf-cookie'),
    login: (data) => client.post('/api/login', data),
    logout: ()    => client.post('/api/logout'),
    me: ()        => client.get('/api/me'),
};

// ── Admin API ─────────────────────────────────────────────────────────────────
export const adminAPI = {
    stats:          () => client.get('/api/admin/stats'),
    attendanceToday:() => client.get('/api/admin/attendance/today'),
    financialSummary: ()=> client.get('/api/admin/financial-summary'),
    recentStudents: () => client.get('/api/admin/recent-students'),
    announcements:  () => client.get('/api/admin/announcements'),
    upcomingExams:  () => client.get('/api/admin/upcoming-exams'),
};

export default client;
