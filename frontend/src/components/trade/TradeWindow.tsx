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
  const [selectedDonatePlayerId, setSelectedDonatePlayerId] = useState<string>('');
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [submittingTrade, setSubmittingTrade] = useState(false);
  const [submittingDonate, setSubmittingDonate] = useState(false);
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
  const sizeDiff = Math.abs(teamAPlayers.length - teamBPlayers.length);

  const myParticipant = participants.find((p) => p.user.id === user?.id);
  const isCaptainA = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'A');
  const isCaptainB = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'B');
  const canTrade = adminActive || isCaptainA || isCaptainB;

  const myTeam = isCaptainA ? 'A' : isCaptainB ? 'B' : myParticipant?.team || 'A';
  const availableMyTeamPlayers = (myTeam === 'A' ? teamAPlayers : teamBPlayers).filter((p) => !p.isHost);
  const availableOpponentPlayers = (myTeam === 'A' ? teamBPlayers : teamAPlayers).filter((p) => !p.isHost);

  // Check if donating a player exceeds diff limit > 2
  const donateWillExceedLimit = () => {
    if (myTeam === 'A') {
      const newA = teamAPlayers.length - 1;
      const newB = teamBPlayers.length + 1;
      return Math.abs(newA - newB) > 2;
    } else {
      const newA = teamAPlayers.length + 1;
      const newB = teamBPlayers.length - 1;
      return Math.abs(newA - newB) > 2;
    }
  };

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
          toast.success('Hết thời gian chuyển nhượng 10 phút! Tự động chuyển sang Đội hình ra sân.', {
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
        toast.success('Đã gửi đề nghị trao đổi cầu thủ');
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

  const handleDonatePlayer = async () => {
    if (!selectedDonatePlayerId) {
      toast.error('Vui lòng chọn 1 cầu thủ bên mình để tặng sang đội bạn');
      return;
    }

    if (donateWillExceedLimit()) {
      toast.error('Không thể tặng cầu thủ: Chênh lệch sĩ số giữa hai đội không được vượt quá 2 người');
      return;
    }

    setSubmittingDonate(true);
    try {
      const res = await tradeService.donatePlayer(matchId, selectedDonatePlayerId);
      if (res.success) {
        toast.success('Đã chuyển nhượng tặng cầu thủ sang đội bạn thành công');
        setSelectedDonatePlayerId('');
        fetchTrades();
        onTradeCompleted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tặng cầu thủ');
    } finally {
      setSubmittingDonate(false);
    }
  };

  const handleRespond = async (tradeId: string, accept: boolean) => {
    try {
      const res = await tradeService.respondTrade(matchId, tradeId, accept);
      if (res.success) {
        toast.success(accept ? 'Đã chấp nhận đổi cầu thủ' : 'Đã từ chối đổi cầu thủ');
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
            ? 'Quản trị viên đã xác nhận: Hoàn tất chuyển nhượng'
            : myConfirmed
            ? 'Đã hủy xác nhận hoàn tất chuyển nhượng'
            : 'Đã xác nhận hoàn tất chuyển nhượng! Đang chờ đội trưởng còn lại...'
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
      {/* Banner cảnh báo màu vàng chuẩn quy định (Không emoji, có dấu, icon info) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl mt-0.5 shrink-0">
            info
          </span>
          <div className="space-y-1.5 text-sm">
            <h4 className="font-space font-bold text-base text-amber-950 dark:text-amber-300">
              Quy định chuyển nhượng và trao đổi cầu thủ
            </h4>
            <p className="leading-relaxed">
              Trong bước này, ngoài việc trao đổi cầu thủ một-đổi-một giữa hai đội, đội trưởng có thể lựa chọn <strong>tặng trực tiếp</strong> cầu thủ của đội mình sang đội bạn mà không cần nhận người về. Tuy nhiên, để đảm bảo tính cân bằng của trận đấu, <strong>sĩ số giữa hai đội tuyệt đối không được chênh lệch vượt quá 2 người</strong> sau mỗi lần chuyển nhượng. Hãy tính toán kỹ lưỡng đội hình trước khi xác nhận.
            </p>
          </div>
        </div>
      </div>

      {/* Spectator Live Banner for Non-captains and Non-admin */}
      {!canTrade && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-space">
          <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">visibility</span>
          <span>
            <strong>Chế độ theo dõi trực tiếp:</strong> Bạn đang theo dõi tiến trình thương lượng và chuyển nhượng cầu thủ giữa hai Đội trưởng theo thời gian thực (chỉ có quyền xem).
          </span>
        </div>
      )}

      {/* Header with Timer and Confirmation Status */}
      <Card elevation="glass" glow className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" dot size="sm">
                Bước 4: TRAO ĐỔI
              </Badge>
              <span className="text-xs text-slate-500 font-space">Thời gian trao đổi: 10 phút</span>
            </div>
            <h2 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Trao Đổi Cầu Thủ Giữa Hai Đội
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hai bên có thể gửi đề nghị đổi người hoặc tặng người trực tiếp. Nếu cả hai đội trưởng nhấn xác nhận hoặc hết 10 phút, hệ thống sẽ tự động chuyển sang bước tiếp theo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timer countdown badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-space font-black text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl animate-pulse">timer</span>
              <span>{formatTimer(timeLeftSec)}</span>
            </div>

            {/* Hoàn tất Button for Captains / Admin */}
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
                  ? 'Quản trị viên chốt hoàn tất'
                  : (isCaptainA && captainAConfirmedNoTrade) || (isCaptainB && captainBConfirmedNoTrade)
                  ? 'Đã xác nhận hoàn tất (Hủy)'
                  : 'Xác nhận hoàn tất trao đổi'}
              </Button>
            )}

            {adminActive && (
              <Button
                variant="primary"
                size="md"
                rightIcon="arrow_forward"
                onClick={onProceedToLineup}
              >
                Chuyển sang Đội hình ra sân
              </Button>
            )}
          </div>
        </div>

        {/* Headcount statistics & Captain confirmation indicators */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-space">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TEAM_A_COLOR }} />
              <span className="text-slate-700 dark:text-slate-300">
                {TEAM_A_NAME}: <strong>{teamAPlayers.length} người</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TEAM_B_COLOR }} />
              <span className="text-slate-700 dark:text-slate-300">
                {TEAM_B_NAME}: <strong>{teamBPlayers.length} người</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="material-symbols-outlined text-sm">scale</span>
              <span>
                Chênh lệch hiện tại: <strong>{sizeDiff} người</strong> (Giới hạn cho phép: tối đa 2)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${captainAConfirmedNoTrade ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className="text-slate-600 dark:text-slate-400">
                Đội {TEAM_A_NAME}: {captainAConfirmedNoTrade ? 'Đã chốt' : 'Chưa chốt'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${captainBConfirmedNoTrade ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className="text-slate-600 dark:text-slate-400">
                Đội {TEAM_B_NAME}: {captainBConfirmedNoTrade ? 'Đã chốt' : 'Chưa chốt'}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-500 font-space ml-2">
              Đồng thuận: {consensusCount}/2
            </div>
          </div>
        </div>
      </Card>

      {/* Trade Actions Section */}
      {canTrade && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Đổi người 1-1 */}
          <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">swap_horiz</span>
                Đổi Người Một-Đổi-Một (Giữ nguyên sĩ số)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Chọn một cầu thủ của đội mình và yêu cầu đổi lấy một cầu thủ của đội đối phương.
              </p>

              <div className="flex flex-col gap-3.5 mb-4">
                <Select
                  label="Cầu thủ đội mình muốn đổi đi"
                  placeholder="Chọn cầu thủ bên mình..."
                  value={selectedMyPlayerId}
                  onChange={(e) => setSelectedMyPlayerId(e.target.value)}
                  options={myPlayerOptions}
                />
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
              Gửi đề nghị đổi cầu thủ
            </Button>
          </Card>

          {/* Card 2: Tặng cầu thủ trực tiếp (Không cần nhận lại) */}
          <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-space font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500">forward</span>
                  Tặng Cầu Thủ (Chuyển nhượng một chiều)
                </h3>
                <Badge variant={donateWillExceedLimit() ? 'error' : 'success'} size="sm">
                  {donateWillExceedLimit() ? 'Bị khóa do quá chênh lệch' : 'Hợp lệ'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Chuyển trực tiếp một cầu thủ của đội mình sang đội bạn mà không cần nhận người về.
              </p>

              <div className="flex flex-col gap-3.5 mb-4">
                <Select
                  label="Chọn cầu thủ đội mình để tặng sang đội bạn"
                  placeholder="Chọn cầu thủ..."
                  value={selectedDonatePlayerId}
                  onChange={(e) => setSelectedDonatePlayerId(e.target.value)}
                  options={myPlayerOptions}
                />

                {donateWillExceedLimit() ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 font-space">
                    <span className="material-symbols-outlined text-base">warning</span>
                    <span>
                      Không thể tặng thêm cầu thủ: Sĩ số sẽ bị chênh lệch vượt quá 2 người.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 font-space">
                    <span className="material-symbols-outlined text-base text-indigo-400">info</span>
                    <span>
                      Sau khi tặng: Đội của bạn sẽ giảm 1 người, đội bạn sẽ tăng 1 người.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              leftIcon="forward"
              disabled={donateWillExceedLimit() || !selectedDonatePlayerId}
              isLoading={submittingDonate}
              onClick={handleDonatePlayer}
            >
              Xác nhận tặng cầu thủ sang đội bạn
            </Button>
          </Card>
        </div>
      )}

      {/* Pending Trade Requests */}
      <Card elevation="level1" className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">pending_actions</span>
          Đề Nghị Đang Chờ Phản Hồi ({pendingTrades.length})
        </h3>

        {pendingTrades.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400 italic">
            Chưa có đề nghị chuyển nhượng nào đang chờ duyệt
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
                      <span className="material-symbols-outlined text-sm text-slate-400">
                        {t.playerWanted ? 'swap_horiz' : 'forward'}
                      </span>
                      {t.playerWanted ? (
                        <span className="font-bold text-blue-500">{t.playerWanted.fullName}</span>
                      ) : (
                        <span className="font-bold text-indigo-400 italic">(Tặng trực tiếp)</span>
                      )}
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
                {p.isHost && (
                  <Badge variant="gold" size="sm">
                    Đội trưởng
                  </Badge>
                )}
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
                {p.isHost && (
                  <Badge variant="gold" size="sm">
                    Đội trưởng
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
