import React, { useEffect, useState, useCallback } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { adminService } from '../services/adminService';
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
      toast.error(err.response?.data?.message || 'Không thể phê duyệt');
    }
  };

  const handleBan = async (userId: string) => {
    try {
      const res = await adminService.banUser(userId);
      if (res.success) {
        toast.success('Đã khóa tài khoản');
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể khóa');
    }
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEditFullName(u.fullName);
    setEditJerseyNumber(u.jerseyNumber);
    setEditRole(u.role);
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
    <div className="flex flex-col gap-4 max-w-6xl mx-auto font-sans">
      <Card elevation="glass" glow className="!p-4 sm:!p-5 relative z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                Duyệt người dùng
              </Badge>
              <span className="text-[11px] text-slate-400 font-space font-medium">Ban Cán Sự CLB</span>
            </div>
            <h1 className="font-space font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-1 tracking-tight">
              Duyệt Người Dùng
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Phê duyệt thành viên mới, phân quyền và quản lý tài khoản người dùng
            </p>
          </div>

          <div className="w-48">
            <Select
              options={[
                { value: 'PENDING', label: 'Chờ phê duyệt (Pending)' },
                { value: 'ACTIVE', label: 'Đang hoạt động (Active)' },
                { value: 'BANNED', label: 'Đã khóa (Banned)' },
                { value: 'ALL', label: 'Tất cả trạng thái' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card elevation="level1" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-space font-bold uppercase text-slate-400 bg-slate-100/50 dark:bg-slate-900/50">
                <th className="py-2.5 px-3">Cầu thủ</th>
                <th className="py-2.5 px-3">Tên đăng nhập</th>
                <th className="py-2.5 px-3 text-center">Số áo</th>
                <th className="py-2.5 px-3">Vai trò</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-space">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                    Không có người dùng nào trong danh sách
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
                        <Avatar name={u.fullName} jerseyNumber={u.jerseyNumber} size="sm" showNumber />
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
