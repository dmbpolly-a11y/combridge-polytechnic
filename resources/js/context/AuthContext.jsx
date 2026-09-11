import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

const STORAGE_KEY = 'combridge_user';

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    // ── Verify session on mount ──────────────────────────────────────────────
    useEffect(() => {
        authAPI.me()
            .then(({ data }) => {
                setUser(data.user);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
            })
            .catch(() => {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
            })
            .finally(() => setLoading(false));
    }, []);

    // ── Login ────────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password, remember = false) => {
        setError(null);
        try {
            await authAPI.csrf();
            const { data } = await authAPI.login({ email, password, remember });
            setUser(data.user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
            return data.user;
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // ── Role helpers ─────────────────────────────────────────────────────────
    const hasRole = useCallback((role) => {
        if (!user?.roles) return false;
        return user.roles.some(r =>
            (typeof r === 'string' ? r : r.name) === role
        );
    }, [user]);

    const isAdmin      = () => hasRole('administrator') || hasRole('principal');
    const isTeacher    = () => hasRole('teacher');
    const isStudent    = () => hasRole('student');
    const isLibrarian  = () => hasRole('librarian');

    return (
        <AuthContext.Provider value={{
            user, loading, error,
            login, logout,
            isAuthenticated: !!user,
            hasRole, isAdmin, isTeacher, isStudent, isLibrarian,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
