import React, { useEffect, useState, useCallback, useRef } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { adminService } from '../services/adminService';
import { userService } from '../services/userService';
import { Avatar, Badge, Button, Card, Input, Modal, Select } from '../ui';
import toast from 'react-hot-toast';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);

  // Edit user modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editJerseyNumber, setEditJerseyNumber] = useState<number | undefined>();
  const [editRole, setEditRole] = useState<UserRole>('PLAYER');
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingAdminAvatar, setUploadingAdminAvatar] = useState(false);
  const adminFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter === 'ALL' ? undefined : (statusFilter as UserStatus);
      const res = await adminService.getUsers(statusParam);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async (userId: string) => {
    try {
      const res = await adminService.approveUser(userId);
      if (res.success) {
        toast.success('Đã phê duyệt tài khoản thành công!');
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi phê duyệt');
    }
  };

  const handleBan = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) return;
    try {
      const res = await adminService.banUser(userId);
      if (res.success) {
        toast.success('Đã khóa tài khoản');
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi khóa tài khoản');
    }
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEditFullName(u.fullName);
    setEditJerseyNumber(u.jerseyNumber);
    setEditRole(u.role);
  };

  const handleAdminAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingUser) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setUploadingAdminAvatar(true);
    const toastId = toast.loading('Đang tải ảnh lên Cloudflare R2...');

    try {
      const res = await userService.uploadUserAvatar(editingUser.id, file);
      if (res.success && res.data) {
        setEditingUser(res.data);
        fetchUsers();
        toast.success('Đã tải ảnh đại diện lên thành công!', { id: toastId });
      } else {
        toast.error(res.message || 'Lỗi tải ảnh', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tải ảnh lên', { id: toastId });
    } finally {
      setUploadingAdminAvatar(false);
      if (adminFileInputRef.current) {
        adminFileInputRef.current.value = '';
      }
    }
  };

  const handleAdminAvatarRemove = async () => {
    if (!editingUser) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện của người này?')) return;

    setUploadingAdminAvatar(true);
    const toastId = toast.loading('Đang xóa ảnh đại diện...');

    try {
      const res = await userService.removeUserAvatar(editingUser.id);
      if (res.success && res.data) {
        setEditingUser(res.data);
        fetchUsers();
        toast.success('Đã xóa ảnh đại diện thành công!', { id: toastId });
      } else {
        toast.error(res.message || 'Lỗi xóa ảnh', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa ảnh', { id: toastId });
    } finally {
      setUploadingAdminAvatar(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      const res = await adminService.updateUser(editingUser.id, {
        fullName: editFullName,
        jerseyNumber: editJerseyNumber,
        role: editRole,
      });

      if (res.success) {
        toast.success('Cập nhật thông tin thành công!');
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-black text-2xl text-slate-900 dark:text-white">
            Quản Trị Thành Viên
          </h1>
          <p className="text-xs font-space text-slate-600 dark:text-slate-400 mt-1">
            Phê duyệt tài khoản đăng ký, phân quyền vai trò và quản lý ảnh đại diện lưu trữ R2
          </p>
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit">
          {['PENDING', 'ACTIVE', 'BANNED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all ${
                statusFilter === s
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'PENDING' && 'Chờ duyệt'}
              {s === 'ACTIVE' && 'Hoạt động'}
              {s === 'BANNED' && 'Bị khóa'}
              {s === 'ALL' && 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {/* Users table card */}
      <Card elevation="level1" className="overflow-hidden p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-space">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Cầu thủ</th>
                <th className="py-3 px-4">Tài khoản</th>
                <th className="py-3 px-4 text-center">Số áo</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    Không có thành viên nào phù hợp bộ lọc
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-slate-850 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={u.fullName}
                          src={u.avatarUrl}
                          jerseyNumber={u.jerseyNumber}
                          size="sm"
                          showNumber
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">@{u.username}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-500">
                      {u.jerseyNumber ? `#${u.jerseyNumber}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                        {u.role === 'ADMIN' ? 'Quản trị viên' : 'Cầu thủ'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'PENDING' && (
                        <Badge variant="gold" size="sm">Chờ duyệt</Badge>
                      )}
                      {u.status === 'ACTIVE' && (
                        <Badge variant="primary" size="sm" dot>Hoạt động</Badge>
                      )}
                      {u.status === 'BANNED' && (
                        <Badge variant="error" size="sm">Bị khóa</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprove(u.id)}
                            leftIcon="check"
                          >
                            Phê duyệt
                          </Button>
                        )}
                        {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleBan(u.id)}
                            leftIcon="block"
                          >
                            Khóa
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEditModal(u)}
                          leftIcon="edit"
                        >
                          Sửa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Sửa thông tin người dùng">
        <div className="flex flex-col gap-4 font-sans">
          {/* Avatar manager inside modal */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <Avatar
              name={editFullName || editingUser?.fullName}
              src={editingUser?.avatarUrl}
              jerseyNumber={editJerseyNumber}
              size="lg"
              showNumber
            />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <span className="text-xs font-bold font-space text-slate-700 dark:text-slate-300">
                Ảnh đại diện (Cloudflare R2)
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  ref={adminFileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAdminAvatarUpload}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon="upload"
                  isLoading={uploadingAdminAvatar}
                  onClick={() => adminFileInputRef.current?.click()}
                >
                  Tải ảnh mới
                </Button>
                {editingUser?.avatarUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon="delete"
                    isLoading={uploadingAdminAvatar}
                    onClick={handleAdminAvatarRemove}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Input
            label="Họ và tên"
            value={editFullName}
            onChange={(e) => setEditFullName(e.target.value)}
          />
          <Input
            label="Số áo"
            type="number"
            value={editJerseyNumber !== undefined ? editJerseyNumber : ''}
            onChange={(e) =>
              setEditJerseyNumber(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Select
            label="Vai trò"
            options={[
              { value: 'PLAYER', label: 'Cầu thủ (PLAYER)' },
              { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
            ]}
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as UserRole)}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setEditingUser(null)}>
              Hủy
            </Button>
            <Button variant="primary" isLoading={savingEdit} onClick={handleSaveEdit}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
