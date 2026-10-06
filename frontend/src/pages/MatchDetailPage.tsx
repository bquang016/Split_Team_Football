import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Match, MatchLineup, Position, Team, User } from '../types';
import { matchService } from '../services/matchService';
import { spinService } from '../services/spinService';
import { pickService } from '../services/pickService';
import { lineupService } from '../services/lineupService';
import { statsService, PlayerStatInput } from '../services/statsService';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useWebSocketStore } from '../store/websocketStore';
import { Avatar, Badge, Button, Card, Breadcrumbs, Tabs, Select } from '../ui';
import { ScoreBoard } from '../components/match/ScoreBoard';
import { LiveGoalTimeline } from '../components/match/LiveGoalTimeline';
import { StatusBadge } from '../components/match/StatusBadge';
import { SpinWheel } from '../components/spin/SpinWheel';
import { CaptainFaceOff } from '../components/spin/CaptainFaceOff';
import { JerseySelectionStep } from '../components/jersey/JerseySelectionStep';
import { CaptainJerseyStep } from '../components/jersey/CaptainJerseyStep';
import { PickList } from '../components/pick/PickList';
import { TradeWindow } from '../components/trade/TradeWindow';
import { AIAnalysisCard } from '../components/ai/AIAnalysisCard';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { PostMatchStatsTab } from '../components/match/PostMatchStatsTab';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import {
  TEAM_A_NAME,
  TEAM_B_NAME,
  TEAM_A_COLOR,
  TEAM_B_COLOR,
  FORMATION_PRESETS_7V7,
  detectPositionFromCoordinates,
} from '../utils/constants';
import spainJerseyImg from '../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../assets/ao_dau/phap.webp';
import toast from 'react-hot-toast';

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'jersey' | 'pick' | 'trade' | 'lineup' | 'stats' | 'squad' | 'tactics'
  >('overview');
  const [hasInitializedTab, setHasInitializedTab] = useState(false);

  // Spin wheel state
  const [hostAId, setHostAId] = useState<string>('');
  const [hostBId, setHostBId] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

  // Score modal
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // Admin Member Assignment Modal (Tickbox Multi-select & Guest Player)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalTab, setAssignModalTab] = useState<'system' | 'guest'>('system');
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [selectedAssignUserIds, setSelectedAssignUserIds] = useState<string[]>([]);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningUser, setAssigningUser] = useState(false);

  // Guest Player state
  const [guestFullName, setGuestFullName] = useState('');
  const [guestJerseyNumber, setGuestJerseyNumber] = useState('');
  const [guestJerseyError, setGuestJerseyError] = useState('');
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  // Tactical Pitch in MatchDetailPage
  const [tacticsActiveTeam, setTacticsActiveTeam] = useState<Team>('A');
  const [tacticsEditing, setTacticsEditing] = useState(false);
  const [tacticsSaving, setTacticsSaving] = useState(false);
  const [tacticsPitchTheme, setTacticsPitchTheme] = useState<'emerald' | 'midnight' | 'charcoal' | 'daylight'>('emerald');
  const [tacticsSelectedUserId, setTacticsSelectedUserId] = useState<string | null>(null);
  const [localLineups, setLocalLineups] = useState<MatchLineup[]>([]);

  // Stats state
  const [playerStatsInputs, setPlayerStatsInputs] = useState<
    Record<string, { goals: number; assists: number; saves: number; isMvp: boolean; rating?: number | null }>
  >({});
  const [savingStats, setSavingStats] = useState(false);

  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState(false);
  const subscribe = useWebSocketStore((state) => state.subscribe);

  // Debounced check for guest jersey number availability
  useEffect(() => {
    if (!isAssignModalOpen || assignModalTab !== 'guest') {
      setGuestJerseyError('');
      return;
    }

    const timer = setTimeout(async () => {
      const val = guestJerseyNumber.trim();
      if (!val) {
        setGuestJerseyError('');
        return;
      }
      const jNum = Number(val);
      if (isNaN(jNum) || jNum < 1 || jNum > 99) {
        setGuestJerseyError('Số áo phải từ 1 đến 99');
        return;
      }

      try {
        const res = await authService.checkAvailability({
          jerseyNumber: jNum,
          forGuest: true,
        });
        if (res.success && res.data) {
          if (!res.data.jerseyNumberAvailable) {
            setGuestJerseyError(res.data.jerseyNumberError || 'Số áo đã có người trong hệ thống sử dụng');
          } else {
            setGuestJerseyError('');
          }
        }
      } catch {
        // Silently skip
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [isAssignModalOpen, assignModalTab, guestJerseyNumber]);

  const handleDeleteMatch = async () => {
    if (!match) return;
    setDeletingMatch(true);
    try {
      const res = await matchService.deleteMatch(match.id);
      if (res.success) {
        toast.success('Đã xóa mềm trận đấu! Toàn bộ điểm số đã được hoàn tác khỏi BXH.');
        setIsDeleteModalOpen(false);
        navigate('/matches');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa trận đấu');
    } finally {
      setDeletingMatch(false);
    }
  };

  const handleRestoreMatch = async () => {
    if (!match) return;
    try {
      const res = await matchService.restoreMatch(match.id);
      if (res.success) {
        toast.success('Đã khôi phục trận đấu và tính lại điểm số vào BXH!');
        fetchMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể khôi phục trận đấu');
    }
  };

  const fetchMatch = async () => {
    if (!id) return;
    try {
      const res = await matchService.getMatchDetails(id);
      if (res.success && res.data) {
        setMatch(res.data);
        setScoreA(res.data.scoreTeamA || 0);
        setScoreB(res.data.scoreTeamB || 0);
        if (res.data.lineups) {
          setLocalLineups(res.data.lineups);
        }

        // Pre-select hosts if already recorded in spinSession
        if (res.data.spinSession) {
          setHostAId(res.data.spinSession.hostA?.id || '');
          setHostBId(res.data.spinSession.hostB?.id || '');
        } else {
          const hosts = res.data.participants?.filter((p) => p.isHost) || [];
          if (hosts.length >= 2) {
            setHostAId(hosts[0].user.id);
            setHostBId(hosts[1].user.id);
          }
        }
      }
    } catch {
      toast.error('Không thể tải thông tin trận đấu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [id]);

  // STOMP Realtime Subscriptions
  useEffect(() => {
    if (!id) return;

    const unsubs = [
      subscribe(`/topic/match/${id}/status`, (updatedMatch: Match) => {
        setMatch((prev) => (prev ? { ...prev, ...updatedMatch } : updatedMatch));
        toast.success(`Trạng thái trận đấu: ${updatedMatch.status}`);
        if (updatedMatch?.status) {
          switch (updatedMatch.status) {
            case 'JERSEY_SELECTION':
              setActiveTab('jersey');
              break;
            case 'PLAYER_PICKING':
              setActiveTab('pick');
              break;
            case 'TRADE_WINDOW':
              setActiveTab('trade');
              break;
            case 'TEAMS_SPLIT':
            case 'IN_PROGRESS':
              setActiveTab('squad');
              break;
            case 'COMPLETED':
              setActiveTab('stats');
              break;
          }
        }
      }),
      subscribe(`/topic/match/${id}/spin`, (session: any) => {
        setIsSpinning(true);
        setMatch((prev) => (prev ? { ...prev, spinSession: session } : prev));
      }),
      subscribe(`/topic/match/${id}/pick`, () => {
        fetchMatch();
      }),
      subscribe(`/topic/match/${id}/trade`, () => {
        fetchMatch();
      }),
      subscribe(`/topic/match/${id}/goals`, () => {
        fetchMatch();
      }),
      subscribe(`/topic/match/${id}/score`, (updatedMatch: Match) => {
        setMatch((prev) =>
          prev
            ? { ...prev, scoreTeamA: updatedMatch.scoreTeamA, scoreTeamB: updatedMatch.scoreTeamB }
            : updatedMatch
        );
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, [id, subscribe]);

  // Auto-navigate to current match step on initial load
  useEffect(() => {
    if (!match || hasInitializedTab) return;
    switch (match.status) {
      case 'PENDING':
        setActiveTab('overview');
        break;
      case 'JERSEY_SELECTION':
        setActiveTab('jersey');
        break;
      case 'PLAYER_PICKING':
        setActiveTab('pick');
        break;
      case 'TRADE_WINDOW':
        setActiveTab('trade');
        break;
      case 'TEAMS_SPLIT':
      case 'IN_PROGRESS':
        setActiveTab('squad');
        break;
      case 'COMPLETED':
        setActiveTab('stats');
        break;
      default:
        setActiveTab('overview');
    }
    setHasInitializedTab(true);
  }, [match, hasInitializedTab]);

  // Synchronize player stats inputs from saved database records or live match goals
  useEffect(() => {
    if (!match?.id) return;

    const syncPlayerStats = async () => {
      try {
        const res = await statsService.getMatchStats(match.id);
        const statsMap: Record<string, { goals: number; assists: number; saves: number; isMvp: boolean; rating?: number | null }> = {};

        // 1. Map existing saved player stats from database
        if (res.success && res.data && res.data.length > 0) {
          res.data.forEach((st) => {
            if (st.user?.id) {
              statsMap[st.user.id] = {
                goals: st.goals ?? 0,
                assists: st.assists ?? 0,
                saves: st.saves ?? 0,
                isMvp: Boolean(st.isMvp),
                rating: st.rating != null ? Number(st.rating) : null,
              };
            }
          });
        }

        // 2. Compute live goals & assists from match.goals for each participant
        (match.participants || []).forEach((p) => {
          if (!p.user?.id) return;
          const liveGoals = (match.goals || [])
            .filter((g) => g.scorer?.id === p.user.id)
            .reduce((sum, g) => sum + (g.goalCount || 1), 0);
          const liveAssists = (match.goals || [])
            .filter((g) => g.assist?.id === p.user.id)
            .length;

          if (!statsMap[p.user.id]) {
            statsMap[p.user.id] = {
              goals: liveGoals,
              assists: liveAssists,
              saves: 0,
              isMvp: false,
              rating: null,
            };
          } else {
            // If live goals exist and saved was 0, sync from live events
            if (liveGoals > 0 && statsMap[p.user.id].goals === 0) {
              statsMap[p.user.id].goals = liveGoals;
            }
            if (liveAssists > 0 && statsMap[p.user.id].assists === 0) {
              statsMap[p.user.id].assists = liveAssists;
            }
          }
        });

        setPlayerStatsInputs(statsMap);
      } catch {
        // Fallback directly to match.goals
        const statsMap: Record<string, { goals: number; assists: number; saves: number; isMvp: boolean; rating?: number | null }> = {};
        (match.participants || []).forEach((p) => {
          if (!p.user?.id) return;
          const liveGoals = (match.goals || [])
            .filter((g) => g.scorer?.id === p.user.id)
            .reduce((sum, g) => sum + (g.goalCount || 1), 0);
          const liveAssists = (match.goals || [])
            .filter((g) => g.assist?.id === p.user.id)
            .length;
          statsMap[p.user.id] = {
            goals: liveGoals,
            assists: liveAssists,
            saves: 0,
            isMvp: false,
            rating: null,
          };
        });
        setPlayerStatsInputs(statsMap);
      }
    };

    syncPlayerStats();
  }, [match?.id, match?.goals, match?.status]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500">Đang tải dữ liệu trận đấu...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy trận đấu</h2>
        <Link to="/matches">
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const participants = match.participants || [];
  const hostAUser = participants.find((p) => p.user?.id === hostAId)?.user || match.spinSession?.hostA;
  const hostBUser = participants.find((p) => p.user?.id === hostBId)?.user || match.spinSession?.hostB;
  const winnerUser = match.spinSession?.winner;

  // Captaincy & permissions
  const isCaptainA = participants.some((p) => p.user?.id === user?.id && p.isHost && p.team === 'A');
  const isCaptainB = participants.some((p) => p.user?.id === user?.id && p.isHost && p.team === 'B');
  const isCaptain = isCaptainA || isCaptainB;
  const isWinnerCaptain = winnerUser && user?.id === winnerUser.id;
  const canSelectJersey = adminActive || Boolean(isWinnerCaptain);
  const canPick = adminActive || isCaptain;

  // Squad, labels and permissions
  const teamALabel =
    match.jerseyWinnerTeam === 'SPAIN'
      ? 'Tây Ban Nha'
      : match.jerseyWinnerTeam === 'FRANCE'
      ? 'Pháp'
      : TEAM_A_NAME;

  const teamBLabel =
    match.jerseyWinnerTeam === 'SPAIN'
      ? 'Pháp'
      : match.jerseyWinnerTeam === 'FRANCE'
      ? 'Tây Ban Nha'
      : TEAM_B_NAME;

  const teamAJersey = match.jerseyWinnerTeam === 'FRANCE' ? franceJerseyImg : spainJerseyImg;
  const teamBJersey = match.jerseyWinnerTeam === 'FRANCE' ? spainJerseyImg : franceJerseyImg;

  const teamAParticipants = participants.filter((p) => p.team === 'A');
  const teamBParticipants = participants.filter((p) => p.team === 'B');

  const teamALineups = localLineups.filter((l) => l.team === 'A');
  const teamBLineups = localLineups.filter((l) => l.team === 'B');

  const teamABenchPlayers = teamAParticipants.filter(
    (p) => !teamALineups.some((l) => l.user?.id === p.user?.id)
  );
  const teamBBenchPlayers = teamBParticipants.filter(
    (p) => !teamBLineups.some((l) => l.user?.id === p.user?.id)
  );

  const captainAParticipant = teamAParticipants.find((p) => p.isHost);
  const captainBParticipant = teamBParticipants.find((p) => p.isHost);

  const canEdit = (team: Team) => {
    if (adminActive) return true;
    const myParticipant = participants.find((p) => p.user?.id === user?.id);
    return Boolean(myParticipant?.isHost && myParticipant?.team === team);
  };
  const canEditTeamA = canEdit('A');
  const canEditTeamB = canEdit('B');

  const isSetupCompleted =
    match.status === 'TEAMS_SPLIT' || match.status === 'IN_PROGRESS' || match.status === 'COMPLETED';

  // Tactical board helper functions
  const handleTacticsApplyPreset = (presetIndex: number) => {
    if (!match?.participants) return;
    const preset = FORMATION_PRESETS_7V7[presetIndex];
    if (!preset) return;

    const allTeamParticipants = participants.filter((p) => p.team === tacticsActiveTeam);
    const existingTeamStarters = localLineups.filter((l) => l.team === tacticsActiveTeam);
    const otherTeamLineups = localLineups.filter((l) => l.team !== tacticsActiveTeam);

    const selectedPlayers: typeof allTeamParticipants = [];
    existingTeamStarters.forEach((st) => {
      const found = allTeamParticipants.find((p) => p.user?.id === st.user?.id);
      if (found && !selectedPlayers.some((sp) => sp.user?.id === found.user?.id)) {
        selectedPlayers.push(found);
      }
    });

    allTeamParticipants.forEach((p) => {
      if (selectedPlayers.length < 7 && !selectedPlayers.some((sp) => sp.user?.id === p.user?.id)) {
        selectedPlayers.push(p);
      }
    });

    const newTeamLineups: MatchLineup[] = selectedPlayers.slice(0, 7).map((p, idx) => {
      const pos = preset.positions[idx] || { position: 'CM', x: 50, y: 50 };
      const pUserId = p.user?.id || `pos-${idx}`;
      return {
        id: `lineup-${pUserId}`,
        matchId: match.id,
        user: p.user,
        team: tacticsActiveTeam,
        positionLabel: pos.position as Position,
        xPercent: pos.x,
        yPercent: pos.y,
        jerseyNumber: p.jerseyNumber ?? p.user?.jerseyNumber,
      };
    });

    setLocalLineups([...otherTeamLineups, ...newTeamLineups]);
    toast.success(`Đã áp dụng sơ đồ ${preset.name} cho Đội ${tacticsActiveTeam === 'A' ? teamALabel : teamBLabel}!`);
  };

  const handleTacticsUpdatePosition = (userId: string, xPercent: number, yPercent: number) => {
    if (!tacticsEditing) return;
    const detectedPosition = detectPositionFromCoordinates(xPercent, yPercent);
    setLocalLineups((prev) =>
      prev.map((l) =>
        l.user.id === userId && l.team === tacticsActiveTeam
          ? { ...l, xPercent, yPercent, positionLabel: detectedPosition }
          : l
      )
    );
  };

  const handleTacticsSave = async () => {
    if (!match) return;
    setTacticsSaving(true);
    try {
      const teamLineups = adminActive
        ? localLineups
        : localLineups.filter((l) => l.team === tacticsActiveTeam);

      await lineupService.saveLineup(
        match.id,
        teamLineups.map((l) => ({
          userId: l.user.id,
          team: l.team,
          positionLabel: l.positionLabel,
          xPercent: l.xPercent,
          yPercent: l.yPercent,
          jerseyNumber: l.jerseyNumber,
        }))
      );
      toast.success(`Đã lưu đội hình ${tacticsActiveTeam === 'A' ? teamALabel : teamBLabel} thành công!`);
      setTacticsEditing(false);
      fetchMatch();
    } catch {
      toast.error('Lỗi khi lưu sơ đồ đội hình');
    } finally {
      setTacticsSaving(false);
    }
  };

  const hasJoined = participants.some((p) => p.user?.id === user?.id);

  // Stats eligibility: Match is COMPLETED OR 2 hours passed since start
  const matchDateTime = match.matchTime ? new Date(`${match.matchDate}T${match.matchTime}`) : new Date(match.matchDate);
  const isPastMatch = matchDateTime.getTime() < Date.now();
  const hoursSinceMatch = (Date.now() - matchDateTime.getTime()) / (1000 * 60 * 60);
  const isStatsEligible = match.status === 'COMPLETED' || hoursSinceMatch >= 2;

  const handleJoinToggle = async () => {
    if (match.status !== 'PENDING' || isPastMatch) {
      toast.error('Trận đấu đã bắt đầu hoặc đã qua thời gian điểm danh');
      return;
    }
    try {
      if (hasJoined) {
        await matchService.leaveMatch(match.id);
        toast.success('Đã hủy tham gia trận đấu');
      } else {
        await matchService.joinMatch(match.id);
        toast.success('Điểm danh tham gia trận đấu thành công!');
      }
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleOpenAssignModal = async () => {
    setIsAssignModalOpen(true);
    setSelectedAssignUserIds([]);
    setAssignSearchQuery('');
    setLoadingUsers(true);
    try {
      const res = await adminService.getUsers();
      if (res.success && res.data) {
        setSystemUsers(res.data);
      }
    } catch {
      toast.error('Không thể tải danh sách người dùng hệ thống');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAssignUser = async () => {
    if (selectedAssignUserIds.length === 0) {
      toast.error('Vui lòng tích chọn ít nhất một thành viên để gán vào trận');
      return;
    }
    setAssigningUser(true);
    try {
      const res = await matchService.addParticipantsBatch(match.id, selectedAssignUserIds);
      if (res.success) {
        toast.success(`Đã gán ${selectedAssignUserIds.length} thành viên vào trận thành công!`);
        setSelectedAssignUserIds([]);
        setIsAssignModalOpen(false);
        fetchMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể thêm cầu thủ');
    } finally {
      setAssigningUser(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestFullName.trim()) {
      toast.error('Vui lòng nhập họ và tên cầu thủ khách');
      return;
    }
    const jNum = Number(guestJerseyNumber);
    if (!guestJerseyNumber || isNaN(jNum) || jNum < 1 || jNum > 99) {
      toast.error('Vui lòng chọn số áo cho cầu thủ khách trong khoảng từ 1 đến 99');
      return;
    }
    if (guestJerseyError) {
      toast.error(guestJerseyError);
      return;
    }
    setGuestSubmitting(true);
    try {
      const res = await matchService.addGuestParticipant(match.id, {
        fullName: guestFullName.trim(),
        jerseyNumber: jNum,
      });
      if (res.success) {
        toast.success(`Đã thêm cầu thủ khách "${guestFullName.trim()}" (Số áo ${jNum}) vào trận đấu!`);
        setGuestFullName('');
        setGuestJerseyNumber('');
        setGuestJerseyError('');
        setIsAssignModalOpen(false);
        fetchMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể thêm cầu thủ khách');
    } finally {
      setGuestSubmitting(false);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    try {
      await matchService.removeParticipant(match.id, userId);
      toast.success('Đã xóa thành viên khỏi trận đấu');
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa thành viên');
    }
  };

  const handleStartJerseySelection = async () => {
    if (participants.length < 2) {
      toast.error('Cần ít nhất 2 cầu thủ tham gia để bắt đầu chọn đội trưởng và chọn áo');
      return;
    }
    try {
      await matchService.updateMatchStatus(match.id, 'JERSEY_SELECTION');
      toast.success('Đã chốt danh sách điểm danh! Chuyển sang bước Chọn áo đấu.');
      setActiveTab('jersey');
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể chuyển bước');
    }
  };

  const handleStartSpin = async () => {
    if (!hostAId || !hostBId) {
      toast.error('Vui lòng chọn cả hai đội trưởng');
      return;
    }
    if (hostAId === hostBId) {
      toast.error('Hai đội trưởng phải là hai người khác nhau');
      return;
    }

    try {
      setIsSpinning(true);
      await spinService.startSpin(match.id, hostAId, hostBId);
      toast.success('Bắt đầu quay chọn đội trưởng ưu tiên!');
    } catch (err: any) {
      setIsSpinning(false);
      toast.error(err.response?.data?.message || 'Không thể bắt đầu quay');
    }
  };

  const handlePickPlayer = async (userId: string, team: Team) => {
    try {
      await pickService.pickPlayer(match.id, userId, team);
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể chọn cầu thủ');
    }
  };

  const handleResetPick = async (userId: string) => {
    try {
      await pickService.resetPick(match.id, userId);
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể đặt lại');
    }
  };

  const handleUpdateStatus = async (newStatus: any) => {
    try {
      await matchService.updateMatchStatus(match.id, newStatus);
      toast.success('Cập nhật trạng thái trận đấu thành công');
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleSaveScore = async () => {
    if (!isStatsEligible) {
      toast.error('Chỉ được nhập tỉ số khi trận đấu đã kết thúc (sau 2 tiếng kể từ khi bắt đầu)');
      return;
    }
    try {
      await matchService.updateScore(match.id, scoreA, scoreB);
      toast.success('Đã cập nhật tỉ số');
      setIsScoreModalOpen(false);
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật tỉ số');
    }
  };

  // Record Player Stats
  const handleSaveStats = async () => {
    setSavingStats(true);
    try {
      const statsPayload: PlayerStatInput[] = participants
        .filter((p) => p.user?.id)
        .map((p) => {
          const input = playerStatsInputs[p.user.id] || { goals: 0, assists: 0, saves: 0, isMvp: false, rating: null };
          const isWinner =
            (match.scoreTeamA > match.scoreTeamB && p.team === 'A') ||
            (match.scoreTeamB > match.scoreTeamA && p.team === 'B');

          return {
            userId: p.user.id,
            team: p.team,
            goals: Number(input.goals) || 0,
            assists: Number(input.assists) || 0,
            saves: Number(input.saves) || 0,
            rating:
              input.rating !== undefined && input.rating !== null && !isNaN(Number(input.rating))
                ? Number(input.rating)
                : null,
            isWinner,
            isMvp: Boolean(input.isMvp),
          };
        });

      const res = await statsService.recordStats(match.id, statsPayload);
      if (res.success) {
        toast.success('Đã lưu thống kê cầu thủ và làm mới bảng xếp hạng!');
        fetchMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể lưu thống kê');
    } finally {
      setSavingStats(false);
    }
  };

  const eligibleHosts = participants.map((p) => ({
    value: p.user.id,
    label: p.user.fullName,
    jerseyNumber: p.user.jerseyNumber,
    avatar: p.user.avatarUrl,
    sublabel: `@${p.user.username}`,
  }));

  const unassignedSystemUsers = systemUsers.filter(
    (u) => !participants.some((p) => p.user.id === u.id)
  );

  const filteredUnassignedUsers = unassignedSystemUsers.filter((u) => {
    if (!assignSearchQuery.trim()) return true;
    const q = assignSearchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.jerseyNumber !== undefined && String(u.jerseyNumber).includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Hierarchical Breadcrumb */}
      <Breadcrumbs
        links={[
          { label: 'Trang chủ', to: '/', icon: 'home' },
          { label: 'Lịch & Trận đấu', to: '/matches', icon: 'calendar_month' },
          { label: match.title || `Trận ${formatDateVi(match.matchDate)}` },
        ]}
      />

      {/* Top Header Bento Glass Card */}
      <Card elevation="glass" glow className="!p-5 sm:!p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <StatusBadge status={match.status} />
              <span className="text-xs font-space text-slate-500 font-medium">
                • {match.location || 'Sân cố định'} • Thể thức 7v7 tự do
              </span>
            </div>

            {/* Quick status actions for Admin */}
            {adminActive && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!isStatsEligible) {
                      toast.error('Chỉ được nhập tỉ số khi trận đấu đã kết thúc (sau 2 tiếng kể từ khi bắt đầu)');
                      return;
                    }
                    setIsScoreModalOpen(true);
                  }}
                  leftIcon="scoreboard"
                  disabled={!isStatsEligible}
                  title={!isStatsEligible ? 'Chỉ nhập tỉ số khi trận đấu kết thúc (sau 2 tiếng)' : 'Nhập tỉ số'}
                >
                  Nhập tỉ số {!isStatsEligible ? '(Khóa)' : ''}
                </Button>

                {match.status === 'PENDING' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleStartJerseySelection}
                    leftIcon="checkroom"
                  >
                    Bắt đầu chọn áo
                  </Button>
                )}

                {match.status === 'JERSEY_SELECTION' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus('PLAYER_PICKING')}
                    leftIcon="how_to_reg"
                  >
                    Sang bước Chọn người
                  </Button>
                )}

                {match.status === 'PLAYER_PICKING' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus('TRADE_WINDOW')}
                    leftIcon="swap_horiz"
                  >
                    Mở Chuyển nhượng (Trade)
                  </Button>
                )}

                {match.status === 'TRADE_WINDOW' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                    leftIcon="play_arrow"
                  >
                    Bắt đầu thi đấu
                  </Button>
                )}

                {match.status === 'IN_PROGRESS' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn kết thúc trận đấu và chốt tỉ số để mở bảng thống kê sau trận?')) {
                        handleUpdateStatus('COMPLETED');
                      }
                    }}
                    leftIcon="stop_circle"
                  >
                    Kết thúc trận đấu
                  </Button>
                )}

                {match.isDeleted ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleRestoreMatch}
                    leftIcon="restore_from_trash"
                  >
                    Khôi phục trận đấu
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setIsDeleteModalOpen(true)}
                    leftIcon="delete"
                  >
                    Xóa trận
                  </Button>
                )}
              </div>
            )}
          </div>

          {match.isDeleted && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs font-space text-rose-700 dark:text-rose-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-rose-500">warning</span>
                <span>
                  Trận đấu này đã bị <strong>Xóa mềm</strong>. Dữ liệu bàn thắng và điểm số của trận này đang được tạm thời hoàn tác khỏi Bảng xếp hạng.
                </span>
              </div>
              {adminActive && (
                <Button size="sm" variant="primary" leftIcon="restore_from_trash" onClick={handleRestoreMatch}>
                  Khôi phục ngay
                </Button>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div>
              <h1 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                {match.title || `Trận bóng ngày ${match.matchDate}`}
              </h1>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-space text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                <span>{formatDateVi(match.matchDate)}</span>
                {match.matchTime && <span>• {formatTimeVi(match.matchTime)}</span>}
                <span>
                  • <strong className="text-slate-900 dark:text-slate-100">{participants.length}</strong> cầu thủ tham gia (không giới hạn)
                </span>
              </div>
            </div>

            {user && (
              <div>
                {match.status === 'PENDING' && !isPastMatch ? (
                  <Button
                    size="md"
                    variant={hasJoined ? 'danger' : 'primary'}
                    leftIcon={hasJoined ? 'cancel' : 'how_to_reg'}
                    onClick={handleJoinToggle}
                  >
                    {hasJoined ? 'Hủy tham gia' : 'Điểm danh tham gia'}
                  </Button>
                ) : match.status === 'PENDING' && isPastMatch ? (
                  <span className="text-xs font-space text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm">event_busy</span>
                    Đã quá giờ thi đấu (Trận trong quá khứ)
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-space text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Đã đóng điểm danh
                    </span>

                    {adminActive && match.status === 'TEAMS_SPLIT' && (
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon="play_circle"
                        onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      >
                        Bắt đầu trận đấu
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs: When setup completed, only show Squad & Tactics (+ Stats) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {(() => {
              if (isSetupCompleted) {
                return (
                  <Tabs
                    tabs={[
                      { id: 'squad', label: 'ĐỘI HÌNH', icon: 'groups' },
                      { id: 'tactics', label: 'SƠ ĐỒ', icon: 'sports' },
                      ...(match.status === 'IN_PROGRESS' || match.status === 'COMPLETED' || isStatsEligible
                        ? [{ id: 'stats', label: 'THỐNG KÊ SAU TRẬN', icon: 'sports_score' }]
                        : []),
                    ]}
                    activeTab={activeTab === 'overview' || activeTab === 'jersey' || activeTab === 'pick' || activeTab === 'trade' ? 'squad' : activeTab}
                    onChange={(t) => setActiveTab(t as any)}
                  />
                );
              }

              const getStepProgress = (status?: string) => {
                switch (status) {
                  case 'PENDING':
                    return 1;
                  case 'JERSEY_SELECTION':
                    return 2;
                  case 'PLAYER_PICKING':
                    return 3;
                  case 'TRADE_WINDOW':
                    return 4;
                  default:
                    return 1;
                }
              };

              const currentStep = getStepProgress(match.status);

              const isTabLocked = (tabId: string) => {
                if (adminActive) return false;
                switch (tabId) {
                  case 'overview':
                    return false;
                  case 'jersey':
                    return currentStep < 2;
                  case 'pick':
                    return currentStep < 3;
                  case 'trade':
                    return currentStep < 4;
                  default:
                    return false;
                }
              };

              return (
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Bước 1: ĐIỂM DANH', icon: 'groups', count: participants.length },
                    { id: 'jersey', label: 'Bước 2: CHỌN ÁO ĐẤU', icon: 'styler', disabled: isTabLocked('jersey') },
                    { id: 'pick', label: 'Bước 3: CHỌN NGƯỜI', icon: 'how_to_reg', disabled: isTabLocked('pick') },
                    { id: 'trade', label: 'Bước 4: TRAO ĐỔI', icon: 'swap_horiz', disabled: isTabLocked('trade') },
                  ]}
                  activeTab={activeTab}
                  onChange={(t) => {
                    if (!isTabLocked(t as string)) {
                      setActiveTab(t as any);
                    } else {
                      toast.error('Bước này chưa được mở khóa trong tiến trình trận đấu');
                    }
                  }}
                />
              );
            })()}
          </div>
        </div>
      </Card>

      {/* TAB 1: OVERVIEW (Step 1 Điểm danh) */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-5">
          <ScoreBoard
            scoreTeamA={match.scoreTeamA}
            scoreTeamB={match.scoreTeamB}
            hostAName={hostAUser?.fullName}
            hostBName={hostBUser?.fullName}
            isLive={match.status === 'IN_PROGRESS'}
          />

          {/* Diễn biến bàn thắng realtime trên sân */}
          {(match.status === 'IN_PROGRESS' || match.status === 'COMPLETED' || (match.goals && match.goals.length > 0)) && (
            <LiveGoalTimeline
              match={match}
              isAdmin={adminActive}
              onGoalRecorded={fetchMatch}
            />
          )}

          <AIAnalysisCard
            matchId={match.id}
            initialAnalysis={match.aiAnalysis}
            initialAnalyzedAt={match.aiAnalyzedAt}
          />

          {/* Participants List */}
          <Card elevation="level1" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                  Danh Sách Cầu Thủ Đã Điểm Danh ({participants.length})
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Không giới hạn số người tham gia • Đồng bộ realtime
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {adminActive && match.status === 'PENDING' && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon="person_add"
                      onClick={handleOpenAssignModal}
                    >
                      Gán thành viên vào trận
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon="checkroom"
                      onClick={handleStartJerseySelection}
                    >
                      Bắt đầu chọn áo
                    </Button>
                  </>
                )}
                {match.status === 'PENDING' && (
                  <Badge variant="live" size="sm" dot>
                    Đang mở điểm danh
                  </Badge>
                )}
              </div>
            </div>

            {participants.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400 italic">
                Chưa có cầu thủ nào điểm danh
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={p.user.fullName} src={p.user.avatarUrl} jerseyNumber={p.user.jerseyNumber} size="md" showNumber />
                      <div>
                        <div className="font-heading font-black text-sm text-slate-900 dark:text-white">
                          {p.user.fullName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {p.user.role === 'GUEST' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-space font-bold border border-purple-500/30 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[11px]">person_pin</span>
                              Cầu thủ khách
                            </span>
                          )}
                          {p.isHost && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
                          {p.team === 'A' && <Badge variant="teamA" size="sm">Đội A</Badge>}
                          {p.team === 'B' && <Badge variant="teamB" size="sm">Đội B</Badge>}
                          {p.team === 'BENCH' && <Badge variant="neutral" size="sm">Dự bị</Badge>}
                        </div>
                      </div>
                    </div>

                    {adminActive && match.status === 'PENDING' && (
                      <button
                        onClick={() => handleRemoveParticipant(p.user.id)}
                        title="Xóa khỏi trận"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* BƯỚC 2: CHỌN ÁO ĐẤU (Gộp Đội trưởng & Áo đấu) */}
      {activeTab === 'jersey' && (
        <CaptainJerseyStep
          match={match}
          participants={participants}
          onRefreshMatch={fetchMatch}
          onProceedToPick={() => {
            fetchMatch();
            setActiveTab('pick');
          }}
        />
      )}

      {/* TAB 4: PICK LIST (Step 3: Chọn người với Timer 60s) */}
      {activeTab === 'pick' && (
        <PickList
          matchId={match.id}
          match={match}
          participants={participants}
          canPick={canPick}
          onPick={handlePickPlayer}
          onReset={handleResetPick}
          onMatchUpdate={fetchMatch}
          onProceedToTrade={() => {
            if (adminActive) {
              handleUpdateStatus('TRADE_WINDOW');
              setActiveTab('trade');
            }
          }}
        />
      )}

      {/* TAB 5: TRADE WINDOW (Step 4: Chỉnh sửa) */}
      {activeTab === 'trade' && (
        <TradeWindow
          matchId={match.id}
          match={match}
          participants={participants}
          onTradeCompleted={fetchMatch}
          onProceedToLineup={async () => {
            if (adminActive) {
              await handleUpdateStatus('TEAMS_SPLIT');
            } else {
              try {
                await matchService.confirmNoTrade(match.id);
              } catch {
                // Ignore if already progressed or unauthorized
              }
            }
            fetchMatch();
            setActiveTab('squad');
          }}
        />
      )}

      {/* TAB: ĐỘI HÌNH (Sau khi hoàn tất setup) */}
      {activeTab === 'squad' && (
        <div className="flex flex-col gap-6">
          <ScoreBoard
            scoreTeamA={match.scoreTeamA}
            scoreTeamB={match.scoreTeamB}
            hostAName={hostAUser?.fullName}
            hostBName={hostBUser?.fullName}
            isLive={match.status === 'IN_PROGRESS'}
          />

          {(match.status === 'IN_PROGRESS' || match.status === 'COMPLETED' || (match.goals && match.goals.length > 0)) && (
            <LiveGoalTimeline
              match={match}
              isAdmin={adminActive}
              onGoalRecorded={fetchMatch}
            />
          )}

          {match.status === 'TEAMS_SPLIT' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl shrink-0">
                  check_circle
                </span>
                <div>
                  <h4 className="font-space font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-300">
                    Đã Hoàn Tất Chia Đội & Chốt Đội Hình
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Trận đấu đã hoàn tất các bước setup. Trận sẽ tự động chuyển sang "Trận đang đá" khi tới ngày giờ thi đấu.
                  </p>
                </div>
              </div>

              {adminActive && (
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon="sports_soccer"
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                >
                  Bắt đầu trận đấu ngay
                </Button>
              )}
            </div>
          )}

          <AIAnalysisCard
            matchId={match.id}
            initialAnalysis={match.aiAnalysis}
            initialAnalyzedAt={match.aiAnalyzedAt}
          />

          {/* Hai Đội Hình Song Song */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CỘT ĐỘI A */}
            <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                {/* Team Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teamAJersey}
                      alt={teamALabel}
                      className="w-10 h-10 object-contain filter drop-shadow"
                    />
                    <div>
                      <h3 className="font-space font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        Đội {teamALabel}
                        <span className="text-xs font-mono font-normal text-slate-500">
                          ({teamAParticipants.length} cầu thủ)
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {teamALineups.length > 0 ? (
                          <Badge variant="primary" size="sm">
                            Đã chốt sơ đồ ({teamALineups.length} đá chính)
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Chưa lưu sơ đồ
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {canEditTeamA && (
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon="edit"
                      onClick={() => {
                        setTacticsActiveTeam('A');
                        setTacticsEditing(true);
                        setActiveTab('tactics');
                      }}
                    >
                      Chỉnh sửa sơ đồ
                    </Button>
                  )}
                </div>

                {/* ĐỘI TRƯỞNG ĐỨNG ĐẦU */}
                {captainAParticipant ? (
                  <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar
                          name={captainAParticipant.user?.fullName || 'Đội trưởng'}
                          src={captainAParticipant.user?.avatarUrl}
                          jerseyNumber={captainAParticipant.jerseyNumber ?? captainAParticipant.user?.jerseyNumber}
                          size="md"
                          showNumber
                        />
                        <span
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono shadow-xs"
                          title="Đội trưởng"
                        >
                          C
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-space font-black text-sm text-slate-900 dark:text-white">
                            {captainAParticipant.user?.fullName || 'Đội trưởng'}
                          </span>
                          <Badge variant="gold" size="sm">
                            ĐỘI TRƯỞNG
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          Số áo #{captainAParticipant.jerseyNumber ?? captainAParticipant.user?.jerseyNumber ?? 'C'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 italic">
                    Chưa chỉ định Đội trưởng
                  </div>
                )}

                {/* Danh sách cầu thủ đá chính (nếu có sơ đồ) */}
                <div className="mb-4">
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-emerald-500">sports_soccer</span>
                    Đội hình đá chính ({teamALineups.length}/7)
                  </h4>
                  {teamALineups.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {teamALineups.map((l) => (
                        <div
                          key={l.user?.id || l.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={l.user?.fullName || 'Cầu thủ'}
                              src={l.user?.avatarUrl}
                              jerseyNumber={l.jerseyNumber ?? l.user?.jerseyNumber}
                              size="sm"
                              showNumber
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-space font-bold text-xs text-slate-900 dark:text-white">
                                  {l.user?.fullName || 'Cầu thủ'}
                                </span>
                                {l.user?.role === 'GUEST' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-space font-bold border border-purple-500/30 inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[11px]">person_pin</span>
                                    Cầu thủ khách
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30">
                            {l.positionLabel || 'CM'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2">
                      Đội trưởng chưa lưu sơ đồ ra sân. Nhấn "Chỉnh sửa sơ đồ" để sắp xếp 7 cầu thủ đá chính.
                    </p>
                  )}
                </div>

                {/* Cầu thủ dự bị */}
                <div>
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">chair</span>
                    Cầu thủ dự bị ({teamABenchPlayers.length})
                  </h4>
                  {teamABenchPlayers.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {teamABenchPlayers.map((p) => (
                        <div
                          key={p.user?.id || p.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={p.user?.fullName || 'Cầu thủ'}
                              src={p.user?.avatarUrl}
                              jerseyNumber={p.jerseyNumber ?? p.user?.jerseyNumber}
                              size="sm"
                              showNumber
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="font-space font-medium text-xs text-slate-700 dark:text-slate-300">
                                {p.user?.fullName || 'Cầu thủ'}
                              </span>
                              {p.user?.role === 'GUEST' && (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-space font-bold border border-purple-500/30 inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[11px]">person_pin</span>
                                  Cầu thủ khách
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            #{p.jerseyNumber ?? p.user?.jerseyNumber ?? '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">Không có cầu thủ dự bị</p>
                  )}
                </div>
              </div>
            </Card>

            {/* CỘT ĐỘI B */}
            <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                {/* Team Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teamBJersey}
                      alt={teamBLabel}
                      className="w-10 h-10 object-contain filter drop-shadow"
                    />
                    <div>
                      <h3 className="font-space font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        Đội {teamBLabel}
                        <span className="text-xs font-mono font-normal text-slate-500">
                          ({teamBParticipants.length} cầu thủ)
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {teamBLineups.length > 0 ? (
                          <Badge variant="primary" size="sm">
                            Đã chốt sơ đồ ({teamBLineups.length} đá chính)
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">
                            Chưa lưu sơ đồ
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {canEditTeamB && (
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon="edit"
                      onClick={() => {
                        setTacticsActiveTeam('B');
                        setTacticsEditing(true);
                        setActiveTab('tactics');
                      }}
                    >
                      Chỉnh sửa sơ đồ
                    </Button>
                  )}
                </div>

                {/* ĐỘI TRƯỞNG ĐỨNG ĐẦU */}
                {captainBParticipant ? (
                  <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar
                          name={captainBParticipant.user?.fullName || 'Đội trưởng'}
                          src={captainBParticipant.user?.avatarUrl}
                          jerseyNumber={captainBParticipant.jerseyNumber ?? captainBParticipant.user?.jerseyNumber}
                          size="md"
                          showNumber
                        />
                        <span
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono shadow-xs"
                          title="Đội trưởng"
                        >
                          C
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-space font-black text-sm text-slate-900 dark:text-white">
                            {captainBParticipant.user?.fullName || 'Đội trưởng'}
                          </span>
                          <Badge variant="gold" size="sm">
                            ĐỘI TRƯỞNG
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          Số áo #{captainBParticipant.jerseyNumber ?? captainBParticipant.user?.jerseyNumber ?? 'C'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 italic">
                    Chưa chỉ định Đội trưởng
                  </div>
                )}

                {/* Danh sách cầu thủ đá chính (nếu có sơ đồ) */}
                <div className="mb-4">
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-emerald-500">sports_soccer</span>
                    Đội hình đá chính ({teamBLineups.length}/7)
                  </h4>
                  {teamBLineups.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {teamBLineups.map((l) => (
                        <div
                          key={l.user?.id || l.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={l.user?.fullName || 'Cầu thủ'}
                              src={l.user?.avatarUrl}
                              jerseyNumber={l.jerseyNumber ?? l.user?.jerseyNumber}
                              size="sm"
                              showNumber
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-space font-bold text-xs text-slate-900 dark:text-white">
                                  {l.user?.fullName || 'Cầu thủ'}
                                </span>
                                {l.user?.role === 'GUEST' && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-space font-bold border border-purple-500/30 inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[11px]">person_pin</span>
                                    Cầu thủ khách
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30">
                            {l.positionLabel || 'CM'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-2">
                      Đội trưởng chưa lưu sơ đồ ra sân. Nhấn "Chỉnh sửa sơ đồ" để sắp xếp 7 cầu thủ đá chính.
                    </p>
                  )}
                </div>

                {/* Cầu thủ dự bị */}
                <div>
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">chair</span>
                    Cầu thủ dự bị ({teamBBenchPlayers.length})
                  </h4>
                  {teamBBenchPlayers.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {teamBBenchPlayers.map((p) => (
                        <div
                          key={p.user?.id || p.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={p.user?.fullName || 'Cầu thủ'}
                              src={p.user?.avatarUrl}
                              jerseyNumber={p.jerseyNumber ?? p.user?.jerseyNumber}
                              size="sm"
                              showNumber
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="font-space font-medium text-xs text-slate-700 dark:text-slate-300">
                                {p.user?.fullName || 'Cầu thủ'}
                              </span>
                              {p.user?.role === 'GUEST' && (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-space font-bold border border-purple-500/30 inline-flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[11px]">person_pin</span>
                                  Cầu thủ khách
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            #{p.jerseyNumber ?? p.user?.jerseyNumber ?? '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">Không có cầu thủ dự bị</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB: SƠ ĐỒ THI ĐẤU (Interactive Pitch + Presets + Save) */}
      {(activeTab === 'tactics' || activeTab === 'lineup') && (
        <div className="flex flex-col gap-6">
          {/* Header Bar: Team Selector, Presets & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Team Selector Pills */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTacticsActiveTeam('A');
                  setTacticsSelectedUserId(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all cursor-pointer flex items-center gap-2 ${
                  tacticsActiveTeam === 'A'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <img
                  src={teamAJersey}
                  alt={teamALabel}
                  className="w-5 h-5 object-contain filter drop-shadow"
                />
                <span>Đội {teamALabel}</span>
                {canEditTeamA && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-rose-200">
                    Bạn quản lý
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTacticsActiveTeam('B');
                  setTacticsSelectedUserId(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all cursor-pointer flex items-center gap-2 ${
                  tacticsActiveTeam === 'B'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <img
                  src={teamBJersey}
                  alt={teamBLabel}
                  className="w-5 h-5 object-contain filter drop-shadow"
                />
                <span>Đội {teamBLabel}</span>
                {canEditTeamB && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-blue-200">
                    Bạn quản lý
                  </span>
                )}
              </button>
            </div>

            {/* Presets and Save / Edit Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {canEdit(tacticsActiveTeam) && (
                tacticsEditing ? (
                  <>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-space">
                      <span className="text-slate-400">Sơ đồ mẫu:</span>
                      {FORMATION_PRESETS_7V7.slice(0, 3).map((preset, idx) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleTacticsApplyPreset(idx)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon="save"
                      isLoading={tacticsSaving}
                      onClick={handleTacticsSave}
                    >
                      Lưu đội hình
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon="edit"
                    className="!bg-amber-500 hover:!bg-amber-600 !text-white !border-transparent"
                    onClick={() => setTacticsEditing(true)}
                  >
                    Chỉnh sửa sơ đồ
                  </Button>
                )
              )}

              <Link to={`/matches/${match.id}/lineup`}>
                <Button size="sm" variant="secondary" rightIcon="open_in_new">
                  Mở sa bàn toàn màn hình
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive or Read-only Pitch */}
          <Card elevation="level1" className="p-3 sm:p-5 bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-xl relative max-w-4xl mx-auto w-full">
            <FootballPitch
              lineups={localLineups}
              activeTeam={tacticsActiveTeam}
              teamLabel={tacticsActiveTeam === 'A' ? teamALabel : teamBLabel}
              isEditable={tacticsEditing && canEdit(tacticsActiveTeam)}
              selectedUserId={tacticsSelectedUserId}
              pitchTheme={tacticsPitchTheme}
              onSelectUser={setTacticsSelectedUserId}
              onUpdatePosition={handleTacticsUpdatePosition}
            />
          </Card>
        </div>
      )}

      {/* THỐNG KÊ SAU TRẬN */}
      {activeTab === 'stats' && (
        <PostMatchStatsTab
          match={match}
          participants={participants}
          teamALabel={teamALabel}
          teamBLabel={teamBLabel}
          adminActive={adminActive}
          isStatsEligible={isStatsEligible}
          playerStatsInputs={playerStatsInputs}
          setPlayerStatsInputs={setPlayerStatsInputs}
          savingStats={savingStats}
          onSaveStats={handleSaveStats}
          onEndMatch={() => handleUpdateStatus('COMPLETED')}
        />
      )}

      {/* Score Modal (Portaled) */}
      {isScoreModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsScoreModalOpen(false);
            }}
          >
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm pointer-events-none" />
            <div onClick={(e) => e.stopPropagation()} className="relative my-auto max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 text-slate-900 dark:text-white">
              <h3 className="font-space font-black text-xl text-slate-900 dark:text-white mb-4">
                Cập Nhật Tỉ Số Trận Đấu
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {TEAM_A_NAME}
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-space font-black text-xl text-rose-500"
                    value={scoreA}
                    onChange={(e) => setScoreA(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {TEAM_B_NAME}
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-space font-black text-xl text-blue-500"
                    value={scoreB}
                    onChange={(e) => setScoreB(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsScoreModalOpen(false)}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleSaveScore}>
                  Lưu Tỉ Số
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Admin Member Assignment Modal (Portaled Tickbox Multi-select) */}
      {isAssignModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsAssignModalOpen(false);
            }}
          >
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm pointer-events-none" />
            <div onClick={(e) => e.stopPropagation()} className="relative my-auto max-w-lg w-full p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] z-10 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-space font-black text-lg text-slate-900 dark:text-white">
                    Gán Cầu Thủ Vào Trận Đấu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chọn thành viên hệ thống hoặc thêm cầu thủ khách tham gia thi đấu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignModalTab('system')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                    assignModalTab === 'system'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">groups</span>
                  <span>Thành viên hệ thống</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAssignModalTab('guest')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                    assignModalTab === 'guest'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">person_pin</span>
                  <span>Cầu thủ khách (Cầu thủ ma)</span>
                </button>
              </div>

              {assignModalTab === 'guest' ? (
                <form onSubmit={handleAddGuest} className="flex flex-col gap-4 py-4 flex-1">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs font-space space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-base text-purple-600 dark:text-purple-400">info</span>
                      Dành cho bạn bè tham gia đá tạm thời
                    </div>
                    <p className="leading-relaxed">
                      Cầu thủ này chỉ tham gia trận đấu hiện tại để phục vụ việc chia đội và sắp xếp sơ đồ chiến thuật. Hệ thống sẽ <strong>không lưu lịch sử thi đấu</strong> cũng như <strong>không tính điểm vào Bảng xếp hạng</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">
                      Họ và tên cầu thủ khách <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Anh Nam (Bạn Tuấn)"
                      value={guestFullName}
                      onChange={(e) => setGuestFullName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-space text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-space font-bold text-slate-700 dark:text-slate-300">
                      Số áo thi đấu chính thức <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      placeholder="Ví dụ: 19"
                      value={guestJerseyNumber}
                      onChange={(e) => setGuestJerseyNumber(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm font-space text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors ${
                        guestJerseyError
                          ? 'border-rose-500 focus:border-rose-500 text-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-purple-500'
                      }`}
                      required
                    />
                    {guestJerseyError ? (
                      <span className="text-xs text-rose-500 font-semibold">{guestJerseyError}</span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-space leading-relaxed">
                        Bắt buộc từ 1–99. Số áo này không được trùng với bất kỳ ai trong hệ thống (nhưng có thể bị người dùng thật chiếm lại).
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAssignModalOpen(false)}
                      type="button"
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon="person_add"
                      isLoading={guestSubmitting}
                      type="submit"
                      className="!bg-purple-600 hover:!bg-purple-700"
                    >
                      Thêm cầu thủ khách
                    </Button>
                  </div>
                </form>
              ) : loadingUsers ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Đang tải danh sách thành viên...
                </div>
              ) : unassignedSystemUsers.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 italic">
                  Tất cả thành viên trong hệ thống đã có trong danh sách trận đấu
                </div>
              ) : (
                <div className="flex flex-col gap-3 py-3 flex-1 overflow-hidden">
                  {/* Search Bar and Select All Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Tìm theo tên, số áo, username..."
                        value={assignSearchQuery}
                        onChange={(e) => setAssignSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-space text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedAssignUserIds.length === filteredUnassignedUsers.length) {
                            setSelectedAssignUserIds([]);
                          } else {
                            setSelectedAssignUserIds(filteredUnassignedUsers.map((u) => u.id));
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-space font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {selectedAssignUserIds.length === filteredUnassignedUsers.length && filteredUnassignedUsers.length > 0
                          ? 'Bỏ chọn tất cả'
                          : 'Chọn tất cả'}
                      </button>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-space font-bold">
                        Đã chọn: {selectedAssignUserIds.length} / {unassignedSystemUsers.length}
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Checkbox List */}
                  <div className="flex flex-col gap-1.5 overflow-y-auto max-h-72 pr-1 custom-scrollbar">
                    {filteredUnassignedUsers.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 italic">
                        Không tìm thấy thành viên nào phù hợp với tìm kiếm
                      </div>
                    ) : (
                      filteredUnassignedUsers.map((u) => {
                        const isChecked = selectedAssignUserIds.includes(u.id);

                        return (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedAssignUserIds((prev) =>
                                prev.includes(u.id) ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                              );
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-700 shadow-2xs'
                                : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedAssignUserIds((prev) =>
                                    e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                                  );
                                }}
                                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                              />

                              <Avatar
                                name={u.fullName}
                                src={u.avatarUrl}
                                jerseyNumber={u.jerseyNumber}
                                size="sm"
                                showNumber
                              />

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-space font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {u.fullName}
                                  </span>
                                  {u.role === 'ADMIN' && (
                                    <Badge variant="gold" size="sm">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[11px] font-space text-slate-400 dark:text-slate-500 block truncate">
                                  @{u.username} {u.jerseyNumber ? `• Số áo #${u.jerseyNumber}` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center">
                              {isChecked ? (
                                <span className="material-symbols-outlined text-base text-emerald-500">
                                  check_circle
                                </span>
                              ) : (
                                <span className="material-symbols-outlined text-base text-slate-300 dark:text-slate-600">
                                  radio_button_unchecked
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAssignModalOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon="person_add"
                      isLoading={assigningUser}
                      disabled={selectedAssignUserIds.length === 0 || loadingUsers}
                      onClick={handleAssignUser}
                    >
                      Gán ({selectedAssignUserIds.length}) thành viên vào trận
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Soft Delete Match Modal (Portaled) */}
      {isDeleteModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsDeleteModalOpen(false);
            }}
          >
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm pointer-events-none" />
            <div onClick={(e) => e.stopPropagation()} className="relative my-auto max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 text-slate-900 dark:text-white">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <h3 className="font-space font-black text-lg text-slate-900 dark:text-white mb-2">
                Xác Nhận Xóa Mềm Trận Đấu?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Trận đấu sẽ được chuyển vào <strong>Thùng rác</strong> và ẩn khỏi Trang chủ & Lịch thi đấu. Toàn bộ bàn thắng, kiến tạo, và điểm số của trận này sẽ <strong>tạm thời được hoàn tác khỏi Bảng xếp hạng</strong> cho đến khi bạn bấm <strong>Khôi phục</strong>.
              </p>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
                  Hủy bỏ
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon="delete"
                  isLoading={deletingMatch}
                  onClick={handleDeleteMatch}
                >
                  Xác nhận Xóa mềm
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
