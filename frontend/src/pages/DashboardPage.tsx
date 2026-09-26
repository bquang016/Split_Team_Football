import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, LeaderboardItem } from '../types';
import { matchService } from '../services/matchService';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';
import { Button, Card } from '../ui';
import { MatchCard } from '../components/match/MatchCard';
import { MetricBentoStrip } from '../components/leaderboard/MetricBentoStrip';
import { CreateMatchModal } from '../components/match/CreateMatchModal';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../utils/constants';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAdmin } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesRes, lbRes] = await Promise.all([
        matchService.getMatches(),
        leaderboardService.getLeaderboard('goals'),
      ]);

      if (matchesRes.success) setMatches(matchesRes.data || []);
      if (lbRes.success) setLeaderboard(lbRes.data || []);
    } catch {
      toast.error('Không thể tải dữ liệu trang chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Find next upcoming match (not completed or cancelled)
  const nextMatch = matches.find(
    (m) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED'
  );

  // Recent completed matches
  const recentMatches = matches.filter((m) => m.status === 'COMPLETED').slice(0, 3);

  // Top metric items
  const topScorer = leaderboard[0];
  const topAssister = [...leaderboard].sort((a, b) => b.totalAssists - a.totalAssists)[0];
  const topWinner = [...leaderboard].sort((a, b) => b.totalWins - a.totalWins)[0];

  const hasJoinedNextMatch = nextMatch?.participants?.some((p) => p.user.id === user?.id);

  const handleJoinNextMatch = async () => {
    if (!nextMatch || !user) return;
    try {
      if (hasJoinedNextMatch) {
        await matchService.leaveMatch(nextMatch.id);
        toast.success('Đã hủy tham gia trận đấu');
      } else {
        await matchService.joinMatch(nextMatch.id);
        toast.success('Điểm danh tham gia trận đấu thành công!');
      }
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              ChiMocCanh • Thể thức 7v7
            </span>
            <span className="text-xs text-slate-400 font-medium">Saigon Sunday League</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            {user ? `Xin chào, ${user.fullName}!` : 'ChiMocCanh Matchday Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý trận đấu, quay số chia đội và theo dõi phong độ cầu thủ hàng tuần.
          </p>
        </div>

        {isAdmin() && (
          <Button
            variant="primary"
            leftIcon="add_circle"
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto"
          >
            Tạo trận đấu mới
          </Button>
        )}
      </div>

      {/* Hero: Next Match Spotlight */}
      {nextMatch && (
        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-2xs">
          <div className="flex flex-col gap-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Trận Đấu Sắp Diễn Ra
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {nextMatch.location || 'Sân cỏ nhân tạo D3 Bình Thạnh'}
              </span>
            </div>

            {/* Match Title & Datetime */}
            <div>
              <h2 className="font-headline font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {nextMatch.title || `Trận bóng ngày ${nextMatch.matchDate}`}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-red-600">
                    calendar_today
                  </span>
                  {formatDateVi(nextMatch.matchDate)}
                </span>
                {nextMatch.matchTime && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                      schedule
                    </span>
                    {formatTimeVi(nextMatch.matchTime)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">groups</span>
                  {nextMatch.participants?.length || 0} cầu thủ đã đăng ký
                </span>
              </div>
            </div>

            {/* Team Jersey Colors Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md py-2.5 px-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full border border-red-300" style={{ backgroundColor: TEAM_A_COLOR }} />
                <span className="text-xs font-bold text-slate-800">{TEAM_A_NAME} (Đỏ)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full border border-blue-300" style={{ backgroundColor: TEAM_B_COLOR }} />
                <span className="text-xs font-bold text-slate-800">{TEAM_B_NAME} (Xanh)</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to={`/matches/${nextMatch.id}`}>
                <Button size="md" variant="primary" rightIcon="arrow_forward">
                  Vào phòng trận đấu
                </Button>
              </Link>
              {user && (
                <Button
                  size="md"
                  variant={hasJoinedNextMatch ? 'danger' : 'surface'}
                  leftIcon={hasJoinedNextMatch ? 'cancel' : 'how_to_reg'}
                  onClick={handleJoinNextMatch}
                >
                  {hasJoinedNextMatch ? 'Hủy điểm danh' : 'Điểm danh tham gia'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bento Stats Metric Strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline font-bold text-lg text-slate-900">Thành Tích Nổi Bật</h3>
          <Link
            to="/leaderboard"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Xem bảng xếp hạng</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>
        <MetricBentoStrip
          topScorer={topScorer}
          topAssister={topAssister}
          topWinner={topWinner}
        />
      </div>

      {/* Recent Matches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-headline font-bold text-lg text-slate-900">Kết Quả Các Trận Gần Đây</h3>
          <Link
            to="/matches"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Tất cả trận đấu</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        {recentMatches.length === 0 ? (
          <Card elevation="level1" className="py-8 text-center text-sm text-slate-400 italic">
            Chưa có trận đấu nào kết thúc
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};
