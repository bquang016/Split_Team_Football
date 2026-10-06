import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { userService, UpdateProfilePayload } from '../../services/userService';
import { authService } from '../../services/authService';
import { Button, Input } from '../../ui';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export interface EditProfileModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const FOOTBALL_POSITIONS = [
  { value: 'GK', label: 'GK — Thủ môn' },
  { value: 'CB', label: 'CB — Trung vệ' },
  { value: 'LB', label: 'LB — Hậu vệ cánh trái' },
  { value: 'RB', label: 'RB — Hậu vệ cánh phải' },
  { value: 'CDM', label: 'CDM — Tiền vệ phòng ngự' },
  { value: 'CM', label: 'CM — Tiền vệ trung tâm' },
  { value: 'CAM', label: 'CAM — Tiền vệ tấn công' },
  { value: 'LM', label: 'LM — Tiền vệ cánh trái' },
  { value: 'RM', label: 'RM — Tiền vệ cánh phải' },
  { value: 'LW', label: 'LW — Tiền đạo cánh trái' },
  { value: 'RW', label: 'RW — Tiền đạo cánh phải' },
  { value: 'ST', label: 'ST — Tiền đạo cắm' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [jerseyNumber, setJerseyNumber] = useState<number | undefined>(user.jerseyNumber);
  const [favoritePosition, setFavoritePosition] = useState(user.favoritePosition || '');

  // Duplicate error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [jerseyError, setJerseyError] = useState('');

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Sync state when modal opens or user prop changes
  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setJerseyNumber(user.jerseyNumber);
      setFavoritePosition(user.favoritePosition || '');
      setShowPasswordSection(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setUsernameError('');
      setEmailError('');
      setJerseyError('');
    }
  }, [isOpen, user]);

  // Debounced duplicate check excluding current user
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      const u = username.trim();
      const em = email.trim();
      const j = jerseyNumber !== undefined && jerseyNumber !== null && !isNaN(Number(jerseyNumber)) ? Number(jerseyNumber) : undefined;

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
          excludeUserId: user.id,
        });

        if (res.success && res.data) {
          if (u) {
            setUsernameError(res.data.usernameAvailable ? '' : (res.data.usernameError || 'Tên đăng nhập đã tồn tại trong hệ thống'));
          } else {
            setUsernameError('');
          }

          if (em) {
            setEmailError(res.data.emailAvailable ? '' : (res.data.emailError || 'Email đã được sử dụng bởi tài khoản khác'));
          } else {
            setEmailError('');
          }

          if (j !== undefined) {
            if (j < 1 || j > 99) {
              setJerseyError('Số áo phải từ 1 đến 99');
            } else {
              setJerseyError(res.data.jerseyNumberAvailable ? '' : (res.data.jerseyNumberError || 'Số áo đã có cầu thủ khác đăng ký'));
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
  }, [isOpen, username, email, jerseyNumber, user.id]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Họ và tên không được để trống');
      return;
    }

    if (!username.trim()) {
      toast.error('Tên đăng nhập không được để trống');
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

    // Password validation if attempting to change
    if (showPasswordSection || newPassword || currentPassword) {
      if (!currentPassword) {
        toast.error('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu');
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error('Xác nhận mật khẩu mới không khớp');
        return;
      }
    }

    setLoading(true);
    const toastId = toast.loading('Đang lưu thông tin...');

    try {
      const payload: UpdateProfilePayload = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim() || undefined,
        jerseyNumber: jerseyNumber !== undefined && jerseyNumber !== null ? Number(jerseyNumber) : undefined,
        favoritePosition: favoritePosition.trim() || undefined,
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await userService.updateUserProfile(user.id, payload);

      if (res.success && res.data) {
        toast.success('Đã cập nhật thông tin thành công!', { id: toastId });
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.message || 'Không thể cập nhật thông tin', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111A2E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">manage_accounts</span>
            </div>
            <div>
              <h2 id="edit-profile-title" className="font-space font-black text-base text-slate-900 dark:text-white">
                Chỉnh Sửa Thông Tin Cá Nhân
              </h2>
              <p className="text-xs text-slate-500 font-space">
                Cập nhật hồ sơ cầu thủ và bảo mật tài khoản
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <Input
            label="Họ và tên *"
            placeholder="VD: Nguyễn Văn A"
            leftIcon="badge"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Tên đăng nhập *"
              placeholder="VD: nguyenvana"
              leftIcon="person"
              required
              value={username}
              error={usernameError}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Email liên hệ"
              type="email"
              placeholder="VD: a@chimmoccanh.com"
              leftIcon="mail"
              value={email}
              error={emailError}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Số áo thi đấu chính thức"
              type="number"
              placeholder="VD: 7, 10"
              leftIcon="tag"
              min={1}
              max={99}
              value={jerseyNumber !== undefined && jerseyNumber !== null ? jerseyNumber : ''}
              error={jerseyError}
              helperText="Mỗi cầu thủ 1 số áo duy nhất (1-99)"
              onChange={(e) =>
                setJerseyNumber(e.target.value ? Number(e.target.value) : undefined)
              }
            />

            <div>
              <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vị trí sở trường / yêu thích
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
                  sports_soccer
                </span>
                <select
                  value={favoritePosition}
                  onChange={(e) => setFavoritePosition(e.target.value)}
                  className="w-full text-xs font-space rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">Chọn vị trí...</option>
                  {FOOTBALL_POSITIONS.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Collapsible Change Password Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowPasswordSection((prev) => !prev)}
              className="flex items-center justify-between w-full py-2 text-xs font-space font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-amber-500">lock</span>
                <span>Thay đổi mật khẩu đăng nhập</span>
              </div>
              <span className="material-symbols-outlined text-base">
                {showPasswordSection ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showPasswordSection && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
                <Input
                  label="Mật khẩu hiện tại *"
                  type="password"
                  placeholder="Nhập mật khẩu đang dùng"
                  leftIcon="key"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <Input
                  label="Mật khẩu mới *"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  leftIcon="lock"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Xác nhận mật khẩu mới *"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  leftIcon="lock_reset"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-xs"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon="save"
              isLoading={loading}
              className="text-xs px-5"
            >
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
