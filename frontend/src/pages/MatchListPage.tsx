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
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await matchService.getMatches();
      if (res.success && res.data) {
        setMatches(res.data);
      }
    } catch {
      toast.error('Không thể tải danh sách trận đấu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto font-sans">
      {/* Header and Controls */}
      <Card elevation="glass" glow className="!p-5 sm:!p-6 relative z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                Lịch & Kết quả
              </Badge>
              <span className="text-xs text-slate-400 font-space font-medium">Saigon Sunday League</span>
            </div>
            <h1 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Lịch Thi Đấu & Kết Quả
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tổng cộng: <strong className="text-slate-900 dark:text-slate-100">{matches.length}</strong> trận đấu (Thể thức 7v7 nội bộ).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <Select
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái' },
                  { value: 'PENDING', label: 'Chờ điểm danh' },
                  { value: 'IN_PROGRESS', label: 'Đang thi đấu' },
                  { value: 'COMPLETED', label: 'Đã kết thúc' },
                ]}
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
        <Card elevation="level1" className="py-10 text-center text-xs text-slate-400 italic">
          Không tìm thấy trận đấu nào phù hợp với bộ lọc
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMatches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
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
