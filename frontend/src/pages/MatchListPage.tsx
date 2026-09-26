import React, { useEffect, useState } from 'react';
import { Match } from '../types';
import { matchService } from '../services/matchService';
import { useAuthStore } from '../store/authStore';
import { Button, Card, Select } from '../ui';
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Lịch & Kết quả
            </span>
            <span className="text-xs text-slate-400 font-medium">Saigon Sunday League</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            Lịch Thi Đấu & Kết Quả
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng: {matches.length} trận đấu (Thể thức 7v7 nội bộ).
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              leftIcon="add_circle"
              onClick={() => setIsModalOpen(true)}
            >
              Tạo trận mới
            </Button>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Đang tải dữ liệu trận đấu...
        </div>
      ) : filteredMatches.length === 0 ? (
        <Card elevation="level1" className="py-12 text-center text-sm text-slate-400 italic">
          Không tìm thấy trận đấu nào phù hợp với bộ lọc
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
