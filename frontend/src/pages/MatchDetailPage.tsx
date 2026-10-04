import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Match, MatchLineup, Team, User } from '../types';
import { matchService } from '../services/matchService';
import { spinService } from '../services/spinService';
import { pickService } from '../services/pickService';
import { statsService, PlayerStatInput } from '../services/statsService';
import { adminService } from '../services/adminService';
import { useAuthStore } from '../store/authStore';
import { useWebSocketStore } from '../store/websocketStore';
import { Avatar, Badge, Button, Card, Breadcrumbs, Tabs, Select } from '../ui';
import { ScoreBoard } from '../components/match/ScoreBoard';
import { LiveGoalTimeline } from '../components/match/LiveGoalTimeline';
import { StatusBadge } from '../components/match/StatusBadge';
import { SpinWheel } from '../components/spin/SpinWheel';
import { CaptainFaceOff } from '../components/spin/CaptainFaceOff';
import { JerseySelectionStep } from '../components/jersey/JerseySelectionStep';
import { PickList } from '../components/pick/PickList';
import { TradeWindow } from '../components/trade/TradeWindow';
import { AIAnalysisCard } from '../components/ai/AIAnalysisCard';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../utils/constants';
import toast from 'react-hot-toast';

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'spin' | 'jersey' | 'pick' | 'trade' | 'lineup' | 'stats'>('overview');
  const [hasInitializedTab, setHasInitializedTab] = useState(false);

  // Spin wheel state
  const [hostAId, setHostAId] = useState<string>('');
  const [hostBId, setHostBId] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

  // Score modal
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // Admin Member Assignment Modal (Tickbox Multi-select)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [selectedAssignUserIds, setSelectedAssignUserIds] = useState<string[]>([]);
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningUser, setAssigningUser] = useState(false);

  // Stats state
  const [playerStatsInputs, setPlayerStatsInputs] = useState<
    Record<string, { goals: number; assists: number; saves: number; isMvp: boolean }>
  >({});
  const [savingStats, setSavingStats] = useState(false);

  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMatch, setDeletingMatch] = useState(false);
  const subscribe = useWebSocketStore((state) => state.subscribe);

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
            case 'IN_PROGRESS':
              setActiveTab('lineup');
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
      case 'IN_PROGRESS':
        setActiveTab('lineup');
        break;
      case 'COMPLETED':
        setActiveTab('stats');
        break;
      default:
        setActiveTab('overview');
    }
    setHasInitializedTab(true);
  }, [match, hasInitializedTab]);

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
  const hostAUser = participants.find((p) => p.user.id === hostAId)?.user || match.spinSession?.hostA;
  const hostBUser = participants.find((p) => p.user.id === hostBId)?.user || match.spinSession?.hostB;
  const winnerUser = match.spinSession?.winner;

  // Captaincy & permissions
  const isCaptainA = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'A');
  const isCaptainB = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'B');
  const isCaptain = isCaptainA || isCaptainB;
  const isWinnerCaptain = winnerUser && user?.id === winnerUser.id;
  const canSelectJersey = adminActive || Boolean(isWinnerCaptain);
  const canPick = adminActive || isCaptain;

  const hasJoined = participants.some((p) => p.user.id === user?.id);

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
      setActiveTab('spin');
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
      const statsPayload: PlayerStatInput[] = participants.map((p) => {
        const input = playerStatsInputs[p.user.id] || { goals: 0, assists: 0, saves: 0, isMvp: false };
        const isWinner =
          (match.scoreTeamA > match.scoreTeamB && p.team === 'A') ||
          (match.scoreTeamB > match.scoreTeamA && p.team === 'B');

        return {
          userId: p.user.id,
          team: p.team,
          goals: input.goals || 0,
          assists: input.assists || 0,
          saves: input.saves || 0,
          isWinner,
          isMvp: input.isMvp || false,
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
                    variant="primary"
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    leftIcon="sports_score"
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
                  <span className="text-xs font-space text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    Đã đóng điểm danh ({match.status === 'IN_PROGRESS' ? 'Đang thi đấu' : 'Đang chia đội'})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs with Step Locking */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {(() => {
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
                  case 'IN_PROGRESS':
                    return 5;
                  case 'COMPLETED':
                    return 6;
                  default:
                    return 1;
                }
              };

              const currentStep = getStepProgress(match.status);

              const isTradeWindowExpired = match.tradeWindowStartedAt
                ? Date.now() - new Date(match.tradeWindowStartedAt).getTime() >= 600000
                : false;

              const isTabLocked = (tabId: string) => {
                if (adminActive) return false;
                switch (tabId) {
                  case 'overview':
                  case 'spin':
                    return false;
                  case 'jersey':
                    return currentStep < 2;
                  case 'pick':
                    return currentStep < 3;
                  case 'trade':
                    return currentStep < 4;
                  case 'lineup':
                    return currentStep < 5 && !isTradeWindowExpired;
                  case 'stats':
                    return currentStep < 5 && !isStatsEligible;
                  default:
                    return false;
                }
              };

              return (
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Step 1: Điểm danh', icon: 'groups', count: participants.length },
                    { id: 'spin', label: 'Step 2: Quay Captain', icon: 'casino', disabled: isTabLocked('spin') },
                    { id: 'jersey', label: 'Step 2: Chọn áo đấu', icon: 'checkroom', disabled: isTabLocked('jersey') },
                    { id: 'pick', label: 'Step 3: Chọn người (60s)', icon: 'how_to_reg', disabled: isTabLocked('pick') },
                    { id: 'trade', label: 'Step 4: Chỉnh sửa (Trade)', icon: 'swap_horiz', disabled: isTabLocked('trade') },
                    { id: 'lineup', label: 'Step 5: Sơ đồ thi đấu', icon: 'sports', disabled: isTabLocked('lineup') },
                    { id: 'stats', label: 'Step 6: Thống kê sau trận', icon: 'sports_score', disabled: isTabLocked('stats') },
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
                      <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="md" showNumber />
                      <div>
                        <div className="font-heading font-black text-sm text-slate-900 dark:text-white">
                          {p.user.fullName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
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

      {/* TAB 2: SPIN WHEEL (Captain Faceoff Spin) */}
      {activeTab === 'spin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
            {hostAUser && hostBUser ? (
              <SpinWheel
                hostA={hostAUser}
                hostB={hostBUser}
                winner={winnerUser}
                isSpinning={isSpinning}
                durationMs={match.spinSession?.durationMs || 4500}
                onSpinComplete={() => {
                  setIsSpinning(false);
                  fetchMatch();
                  setActiveTab('jersey');
                }}
              />
            ) : (
              <div className="py-24 text-center text-sm text-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">casino</span>
                <p>Vui lòng chọn 2 đội trưởng ở bảng bên phải để bắt đầu vòng quay</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            {adminActive && !winnerUser && (
              <Card elevation="level1" className="relative z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="font-heading font-black text-base text-slate-900 dark:text-white mb-3">
                  ADMIN chọn 2 Đội trưởng từ danh sách điểm danh
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Select
                    placeholder="-- Đội trưởng A --"
                    value={hostAId}
                    onChange={(e) => setHostAId(e.target.value)}
                    options={eligibleHosts}
                  />
                  <Select
                    placeholder="-- Đội trưởng B --"
                    value={hostBId}
                    onChange={(e) => setHostBId(e.target.value)}
                    options={eligibleHosts}
                  />
                </div>
              </Card>
            )}

            <CaptainFaceOff
              hostA={hostAUser}
              hostB={hostBUser}
              winner={winnerUser}
              isAdmin={adminActive}
              isSpinning={isSpinning}
              onStartSpin={handleStartSpin}
            />
          </div>
        </div>
      )}

      {/* TAB 3: JERSEY SELECTION */}
      {activeTab === 'jersey' && (
        <JerseySelectionStep
          match={match}
          canSelect={canSelectJersey}
          onJerseySelected={() => {
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
              await handleUpdateStatus('IN_PROGRESS');
            } else {
              try {
                await matchService.confirmNoTrade(match.id);
              } catch {
                // Ignore if already progressed or unauthorized
              }
            }
            setActiveTab('lineup');
          }}
        />
      )}

      {/* TAB 6: LINEUP REDIRECT (Step 5: Sơ đồ thi đấu riêng biệt) */}
      {activeTab === 'lineup' && (
        <Card elevation="level1" className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">sports</span>
          </div>
          <Badge variant="primary" size="md" className="mb-2">
            Step 5: Sơ Đồ Thi Đấu (Sa Bàn)
          </Badge>
          <h2 className="font-space font-black text-2xl text-slate-900 dark:text-white mb-2">
            Sa Bàn Chiến Thuật 7v7 Riêng Biệt
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-6">
            Giao diện sa bàn thi đấu đã được chuyển sang trang riêng biệt không liên quan đến phòng live để Đội trưởng và Ban huấn luyện tùy ý kéo thả tự do và chọn sơ đồ mẫu 7 người.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to={`/matches/${match.id}/lineup`}>
              <Button size="lg" variant="primary" rightIcon="open_in_new">
                Mở Trang Sa Bàn Thi Đấu
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* TAB 7: STATS (Step 6: Thống kê sau trận) */}
      {activeTab === 'stats' && (
        <Card elevation="level1" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                Step 6: Thống Kê Sau Trận Đấu
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Nhập số bàn thắng, kiến tạo, cứu thua và chọn cầu thủ MVP sau khi trận đấu kết thúc (sau 2 tiếng)
              </p>
            </div>

            {adminActive && isStatsEligible && (
              <Button
                variant="primary"
                size="sm"
                leftIcon="save"
                isLoading={savingStats}
                onClick={handleSaveStats}
              >
                Lưu thống kê & Cập nhật BXH
              </Button>
            )}
          </div>

          {!isStatsEligible ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">lock_clock</span>
              </div>
              <h4 className="font-space font-black text-base text-slate-900 dark:text-white mb-1">
                Tính Năng Thống Kê Chưa Mở
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Trận đấu diễn ra khoảng 2 tiếng. Tính năng nhập thống kê chỉ mở sau 2 tiếng kể từ khi bắt đầu trận đấu hoặc sau khi ADMIN bấm <strong>"Kết thúc trận đấu"</strong>.
              </p>
              {adminActive && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon="sports_score"
                  onClick={() => handleUpdateStatus('COMPLETED')}
                >
                  Kết thúc trận đấu & Mở nhập thống kê ngay
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-space">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 uppercase bg-slate-50/60 dark:bg-slate-900/60">
                    <th className="py-2.5 px-3">Cầu thủ</th>
                    <th className="py-2.5 px-3">Đội</th>
                    <th className="py-2.5 px-3 text-center">Bàn thắng</th>
                    <th className="py-2.5 px-3 text-center">Kiến tạo</th>
                    <th className="py-2.5 px-3 text-center">Cứu thua</th>
                    <th className="py-2.5 px-3 text-center">Cầu thủ xuất sắc (MVP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {participants.map((p) => {
                    const currentInput = playerStatsInputs[p.user.id] || {
                      goals: 0,
                      assists: 0,
                      saves: 0,
                      isMvp: false,
                    };

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                            <span className="font-bold text-slate-900 dark:text-white">{p.user.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          {p.team === 'A' ? (
                            <span className="text-rose-600 font-bold">{TEAM_A_NAME}</span>
                          ) : p.team === 'B' ? (
                            <span className="text-blue-600 font-bold">{TEAM_B_NAME}</span>
                          ) : (
                            <span className="text-slate-500">Dự bị</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {adminActive ? (
                            <input
                              type="number"
                              min={0}
                              className="w-16 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                              value={currentInput.goals}
                              onChange={(e) =>
                                setPlayerStatsInputs((prev) => ({
                                 ...prev,
                                  [p.user.id]: {
                                    ...currentInput,
                                    goals: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span className="font-mono font-bold text-rose-600">{currentInput.goals}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {adminActive ? (
                            <input
                              type="number"
                              min={0}
                              className="w-16 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                              value={currentInput.assists}
                              onChange={(e) =>
                                setPlayerStatsInputs((prev) => ({
                                  ...prev,
                                  [p.user.id]: {
                                    ...currentInput,
                                    assists: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span className="font-mono font-bold text-blue-600">{currentInput.assists}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {adminActive ? (
                            <input
                              type="number"
                              min={0}
                              className="w-16 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-emerald-600 focus:outline-none focus:border-emerald-500"
                              value={currentInput.saves}
                              onChange={(e) =>
                                setPlayerStatsInputs((prev) => ({
                                  ...prev,
                                  [p.user.id]: {
                                    ...currentInput,
                                    saves: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span className="font-mono font-bold text-emerald-600">{currentInput.saves}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {adminActive ? (
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                              checked={currentInput.isMvp}
                              onChange={(e) =>
                                setPlayerStatsInputs((prev) => ({
                                  ...prev,
                                  [p.user.id]: {
                                    ...currentInput,
                                    isMvp: e.target.checked,
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span className="font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
                              {currentInput.isMvp ? (
                                <>
                                  <span className="material-symbols-outlined text-sm">star</span>
                                  MVP
                                </>
                              ) : (
                                '-'
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
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
                    Chọn Thành Viên Vào Trận Đấu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tích chọn (checkbox) các thành viên để đưa vào danh sách điểm danh
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

              {loadingUsers ? (
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
                </div>
              )}

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
