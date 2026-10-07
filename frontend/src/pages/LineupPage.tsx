import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import { useAuthStore } from '../store/authStore';
import { matchService } from '../services/matchService';
import { lineupService } from '../services/lineupService';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { BenchReserves } from '../components/lineup/BenchReserves';
import { TacticalSidebar } from '../components/lineup/TacticalSidebar';
import { LineupExport } from '../components/lineup/LineupExport';
import { LineupPosterModal } from '../components/lineup/LineupPosterModal';
import { FORMATION_PRESETS_7V7, TEAM_A_NAME, TEAM_B_NAME, detectPositionFromCoordinates, DEFAULT_POSITION_COORDINATES } from '../utils/constants';
import type { Match, MatchLineup, Position, Team } from '../types';
import toast from 'react-hot-toast';
import spainJerseyImg from '../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../assets/ao_dau/phap.webp';

export const LineupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();

  const [match, setMatch] = useState<Match | null>(null);
  const [lineups, setLineups] = useState<MatchLineup[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team>('A');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Pitch visuals state
  const [pitchTheme, setPitchTheme] = useState<'emerald' | 'midnight' | 'charcoal' | 'daylight'>('emerald');
  const [showNames, setShowNames] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showPositions, setShowPositions] = useState(true);
  const [showZones, setShowZones] = useState(false);

  // Determine if current user can edit a given team
  const canEdit = useCallback(
    (team: Team) => {
      if (adminActive) return true;
      if (!match?.participants) return false;
      const myParticipant = match.participants.find((p) => p.user.id === user?.id);
      return Boolean(myParticipant?.isHost && myParticipant?.team === team);
    },
    [adminActive, match, user?.id]
  );

  const [editingTeams, setEditingTeams] = useState<Record<string, boolean>>({ A: false, B: false });
  const isEditable = canEdit(activeTeam);
  const isEditing = Boolean(editingTeams[activeTeam]);
  const isPitchInteractive = isEditable && isEditing;

  const teamALabel =
    match?.jerseyWinnerTeam === 'SPAIN'
      ? 'Tây Ban Nha'
      : match?.jerseyWinnerTeam === 'FRANCE'
      ? 'Pháp'
      : TEAM_A_NAME;

  const teamBLabel =
    match?.jerseyWinnerTeam === 'SPAIN'
      ? 'Pháp'
      : match?.jerseyWinnerTeam === 'FRANCE'
      ? 'Tây Ban Nha'
      : TEAM_B_NAME;

  const activeTeamLabel = activeTeam === 'A' ? teamALabel : teamBLabel;

  const fetchMatchData = async () => {
    if (!id) return;
    try {
      const response = await matchService.getMatchDetails(id);
      const m = response.data;
      setMatch(m);
      // Ensure jersey numbers are retained from match participants or user profiles
      const enrichedLineups = (m.lineups ?? []).map((l: MatchLineup) => {
        const participant = m.participants?.find((p) => p.user.id === l.user.id);
        const defaultCoord = l.positionLabel ? DEFAULT_POSITION_COORDINATES[l.positionLabel] : undefined;
        return {
          ...l,
          xPercent: typeof l.xPercent === 'number' && !isNaN(l.xPercent) ? l.xPercent : (defaultCoord?.x ?? 50),
          yPercent: typeof l.yPercent === 'number' && !isNaN(l.yPercent) ? l.yPercent : (defaultCoord?.y ?? 50),
          jerseyNumber: l.jerseyNumber ?? participant?.jerseyNumber ?? l.user.jerseyNumber,
        };
      });

      // Auto-populate default 2-3-1 formation for teams that have participants but no saved lineup
      let finalLineups: MatchLineup[] = [...enrichedLineups];
      const hasTeamA = finalLineups.some((l) => l.team === 'A');
      const hasTeamB = finalLineups.some((l) => l.team === 'B');
      const teamAParticipants = (m.participants ?? []).filter((p) => p.team === 'A');
      const teamBParticipants = (m.participants ?? []).filter((p) => p.team === 'B');
      const defaultPreset = FORMATION_PRESETS_7V7[0];

      if (!hasTeamA && teamAParticipants.length > 0) {
        const startersA: MatchLineup[] = teamAParticipants.slice(0, 7).map((p, idx) => {
          const pos = defaultPreset.positions[idx] || { position: 'CM', x: 50, y: 50 };
          return {
            id: `lineup-${p.user.id}`,
            matchId: m.id,
            user: p.user,
            team: 'A',
            positionLabel: pos.position as Position,
            xPercent: pos.x,
            yPercent: pos.y,
            jerseyNumber: p.jerseyNumber ?? p.user.jerseyNumber,
          };
        });
        finalLineups = [...finalLineups, ...startersA];
      }

      if (!hasTeamB && teamBParticipants.length > 0) {
        const startersB: MatchLineup[] = teamBParticipants.slice(0, 7).map((p, idx) => {
          const pos = defaultPreset.positions[idx] || { position: 'CM', x: 50, y: 50 };
          return {
            id: `lineup-${p.user.id}`,
            matchId: m.id,
            user: p.user,
            team: 'B',
            positionLabel: pos.position as Position,
            xPercent: pos.x,
            yPercent: pos.y,
            jerseyNumber: p.jerseyNumber ?? p.user.jerseyNumber,
          };
        });
        finalLineups = [...finalLineups, ...startersB];
      }

      setLineups(finalLineups);
      const teamALineups = finalLineups.filter((l) => l.team === 'A');
      const teamBLineups = finalLineups.filter((l) => l.team === 'B');
      setEditingTeams((prev) => ({
        A: prev.A || teamALineups.length === 0,
        B: prev.B || teamBLineups.length === 0,
      }));
    } catch {
      toast.error('Không thể tải sơ đồ thi đấu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  // Update on-pitch position coordinates & automatically adjust role (GK, CB, ST, etc.) based on coordinates
  const handleUpdatePosition = useCallback(
    (userId: string, xPercent: number, yPercent: number) => {
      if (!isPitchInteractive) return;
      const detectedPosition = detectPositionFromCoordinates(xPercent, yPercent);
      setLineups((prev) =>
        prev.map((l) =>
          l.user.id === userId && l.team === activeTeam
            ? { ...l, xPercent, yPercent, positionLabel: detectedPosition }
            : l
        )
      );
    },
    [isPitchInteractive, activeTeam]
  );

  // Update position label (GK, CB, ST...)
  const handleUpdatePositionLabel = useCallback(
    (userId: string, positionLabel: Position) => {
      if (!isPitchInteractive) return;
      setLineups((prev) =>
        prev.map((l) => (l.user.id === userId && l.team === activeTeam ? { ...l, positionLabel } : l))
      );
    },
    [isEditable, activeTeam]
  );

  // Apply formation preset
  const handleApplyPreset = (presetIndex: number) => {
    if (!isPitchInteractive) {
      toast.error('Vui lòng bấm "Chỉnh sửa sơ đồ" trước khi thay đổi chiến thuật');
      return;
    }
    const preset = FORMATION_PRESETS_7V7[presetIndex];
    if (!preset || !match?.participants) return;

    setActivePresetIndex(presetIndex);

    const allTeamParticipants = match.participants.filter((p) => p.team === activeTeam);
    const existingTeamStarters = lineups.filter((l) => l.team === activeTeam);
    const otherTeamLineups = lineups.filter((l) => l.team !== activeTeam);

    // Pick 7 players: priority to existing starters, fill rest from team pool
    const selectedPlayers: typeof allTeamParticipants = [];
    existingTeamStarters.forEach((st) => {
      const found = allTeamParticipants.find((p) => p.user.id === st.user.id);
      if (found && !selectedPlayers.some((sp) => sp.user.id === found.user.id)) {
        selectedPlayers.push(found);
      }
    });

    allTeamParticipants.forEach((p) => {
      if (selectedPlayers.length < 7 && !selectedPlayers.some((sp) => sp.user.id === p.user.id)) {
        selectedPlayers.push(p);
      }
    });

    const newTeamLineups: MatchLineup[] = selectedPlayers.slice(0, 7).map((p, idx) => {
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
    toast.success(`Đã áp dụng sơ đồ ${preset.name} cho Đội ${activeTeamLabel}!`);
  };

  // Drag and drop from bench / outside onto the pitch
  const handleAddPlayerFromBench = useCallback(
    (userId: string, xPercent: number, yPercent: number) => {
      if (!isEditable || !match?.participants) return;
      const participant = match.participants.find((p) => p.user.id === userId && p.team === activeTeam);
      if (!participant) return;

      const teamStarters = lineups.filter((l) => l.team === activeTeam);
      const otherTeamLineups = lineups.filter((l) => l.team !== activeTeam);

      // Determine role based on pitch coordinates
      const defaultPos: Position = detectPositionFromCoordinates(xPercent, yPercent);

      if (teamStarters.length < 7) {
        const newLineup: MatchLineup = {
          id: `lineup-${userId}`,
          matchId: match.id,
          user: participant.user,
          team: activeTeam,
          positionLabel: defaultPos,
          xPercent,
          yPercent,
          jerseyNumber: participant.jerseyNumber ?? participant.user.jerseyNumber,
        };
        setLineups([...otherTeamLineups, ...teamStarters, newLineup]);
        setSelectedUserId(userId);
        toast.success(`Đã đưa ${participant.user.fullName} (${defaultPos}) vào sân!`);
      } else {
        // Substitute closest player
        let closestIndex = 0;
        let minDistance = 99999;
        teamStarters.forEach((st, idx) => {
          const dx = (st.xPercent ?? 50) - xPercent;
          const dy = (st.yPercent ?? 50) - yPercent;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = idx;
          }
        });

        const oldPlayer = teamStarters[closestIndex];
        const substituted: MatchLineup = {
          id: `lineup-${userId}`,
          matchId: match.id,
          user: participant.user,
          team: activeTeam,
          positionLabel: defaultPos,
          xPercent,
          yPercent,
          jerseyNumber: participant.jerseyNumber ?? participant.user.jerseyNumber,
        };

        const updatedStarters = [...teamStarters];
        updatedStarters[closestIndex] = substituted;

        setLineups([...otherTeamLineups, ...updatedStarters]);
        setSelectedUserId(userId);
        toast.success(
          `Đã thay thế: ${participant.user.fullName} (${defaultPos}) vào sân thay cho ${oldPlayer.user.fullName}!`
        );
      }
    },
    [isEditable, match?.participants, match?.id, activeTeam, lineups]
  );

  // Bench a player (remove from pitch starters)
  const handleBenchPlayer = useCallback(
    (userId: string) => {
      if (!isPitchInteractive) return;
      setLineups((prev) => prev.filter((l) => !(l.team === activeTeam && l.user.id === userId)));
      if (selectedUserId === userId) {
        setSelectedUserId(null);
      }
      toast.success('Đã chuyển cầu thủ ra hàng ghế dự bị');
    },
    [isPitchInteractive, activeTeam, selectedUserId]
  );

  // Start a player from bench (1-click from sidebar or bench button)
  const handleStartPlayer = useCallback(
    (userId: string) => {
      if (!isPitchInteractive || !match?.participants) return;
      const participant = match.participants.find((p) => p.user.id === userId && p.team === activeTeam);
      if (!participant) return;

      const teamStarters = lineups.filter((l) => l.team === activeTeam);
      const otherTeamLineups = lineups.filter((l) => l.team !== activeTeam);

      if (teamStarters.length < 7) {
        const defaultPositions: { pos: Position; x: number; y: number }[] = [
          { pos: 'GK', x: 50, y: 88 },
          { pos: 'CB', x: 32, y: 70 },
          { pos: 'CB', x: 68, y: 70 },
          { pos: 'CM', x: 50, y: 48 },
          { pos: 'LM', x: 20, y: 48 },
          { pos: 'RM', x: 80, y: 48 },
          { pos: 'ST', x: 50, y: 22 },
        ];
        const openSlot = defaultPositions[teamStarters.length] || { pos: 'CM', x: 50, y: 50 };

        const newLineup: MatchLineup = {
          id: `lineup-${userId}`,
          matchId: match.id,
          user: participant.user,
          team: activeTeam,
          positionLabel: openSlot.pos,
          xPercent: openSlot.x,
          yPercent: openSlot.y,
          jerseyNumber: participant.user.jerseyNumber,
        };
        setLineups([...otherTeamLineups, ...teamStarters, newLineup]);
        setSelectedUserId(userId);
        toast.success(`Đã đưa ${participant.user.fullName} vào sân!`);
      } else if (selectedUserId) {
        const oldPlayerIdx = teamStarters.findIndex((s) => s.user.id === selectedUserId);
        if (oldPlayerIdx !== -1) {
          const oldStarter = teamStarters[oldPlayerIdx];
          const newStarter: MatchLineup = {
            ...oldStarter,
            id: `lineup-${userId}`,
            user: participant.user,
            jerseyNumber: participant.user.jerseyNumber,
          };
          const updatedStarters = [...teamStarters];
          updatedStarters[oldPlayerIdx] = newStarter;
          setLineups([...otherTeamLineups, ...updatedStarters]);
          setSelectedUserId(userId);
          toast.success(
            `Đã thay thế: ${participant.user.fullName} vào sân thay cho ${oldStarter.user.fullName}!`
          );
        }
      } else {
        toast.error('Đội hình đã đủ 7 người. Hãy chọn 1 cầu thủ đá chính để thay thế hoặc kéo thả lên sân.');
      }
    },
    [isEditable, match?.participants, match?.id, activeTeam, lineups, selectedUserId]
  );

  // Save lineup to backend (Only saves active team)
  const handleSave = useCallback(async () => {
    if (!id) return;
    const currentTeamLineups = lineups.filter((l) => l.team === activeTeam);
    if (currentTeamLineups.length === 0) {
      toast.error(
        `Đội ${activeTeamLabel} chưa có cầu thủ nào trên sân. Vui lòng chọn sơ đồ mẫu hoặc kéo cầu thủ vào sân trước khi lưu!`
      );
      return;
    }

    setSaving(true);
    try {
      await lineupService.saveLineup(
        id,
        currentTeamLineups.map((l) => ({
          userId: l.user.id,
          team: l.team,
          positionLabel: l.positionLabel,
          xPercent: l.xPercent,
          yPercent: l.yPercent,
          jerseyNumber: l.jerseyNumber,
        }))
      );
      toast.success(`Đã chốt xong đội hình ${activeTeamLabel}!`);
      setEditingTeams((prev) => ({ ...prev, [activeTeam]: false }));
      fetchMatchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.lineups || 'Lỗi khi lưu sơ đồ';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [id, lineups, activeTeam, activeTeamLabel]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isEditable && !saving) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditable, saving, handleSave]);

  // Export PNG functionality capturing the whole tactical board
  const handleExportPng = async () => {
    let element = document.getElementById('tactical-board-export-container');
    if (!element) {
      element = document.getElementById('football-pitch-canvas');
    }
    if (!element) {
      toast.error('Không tìm thấy sơ đồ sân để xuất ảnh');
      return;
    }

    setIsExportingPng(true);
    const toastId = toast.loading('Đang khởi tạo ảnh sơ đồ chất lượng cao (2K)...');

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeTitle = `${match?.title || 'match'}-${activeTeamLabel}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');

      link.download = `${safeTitle}-sa-ban-7v7.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Đã xuất ảnh PNG sơ đồ chiến thuật thành công!', { id: toastId });
    } catch (err) {
      console.error('Lỗi khi xuất ảnh sơ đồ:', err);
      toast.error('Có lỗi xảy ra khi tạo ảnh sơ đồ', { id: toastId });
    } finally {
      setIsExportingPng(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-space">
        <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin">
          progress_activity
        </span>
        <p className="text-xs text-slate-500">Đang tải sa bàn chiến thuật...</p>
      </div>
    );
  }

  if (!match) return null;

  const currentTeamStarters = lineups.filter((l) => l.team === activeTeam);
  const currentTeamBench = (match.participants ?? []).filter(
    (p) => p.team === activeTeam && !lineups.some((l) => l.team === activeTeam && l.user.id === p.user.id)
  );

  const activePreset = activePresetIndex !== undefined ? FORMATION_PRESETS_7V7[activePresetIndex]?.name : undefined;

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col gap-4">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-space">
        <div className="flex items-center gap-1.5 truncate">
          <Link to="/matches" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
            Lịch & Trận đấu
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link
            to={`/matches/${match.id}`}
            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors truncate max-w-44"
          >
            {match.title}
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-800 dark:text-slate-300 font-bold">Sa Bàn 7v7</span>
        </div>

        <Link
          to={`/matches/${match.id}`}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Về chi tiết trận</span>
        </Link>
      </div>

      {/* Main Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <h1 className="text-lg sm:text-2xl font-black font-space text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Sa Bàn Chiến Thuật 7v7
            </h1>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 uppercase">
              Interactive Pitch
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-space">
            Kéo thả tự do trên sân hoặc kéo từ hàng dự bị lên • Tối đa 7 cầu thủ đá chính
          </p>
        </div>

        {/* Team Selector Pills */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTeam('A');
              setSelectedUserId(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all cursor-pointer flex items-center gap-2 ${
              activeTeam === 'A'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <img
              src={match?.jerseyWinnerTeam === 'FRANCE' ? franceJerseyImg : spainJerseyImg}
              alt={teamALabel}
              className="w-5 h-5 object-contain filter drop-shadow"
            />
            <span>{teamALabel}</span>
            {canEdit('A') && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-rose-200">
                Bạn quản lý
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTeam('B');
              setSelectedUserId(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all cursor-pointer flex items-center gap-2 ${
              activeTeam === 'B'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <img
              src={match?.jerseyWinnerTeam === 'FRANCE' ? spainJerseyImg : franceJerseyImg}
              alt={teamBLabel}
              className="w-5 h-5 object-contain filter drop-shadow"
            />
            <span>{teamBLabel}</span>
            {canEdit('B') && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-blue-200">
                Bạn quản lý
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons: Save & Quick Export */}
        <div className="flex items-center gap-2">
          <LineupExport
            matchTitle={match.title}
            teamLabel={activeTeamLabel}
            onClick={() => setIsPosterModalOpen(true)}
          />

          {isEditable && (
            isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold font-space transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-emerald-500/20"
                title="Phím tắt: Ctrl + S"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base">save</span>
                )}
                <span>Lưu đội hình</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditingTeams((prev) => ({ ...prev, [activeTeam]: true }))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold font-space transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Chỉnh sửa sơ đồ</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Two-Column Tactical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: TACTICAL PITCH & DEDICATED BENCH (EXPORTABLE AREA) */}
        {/* ============================================================== */}
        <div
          id="tactical-board-export-container"
          className="lg:col-span-8 flex flex-col gap-4 rounded-3xl p-3 sm:p-5 bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/90 shadow-xl relative"
        >
          {/* Main Interactive Football Pitch */}
          <FootballPitch
            lineups={lineups}
            activeTeam={activeTeam}
            teamLabel={activeTeamLabel}
            formationName={activePreset}
            isEditable={isPitchInteractive}
            selectedUserId={selectedUserId}
            pitchTheme={pitchTheme}
            showNames={showNames}
            showNumbers={showNumbers}
            showPositions={showPositions}
            showZones={showZones}
            onSelectUser={setSelectedUserId}
            onUpdatePosition={handleUpdatePosition}
            onUpdatePositionLabel={handleUpdatePositionLabel}
            onAddPlayerFromBench={handleAddPlayerFromBench}
            onBenchPlayer={handleBenchPlayer}
          />

          {/* Dedicated Reserves Bench Line */}
          <BenchReserves
            benchPlayers={currentTeamBench}
            team={activeTeam}
            isEditable={isPitchInteractive}
            onStartPlayer={handleStartPlayer}
            onDropOnBench={handleBenchPlayer}
          />
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: MODERN MINIMALIST TACTICAL SIDEBAR */}
        {/* ============================================================== */}
        <div className="lg:col-span-4">
          <TacticalSidebar
            match={match}
            activeTeam={activeTeam}
            teamLabel={activeTeamLabel}
            isEditable={isPitchInteractive}
            lineups={lineups}
            benchPlayers={currentTeamBench}
            selectedUserId={selectedUserId}
            activePresetIndex={activePresetIndex}
            pitchTheme={pitchTheme}
            showNames={showNames}
            showNumbers={showNumbers}
            showPositions={showPositions}
            showZones={showZones}
            onSelectUser={setSelectedUserId}
            onSelectFormation={handleApplyPreset}
            onUpdatePositionLabel={handleUpdatePositionLabel}
            onBenchPlayer={handleBenchPlayer}
            onStartPlayer={handleStartPlayer}
            onChangePitchTheme={setPitchTheme}
            onToggleNames={() => setShowNames((v) => !v)}
            onToggleNumbers={() => setShowNumbers((v) => !v)}
            onTogglePositions={() => setShowPositions((v) => !v)}
            onToggleZones={() => setShowZones((v) => !v)}
            onExportPng={() => setIsPosterModalOpen(true)}
            isExportingPng={isExportingPng}
          />
        </div>
      </div>

      {/* MATCHDAY SQUAD POSTER EXPORT MODAL */}
      <LineupPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        match={match}
        activeTeam={activeTeam}
        teamLabel={activeTeamLabel}
        lineups={lineups}
        benchPlayers={currentTeamBench}
        formationName={activePreset}
      />
    </div>
  );
};
