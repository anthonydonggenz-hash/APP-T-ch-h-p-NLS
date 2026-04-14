import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối Supabase cho dự án: Test-23-01-2026
// Project URL: https://tdrdmvsxkcjodrjkfmal.supabase.co
//
// LƯU Ý BẢO MẬT: 
// - Không bao giờ đưa Database Password vào code Frontend.
// - Chỉ sử dụng Anon Key (Public) cho Client-side.
// - Mọi kết nối Database trực tiếp (nếu cần) phải thực hiện ở Backend hoặc Supabase Dashboard.

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || 'https://tdrdmvsxkcjodrjkfmal.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcmRtdnN4a2Nqb2RyamtmbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNjU0MzMsImV4cCI6MjA4NDc0MTQzM30.i_9oQXYylAkRlj3ZXQzX5qQ_TM2p-G4o1Pg4dg9ULi8';

export const supabase = createClient(supabaseUrl, supabaseKey);