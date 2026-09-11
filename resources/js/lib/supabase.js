import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL || 'https://dttkkhgvxyqdakfoanzn.supabase.co';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn(
        '[Supabase] Using default URL or placeholder key.\n' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel or .env.local.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export default supabase;

