import React, { useEffect, useState } from 'react';
import { MatchParticipant, TradeRequest, User } from '../../types';
import { Card, Button, Badge, Avatar } from '../../ui';
import { tradeService } from '../../services/tradeService';
import { matchService } from '../../services/matchService';
import { useAuthStore } from '../../store/authStore';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import toast from 'react-hot-toast';

interface TradeWindowProps {
  matchId: string;
  participants: MatchParticipant[];
  onTradeCompleted: () => void;
  onProceedToLineup: () => void;
}

export const TradeWindow: React.FC<TradeWindowProps> = ({
  matchId,
  participants,
  onTradeCompleted,
  onProceedToLineup,
}) => {
  const [trades, setTrades] = useState<TradeRequest[]>([]);
  const [selectedMyPlayerId, setSelectedMyPlayerId] = useState<string>('');
  const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string>('');
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [submittingTrade, setSubmittingTrade] = useState(false);
  const [timeLeftSec, setTimeLeftSec] = useState(600); // 10 minutes

  const { user, isAdmin } = useAuthStore();

  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');

  const myParticipant = participants.find((p) => p.user.id === user?.id);
  const isCaptainA = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'A');
  const isCaptainB = participants.some((p) => p.user.id === user?.id && p.isHost && p.team === 'B');
  const canTrade = isAdmin() || isCaptainA || isCaptainB;

  const myTeam = isCaptainA ? 'A' : isCaptainB ? 'B' : myParticipant?.team || 'A';
  const availableMyTeamPlayers = (myTeam === 'A' ? teamAPlayers : teamBPlayers).filter((p) => !p.isHost);
  const availableOpponentPlayers = (myTeam === 'A' ? teamBPlayers : teamAPlayers).filter((p) => !p.isHost);

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

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const pendingTrades = trades.filter((t) => t.status === 'PENDING');
  const pastTrades = trades.filter((t) => t.status !== 'PENDING');

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto font-sans">
      {/* Header with Timer */}
      <Card elevation="glass" glow className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" dot size="sm">
                Bước 4: Chuyển Nhượng (Trade Window)
              </Badge>
              <span className="text-xs text-slate-400 font-space">Thời gian có hạn: 10 phút</span>
            </div>
            <h2 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Trao Đổi Cầu Thủ Giữa 2 Đội
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hai đội trưởng có thể đề nghị trao đổi 1-1 trước khi bước vào xếp sơ đồ sa bàn.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer countdown badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-space font-black text-xl">
              <span className="material-symbols-outlined text-2xl animate-pulse">timer</span>
              <span>{formatTimer(timeLeftSec)}</span>
            </div>

            {(isAdmin() || isCaptainA || isCaptainB) && (
              <Button
                variant="primary"
                size="md"
                rightIcon="arrow_forward"
                onClick={onProceedToLineup}
              >
                Chốt đội hình & Sang Sa bàn
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Propose Trade Card */}
      {canTrade && (
        <Card elevation="level1" className="p-5 sm:p-6">
          <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">swap_horiz</span>
            Gửi Đề Nghị Trao Đổi Cầu Thủ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Player from my team */}
            <div>
              <label className="block text-xs font-space font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Cầu thủ đội mình muốn đổi đi:
              </label>
              <select
                value={selectedMyPlayerId}
                onChange={(e) => setSelectedMyPlayerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-space text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Chọn cầu thủ bên mình --</option>
                {availableMyTeamPlayers.map((p) => (
                  <option key={p.user.id} value={p.user.id}>
                    {p.user.fullName} (#{p.user.jerseyNumber || '—'})
                  </option>
                ))}
              </select>
            </div>

            {/* Player from opponent team */}
            <div>
              <label className="block text-xs font-space font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Cầu thủ đối phương muốn nhận về:
              </label>
              <select
                value={selectedTargetPlayerId}
                onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-space text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Chọn cầu thủ đối phương --</option>
                {availableOpponentPlayers.map((p) => (
                  <option key={p.user.id} value={p.user.id}>
                    {p.user.fullName} (#{p.user.jerseyNumber || '—'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon="send"
            isLoading={submittingTrade}
            onClick={handleProposeTrade}
          >
            Gửi Đề Nghị Đổi
          </Button>
        </Card>
      )}

      {/* Pending Trade Requests */}
      <Card elevation="level1" className="p-5 sm:p-6">
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
              const canRespond = isAdmin() || (!isSender && (isCaptainA || isCaptainB));

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
        <Card elevation="level1" className="p-4 sm:p-5">
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
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs font-space">
                <div className="flex items-center gap-2">
                  <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.user.fullName}</span>
                </div>
                {p.isHost && <Badge variant="gold" size="sm">C</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Team B */}
        <Card elevation="level1" className="p-4 sm:p-5">
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
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs font-space">
                <div className="flex items-center gap-2">
                  <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.user.fullName}</span>
                </div>
                {p.isHost && <Badge variant="gold" size="sm">C</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
