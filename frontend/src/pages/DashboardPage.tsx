import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, LeaderboardItem } from '../types';
import { matchService } from '../services/matchService';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';
import { Button, Card, Badge, Avatar } from '../ui';
import { MatchCard } from '../components/match/MatchCard';
import { MetricBentoStrip } from '../components/leaderboard/MetricBentoStrip';
import { CreateMatchModal } from '../components/match/CreateMatchModal';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../utils/constants';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchCategory, setMatchCategory] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const { user, isAdmin } = useAuthStore();

  const fetchData = async () => {
    try {
      const [matchesRes, lbRes] = await Promise.all([
        matchService.getMatches(),
        leaderboardService.getLeaderboard('goals'),
      ]);

      if (matchesRes.success) setMatches(matchesRes.data || []);
      if (lbRes.success) setLeaderboard(lbRes.data || []);
    } catch {
      toast.error('Không thể tải dữ liệu trang chủ');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter categorized matches
  const liveMatches = matches.filter((m) => m.status === 'IN_PROGRESS');
  const upcomingMatches = matches.filter(
    (m) =>
      (m.status === 'PENDING' ||
        m.status === 'JERSEY_SELECTION' ||
        m.status === 'PLAYER_PICKING' ||
        m.status === 'TRADE_WINDOW') &&
      m.matchDate >= todayStr
  );
  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

  // Next primary upcoming match (focus on live or nearest future match)
  const nextMatch = liveMatches[0] || upcomingMatches[0];

  // User's personal stats in the leaderboard
  const myStats = leaderboard.find((item) => item.user.id === user?.id);

  // Admin calculations
  const totalLeagueGoals = matches
    .filter((m) => m.status === 'COMPLETED')
    .reduce((acc, m) => acc + (m.scoreTeamA || 0) + (m.scoreTeamB || 0), 0);
  const totalCompletedMatches = completedMatches.length;
  const avgGoalsPerMatch =
    totalCompletedMatches > 0
      ? (totalLeagueGoals / totalCompletedMatches).toFixed(2)
      : '0.00';

  // Top metric items
  const topScorer = leaderboard[0];
  const topAssister = [...leaderboard].sort((a, b) => b.totalAssists - a.totalAssists)[0];
  const topWinner = [...leaderboard].sort((a, b) => b.totalWins - a.totalWins)[0];

  const hasJoinedNextMatch = nextMatch?.participants?.some((p) => p.user.id === user?.id);
  const isNextMatchPast =
    nextMatch &&
    (nextMatch.matchDate < todayStr ||
      (nextMatch.matchTime &&
        new Date(`${nextMatch.matchDate}T${nextMatch.matchTime}`).getTime() < Date.now()));

  const handleJoinNextMatch = async () => {
    if (!nextMatch || !user) return;
    if (nextMatch.status !== 'PENDING' || isNextMatchPast) {
      toast.error('Trận đấu đã bắt đầu hoặc đã qua thời gian điểm danh');
      return;
    }
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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Top Welcome Row Bento Glass */}
      <Card elevation="glass" glow className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                Sân 7v7 - Saigon League
              </Badge>
              <span className="text-xs text-slate-500 font-space font-medium">Matchday Hub</span>
            </div>
            <h1 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-2 tracking-tight">
              {user ? `Xin chào, ${user.fullName}!` : 'ChimMocCanh Matchday Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Quản lý trận đấu, chia đội, chuyển nhượng và theo dõi phong độ cầu thủ hàng tuần.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <Link to="/match-history">
                <Button variant="secondary" size="md" leftIcon="history">
                  Lịch sử đấu
                </Button>
              </Link>
            )}
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
        </div>
      </Card>

      {/* USER: Personal Performance Bento Card - High Contrast Clean Light/Dark Theme */}
      {user && (
        <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.fullName} jerseyNumber={user.jerseyNumber} size="md" showNumber />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-space font-black text-base text-slate-950 dark:text-white">
                      Thành Tích Cá Nhân: {user.fullName}
                    </h3>
                    <Badge variant="gold" size="sm">
                      Số áo: #{user.jerseyNumber || '-'}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-space">
                    {myStats ? `Hạng #${myStats.rank} trên Bảng xếp hạng` : 'Chưa có dữ liệu thi đấu'}
                  </span>
                </div>
              </div>
              <Link to="/match-history">
                <Button size="sm" variant="secondary" rightIcon="arrow_forward">
                  Xem chi tiết lịch sử đấu
                </Button>
              </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Bàn Thắng</span>
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                  {myStats?.totalGoals || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Kiến Tạo</span>
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                  {myStats?.totalAssists || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Cứu Thua</span>
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                  {myStats?.totalSaves || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Số Lần MVP</span>
                <span className="font-space font-black text-2xl text-amber-600 dark:text-amber-400 mt-1">
                  {myStats?.totalMvp || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Tỉ Lệ Thắng</span>
                <span className="font-space font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
                  {myStats?.winRate ? `${myStats.winRate}%` : '0%'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Trận (T-H-B)</span>
                <span className="font-space font-black text-lg text-slate-950 dark:text-white mt-1">
                  {myStats?.totalWins || 0}W - {myStats?.totalDraws || 0}D - {myStats?.totalLosses || 0}L
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ADMIN: League Stats Widget */}
      {isAdmin() && (
        <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-xl">admin_panel_settings</span>
              <h3 className="font-space font-extrabold text-base text-slate-950 dark:text-white">
                Thống Kê Quản Trị Hệ Thống
              </h3>
            </div>
            <Badge variant="primary" size="sm">
              Admin Overview
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Tổng Bàn Thắng Giải</span>
              <span className="block font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                {totalLeagueGoals}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Hiệu Suất Bàn / Trận</span>
              <span className="block font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                {avgGoalsPerMatch}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Tổng Trận Đã Đấu</span>
              <span className="block font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                {totalCompletedMatches}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">Tổng Cầu Thủ Đăng Ký</span>
              <span className="block font-space font-black text-2xl text-slate-950 dark:text-white mt-1">
                {leaderboard.length}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Hero: Next Match Spotlight */}
      {nextMatch && (
        <Card elevation="level1" className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col gap-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant={nextMatch.status === 'IN_PROGRESS' ? 'live' : 'primary'} size="md" dot>
                {nextMatch.status === 'IN_PROGRESS' ? 'Đang Diễn Ra (Live)' : 'Trận Đấu Sắp Tới'}
              </Badge>
              <span className="text-xs text-slate-500 font-space font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {nextMatch.location || 'Sân cố định'}
              </span>
            </div>

            {/* Match Title & Datetime */}
            <div>
              <h2 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                {nextMatch.title || `Trận bóng ngày ${nextMatch.matchDate}`}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2.5 font-space font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-rose-600">
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
                  <strong className="text-slate-900 dark:text-white">
                    {nextMatch.participants?.length || 0}
                  </strong>{' '}
                  cầu thủ đã tham gia
                </span>
              </div>
            </div>

            {/* Team Jersey Colors Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-rose-400/40 shadow-xs"
                  style={{ backgroundColor: TEAM_A_COLOR }}
                />
                <span className="text-xs font-space font-bold text-slate-800 dark:text-slate-200">
                  {TEAM_A_NAME} (Đỏ)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-blue-400/40 shadow-xs"
                  style={{ backgroundColor: TEAM_B_COLOR }}
                />
                <span className="text-xs font-space font-bold text-slate-800 dark:text-slate-200">
                  {TEAM_B_NAME} (Xanh)
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to={`/matches/${nextMatch.id}`}>
                <Button size="md" variant="primary" rightIcon="arrow_forward">
                  Vào phòng trận đấu
                </Button>
              </Link>
              {user && nextMatch.status === 'PENDING' && (
                <Button
                  size="md"
                  variant={hasJoinedNextMatch ? 'danger' : 'secondary'}
                  leftIcon={hasJoinedNextMatch ? 'cancel' : 'how_to_reg'}
                  onClick={handleJoinNextMatch}
                >
                  {hasJoinedNextMatch ? 'Hủy điểm danh' : 'Điểm danh tham gia'}
                </Button>
              )}
              {user && nextMatch.status !== 'PENDING' && (
                <span className="text-xs font-space text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Đã đóng điểm danh
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Match Cards Showcase by Category */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
          <div>
            <h3 className="font-space font-extrabold text-lg text-slate-900 dark:text-white">
              Danh Sách Các Trận Đấu
            </h3>
            <p className="text-xs text-slate-500 font-space">
              Phân loại: Đang thi đấu, Sắp diễn ra, Đã kết thúc
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setMatchCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                matchCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Tất cả ({matches.length})
            </button>
            <button
              onClick={() => setMatchCategory('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                matchCategory === 'live'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Đang thi đấu ({liveMatches.length})
            </button>
            <button
              onClick={() => setMatchCategory('upcoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                matchCategory === 'upcoming'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Sắp diễn ra ({upcomingMatches.length})
            </button>
            <button
              onClick={() => setMatchCategory('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                matchCategory === 'completed'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Đã kết thúc ({completedMatches.length})
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <Card elevation="level1" className="py-12 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            Chưa có trận đấu nào được tạo
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {(matchCategory === 'all'
              ? matches
              : matchCategory === 'live'
              ? liveMatches
              : matchCategory === 'upcoming'
              ? upcomingMatches
              : completedMatches
            ).map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>

      {/* Bento Stats Metric Strip */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-space font-extrabold text-lg text-slate-900 dark:text-white">
            Bảng Thành Tích Cá Nhân Nổi Bật
          </h3>
          <Link
            to="/leaderboard"
            className="text-xs font-space font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Xem đầy đủ BXH</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>
        <MetricBentoStrip
          topScorer={topScorer}
          topAssister={topAssister}
          topWinner={topWinner}
        />
      </div>

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};
