import React, { useEffect, useState } from 'react';
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

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

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
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Trung tâm Quản trị CLB
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Phê duyệt thành viên mới, phân quyền và quản lý tài khoản người dùng
          </p>
        </div>

        <div className="w-56">
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

      <Card elevation="level1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono font-bold uppercase text-slate-500 bg-slate-50/60">
                <th className="py-3 px-3">Cầu thủ</th>
                <th className="py-3 px-3">Tên đăng nhập</th>
                <th className="py-3 px-3 text-center">Số áo</th>
                <th className="py-3 px-3">Vai trò</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
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
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.fullName} jerseyNumber={u.jerseyNumber} size="sm" showNumber />
                        <span className="font-bold text-slate-900 font-heading">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">@{u.username}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-700">
                      {u.jerseyNumber ? `#${u.jerseyNumber}` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={u.role === 'ADMIN' ? 'teamA' : 'neutral'} size="sm">
                        {u.role === 'ADMIN' ? 'Quản trị viên' : 'Cầu thủ'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {u.status === 'PENDING' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-[10px] font-bold uppercase border border-amber-200">
                          Chờ duyệt
                        </span>
                      )}
                      {u.status === 'ACTIVE' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-200">
                          Hoạt động
                        </span>
                      )}
                      {u.status === 'BANNED' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 font-mono text-[10px] font-bold uppercase border border-red-200">
                          Bị khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                          variant="surface"
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
        <div className="flex flex-col gap-4">
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
