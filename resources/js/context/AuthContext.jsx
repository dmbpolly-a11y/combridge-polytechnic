import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [profile, setProfile] = useState(null);   // row from 'users' table (roles, name, etc.)
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    // ── Load user profile from the 'users' table ─────────────────────────────
    const loadProfile = useCallback(async (authUser) => {
        if (!authUser) { setProfile(null); return; }
        try {
            const { data } = await supabase
                .from('users')
                .select('*, roles(name)')
                .eq('id', authUser.id)
                .single();
            setProfile(data ?? null);
        } catch {
            setProfile(null);
        }
    }, []);

    // ── Sync Supabase session on mount ────────────────────────────────────────
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null;
            setUser(u);
            loadProfile(u).finally(() => setLoading(false));
        });

        // Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null;
            setUser(u);
            loadProfile(u);
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        setError(null);
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message);
            throw err;
        }
        return data.user;
    }, []);

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }, []);

    // ── Role helpers ──────────────────────────────────────────────────────────
    const hasRole = useCallback((role) => {
        if (!profile?.roles) return false;
        return profile.roles.some(r =>
            (typeof r === 'string' ? r : r.name) === role
        );
    }, [profile]);

    const isAdmin     = () => hasRole('administrator') || hasRole('principal') || hasRole('director');
    const isTeacher   = () => hasRole('teacher');
    const isStudent   = () => hasRole('student');
    const isLibrarian = () => hasRole('librarian');

    // Merge auth user + profile for convenience
    const mergedUser = user ? { ...user, ...(profile ?? {}), name: profile?.name ?? user.email } : null;

    return (
        <AuthContext.Provider value={{
            user: mergedUser,
            loading,
            error,
            login,
            logout,
            isAuthenticated: !!user,
            hasRole,
            isAdmin,
            isTeacher,
            isStudent,
            isLibrarian,
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
