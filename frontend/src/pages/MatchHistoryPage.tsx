import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { matchService } from '../services/matchService';
import { JERSEY_TEAM_LABEL } from '../types';
import type { Match } from '../types';
import clsx from 'clsx';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getResultBadge = (match: Match, userId?: string) => {
  if (match.status !== 'COMPLETED') return null;

  const participant = match.participants?.find((p) => p.user.id === userId);
  if (!participant) return null;

  const teamA = participant.team === 'A';
  const aWon = match.scoreTeamA > match.scoreTeamB;
  const bWon = match.scoreTeamB > match.scoreTeamA;
  const drew = match.scoreTeamA === match.scoreTeamB;

  if (drew) {
    return { label: 'Hòa', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
  }
  if ((teamA && aWon) || (!teamA && bWon)) {
    return { label: 'Thắng', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
  }
  return { label: 'Thua', className: 'bg-red-500/20 text-red-400 border border-red-500/30' };
};

// ─── Component ───────────────────────────────────────────────────────────────

export const MatchHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await matchService.getMatches();
        const all = response.data ?? [];
        // Filter only completed matches where this user participated
        const myHistory = all
          .filter(
            (m) =>
              m.status === 'COMPLETED' &&
              m.participants?.some((p) => p.user.id === user?.id)
          )
          .sort(
            (a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
          );
        setMatches(myHistory);
      } catch (err) {
        console.error('Lỗi tải lịch sử đấu:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-emerald-500 text-2xl">history</span>
          <h1 className="text-2xl font-bold font-space text-slate-900 dark:text-white">
            Lịch sử đấu
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm ml-9">
          Tất cả các trận đấu bạn đã tham gia
        </p>
      </div>

      {/* Match List */}
      {matches.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-3 block">sports_soccer</span>
          <p className="font-space">Bạn chưa có trận đấu nào được ghi nhận.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const participant = match.participants?.find((p) => p.user.id === user?.id);
            const result = getResultBadge(match, user?.id);
            const teamLabel =
              participant?.team === 'A'
                ? match.jerseyWinnerTeam === 'SPAIN'
                  ? 'Tây Ban Nha'
                  : match.jerseyWinnerTeam === 'FRANCE'
                  ? 'Pháp'
                  : 'Đội A'
                : participant?.team === 'B'
                ? match.jerseyWinnerTeam === 'SPAIN'
                  ? 'Pháp'
                  : match.jerseyWinnerTeam === 'FRANCE'
                  ? 'Tây Ban Nha'
                  : 'Đội B'
                : null;

            return (
              <div
                key={match.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all"
              >
                {/* Date */}
                <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <span className="text-lg font-bold font-space text-slate-800 dark:text-white leading-none">
                    {new Date(match.matchDate).getDate()}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    T{new Date(match.matchDate).getMonth() + 1}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold font-space text-slate-900 dark:text-white truncate">
                      {match.title}
                    </span>
                    {result && (
                      <span
                        className={clsx(
                          'text-xs font-bold px-2 py-0.5 rounded-full',
                          result.className
                        )}
                      >
                        {result.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {teamLabel && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">sports_soccer</span>
                        Đội: {teamLabel}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">scoreboard</span>
                      {match.scoreTeamA} - {match.scoreTeamB}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {match.location}
                    </span>
                  </div>
                </div>

                {/* View Button */}
                <Link
                  to={`/matches/${match.id}`}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold font-space px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                >
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                  Xem chi tiết
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
