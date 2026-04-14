import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối Supabase cho dự án mới
// Project URL: https://yozwkthjkyqoyfrfrzfi.supabase.co

const defaultUrl = 'https://yozwkthjkyqoyfrfrzfi.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvendrdGhqa3lxb3lmcmZyemZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTkwNTUsImV4cCI6MjA5MTY5NTA1NX0.fHW_5v1JH-O8Gms1Bs9OuL-0BSjA-8oKulDAkiyEdig';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const useEnv = !!(envUrl && envUrl.startsWith('http') && envKey && envKey.length > 10);

const supabaseUrl = useEnv ? envUrl.trim() : defaultUrl;
const supabaseKey = useEnv ? envKey.trim() : defaultKey;

export const supabase = createClient(supabaseUrl, supabaseKey);