import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { matchService } from '../services/matchService';
import { lineupService } from '../services/lineupService';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { BenchReserves } from '../components/lineup/BenchReserves';
import { FormationPreset } from '../components/lineup/FormationPreset';
import type { Match, MatchLineup, Position, Team } from '../types';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ─── Component ───────────────────────────────────────────────────────────────

export const LineupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();

  const [match, setMatch] = useState<Match | null>(null);
  const [lineups, setLineups] = useState<MatchLineup[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team>('A');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine if current user can edit a given team
  const canEdit = useCallback(
    (team: Team) => {
      if (adminActive) return true;
      if (!match?.participants) return false;
      const myParticipant = match.participants.find((p) => p.user.id === user?.id);
      return myParticipant?.isHost && myParticipant?.team === team;
    },
    [adminActive, match, user?.id]
  );

  const isEditable = canEdit(activeTeam);

  // Jersey display names
  const teamALabel =
    match?.jerseyWinnerTeam === 'SPAIN'
      ? 'Tây Ban Nha'
      : match?.jerseyWinnerTeam === 'FRANCE'
      ? 'Pháp'
      : 'Đội A';
  const teamBLabel =
    match?.jerseyWinnerTeam === 'SPAIN'
      ? 'Pháp'
      : match?.jerseyWinnerTeam === 'FRANCE'
      ? 'Tây Ban Nha'
      : 'Đội B';

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const response = await matchService.getMatchDetails(id);
        const m = response.data;
        setMatch(m);
        setLineups(m.lineups ?? []);
      } catch {
        toast.error('Không thể tải sơ đồ thi đấu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdatePosition = useCallback(
    (userId: string, xPercent: number, yPercent: number) => {
      setLineups((prev) =>
        prev.map((l) => (l.user.id === userId ? { ...l, xPercent, yPercent } : l))
      );
    },
    []
  );

  const handleUpdatePositionLabel = useCallback(
    (userId: string, positionLabel: Position) => {
      setLineups((prev) =>
        prev.map((l) => (l.user.id === userId ? { ...l, positionLabel } : l))
      );
    },
    []
  );

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await lineupService.saveLineup(
        id,
        lineups.map((l) => ({
          userId: l.user.id,
          team: l.team,
          positionLabel: l.positionLabel,
          xPercent: l.xPercent,
          yPercent: l.yPercent,
          jerseyNumber: l.jerseyNumber,
        }))
      );
      toast.success('Đã lưu sơ đồ thi đấu!');
    } catch {
      toast.error('Lỗi khi lưu sơ đồ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  if (!match) return null;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-space">
        <Link to="/matches" className="hover:text-emerald-500 transition-colors">
          Lịch & Trận đấu
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link
          to={`/matches/${match.id}`}
          className="hover:text-emerald-500 transition-colors truncate max-w-48"
        >
          {match.title}
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-600 dark:text-slate-300">Sơ đồ thi đấu</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold font-space text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">view_list</span>
            Sơ đồ thi đấu
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{match.title}</p>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <>
              <FormationPreset
                onSelectFormation={(_idx) => {
                  // Formation preset logic - handled by the component
                }}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold font-space transition-all disabled:opacity-60"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base">save</span>
                )}
                Lưu sơ đồ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Team Tabs */}
      <div className="flex gap-2 mb-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 w-fit">
        {(['A', 'B'] as Team[]).map((team) => (
          <button
            key={team}
            type="button"
            onClick={() => setActiveTeam(team)}
            className={clsx(
              'px-5 py-2 rounded-xl text-sm font-bold font-space transition-all',
              activeTeam === team
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            {team === 'A' ? teamALabel : teamBLabel}
            {canEdit(team) && (
              <span className="ml-1.5 text-xs text-emerald-500 font-normal">(của bạn)</span>
            )}
          </button>
        ))}
      </div>

      {/* Editable hint */}
      {isEditable && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-3 font-space">
          <span className="material-symbols-outlined text-sm">touch_app</span>
          Kéo thả cầu thủ để sắp xếp vị trí. Tối đa 7 người xuất phát.
        </div>
      )}
      {!isEditable && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-space">
          <span className="material-symbols-outlined text-sm">visibility</span>
          Bạn chỉ có thể xem sơ đồ của đội này.
        </div>
      )}

      {/* Main Pitch */}
      <FootballPitch
        lineups={lineups}
        activeTeam={activeTeam}
        isEditable={isEditable}
        onUpdatePosition={handleUpdatePosition}
        onUpdatePositionLabel={handleUpdatePositionLabel}
      />

      {/* Bench / Reserves */}
      <div className="mt-4">
        <BenchReserves
          benchPlayers={
            (match.participants ?? []).filter(
              (p) =>
                p.team === activeTeam &&
                !lineups.some((l) => l.user.id === p.user.id)
            )
          }
          team={activeTeam}
        />
      </div>
    </div>
  );
};
