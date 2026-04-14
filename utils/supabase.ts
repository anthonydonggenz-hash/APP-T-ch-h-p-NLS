import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối Supabase cho dự án mới
// Project URL: https://yozwkthjkyqoyfrfrzfi.supabase.co

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yozwkthjkyqoyfrfrzfi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvendrdGhqa3lxb3lmcmZyemZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjU0MzMsImV4cCI6MjA4NDc0MTQzM30.fHW_5v1JH-O8Gms1Bs9OuL-0BSjA-8oKulDAkiyEdig';

export const supabase = createClient(supabaseUrl, supabaseKey);