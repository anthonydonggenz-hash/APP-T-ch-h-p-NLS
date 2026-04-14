import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối Supabase cho dự án mới
// Project URL: https://tdrdmvsxkcjodrjkfmal.supabase.co

const defaultUrl = 'https://tdrdmvsxkcjodrjkfmal.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcmRtdnN4a2Nqb2RyamtmbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjU0MzMsImV4cCI6MjA4NDc0MTQzM30.i_9oQXYylAkRlj3ZXQzX5qQ_TM2p-G4o1Pg4dg9ULi8';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const useEnv = !!(envUrl && envUrl.startsWith('http') && envKey && envKey.length > 10);

const supabaseUrl = useEnv ? envUrl.trim() : defaultUrl;
const supabaseKey = useEnv ? envKey.trim() : defaultKey;

export const supabase = createClient(supabaseUrl, supabaseKey);