import React, { useEffect, useState, useRef } from 'react';
import { Match, MatchParticipant, TradeRequest } from '../../types';
import { Card, Button, Badge, Avatar, Select } from '../../ui';
import { tradeService } from '../../services/tradeService';
import { matchService } from '../../services/matchService';
import { useAuthStore } from '../../store/authStore';
import { useWebSocketStore } from '../../store/websocketStore';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import toast from 'react-hot-toast';

interface TradeWindowProps {
  matchId: string;
  match?: Match | null;
  participants: MatchParticipant[];
  onTradeCompleted: () => void;
  onProceedToLineup: () => void;
}

export const TradeWindow: React.FC<TradeWindowProps> = ({
  matchId,
  match,
  participants,
  onTradeCompleted,
  onProceedToLineup,
}) => {
  const [trades, setTrades] = useState<TradeRequest[]>([]);
  const [selectedMyPlayerId, setSelectedMyPlayerId] = useState<string>('');
  const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string>('');
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [submittingTrade, setSubmittingTrade] = useState(false);
  const [submittingConfirm, setSubmittingConfirm] = useState(false);
  const [timeLeftSec, setTimeLeftSec] = useState(600); // 10 minutes

  const onProceedToLineupRef = useRef(onProceedToLineup);
  onProceedToLineupRef.current = onProceedToLineup;
  const hasFiredTimeoutRef = useRef(false);

  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();
  const subscribe = useWebSocketStore((state) => state.subscribe);

  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');

  const myParticipant = participants.find((p) => p.user.id === user?.id);
  const isCaptainA = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'A');
  const isCaptainB = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'B');
  const canTrade = adminActive || isCaptainA || isCaptainB;

  const myTeam = isCaptainA ? 'A' : isCaptainB ? 'B' : myParticipant?.team || 'A';
  const availableMyTeamPlayers = (myTeam === 'A' ? teamAPlayers : teamBPlayers).filter((p) => !p.isHost);
  const availableOpponentPlayers = (myTeam === 'A' ? teamBPlayers : teamAPlayers).filter((p) => !p.isHost);

  const myPlayerOptions = availableMyTeamPlayers.map((p) => ({
    value: p.user.id,
    label: p.user.fullName,
    jerseyNumber: p.user.jerseyNumber,
    avatar: p.user.avatarUrl,
    sublabel: `@${p.user.username}`,
  }));

  const targetPlayerOptions = availableOpponentPlayers.map((p) => ({
    value: p.user.id,
    label: p.user.fullName,
    jerseyNumber: p.user.jerseyNumber,
    avatar: p.user.avatarUrl,
    sublabel: `@${p.user.username}`,
  }));

  const fetchTrades = async () => {
    setLoadingTrades(true);
    try {
      const res = await tradeService.getTrades(matchId);
      if (res.success && res.data) {
        setTrades(res.data);
      }
    } catch {
      // Ignored
    } finally {
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [matchId]);

  // Subscribe to real-time trade events
  useEffect(() => {
    if (!matchId) return;

    const unsubTrade = subscribe(`/topic/match/${matchId}/trade`, () => {
      fetchTrades();
      onTradeCompleted();
    });

    return () => {
      unsubTrade();
    };
  }, [matchId, subscribe, onTradeCompleted]);

  // Synchronized countdown timer based on tradeWindowStartedAt
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (match?.tradeWindowStartedAt) {
        const start = new Date(match.tradeWindowStartedAt).getTime();
        const elapsed = Math.floor((Date.now() - start) / 1000);
        return Math.max(0, 600 - elapsed);
      }
      return 600;
    };

    const initial = calculateTimeLeft();
    setTimeLeftSec(initial);

    // If already expired on mount, do not repeat toast; trigger transition once
    if (initial <= 0) {
      if (!hasFiredTimeoutRef.current) {
        hasFiredTimeoutRef.current = true;
        onProceedToLineupRef.current();
      }
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeftSec(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (!hasFiredTimeoutRef.current) {
          hasFiredTimeoutRef.current = true;
          toast.success('Hết thời gian chuyển nhượng 10 phút! Tự động chuyển sang Sơ đồ thi đấu.', {
            id: 'trade-timeout',
          });
          onProceedToLineupRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match?.tradeWindowStartedAt]);

  const captainAConfirmedNoTrade = Boolean(match?.captainAConfirmedNoTrade);
  const captainBConfirmedNoTrade = Boolean(match?.captainBConfirmedNoTrade);
  const myConfirmed = isCaptainA ? captainAConfirmedNoTrade : isCaptainB ? captainBConfirmedNoTrade : false;
  const consensusCount = (captainAConfirmedNoTrade ? 1 : 0) + (captainBConfirmedNoTrade ? 1 : 0);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleProposeTrade = async () => {
    if (!selectedMyPlayerId || !selectedTargetPlayerId) {
      toast.error('Vui lòng chọn 1 cầu thủ bên mình và 1 cầu thủ đối phương');
      return;
    }

    setSubmittingTrade(true);
    try {
      const res = await tradeService.createTrade(matchId, selectedMyPlayerId, selectedTargetPlayerId);
      if (res.success) {
        toast.success('Đã gửi đề nghị trao đổi cầu thủ!');
        setSelectedMyPlayerId('');
        setSelectedTargetPlayerId('');
        fetchTrades();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tạo đề nghị đổi người');
    } finally {
      setSubmittingTrade(false);
    }
  };

  const handleRespond = async (tradeId: string, accept: boolean) => {
    try {
      const res = await tradeService.respondTrade(matchId, tradeId, accept);
      if (res.success) {
        toast.success(accept ? 'Đã chấp nhận đổi cầu thủ!' : 'Đã từ chối đổi cầu thủ');
        fetchTrades();
        onTradeCompleted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = async (tradeId: string) => {
    try {
      const res = await tradeService.cancelTrade(matchId, tradeId);
      if (res.success) {
        toast.success('Đã hủy đề nghị đổi cầu thủ');
        fetchTrades();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const toggleNoTradeConfirmation = async () => {
    setSubmittingConfirm(true);
    try {
      const res = await matchService.confirmNoTrade(matchId);
      if (res.success) {
        toast.success(
          adminActive
            ? 'Quản trị viên đã xác nhận: Không chỉnh sửa!'
            : myConfirmed
            ? 'Đã hủy xác nhận không chỉnh sửa'
            : 'Đã xác nhận không chỉnh sửa! Đang chờ đội trưởng còn lại...'
        );
        onTradeCompleted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận');
    } finally {
      setSubmittingConfirm(false);
    }
  };

  const pendingTrades = trades.filter((t) => t.status === 'PENDING');

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Header with Timer and Confirmation Status */}
      <Card elevation="glass" glow className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" dot size="sm">
                Bước 4: Chỉnh Sửa & Chuyển Nhượng (Trade)
              </Badge>
              <span className="text-xs text-slate-500 font-space">Thời gian chỉnh sửa: 10 phút</span>
            </div>
            <h2 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Trao Đổi Cầu Thủ Giữa 2 Đội
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hai bên có thể gửi đề nghị đổi người. Nếu cả 2 đội trưởng nhấn "Không chỉnh sửa" hoặc hết 10 phút, hệ thống sẽ tự động chuyển tiếp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timer countdown badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-space font-black text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl animate-pulse">timer</span>
              <span>{formatTimer(timeLeftSec)}</span>
            </div>

            {/* Không chỉnh sửa Button for Captains / Admin */}
            {canTrade && (
              <Button
                variant={
                  (isCaptainA && captainAConfirmedNoTrade) || (isCaptainB && captainBConfirmedNoTrade)
                    ? 'emerald'
                    : 'secondary'
                }
                size="md"
                leftIcon="check_circle"
                isLoading={submittingConfirm}
                onClick={toggleNoTradeConfirmation}
              >
                {adminActive
                  ? 'Chốt: Không chỉnh sửa'
                  : (isCaptainA && captainAConfirmedNoTrade) || (isCaptainB && captainBConfirmedNoTrade)
                  ? 'Đã xác nhận Không chỉnh sửa (Hủy)'
                  : 'Nút: Không chỉnh sửa'}
              </Button>
            )}

            {adminActive && (
              <Button
                variant="primary"
                size="md"
                rightIcon="arrow_forward"
                onClick={onProceedToLineup}
              >
                Chốt sang Sa bàn
              </Button>
            )}
          </div>
        </div>

        {/* Captain confirmation indicators */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-space">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${captainAConfirmedNoTrade ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className="text-slate-600 dark:text-slate-400">
                Đội trưởng {TEAM_A_NAME}: <strong>{captainAConfirmedNoTrade ? 'Đã xác nhận Không chỉnh sửa' : 'Chưa bấm'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${captainBConfirmedNoTrade ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className="text-slate-600 dark:text-slate-400">
                Đội trưởng {TEAM_B_NAME}: <strong>{captainBConfirmedNoTrade ? 'Đã xác nhận Không chỉnh sửa' : 'Chưa bấm'}</strong>
              </span>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-500 font-space">
            Đồng thuận: {consensusCount}/2
          </div>
        </div>
      </Card>

      {/* Propose Trade Card */}
      {canTrade && (
        <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">swap_horiz</span>
            Gửi Đề Nghị Trao Đổi Cầu Thủ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Player from my team */}
            <div>
              <Select
                label="Cầu thủ đội mình muốn đổi đi"
                placeholder="Chọn cầu thủ bên mình..."
                value={selectedMyPlayerId}
                onChange={(e) => setSelectedMyPlayerId(e.target.value)}
                options={myPlayerOptions}
              />
            </div>

            {/* Player from opponent team */}
            <div>
              <Select
                label="Cầu thủ đối phương muốn nhận về"
                placeholder="Chọn cầu thủ đối phương..."
                value={selectedTargetPlayerId}
                onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
                options={targetPlayerOptions}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon="send"
            isLoading={submittingTrade}
            onClick={handleProposeTrade}
          >
            Gửi Đề Nghị Đổi Cầu Thủ
          </Button>
        </Card>
      )}

      {/* Pending Trade Requests */}
      <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">pending_actions</span>
          Đề Nghị Đang Chờ Phản Hồi ({pendingTrades.length})
        </h3>

        {pendingTrades.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400 italic">
            Chưa có đề nghị chuyển nhượng nào đang chờ
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingTrades.map((t) => {
              const isSender = t.requestedBy.id === user?.id;
              const canRespond = adminActive || (!isSender && (isCaptainA || isCaptainB));

              return (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-space">
                      <span className="font-bold text-rose-500">{t.playerOffered.fullName}</span>
                      <span className="material-symbols-outlined text-sm text-slate-400">swap_horiz</span>
                      <span className="font-bold text-blue-500">{t.playerWanted.fullName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-space">
                      (Đề nghị bởi: {t.requestedBy.fullName})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {canRespond && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon="check"
                          onClick={() => handleRespond(t.id, true)}
                        >
                          Đồng ý
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon="close"
                          onClick={() => handleRespond(t.id, false)}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                    {isSender && (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon="cancel"
                        onClick={() => handleCancel(t.id)}
                      >
                        Hủy yêu cầu
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Roster Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team A */}
        <Card elevation="level1" className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: TEAM_A_COLOR }} />
              <h4 className="font-space font-bold text-sm text-slate-900 dark:text-white">
                {TEAM_A_NAME} ({teamAPlayers.length} người)
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {teamAPlayers.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs font-space border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.user.fullName}</span>
                </div>
                {p.isHost && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Team B */}
        <Card elevation="level1" className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: TEAM_B_COLOR }} />
              <h4 className="font-space font-bold text-sm text-slate-900 dark:text-white">
                {TEAM_B_NAME} ({teamBPlayers.length} người)
              </h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {teamBPlayers.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs font-space border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.user.fullName}</span>
                </div>
                {p.isHost && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
