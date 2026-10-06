import React, { useState, useMemo } from 'react';
import { Match, MatchParticipant } from '../../types';
import { Avatar, Button, Card } from '../../ui';
import clsx from 'clsx';
import { BallIcon, AssistIcon, SaveIcon, StarIcon, CrownIcon } from '../common/AppIcons';

export interface PlayerStatValues {
  goals: number;
  assists: number;
  saves: number;
  isMvp: boolean;
  rating?: number | null;
}

interface PostMatchStatsTabProps {
  match: Match;
  participants: MatchParticipant[];
  teamALabel: string;
  teamBLabel: string;
  adminActive: boolean;
  isStatsEligible: boolean;
  playerStatsInputs: Record<string, PlayerStatValues>;
  setPlayerStatsInputs: React.Dispatch<
    React.SetStateAction<Record<string, PlayerStatValues>>
  >;
  savingStats: boolean;
  onSaveStats: () => Promise<void>;
  onEndMatch: () => void;
}

export const PostMatchStatsTab: React.FC<PostMatchStatsTabProps> = ({
  match,
  participants,
  teamALabel,
  teamBLabel,
  adminActive,
  isStatsEligible,
  playerStatsInputs,
  setPlayerStatsInputs,
  savingStats,
  onSaveStats,
  onEndMatch,
}) => {
  const [teamFilter, setTeamFilter] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Stepper Increment / Decrement
  const handleDelta = (userId: string, field: 'goals' | 'assists' | 'saves', delta: number) => {
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      const nextVal = Math.max(0, (current[field] || 0) + delta);
      return {
        ...prev,
        [userId]: {
          ...current,
          [field]: nextVal,
        },
      };
    });
  };

  // Handle Direct Numeric Input
  const handleDirectChange = (userId: string, field: 'goals' | 'assists' | 'saves', val: number) => {
    const safeVal = Math.max(0, isNaN(val) ? 0 : val);
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      return {
        ...prev,
        [userId]: {
          ...current,
          [field]: safeVal,
        },
      };
    });
  };

  // Handle Rating Step (+/- 0.5)
  const handleRatingDelta = (userId: string, delta: number) => {
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      const base = current.rating != null ? current.rating : 7.0;
      let next = Math.round((base + delta) * 10) / 10;
      next = Math.max(0, Math.min(10, next));
      return {
        ...prev,
        [userId]: {
          ...current,
          rating: next,
        },
      };
    });
  };

  // Handle Rating Direct Input (Allows values like 7.8, 9.9, etc.)
  const handleRatingDirectChange = (userId: string, valStr: string) => {
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      if (!valStr || valStr.trim() === '') {
        return {
          ...prev,
          [userId]: {
            ...current,
            rating: null,
          },
        };
      }
      const num = parseFloat(valStr);
      if (isNaN(num)) return prev;
      const clamped = Math.max(0, Math.min(10, Math.round(num * 10) / 10));
      return {
        ...prev,
        [userId]: {
          ...current,
          rating: clamped,
        },
      };
    });
  };

  // Clear Rating back to unrated (null)
  const handleClearRating = (userId: string) => {
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      return {
        ...prev,
        [userId]: {
          ...current,
          rating: null,
        },
      };
    });
  };

  // Handle MVP Toggle (Single MVP constraint)
  const handleToggleMvp = (userId: string) => {
    setPlayerStatsInputs((prev) => {
      const current = prev[userId] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
      const nextIsMvp = !current.isMvp;
      const updated: Record<string, PlayerStatValues> = {};

      Object.entries(prev).forEach(([id, st]) => {
        updated[id] = {
          ...st,
          isMvp: nextIsMvp && id === userId,
        };
      });

      if (!updated[userId]) {
        updated[userId] = { ...current, isMvp: nextIsMvp };
      }

      return updated;
    });
  };

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (!p.user) return false;
      if (teamFilter === 'A' && p.team !== 'A') return false;
      if (teamFilter === 'B' && p.team !== 'B') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = p.user.fullName?.toLowerCase() || '';
        const jersey = String(p.jerseyNumber ?? p.user.jerseyNumber ?? '');
        return name.includes(q) || jersey.includes(q);
      }
      return true;
    });
  }, [participants, teamFilter, searchQuery]);

  interface Highlights {
    topScorer: { p: MatchParticipant; goals: number } | null;
    topAssister: { p: MatchParticipant; assists: number } | null;
    topGoalkeeper: { p: MatchParticipant; saves: number } | null;
    topRatedPlayer: { p: MatchParticipant; rating: number } | null;
    mvpPlayer: MatchParticipant | null;
    totalGoalsA: number;
    totalGoalsB: number;
  }

  // Aggregate highlights & team totals
  const { topScorer, topAssister, topGoalkeeper, topRatedPlayer, mvpPlayer, totalGoalsA, totalGoalsB } = useMemo<Highlights>(() => {
    let bestScorer: { p: MatchParticipant; goals: number } | null = null;
    let bestAssister: { p: MatchParticipant; assists: number } | null = null;
    let bestKeeper: { p: MatchParticipant; saves: number } | null = null;
    let bestRated: { p: MatchParticipant; rating: number } | null = null;
    let currentMvp: MatchParticipant | null = null;
    let sumA = 0;
    let sumB = 0;

    participants.forEach((p) => {
      if (!p.user) return;
      const st = playerStatsInputs[p.user.id] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };

      if (p.team === 'A') sumA += st.goals;
      if (p.team === 'B') sumB += st.goals;

      if (st.isMvp) currentMvp = p;
      if (st.goals > 0 && (!bestScorer || st.goals > bestScorer.goals)) {
        bestScorer = { p, goals: st.goals };
      }
      if (st.assists > 0 && (!bestAssister || st.assists > bestAssister.assists)) {
        bestAssister = { p, assists: st.assists };
      }
      if (st.saves > 0 && (!bestKeeper || st.saves > bestKeeper.saves)) {
        bestKeeper = { p, saves: st.saves };
      }
      if (st.rating != null && (!bestRated || st.rating > bestRated.rating)) {
        bestRated = { p, rating: st.rating };
      }
    });

    return {
      topScorer: bestScorer,
      topAssister: bestAssister,
      topGoalkeeper: bestKeeper,
      topRatedPlayer: bestRated,
      mvpPlayer: currentMvp,
      totalGoalsA: sumA,
      totalGoalsB: sumB,
    };
  }, [participants, playerStatsInputs]);

  const hasLiveGoals = Boolean(match.goals && match.goals.length > 0);

  if (!isStatsEligible) {
    return (
      <Card elevation="level1" className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <span className="material-symbols-outlined text-2xl">lock_clock</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Bảng Thống Kê Sau Trận Đang Tạm Khóa
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Bảng thống kê sẽ tự động mở sau 2 tiếng thi đấu, hoặc khi Quản trị viên chính thức bấm <strong>"Kết thúc trận đấu"</strong>.
        </p>
        {adminActive && (
          <Button
            variant="primary"
            size="md"
            leftIcon="sports_score"
            onClick={onEndMatch}
            className="mx-auto"
          >
            Kết thúc trận đấu & Mở thống kê ngay
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 font-sans">
      {/* 1. Header & Actions Card */}
      <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Thống Kê Sau Trận Đấu
              </h2>
              {hasLiveGoals ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đồng bộ tự động từ Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  Tổng kết trận đấu
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ghi nhận số bàn thắng, kiến tạo, số pha cứu thua và bình chọn Cầu thủ xuất sắc nhất (MVP).
            </p>
          </div>

          {adminActive && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="md"
                leftIcon="save"
                isLoading={savingStats}
                onClick={onSaveStats}
                className="shadow-sm"
              >
                Lưu thống kê & BXH
              </Button>
            </div>
          )}
        </div>

        {/* 2. Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
          {/* MVP Card */}
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl fill">star</span>
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide block">
                Cầu thủ xuất sắc (MVP)
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {mvpPlayer?.user?.fullName || 'Chưa chọn'}
              </p>
            </div>
          </div>

          {/* Top Rated Card */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <StarIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide block">
                Điểm cao nhất trận
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {topRatedPlayer ? `${topRatedPlayer.p.user?.fullName} (${topRatedPlayer.rating.toFixed(1)}đ)` : 'Chưa chấm'}
              </p>
            </div>
          </div>

          {/* Top Scorer Card */}
          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <BallIcon size={18} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide block">
                Vua phá lưới trận
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {topScorer ? `${topScorer.p.user?.fullName} (${topScorer.goals} bàn)` : 'Chưa có bàn'}
              </p>
            </div>
          </div>

          {/* Top Assister Card */}
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <AssistIcon size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide block">
                Chuyền kiến tạo
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {topAssister ? `${topAssister.p.user?.fullName} (${topAssister.assists})` : 'Chưa có'}
              </p>
            </div>
          </div>

          {/* Top Goalkeeper Card */}
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <SaveIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide block">
                Cứu thua xuất sắc
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {topGoalkeeper ? `${topGoalkeeper.p.user?.fullName} (${topGoalkeeper.saves})` : 'Chưa có'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Team Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 w-fit">
            <button
              type="button"
              onClick={() => setTeamFilter('ALL')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                teamFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              Tất cả ({participants.length})
            </button>
            <button
              type="button"
              onClick={() => setTeamFilter('A')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                teamFilter === 'A'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              {teamALabel} • {totalGoalsA} bàn
            </button>
            <button
              type="button"
              onClick={() => setTeamFilter('B')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                teamFilter === 'B'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              {teamBLabel} • {totalGoalsB} bàn
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc số áo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </Card>

      {/* 4. Main Stats Table */}
      <Card elevation="level1" className="p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Cầu thủ</th>
                <th className="py-3 px-3">Đội bóng</th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <BallIcon size={14} className="text-rose-500" />
                    <span>Bàn thắng</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <AssistIcon size={14} className="text-blue-500" />
                    <span>Kiến tạo</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <SaveIcon size={14} className="text-emerald-500" />
                    <span>Cứu thua</span>
                  </span>
                </th>
                <th className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <StarIcon size={14} className="text-amber-500" />
                    <span>Điểm số (0 - 10)</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    <CrownIcon size={14} className="text-amber-500" />
                    <span>MVP Trận</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    Không tìm thấy cầu thủ nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => {
                  const currentInput = playerStatsInputs[p.user.id] || {
                    goals: 0,
                    assists: 0,
                    saves: 0,
                    isMvp: false,
                    rating: null,
                  };

                  return (
                    <tr
                      key={p.id}
                      className={clsx(
                        'hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors',
                        currentInput.isMvp && 'bg-amber-50/20 dark:bg-amber-950/10'
                      )}
                    >
                      {/* Cầu thủ */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={p.user?.fullName}
                            src={p.user?.avatarUrl}
                            jerseyNumber={p.jerseyNumber ?? p.user?.jerseyNumber}
                            size="sm"
                            showNumber
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                {p.user?.fullName}
                              </span>
                              {p.isHost && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                                  C
                                </span>
                              )}
                              {p.user?.role === 'GUEST' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-medium border border-purple-500/30">
                                  Khách
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                              @{p.user?.username || 'user'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Đội */}
                      <td className="py-3 px-3">
                        {p.team === 'A' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {teamALabel}
                          </span>
                        ) : p.team === 'B' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {teamBLabel}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Dự bị</span>
                        )}
                      </td>

                      {/* Bàn thắng */}
                      <td className="py-3 px-3 text-center">
                        {adminActive ? (
                          <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/70 p-0.5 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'goals', -1)}
                              disabled={currentInput.goals <= 0}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentInput.goals}
                              onChange={(e) => handleDirectChange(p.user.id, 'goals', Number(e.target.value))}
                              className="w-8 text-center bg-transparent text-sm font-bold tabular-nums text-rose-600 dark:text-rose-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'goals', 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={clsx(
                              'text-sm font-bold tabular-nums',
                              currentInput.goals > 0
                                ? 'text-rose-600 dark:text-rose-400 inline-flex items-center gap-1'
                                : 'text-slate-300 dark:text-slate-600'
                            )}
                          >
                            {currentInput.goals > 0 ? (
                              <>
                                <BallIcon size={14} className="text-rose-500" />
                                <span>{currentInput.goals}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </span>
                        )}
                      </td>

                      {/* Kiến tạo */}
                      <td className="py-3 px-3 text-center">
                        {adminActive ? (
                          <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/70 p-0.5 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'assists', -1)}
                              disabled={currentInput.assists <= 0}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentInput.assists}
                              onChange={(e) => handleDirectChange(p.user.id, 'assists', Number(e.target.value))}
                              className="w-8 text-center bg-transparent text-sm font-bold tabular-nums text-blue-600 dark:text-blue-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'assists', 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={clsx(
                              'text-sm font-bold tabular-nums',
                              currentInput.assists > 0
                                ? 'text-blue-600 dark:text-blue-400 inline-flex items-center gap-1'
                                : 'text-slate-300 dark:text-slate-600'
                            )}
                          >
                            {currentInput.assists > 0 ? (
                              <>
                                <AssistIcon size={14} className="text-blue-500" />
                                <span>{currentInput.assists}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </span>
                        )}
                      </td>

                      {/* Cứu thua */}
                      <td className="py-3 px-3 text-center">
                        {adminActive ? (
                          <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/70 p-0.5 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'saves', -1)}
                              disabled={currentInput.saves <= 0}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentInput.saves}
                              onChange={(e) => handleDirectChange(p.user.id, 'saves', Number(e.target.value))}
                              className="w-8 text-center bg-transparent text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleDelta(p.user.id, 'saves', 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={clsx(
                              'text-sm font-bold tabular-nums',
                              currentInput.saves > 0
                                ? 'text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1'
                                : 'text-slate-300 dark:text-slate-600'
                            )}
                          >
                            {currentInput.saves > 0 ? (
                              <>
                                <SaveIcon size={14} className="text-emerald-500" />
                                <span>{currentInput.saves}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </span>
                        )}
                      </td>

                      {/* Điểm đánh giá (0 - 10) */}
                      <td className="py-3 px-3 text-center">
                        {adminActive ? (
                          <div className="inline-flex items-center justify-center gap-1">
                            <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/70 p-0.5 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleRatingDelta(p.user.id, -0.5)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                                title="Giảm 0.5 điểm"
                              >
                                <span className="material-symbols-outlined text-sm font-bold">remove</span>
                              </button>
                              <input
                                type="number"
                                step="0.1"
                                min={0}
                                max={10}
                                placeholder="—"
                                value={currentInput.rating != null ? currentInput.rating : ''}
                                onChange={(e) => handleRatingDirectChange(p.user.id, e.target.value)}
                                className={clsx(
                                  'w-11 text-center bg-transparent text-sm font-black tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                                  currentInput.rating == null
                                    ? 'text-slate-400 dark:text-slate-500'
                                    : currentInput.rating >= 8.5
                                    ? 'text-amber-500 dark:text-amber-400'
                                    : currentInput.rating >= 7.0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : currentInput.rating >= 5.0
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => handleRatingDelta(p.user.id, 0.5)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                                title="Tăng 0.5 điểm"
                              >
                                <span className="material-symbols-outlined text-sm font-bold">add</span>
                              </button>
                            </div>
                            {currentInput.rating != null && (
                              <button
                                type="button"
                                onClick={() => handleClearRating(p.user.id)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Xóa điểm đánh giá"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tabular-nums',
                              currentInput.rating == null
                                ? 'text-slate-400 dark:text-slate-500 font-medium'
                                : currentInput.rating >= 8.5
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60'
                                : currentInput.rating >= 7.0
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60'
                                : currentInput.rating >= 5.0
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60'
                            )}
                          >
                            {currentInput.rating != null ? (
                              <>
                                <StarIcon size={12} className="text-amber-500 fill-amber-500" fill />
                                <span>{currentInput.rating.toFixed(1)}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </span>
                        )}
                      </td>

                      {/* MVP */}
                      <td className="py-3 px-4 text-center">
                        {adminActive ? (
                          <button
                            type="button"
                            onClick={() => handleToggleMvp(p.user.id)}
                            className={clsx(
                              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer',
                              currentInput.isMvp
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-300 dark:ring-amber-400/50'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400'
                            )}
                          >
                            <span className={clsx('material-symbols-outlined text-sm', currentInput.isMvp && 'fill')}>
                              star
                            </span>
                            <span>{currentInput.isMvp ? 'MVP Trận' : 'Chọn MVP'}</span>
                          </button>
                        ) : currentInput.isMvp ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black shadow-xs">
                            <span className="material-symbols-outlined text-sm fill">star</span>
                            MVP
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-sm font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer save button for admin */}
        {adminActive && filteredParticipants.length > 5 && (
          <div className="p-4 bg-slate-50/70 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Đang hiển thị {filteredParticipants.length} cầu thủ
            </span>
            <Button
              variant="primary"
              size="sm"
              leftIcon="save"
              isLoading={savingStats}
              onClick={onSaveStats}
            >
              Lưu thống kê & BXH
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
