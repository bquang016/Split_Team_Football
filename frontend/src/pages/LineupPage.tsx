import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { matchService } from '../services/matchService';
import { lineupService } from '../services/lineupService';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { BenchReserves } from '../components/lineup/BenchReserves';
import { FormationPreset } from '../components/lineup/FormationPreset';
import { LineupExport } from '../components/lineup/LineupExport';
import { FORMATION_PRESETS_7V7, TEAM_A_NAME, TEAM_B_NAME } from '../utils/constants';
import type { Match, MatchLineup, Position, Team } from '../types';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const LineupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();

  const [match, setMatch] = useState<Match | null>(null);
  const [lineups, setLineups] = useState<MatchLineup[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team>('A');
  const [activePresetIndex, setActivePresetIndex] = useState<number | undefined>(undefined);
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

  const teamALabel = match?.jerseyWinnerTeam === 'SPAIN'
    ? 'Tây Ban Nha'
    : match?.jerseyWinnerTeam === 'FRANCE'
    ? 'Pháp'
    : TEAM_A_NAME;

  const teamBLabel = match?.jerseyWinnerTeam === 'SPAIN'
    ? 'Pháp'
    : match?.jerseyWinnerTeam === 'FRANCE'
    ? 'Tây Ban Nha'
    : TEAM_B_NAME;

  const fetchMatchData = async () => {
    if (!id) return;
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

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  const handleUpdatePosition = useCallback(
    (userId: string, xPercent: number, yPercent: number) => {
      if (!isEditable) return;
      setLineups((prev) =>
        prev.map((l) => (l.user.id === userId ? { ...l, xPercent, yPercent } : l))
      );
    },
    [isEditable]
  );

  const handleUpdatePositionLabel = useCallback(
    (userId: string, positionLabel: Position) => {
      if (!isEditable) return;
      setLineups((prev) =>
        prev.map((l) => (l.user.id === userId ? { ...l, positionLabel } : l))
      );
    },
    [isEditable]
  );

  const handleApplyPreset = (presetIndex: number) => {
    if (!isEditable) {
      toast.error('Bạn chỉ có quyền xếp đội hình cho đội của mình');
      return;
    }
    const preset = FORMATION_PRESETS_7V7[presetIndex];
    if (!preset || !match?.participants) return;

    setActivePresetIndex(presetIndex);

    const teamPlayers = match.participants.filter((p) => p.team === activeTeam);
    const otherTeamLineups = lineups.filter((l) => l.team !== activeTeam);

    // Max 7 starters from the roster
    const starters = teamPlayers.slice(0, 7);
    const newTeamLineups: MatchLineup[] = starters.map((p, idx) => {
      const pos = preset.positions[idx] || { position: 'CM', x: 50, y: 50 };
      return {
        id: `lineup-${p.user.id}`,
        matchId: match.id,
        user: p.user,
        team: activeTeam,
        positionLabel: pos.position as Position,
        xPercent: pos.x,
        yPercent: pos.y,
        jerseyNumber: p.user.jerseyNumber,
      };
    });

    setLineups([...otherTeamLineups, ...newTeamLineups]);
    toast.success(`Đã áp dụng sơ đồ ${preset.name} cho Đội ${activeTeam === 'A' ? teamALabel : teamBLabel}!`);
  };

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
      toast.success('Đã lưu sơ đồ thi đấu thành công!');
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

  const currentTeamStarters = lineups.filter((l) => l.team === activeTeam);
  const currentTeamBench = (match.participants ?? []).filter(
    (p) => p.team === activeTeam && !lineups.some((l) => l.team === activeTeam && l.user.id === p.user.id)
  );

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto font-sans text-slate-900 dark:text-slate-100">
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
        <span className="text-slate-600 dark:text-slate-300">Sơ đồ thi đấu (Sa bàn)</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-space text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">sports</span>
            Sơ Đồ Thi Đấu (Sa Bàn 7v7)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {match.title} • Kéo thả vị trí cầu thủ tự do, tối đa 7 người chính thức
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditable && (
            <FormationPreset
              onSelectFormation={handleApplyPreset}
              activeFormation={activePresetIndex}
            />
          )}
          <LineupExport
            matchTitle={match.title}
            targetElementId="football-pitch-canvas"
          />
          {isEditable && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold font-space transition-all disabled:opacity-60 cursor-pointer shadow-xs"
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
          )}
        </div>
      </div>

      {/* Team Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 w-fit">
          {(['A', 'B'] as Team[]).map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => setActiveTeam(team)}
              className={clsx(
                'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all cursor-pointer',
                activeTeam === team
                  ? team === 'A'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {team === 'A' ? teamALabel : teamBLabel}
              {canEdit(team) && (
                <span className="ml-1.5 text-xs text-emerald-300 font-normal">(Đội của bạn)</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-space text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Chính thức: <strong>{currentTeamStarters.length} / 7</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Dự bị: <strong>{currentTeamBench.length}</strong>
          </span>
        </div>
      </div>

      {/* Permissions hint */}
      {isEditable ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-3 font-space">
          <span className="material-symbols-outlined text-sm">touch_app</span>
          Kéo thả cầu thủ trực tiếp trên sân để sắp xếp vị trí tự do. Tối đa 7 người xuất phát.
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-space">
          <span className="material-symbols-outlined text-sm">visibility</span>
          Chế độ xem sơ đồ (Chỉ Đội trưởng đội này và Ban tổ chức mới có quyền chỉnh sửa).
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
          benchPlayers={currentTeamBench}
          team={activeTeam}
        />
      </div>
    </div>
  );
};
