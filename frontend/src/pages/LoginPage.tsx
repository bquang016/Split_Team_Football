import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { AuthVisualSide } from '../components/auth/AuthVisualSide';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ username: username.trim(), password });
      if (res.success && res.data) {
        login(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success(`Chào mừng trở lại, ${res.data.user.fullName}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(res.message || 'Đăng nhập không thành công');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Vui lòng liên hệ Đội trưởng hoặc Ban quản trị để được hỗ trợ cấp lại mật khẩu.', {
      icon: 'ℹ️',
      duration: 4000,
    });
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#070B14] relative flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glows for liquid glass aesthetic */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-80 sm:w-[450px] h-80 sm:h-[450px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-3/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Subtle pitch texture grid lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Navigation back to home */}
      <Link
        to="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-xs font-sans text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-md group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">
          arrow_back
        </span>
        <span>Trang chủ</span>
      </Link>

      {/* Main Glass Bento Card */}
      <div className="w-full max-w-6xl my-auto rounded-[28px] sm:rounded-[36px] bg-[#0E1626]/85 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] p-4 sm:p-6 md:p-8 lg:p-9 relative z-10">
        
        {/* Mobile View: Symmetrical Team Photo Banner at top */}
        <div className="block lg:hidden">
          <AuthVisualSide mode="mobile" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* Left Column: Direct Login Form */}
          <div className="w-full lg:w-[410px] xl:w-[430px] shrink-0 flex flex-col justify-between py-1 px-1 sm:px-2">
            <div>
              {/* Club Emblem & Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 border border-white/20 shrink-0">
                  <span className="material-symbols-outlined text-2xl">sports_soccer</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-lg tracking-tight text-white">
                      Chim Mọc Cánh
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      FC
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Hệ thống quản lý câu lạc bộ bóng đá
                  </p>
                </div>
              </div>

              {/* Title & Subtitle (Clean Vietnamese, no ALL CAPS) */}
              <div className="mb-6">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
                  Chào mừng trở lại
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  Vui lòng nhập thông tin tài khoản của bạn để tiếp tục
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Username Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300 font-sans">
                    Tên đăng nhập <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                    <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent py-3 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300 font-sans">
                      Mật khẩu <span className="text-emerald-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-sans transition-colors cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                    <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent py-3 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Helper options: Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900/60 text-emerald-500 focus:ring-emerald-500/20 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 hover:text-slate-300 font-sans">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Footer Switch */}
            <div className="mt-8 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400 font-sans">
                Chưa có tài khoản thành viên?{' '}
                <Link
                  to="/register"
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-colors ml-1"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column: Visual Showcase with Team Photo (Desktop) */}
          <div className="hidden lg:flex lg:flex-1 min-w-0 w-full items-center justify-center">
            <AuthVisualSide mode="desktop" />
          </div>

        </div>
      </div>
    </div>
  );
};
