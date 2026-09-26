import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Input } from '../ui';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Background Soft Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <Card elevation="level2" className="w-full max-w-md p-8 relative z-10 bg-white border-slate-200 shadow-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#DC2626] via-[#B91C1C] to-[#2563EB] flex items-center justify-center text-white font-black shadow-md mb-3">
            <span className="material-symbols-outlined text-[28px]">sports_soccer</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">ChimMocCanh</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Đăng nhập tài khoản câu lạc bộ</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            leftIcon="person"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            leftIcon="lock"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="mt-2">
            Đăng nhập
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-red-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </Card>
    </div>
  );
};
