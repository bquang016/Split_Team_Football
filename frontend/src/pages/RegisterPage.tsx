import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../ui';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !fullName.trim() || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
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
        email: email.trim() || undefined,
        password,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success('Đăng ký thành công! Vui lòng chờ quản trị viên duyệt.');
      } else {
        toast.error(res.message || 'Không thể đăng ký');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <Card elevation="level2" className="w-full max-w-md p-8 relative z-10 bg-white border-slate-200 shadow-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#DC2626] via-[#B91C1C] to-[#2563EB] flex items-center justify-center text-white font-black shadow-md mb-3">
            <span className="material-symbols-outlined text-[28px]">sports_soccer</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">ChimMocCanh</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Đăng ký thành viên câu lạc bộ</p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="material-symbols-outlined text-4xl text-amber-600 mb-2">
              check_circle
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
              Đăng ký thành công!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Tài khoản của bạn đã được gửi tới Ban quản trị. Vui lòng chờ quản trị viên phê duyệt
              trước khi đăng nhập.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Về trang Đăng nhập
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <Input
              label="Họ và tên *"
              placeholder="VD: Nguyễn Văn A"
              leftIcon="badge"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tên đăng nhập *"
                placeholder="VD: nguyenvana"
                leftIcon="person"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Số áo yêu thích"
                type="number"
                placeholder="VD: 7"
                leftIcon="tag"
                min={1}
                max={99}
                value={jerseyNumber !== undefined ? jerseyNumber : ''}
                onChange={(e) =>
                  setJerseyNumber(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <Input
              label="Email (tùy chọn)"
              type="email"
              placeholder="VD: a@chimmoccanh.com"
              leftIcon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Mật khẩu *"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              leftIcon="lock"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Xác nhận mật khẩu *"
              type="password"
              placeholder="Nhập lại mật khẩu"
              leftIcon="lock_reset"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="mt-2"
            >
              Gửi yêu cầu đăng ký
            </Button>
          </form>
        )}

        {!isSuccess && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-red-600 font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};
