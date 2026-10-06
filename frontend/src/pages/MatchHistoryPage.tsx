import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { matchService } from '../services/matchService';
import { statsService } from '../services/statsService';
import { Match, PlayerStats, Team } from '../types';
import { Breadcrumbs, Button, Card } from '../ui';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import clsx from 'clsx';
import { BallIcon, AssistIcon, SaveIcon, StarIcon, CrownIcon } from '../components/common/AppIcons';

export const MatchHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStatsList, setPlayerStatsList] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab & Filters
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'WIN' | 'DRAW' | 'LOSS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const matchRes = await matchService.getMatches();
        const all = matchRes.data ?? [];
        setMatches(all);

        if (user?.id) {
          try {
            const statsRes = await statsService.getPlayerStats(user.id);
            if (statsRes.success && statsRes.data) {
              setPlayerStatsList(statsRes.data);
            }
          } catch {
            // Silently fallback if stats endpoint has no records yet
          }
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu lịch sử đấu:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Map user stats by matchId
  const playerStatsMap = useMemo(() => {
    const map: Record<string, PlayerStats> = {};
    playerStatsList.forEach((st) => {
      if (st.matchId) {
        map[st.matchId] = st;
      }
    });
    return map;
  }, [playerStatsList]);

  // All completed matches
  const allCompletedMatches = useMemo(() => {
    return matches
      .filter((m) => m.status === 'COMPLETED' && !m.isDeleted)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
  }, [matches]);

  // Completed matches where user participated
  const myCompletedMatches = useMemo(() => {
    if (!user?.id) return [];
    return allCompletedMatches.filter((m) => {
      const hasParticipant = m.participants?.some((p) => p.user?.id === user.id);
      const hasStats = Boolean(playerStatsMap[m.id]);
      const hasGoalEvent = m.goals?.some((g) => g.scorer?.id === user.id || g.assist?.id === user.id);
      return hasParticipant || hasStats || hasGoalEvent;
    });
  }, [allCompletedMatches, user?.id, playerStatsMap]);

  // Get user outcome for a match
  const getMatchOutcome = (match: Match): {
    outcome: 'WIN' | 'DRAW' | 'LOSS' | 'UNKNOWN';
    teamLabel: string;
    team: Team | null;
  } => {
    if (!user?.id) return { outcome: 'UNKNOWN', teamLabel: '', team: null };

    // Check from stats first
    const st = playerStatsMap[match.id];
    let userTeam: Team | null = st?.team || null;

    if (!userTeam) {
      const p = match.participants?.find((part) => part.user?.id === user.id);
      if (p && p.team && p.team !== 'NONE' && p.team !== 'BENCH') {
        userTeam = p.team;
      }
    }

    if (!userTeam) {
      return { outcome: 'UNKNOWN', teamLabel: '', team: null };
    }

    const { teamALabel, teamBLabel } = getTeamDisplayNames(match);
    const teamLabel = userTeam === 'A' ? teamALabel : teamBLabel;

    if (match.scoreTeamA === match.scoreTeamB) {
      return { outcome: 'DRAW', teamLabel, team: userTeam };
    }

    const aWon = match.scoreTeamA > match.scoreTeamB;
    const isWin = (userTeam === 'A' && aWon) || (userTeam === 'B' && !aWon);

    return {
      outcome: isWin ? 'WIN' : 'LOSS',
      teamLabel,
      team: userTeam,
    };
  };

  // Helper team names
  const getTeamDisplayNames = (match: Match) => {
    let teamALabel = 'Đội A';
    let teamBLabel = 'Đội B';
    if (match.jerseyWinnerTeam === 'SPAIN') {
      teamALabel = 'Tây Ban Nha';
      teamBLabel = 'Pháp';
    } else if (match.jerseyWinnerTeam === 'FRANCE') {
      teamALabel = 'Pháp';
      teamBLabel = 'Tây Ban Nha';
    }
    return { teamALabel, teamBLabel };
  };

  // Career Performance Stats for current user
  const performanceStats = useMemo(() => {
    let totalPlayed = myCompletedMatches.length;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let totalGoals = 0;
    let totalAssists = 0;
    let totalSaves = 0;
    let mvpCount = 0;
    const formList: ('W' | 'D' | 'L')[] = [];

    myCompletedMatches.forEach((m) => {
      const { outcome } = getMatchOutcome(m);
      if (outcome === 'WIN') {
        wins++;
        if (formList.length < 5) formList.push('W');
      } else if (outcome === 'DRAW') {
        draws++;
        if (formList.length < 5) formList.push('D');
      } else if (outcome === 'LOSS') {
        losses++;
        if (formList.length < 5) formList.push('L');
      }

      const st = playerStatsMap[m.id];
      if (st) {
        totalGoals += st.goals || 0;
        totalAssists += st.assists || 0;
        totalSaves += st.saves || 0;
        if (st.isMvp) mvpCount++;
      } else {
        // Fallback from live goals if stat not in cache
        const matchGoals = (m.goals || [])
          .filter((g) => g.scorer?.id === user?.id)
          .reduce((sum, g) => sum + (g.goalCount || 1), 0);
        const matchAssists = (m.goals || []).filter((g) => g.assist?.id === user?.id).length;
        totalGoals += matchGoals;
        totalAssists += matchAssists;
      }
    });

    const winRate = totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

    return {
      totalPlayed,
      wins,
      draws,
      losses,
      winRate,
      totalGoals,
      totalAssists,
      totalSaves,
      mvpCount,
      formList,
    };
  }, [myCompletedMatches, playerStatsMap, user?.id]);

  // Filtered match list
  const displayedMatches = useMemo(() => {
    const sourceList = viewMode === 'my' ? myCompletedMatches : allCompletedMatches;

    return sourceList.filter((m) => {
      // 1. Filter by result (only applicable in "my" view mode)
      if (viewMode === 'my' && resultFilter !== 'ALL') {
        const { outcome } = getMatchOutcome(m);
        if (resultFilter === 'WIN' && outcome !== 'WIN') return false;
        if (resultFilter === 'DRAW' && outcome !== 'DRAW') return false;
        if (resultFilter === 'LOSS' && outcome !== 'LOSS') return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = m.title?.toLowerCase().includes(q);
        const locationMatch = m.location?.toLowerCase().includes(q);
        const dateMatch = m.matchDate?.includes(q);
        return titleMatch || locationMatch || dateMatch;
      }

      return true;
    });
  }, [viewMode, resultFilter, searchQuery, myCompletedMatches, allCompletedMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải lịch sử thi đấu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto font-sans">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        links={[
          { label: 'Trang chủ', to: '/', icon: 'home' },
          { label: 'Lịch & Trận đấu', to: '/matches', icon: 'calendar_month' },
          { label: 'Lịch sử đấu' },
        ]}
      />

      {/* 2. Page Header Card */}
      <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">history</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Lịch Sử Thi Đấu
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tổng hợp thành tích thi đấu, tỉ số và phong độ cá nhân của bạn cùng câu lạc bộ Chim Mọc Cánh.
            </p>
          </div>

          <Link to="/matches">
            <Button variant="secondary" size="sm" leftIcon="calendar_month">
              Xem Lịch Sắp Tới
            </Button>
          </Link>
        </div>

        {/* 3. Performance Bento Overview (when user has played at least 1 match) */}
        {user && myCompletedMatches.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80">
            {/* Matches Played */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                Trận đã đấu
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                {performanceStats.totalPlayed}
              </span>
            </div>

            {/* Win Rate */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                Tỷ lệ thắng
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {performanceStats.winRate}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({performanceStats.wins}T-{performanceStats.draws}H-{performanceStats.losses}B)
                </span>
              </div>
            </div>

            {/* Goals Scored */}
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 block mb-0.5">
                Bàn thắng ghi
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  {performanceStats.totalGoals}
                </span>
                <BallIcon size={14} className="text-rose-500" />
              </div>
            </div>

            {/* Assists */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block mb-0.5">
                Pha kiến tạo
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {performanceStats.totalAssists}
                </span>
                <AssistIcon size={14} className="text-blue-500" />
              </div>
            </div>

            {/* MVP Awards */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block mb-0.5">
                Ngôi sao MVP
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {performanceStats.mvpCount}
                </span>
                <StarIcon size={14} className="text-amber-500 fill-amber-500" fill />
              </div>
            </div>

            {/* Recent Form */}
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block mb-1">
                Phong độ 5 trận
              </span>
              <div className="flex items-center gap-1">
                {performanceStats.formList.length === 0 ? (
                  <span className="text-xs text-slate-400">—</span>
                ) : (
                  performanceStats.formList.map((f, idx) => (
                    <span
                      key={idx}
                      className={clsx(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs',
                        f === 'W' && 'bg-emerald-500',
                        f === 'D' && 'bg-amber-500',
                        f === 'L' && 'bg-rose-500'
                      )}
                      title={f === 'W' ? 'Thắng' : f === 'D' ? 'Hòa' : 'Thua'}
                    >
                      {f}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Controls: View Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Main Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 w-fit">
          <button
            type="button"
            onClick={() => {
              setViewMode('my');
              setResultFilter('ALL');
            }}
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              viewMode === 'my'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <span className="material-symbols-outlined text-sm">person</span>
            Trận Của Tôi ({myCompletedMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              viewMode === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            Toàn Bộ Lịch Sử CLB ({allCompletedMatches.length})
          </button>
        </div>

        {/* Outcome filters (for 'my' mode) */}
        {viewMode === 'my' && myCompletedMatches.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setResultFilter('ALL')}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer',
                resultFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setResultFilter('WIN')}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1',
                resultFilter === 'WIN'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              )}
            >
              Thắng ({performanceStats.wins})
            </button>
            <button
              type="button"
              onClick={() => setResultFilter('DRAW')}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1',
                resultFilter === 'DRAW'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              )}
            >
              Hòa ({performanceStats.draws})
            </button>
            <button
              type="button"
              onClick={() => setResultFilter('LOSS')}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1',
                resultFilter === 'LOSS'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              )}
            >
              Thua ({performanceStats.losses})
            </button>
          </div>
        )}

        {/* Search Box */}
        <div className="relative w-full sm:w-56">
          <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc sân..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 5. Match List Cards */}
      {displayedMatches.length === 0 ? (
        <Card elevation="level1" className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">sports_soccer</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            {viewMode === 'my'
              ? 'Bạn Chưa Có Trận Đấu Nào Được Ghi Nhận'
              : 'Chưa Có Trận Đấu Nào Hoàn Thành Trong CLB'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            {viewMode === 'my'
              ? 'Khi bạn tham gia vào các trận đấu và trận đấu kết thúc, toàn bộ kết quả và số liệu cá nhân của bạn sẽ tự động lưu vào đây.'
              : 'Các trận đấu sau khi quản trị viên chốt kết thúc sẽ hiển thị đầy đủ trong kho lịch sử của câu lạc bộ.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {viewMode === 'my' && allCompletedMatches.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon="shield"
                onClick={() => setViewMode('all')}
              >
                Xem Lịch Sử CLB ({allCompletedMatches.length} trận)
              </Button>
            )}
            <Link to="/matches">
              <Button variant="primary" size="sm" leftIcon="how_to_reg">
                Xem Trận Đang Mở Điểm Danh
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {displayedMatches.map((match) => {
            const { outcome, teamLabel } = getMatchOutcome(match);
            const { teamALabel, teamBLabel } = getTeamDisplayNames(match);
            const userStat = playerStatsMap[match.id];
            const participant = match.participants?.find((p) => p.user?.id === user?.id);

            // Compute goals & assists if userStat doesn't exist
            const userGoals =
              userStat?.goals ??
              (match.goals || [])
                .filter((g) => g.scorer?.id === user?.id)
                .reduce((sum, g) => sum + (g.goalCount || 1), 0);
            const userAssists =
              userStat?.assists ??
              (match.goals || []).filter((g) => g.assist?.id === user?.id).length;
            const userSaves = userStat?.saves ?? 0;
            const isMvp = userStat?.isMvp ?? false;

            return (
              <div
                key={match.id}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-md transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Date Block & Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-base font-black leading-none tabular-nums">
                        {new Date(match.matchDate).getDate()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                        T{new Date(match.matchDate).getMonth() + 1}
                      </span>
                    </div>

                    {/* Match Title & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          to={`/matches/${match.id}`}
                          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate"
                        >
                          {match.title || `Trận bóng ngày ${formatDateVi(match.matchDate)}`}
                        </Link>

                        {/* Outcome badge if in 'my' mode or user played */}
                        {outcome !== 'UNKNOWN' && (
                          <span
                            className={clsx(
                              'px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs inline-flex items-center gap-1',
                              outcome === 'WIN' &&
                                'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-800/60',
                              outcome === 'DRAW' &&
                                'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/60 dark:border-amber-800/60',
                              outcome === 'LOSS' &&
                                'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300/60 dark:border-rose-800/60'
                            )}
                          >
                            <span
                              className={clsx(
                                'w-1.5 h-1.5 rounded-full',
                                outcome === 'WIN' && 'bg-emerald-500',
                                outcome === 'DRAW' && 'bg-amber-500',
                                outcome === 'LOSS' && 'bg-rose-500'
                              )}
                            />
                            {outcome === 'WIN' ? 'Thắng' : outcome === 'DRAW' ? 'Hòa' : 'Thua'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {match.matchTime ? formatTimeVi(match.matchTime) : '19:00'}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {match.location || 'Sân cố định'}
                        </span>
                        {match.participants && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">groups</span>
                            {match.participants.length} cầu thủ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center: Score Display */}
                  <div className="flex items-center justify-between sm:justify-center gap-4 py-2 sm:py-0 border-y sm:border-y-0 border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 text-right min-w-[90px] sm:min-w-[110px] justify-end">
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 truncate">
                        {teamALabel}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-base sm:text-lg tabular-nums text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                      {match.scoreTeamA} - {match.scoreTeamB}
                    </div>

                    <div className="flex items-center gap-2 text-left min-w-[90px] sm:min-w-[110px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                        {teamBLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 justify-end shrink-0">
                    <Link to={`/matches/${match.id}`}>
                      <Button variant="secondary" size="sm" rightIcon="arrow_forward">
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Bottom: User's Personal Match Contribution Highlights */}
                {participant && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap text-slate-500 dark:text-slate-400">
                      <span className="font-medium">
                        Bạn thi đấu cho:{' '}
                        <strong
                          className={clsx(
                            participant.team === 'A' && 'text-rose-600 dark:text-rose-400',
                            participant.team === 'B' && 'text-blue-600 dark:text-blue-400',
                            !participant.team && 'text-slate-600'
                          )}
                        >
                          {teamLabel || (participant.team === 'A' ? teamALabel : teamBLabel)}
                        </strong>
                      </span>
                      {participant.isHost && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                          Đội trưởng (C)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {userGoals > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/60 dark:border-rose-800/60">
                          <BallIcon size={13} className="text-rose-500" />
                          <span>{userGoals} bàn</span>
                        </span>
                      )}
                      {userAssists > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800/60">
                          <AssistIcon size={13} className="text-blue-500" />
                          <span>{userAssists} kiến tạo</span>
                        </span>
                      )}
                      {userSaves > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                          <SaveIcon size={13} className="text-emerald-500" />
                          <span>{userSaves} cứu thua</span>
                        </span>
                      )}
                      {isMvp && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black border border-amber-500/30">
                          <CrownIcon size={13} className="text-amber-500" />
                          <span>MVP Trận đấu</span>
                        </span>
                      )}
                      {userGoals === 0 && userAssists === 0 && userSaves === 0 && !isMvp && (
                        <span className="text-slate-400 text-[11px]">Đã tham gia trọn vẹn trận đấu</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
