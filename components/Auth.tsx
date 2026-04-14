import React, { useState } from 'react';
import { Wand2, Mail, Lock, ArrowLeft, RefreshCw, AlertCircle, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Props {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const Auth: React.FC<Props> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [expectations, setExpectations] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        if (data.user) onAuthSuccess();
      } else {
        // Registration
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              expectations: expectations || 'Không có',
            }
          }
        });

        if (authError) throw authError;

        if (data.user) {
          if (data.session) {
            onAuthSuccess();
          } else {
            setSuccess('Đăng ký thành công! Thầy Cô có thể đăng nhập ngay bây giờ.');
            setIsLogin(true);
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-premium flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-gold-accent/10 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-accent to-gold-primary flex items-center justify-center shadow-lg mb-4">
                <Wand2 className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-slate-800">
                {isLogin ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
              </h1>
              <p className="text-slate-500 text-sm mt-1 text-center">
                {isLogin 
                  ? 'Chào mừng Thầy Cô quay trở lại với công cụ AI' 
                  : 'Tham gia cộng đồng giáo viên ứng dụng AI sáng tạo'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-shake">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 text-green-600 text-sm">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className={isLogin ? "space-y-4" : "space-y-3"}>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-xs" 
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-xs" 
                        placeholder="09xx..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-xs" 
                    placeholder="thayco@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-xs" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Mong muốn ứng dụng AI (Không bắt buộc)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-xs min-h-[60px]" 
                      placeholder="Ví dụ: Tiết kiệm thời gian soạn bài..."
                      value={expectations}
                      onChange={(e) => setExpectations(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-gold-accent to-gold-primary text-white font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : (isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gold-dark font-bold hover:underline"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          </div>

        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; 2024 Thầy Trần Đông AI Trainer. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
