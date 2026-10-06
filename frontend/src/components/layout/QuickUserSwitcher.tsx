import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { User } from '../../types';
import { Avatar, Badge } from '../../ui';
import toast from 'react-hot-toast';

export const QuickUserSwitcher: React.FC = () => {
  const { user, quickLogin } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getQuickUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      setIsOpen(false);
      return;
    }

    setSwitchingId(targetUser.id);
    const success = await quickLogin(targetUser.id);
    setSwitchingId(null);
    if (success) {
      toast.success(`Đã chuyển sang tài khoản: ${targetUser.fullName}`);
      setIsOpen(false);
      window.location.reload();
    } else {
      toast.error('Không thể chuyển tài khoản');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chuyển đổi tài khoản nhanh để test chia đội/admin"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-space font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
      >
        <span className="material-symbols-outlined text-sm text-emerald-500 animate-spin-slow">
          sync_alt
        </span>
        <span className="hidden sm:inline">Đổi tài khoản</span>
        <span className="material-symbols-outlined text-xs text-slate-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 text-slate-900 dark:text-slate-100 font-sans">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
            <div>
              <span className="block font-space font-bold text-xs text-slate-900 dark:text-white">
                Chuyển Nhanh Tài Khoản
              </span>
              <span className="text-[10px] text-slate-400 font-space">
                Đăng nhập 1-click không cần mật khẩu
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
              {users.length} tài khoản
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
                Đang tải danh sách...
              </div>
            ) : users.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                Chưa có tài khoản nào
              </div>
            ) : (
              users.map((u) => {
                const isCurrent = u.id === user?.id;
                const isSwitching = switchingId === u.id;

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitch(u)}
                    disabled={isSwitching}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        name={u.fullName}
                        src={u.avatarUrl}
                        jerseyNumber={u.jerseyNumber}
                        size="sm"
                        showNumber
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-space font-bold text-xs text-slate-900 dark:text-white truncate max-w-[130px]">
                            {u.fullName}
                          </span>
                          {u.role === 'ADMIN' && (
                            <Badge variant="gold" size="sm">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] font-space text-slate-400 dark:text-slate-500 block truncate">
                          @{u.username} • #{u.jerseyNumber || '—'}
                        </span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="material-symbols-outlined text-sm text-emerald-500">
                        check_circle
                      </span>
                    ) : isSwitching ? (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2 py-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-space flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-500 flex-shrink-0">
              lightbulb
            </span>
            <span>
              Mẹo: Mở thêm <strong>Cửa sổ Ẩn danh (Ctrl+Shift+N)</strong> để đăng nhập 2 tài khoản song song 2 bên màn hình!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
