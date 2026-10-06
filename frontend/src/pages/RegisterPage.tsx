import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthVisualSide } from '../components/auth/AuthVisualSide';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number | undefined>(undefined);
  const [favoritePosition, setFavoritePosition] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Duplicate error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [jerseyError, setJerseyError] = useState('');

  const navigate = useNavigate();

  // Debounced real-time duplicate check
  useEffect(() => {
    const timer = setTimeout(async () => {
      const u = username.trim();
      const em = email.trim();
      const j =
        jerseyNumber !== undefined && jerseyNumber !== null && !isNaN(Number(jerseyNumber))
          ? Number(jerseyNumber)
          : undefined;

      if (!u && !em && j === undefined) {
        setUsernameError('');
        setEmailError('');
        setJerseyError('');
        return;
      }

      if (j !== undefined && (j < 1 || j > 99)) {
        setJerseyError('Số áo phải từ 1 đến 99');
      }

      try {
        const res = await authService.checkAvailability({
          username: u || undefined,
          email: em || undefined,
          jerseyNumber: j !== undefined && j >= 1 && j <= 99 ? j : undefined,
        });

        if (res.success && res.data) {
          if (u) {
            setUsernameError(
              res.data.usernameAvailable
                ? ''
                : res.data.usernameError || 'Tên đăng nhập đã tồn tại trong hệ thống'
            );
          } else {
            setUsernameError('');
          }

          if (em) {
            setEmailError(
              res.data.emailAvailable
                ? ''
                : res.data.emailError || 'Email đã được đăng ký trong hệ thống'
            );
          } else {
            setEmailError('');
          }

          if (j !== undefined) {
            if (j < 1 || j > 99) {
              setJerseyError('Số áo phải từ 1 đến 99');
            } else {
              setJerseyError(
                res.data.jerseyNumberAvailable
                  ? ''
                  : res.data.jerseyNumberError || 'Số áo đã có cầu thủ khác sử dụng'
              );
            }
          } else {
            setJerseyError('');
          }
        }
      } catch (err) {
        // Silently skip background check error
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, email, jerseyNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !fullName.trim() || !password) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (jerseyError) {
      toast.error(jerseyError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        username: username.trim(),
        fullName: fullName.trim(),
        jerseyNumber: jerseyNumber ? Number(jerseyNumber) : undefined,
        favoritePosition: favoritePosition.trim() || undefined,
        email: email.trim() || undefined,
        password,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success('Đăng ký thành công! Vui lòng chờ quản trị viên duyệt.');
      } else {
        toast.error(res.message || 'Không thể đăng ký tài khoản');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#070B14] relative flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glows for liquid glass aesthetic */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-2/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

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
      <div className="w-full max-w-6xl my-auto rounded-[28px] sm:rounded-[36px] bg-[#0E1626]/85 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)] p-4 sm:p-6 md:p-8 lg:p-9 relative z-10 my-6">
        
        {/* Mobile View: Symmetrical Team Photo Banner at top */}
        <div className="block lg:hidden">
          <AuthVisualSide mode="mobile" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* Left Column: Direct Register Form */}
          <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 flex flex-col justify-between py-1 sm:py-2 px-1 sm:px-3">
            <div>
              {/* Club Emblem & Header */}
              <div className="flex items-center gap-3 mb-5">
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
                    Đăng ký gia nhập câu lạc bộ
                  </p>
                </div>
              </div>

              {/* Title & Subtitle (Clean Vietnamese, no ALL CAPS) */}
              <div className="mb-5">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mb-1.5">
                  Đăng ký thành viên
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  Gia nhập câu lạc bộ Chim Mọc Cánh FC
                </p>
              </div>

              {isSuccess ? (
                /* Success State Card */
                <div className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md my-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 mb-3.5">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-white mb-2">
                    Đăng ký thành công!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mb-6 font-sans">
                    Hồ sơ đăng ký của bạn đã được chuyển tới Ban quản trị. Vui lòng chờ phê duyệt để kích hoạt tài khoản trước khi đăng nhập.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Về trang đăng nhập</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  
                  {/* Full Name Field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-300 font-sans">
                      Họ và tên <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                      <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                        badge
                      </span>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn Nam"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Username & Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Username */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-300 font-sans">
                          Tên đăng nhập <span className="text-emerald-400">*</span>
                        </label>
                        {username.trim() && !usernameError && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Hợp lệ
                          </span>
                        )}
                      </div>
                      <div
                        className={`relative flex items-center rounded-2xl bg-black/40 border transition-all shadow-inner ${
                          usernameError
                            ? 'border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20'
                            : 'border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          person
                        </span>
                        <input
                          type="text"
                          placeholder="VD: nguyennam"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                          autoComplete="username"
                        />
                      </div>
                      {usernameError && (
                        <span className="text-[11px] text-rose-400 font-sans leading-tight mt-0.5">
                          {usernameError}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-300 font-sans">
                        Email <span className="text-slate-500 text-[10px]">(tùy chọn)</span>
                      </label>
                      <div
                        className={`relative flex items-center rounded-2xl bg-black/40 border transition-all shadow-inner ${
                          emailError
                            ? 'border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20'
                            : 'border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          mail
                        </span>
                        <input
                          type="email"
                          placeholder="VD: nam@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                        />
                      </div>
                      {emailError && (
                        <span className="text-[11px] text-rose-400 font-sans leading-tight mt-0.5">
                          {emailError}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Jersey Number & Preferred Position in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Jersey Number */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-300 font-sans">
                          Số áo mong muốn
                        </label>
                        {jerseyNumber !== undefined && !jerseyError && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Khả dụng
                          </span>
                        )}
                      </div>
                      <div
                        className={`relative flex items-center rounded-2xl bg-black/40 border transition-all shadow-inner ${
                          jerseyError
                            ? 'border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20'
                            : 'border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          tag
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          placeholder="Từ 1 đến 99"
                          value={jerseyNumber !== undefined ? jerseyNumber : ''}
                          onChange={(e) =>
                            setJerseyNumber(e.target.value ? Number(e.target.value) : undefined)
                          }
                          className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                        />
                      </div>
                      {jerseyError ? (
                        <span className="text-[11px] text-rose-400 font-sans leading-tight mt-0.5">
                          {jerseyError}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-sans">
                          Mỗi cầu thủ 1 số áo độc nhất (1–99)
                        </span>
                      )}
                    </div>

                    {/* Preferred Position */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-300 font-sans">
                        Vị trí sở trường
                      </label>
                      <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          sports_soccer
                        </span>
                        <select
                          value={favoritePosition}
                          onChange={(e) => setFavoritePosition(e.target.value)}
                          className="w-full bg-transparent py-2.5 pr-3.5 text-xs sm:text-sm text-white focus:outline-none font-sans cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
                        >
                          <option value="">Chọn vị trí...</option>
                          <option value="GK">GK — Thủ môn</option>
                          <option value="CB">CB — Trung vệ</option>
                          <option value="LB">LB — Hậu vệ trái</option>
                          <option value="RB">RB — Hậu vệ phải</option>
                          <option value="CDM">CDM — Tiền vệ phòng ngự</option>
                          <option value="CM">CM — Tiền vệ trung tâm</option>
                          <option value="CAM">CAM — Tiền vệ tấn công</option>
                          <option value="LM">LM — Tiền vệ cánh trái</option>
                          <option value="RM">RM — Tiền vệ cánh phải</option>
                          <option value="LW">LW — Tiền đạo cánh trái</option>
                          <option value="RW">RW — Tiền đạo cánh phải</option>
                          <option value="ST">ST — Tiền đạo cắm</option>
                        </select>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans">
                        Hỗ trợ xếp sơ đồ chiến thuật tự động
                      </span>
                    </div>

                  </div>

                  {/* Password & Confirm Password in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Password */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-300 font-sans">
                        Mật khẩu <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative flex items-center rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          lock
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Tối thiểu 6 ký tự"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent py-2.5 pr-9 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                          title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-300 font-sans">
                        Xác nhận mật khẩu <span className="text-emerald-400">*</span>
                      </label>
                      <div
                        className={`relative flex items-center rounded-2xl bg-black/40 border transition-all shadow-inner ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20'
                            : 'border-white/10 hover:border-white/20 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-slate-400 pl-3.5 pr-2 pointer-events-none text-xl">
                          lock_reset
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-transparent py-2.5 pr-9 text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                          title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <span className="text-[11px] text-rose-400 font-sans leading-tight mt-0.5">
                          Mật khẩu xác nhận không khớp
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang gửi hồ sơ...</span>
                      </>
                    ) : (
                      <>
                        <span>Gửi yêu cầu đăng ký</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Footer Switch */}
            {!isSuccess && (
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-slate-400 font-sans">
                  Đã có tài khoản thành viên?{' '}
                  <Link
                    to="/login"
                    className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-colors ml-1"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            )}
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
