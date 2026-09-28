import React, { useEffect, useState } from 'react';
import { Match } from '../types';
import { matchService } from '../services/matchService';
import { useAuthStore } from '../store/authStore';
import { Button, Card, Select, Badge } from '../ui';
import { MatchCard } from '../components/match/MatchCard';
import { CreateMatchModal } from '../components/match/CreateMatchModal';
import toast from 'react-hot-toast';

export const MatchListPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const fetchMatches = async () => {
    setLoading(true);
    try {
      if (statusFilter === 'DELETED') {
        const res = await matchService.getDeletedMatches();
        if (res.success && res.data) {
          setMatches(res.data);
        }
      } else {
        const res = await matchService.getMatches();
        if (res.success && res.data) {
          setMatches(res.data);
        }
      }
    } catch {
      toast.error('Không thể tải danh sách trận đấu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const handleDelete = async (matchId: string) => {
    try {
      const res = await matchService.deleteMatch(matchId);
      if (res.success) {
        toast.success('Đã xóa mềm trận đấu! Điểm số và bàn thắng của trận này đã được tạm thời hoàn tác khỏi BXH.');
        setConfirmDeleteId(null);
        fetchMatches();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa trận đấu');
    }
  };

  const handleRestore = async (matchId: string) => {
    try {
      const res = await matchService.restoreMatch(matchId);
      if (res.success) {
        toast.success('Đã khôi phục trận đấu! Điểm số và bàn thắng đã được cộng dồn lại vào BXH.');
        fetchMatches();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể khôi phục trận đấu');
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (statusFilter === 'ALL' || statusFilter === 'DELETED') return true;
    return m.status === statusFilter;
  });

  const filterOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái', icon: 'grid_view' },
    { value: 'PENDING', label: 'Chờ điểm danh', icon: 'schedule' },
    { value: 'IN_PROGRESS', label: 'Đang thi đấu', icon: 'sports_soccer' },
    { value: 'COMPLETED', label: 'Đã kết thúc', icon: 'check_circle' },
  ];

  if (isAdmin) {
    filterOptions.push({ value: 'DELETED', label: 'Thùng rác (Đã xóa)', icon: 'delete' });
  }

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Header and Controls */}
      <Card elevation="glass" glow className="!p-5 sm:!p-6 relative z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={statusFilter === 'DELETED' ? 'error' : 'primary'} dot size="sm">
                {statusFilter === 'DELETED' ? 'Thùng rác trận đấu' : 'Lịch & Kết quả'}
              </Badge>
              <span className="text-xs text-slate-400 font-space font-medium">Saigon Sunday League</span>
            </div>
            <h1 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              {statusFilter === 'DELETED' ? 'Các Trận Đấu Đã Xóa Mềm' : 'Lịch Thi Đấu & Kết Quả'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {statusFilter === 'DELETED'
                ? 'Danh sách các trận đã xóa mềm. Admin có thể bấm "Khôi phục" để tính lại điểm số vào BXH bất cứ lúc nào.'
                : `Tổng cộng: ${matches.length} trận đấu (Thể thức 7v7 nội bộ).`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-56">
              <Select
                options={filterOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>

            {isAdmin && (
              <Button
                variant="primary"
                size="md"
                leftIcon="add_circle"
                onClick={() => setIsModalOpen(true)}
              >
                Tạo trận mới
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Đang tải dữ liệu trận đấu...
        </div>
      ) : filteredMatches.length === 0 ? (
        <Card elevation="level1" className="py-10 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {statusFilter === 'DELETED'
            ? 'Thùng rác trống. Không có trận đấu nào bị xóa.'
            : 'Không tìm thấy trận đấu nào phù hợp với bộ lọc'}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              isAdmin={isAdmin}
              onDelete={(id) => setConfirmDeleteId(id)}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card elevation="glass" glow className="max-w-md w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-space font-black text-lg text-slate-900 dark:text-white mb-2">
              Xác Nhận Xóa Mềm Trận Đấu?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Trận đấu sẽ được chuyển vào <strong>Thùng rác</strong> và ẩn khỏi Trang chủ & Lịch thi đấu. Toàn bộ bàn thắng, kiến tạo, và điểm số của trận này sẽ <strong>tạm thời được hoàn tác khỏi Bảng xếp hạng</strong> cho đến khi bạn bấm <strong>Khôi phục</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setConfirmDeleteId(null)}>
                Hủy bỏ
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon="delete"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Xác nhận Xóa mềm
              </Button>
            </div>
          </Card>
        </div>
      )}

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMatches}
      />
    </div>
  );
};
