import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Match, MatchParticipant, Team, User } from '../../types';
import { TeamColumn } from './TeamColumn';
import { PlayerPickCard } from './PlayerPickCard';
import { Button, Badge, Avatar, Card } from '../../ui';
import { SpinWheel } from '../spin/SpinWheel';
import { spinService } from '../../services/spinService';
import { matchService } from '../../services/matchService';
import { pickService } from '../../services/pickService';
import { useAuthStore } from '../../store/authStore';
import { useWebSocketStore } from '../../store/websocketStore';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import toast from 'react-hot-toast';
import spainJerseyImg from '../../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../../assets/ao_dau/phap.webp';

interface PickListProps {
  matchId?: string;
  match?: Match | null;
  participants: MatchParticipant[];
  canPick: boolean;
  onPick: (userId: string, team: Team) => void;
  onReset: (userId: string) => void;
  onMatchUpdate?: () => void;
  onProceedToTrade?: () => void;
}

export const PickList: React.FC<PickListProps> = ({
  matchId,
  match,
  participants,
  canPick,
  onPick,
  onReset,
  onMatchUpdate,
  onProceedToTrade,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinWinner, setSpinWinner] = useState<User | null>(null);
  const [spinCompletedWinner, setSpinCompletedWinner] = useState<User | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(60);
  const [submittingProceed, setSubmittingProceed] = useState(false);
  const [submittingReady, setSubmittingReady] = useState(false);
  const [submittingOddDecision, setSubmittingOddDecision] = useState(false);

  // 3s Countdown state between consensus and spin
  const [countdown3s, setCountdown3s] = useState<number | null>(null);
  const [hasStarted3s, setHasStarted3s] = useState(false);

  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();
  const subscribe = useWebSocketStore((state) => state.subscribe);

  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');
  const benchPlayers = participants.filter((p) => p.team === 'BENCH');
  const availablePlayers = participants.filter((p) => p.team === 'NONE' || !p.team);

  const captainAParticipant = participants.find((p) => p.isHost && p.team === 'A');
  const captainBParticipant = participants.find((p) => p.isHost && p.team === 'B');
  const captainA = captainAParticipant?.user;
  const captainB = captainBParticipant?.user;

  const isCaptainA = user?.id === captainA?.id;
  const isCaptainB = user?.id === captainB?.id;
  const isCaptain = isCaptainA || isCaptainB;

  // Consensus ready for current round
  const captainAReady = Boolean(match?.pickRoundCaptainAReady);
  const captainBReady = Boolean(match?.pickRoundCaptainBReady);
  const bothCaptainsReady = captainAReady && captainBReady;

  // Step completion consensus
  const captainAConfirmedProceed = Boolean(match?.captainAConfirmedProceed);
  const captainBConfirmedProceed = Boolean(match?.captainBConfirmedProceed);
  const consensusProceedCount = (captainAConfirmedProceed ? 1 : 0) + (captainBConfirmedProceed ? 1 : 0);
  const myConfirmedProceed = isCaptainA ? captainAConfirmedProceed : isCaptainB ? captainBConfirmedProceed : false;

  const currentRound = match?.currentPickRound || 1;
  const firstPickTeam: Team | null = (match?.firstPickTeam as Team) || null;
  const hasSpunForCurrentRound = Boolean(firstPickTeam);

  const roundFirstPickerDone = Boolean(match?.roundFirstPickerDone);
  const roundSecondPickerDone = Boolean(match?.roundSecondPickerDone);

  const isFinalOddPlayer = availablePlayers.length === 1;

  // Active turn team calculation:
  // If firstPickTeam is determined:
  // - First pick is firstPickTeam
  // - If roundFirstPickerDone is true, it is the other team
  const activeTurnTeam: Team = !firstPickTeam
    ? 'A'
    : !roundFirstPickerDone
    ? firstPickTeam
    : firstPickTeam === 'A'
    ? 'B'
    : 'A';

  const activeCaptainName =
    activeTurnTeam === 'A' ? captainA?.fullName || 'Đội A' : captainB?.fullName || 'Đội B';
  const activeTeamLabel = activeTurnTeam === 'A' ? TEAM_A_NAME : TEAM_B_NAME;

  // Phase: 3s Countdown when both captains are ready and round has not spun yet
  useEffect(() => {
    if (bothCaptainsReady && !hasSpunForCurrentRound && !hasStarted3s && !isSpinning && availablePlayers.length > 0) {
      setHasStarted3s(true);
      setCountdown3s(3);
    }
  }, [bothCaptainsReady, hasSpunForCurrentRound, hasStarted3s, isSpinning, availablePlayers.length]);

  // Handle 3s countdown tick
  useEffect(() => {
    if (countdown3s === null) return;
    if (countdown3s > 0) {
      const timer = setTimeout(() => {
        setCountdown3s((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown3s === 0) {
      setCountdown3s(null);
      // ONLY Admin or Captain A triggers the API to avoid race conditions and double spins
      if (adminActive || isCaptainA) {
        triggerRoundSpin();
      }
    }
  }, [countdown3s, adminActive, isCaptainA]);

  const triggerRoundSpin = async () => {
    if (!matchId) return;
    setIsSpinning(true);
    setShowSpinModal(true);
    try {
      const res = await spinService.spinRoundPick(matchId);
      if (res.success && res.data) {
        setSpinWinner(res.data.winner);
      }
    } catch (err: any) {
      setIsSpinning(false);
      setShowSpinModal(false);
      setHasStarted3s(false);
      toast.error(err.response?.data?.message || 'Không thể bắt đầu quay lượt chọn');
    }
  };

  // Synchronized 60s countdown calculation based on match.pickTurnStartedAt
  const hasTriggeredTimeoutSwapRef = useRef(false);
  useEffect(() => {
    if (!hasSpunForCurrentRound || availablePlayers.length === 0) {
      hasTriggeredTimeoutSwapRef.current = false;
      return;
    }

    const calculateRemaining = () => {
      if (!match?.pickTurnStartedAt) return 60;
      const started = new Date(match.pickTurnStartedAt).getTime();
      const now = Date.now();
      const elapsedSec = Math.max(0, Math.floor((now - started) / 1000));
      return Math.max(0, 60 - elapsedSec);
    };

    const initial = calculateRemaining();
    setTimeLeftSec(initial);

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeftSec(remaining);

      // Auto trigger timeout swap if 60s expires and first picker hasn't picked yet
      if (remaining <= 0 && !roundFirstPickerDone && !hasTriggeredTimeoutSwapRef.current && matchId) {
        hasTriggeredTimeoutSwapRef.current = true;
        handleTimeoutSwap();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasSpunForCurrentRound, match?.pickTurnStartedAt, availablePlayers.length, roundFirstPickerDone, matchId]);

  const handleTimeoutSwap = async () => {
    if (!matchId) return;
    try {
      const res = await pickService.pickTimeoutSwap(matchId);
      if (res.success) {
        toast.error('Hết 60 giây! Quyền chọn trước đã được chuyển giao cho đội đối phương.');
        onMatchUpdate?.();
      }
    } catch {
      // Ignored
    }
  };

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!matchId) return;

    const unsubSpin = subscribe(`/topic/match/${matchId}/spin`, (session: any) => {
      if (session && session.winner) {
        setSpinWinner(session.winner);
        setSpinCompletedWinner(null);
        setShowSpinModal(true);
        setIsSpinning(true);
      }
    });

    const unsubPick = subscribe(`/topic/match/${matchId}/pick`, () => {
      onMatchUpdate?.();
    });

    return () => {
      unsubSpin();
      unsubPick();
    };
  }, [matchId, subscribe, onMatchUpdate]);

  const handleSpinComplete = (wonUser?: User | null) => {
    setIsSpinning(false);
    const resolvedWinner = wonUser || spinWinner || match?.spinSession?.winner;
    if (resolvedWinner) {
      setSpinCompletedWinner(resolvedWinner);
      const wonTeam: Team = resolvedWinner.id === captainB?.id ? 'B' : 'A';
      toast.success(`${resolvedWinner.fullName} (Đội ${wonTeam === 'A' ? TEAM_A_NAME : TEAM_B_NAME}) giành quyền chọn trước trong lượt này!`);
    }

    // Always auto-dismiss the modal 2.5s after spin completes
    setTimeout(() => {
      setShowSpinModal(false);
      setSpinWinner(null);
      setSpinCompletedWinner(null);
      setHasStarted3s(false);
      onMatchUpdate?.();
    }, 2500);
  };

  // Safety fallback: if spin modal remains open for >12s, auto close it
  useEffect(() => {
    if (!showSpinModal) return;
    const safetyTimer = setTimeout(() => {
      setShowSpinModal(false);
      setIsSpinning(false);
      setSpinWinner(null);
      setSpinCompletedWinner(null);
      setHasStarted3s(false);
    }, 12000);
    return () => clearTimeout(safetyTimer);
  }, [showSpinModal]);

  const handleToggleReady = async () => {
    if (!matchId) return;
    setSubmittingReady(true);
    try {
      const res = await pickService.confirmPickRoundReady(matchId);
      if (res.success) {
        toast.success('Đã cập nhật trạng thái sẵn sàng cho lượt quay');
        onMatchUpdate?.();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xác nhận sẵn sàng');
    } finally {
      setSubmittingReady(false);
    }
  };

  const handleOddPlayerDecision = async (decision: 'ACCEPT' | 'BENCH') => {
    if (!matchId) return;
    setSubmittingOddDecision(true);
    try {
      const res = await pickService.finalOddDecision(matchId, decision);
      if (res.success) {
        toast.success(decision === 'ACCEPT' ? 'Đã tiếp nhận cầu thủ vào đội hình' : 'Đã chuyển cầu thủ vào danh sách dự bị');
        onMatchUpdate?.();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xử lý quyết định');
    } finally {
      setSubmittingOddDecision(false);
    }
  };

  const handleConfirmProceed = async () => {
    if (!matchId) return;
    setSubmittingProceed(true);
    try {
      const res = await matchService.confirmProceedToTrade(matchId);
      if (res.success) {
        toast.success(
          adminActive
            ? 'Quản trị viên đã duyệt chuyển sang bước Trao đổi'
            : myConfirmedProceed
            ? 'Đã hủy xác nhận chuyển bước'
            : 'Đã xác nhận chuyển bước! Đang đợi đội trưởng còn lại...'
        );
        onMatchUpdate?.();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xác nhận chuyển bước');
    } finally {
      setSubmittingProceed(false);
    }
  };

  // Determine authorized pick buttons (không giới hạn số người mỗi đội)
  const canPickTeamA =
    canPick &&
    hasSpunForCurrentRound &&
    activeTurnTeam === 'A' &&
    (adminActive || isCaptainA);

  const canPickTeamB =
    canPick &&
    hasSpunForCurrentRound &&
    activeTurnTeam === 'B' &&
    (adminActive || isCaptainB);

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Live Spectator Banner */}
      {!adminActive && !isCaptain && (
        <div className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-space flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chế độ xem trực tiếp • Đang đồng bộ thời gian thực vòng quay & lượt chọn cầu thủ</span>
          </span>
          <Badge variant="live" size="sm" dot>Trực tiếp</Badge>
        </div>
      )}

      {/* Step Header */}
      <Card elevation="glass" glow className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" dot size="sm">
                Bước 3: CHỌN NGƯỜI
              </Badge>
              <span className="text-xs text-slate-500 font-space">Quay vòng quay may mắn từng lượt • Thời gian chọn 60 giây</span>
            </div>
            <h2 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Lựa Chọn Cầu Thủ Vào Đội Hình
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ở mỗi lượt chọn, hai đội trưởng bấm sẵn sàng để quay bốc thăm quyền ưu tiên. Đội trúng quay có 60 giây để chọn trước.
            </p>
          </div>
        </div>
      </Card>

      {/* 3s Countdown Overlay before Wheel Spin */}
      {countdown3s !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="text-slate-400 font-space text-lg font-bold uppercase tracking-widest mb-4">
            Chuẩn bị quay vòng quay lượt #{currentRound}
          </div>
          <div className="text-8xl sm:text-9xl font-black font-space text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 animate-pulse scale-110">
            {countdown3s}
          </div>
          <p className="text-slate-300 font-space text-sm mt-6">
            Đang khởi động vòng quay may mắn...
          </p>
        </div>
      )}

      {/* Arena Hub */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl p-5 sm:p-7 text-white">
        <div className="absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-red-600/20 via-rose-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-blue-600/20 via-sky-600/5 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* ĐỘI A (TÂY BAN NHA) */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
              hasSpunForCurrentRound && activeTurnTeam === 'A'
                ? 'bg-rose-950/70 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.35)] ring-2 ring-rose-500/60'
                : 'bg-slate-900/60 border-slate-800/80 opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={spainJerseyImg}
                  alt="Áo đấu Tây Ban Nha"
                  className="w-7 h-7 object-contain filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]"
                />
                <span className="text-xs font-space font-black tracking-wider uppercase text-rose-400">
                  {TEAM_A_NAME} (Đỏ)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {teamAPlayers.length} Cầu thủ
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              {captainA ? (
                <Avatar name={captainA.fullName} src={captainA.avatarUrl} jerseyNumber={captainA.jerseyNumber} size="lg" showNumber />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-space font-black text-base text-white truncate">
                    {captainA?.fullName || 'Chưa có Đội trưởng'}
                  </h4>
                  {captainA && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
                </div>
                <p className="text-xs text-rose-300/70 font-mono mt-0.5">
                  {captainA ? `@${captainA.username}` : ''}
                </p>
              </div>
            </div>

            {/* Turn status indicator for Team A */}
            <div className="pt-2 border-t border-rose-500/20">
              {hasSpunForCurrentRound ? (
                activeTurnTeam === 'A' ? (
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="flex items-center gap-1.5 font-black text-rose-300 animate-pulse">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      Đang đến lượt chọn!
                    </span>
                    {isCaptainA && (
                      <span className="text-amber-400 font-bold underline">
                        Lượt chọn của bạn
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-space">
                    Đang đợi Đội {TEAM_B_NAME} chọn...
                  </span>
                )
              ) : (
                <div className="flex items-center justify-between text-xs font-space">
                  <span className="text-slate-400">Trạng thái sẵn sàng:</span>
                  <span className={`font-bold flex items-center gap-1 ${captainAReady ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-sm">{captainAReady ? 'check_circle' : 'schedule'}</span>
                    {captainAReady ? 'Đã sẵn sàng' : 'Chưa sẵn sàng'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ARENA CENTER (VS HUB, TIMER & SPIN TRIGGER) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center px-2 py-2">
            {availablePlayers.length === 0 ? (
              /* All players picked -> Consensus proceed to Trade */
              <div className="flex flex-col items-center gap-3 w-full p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl">task_alt</span>
                  <h4 className="font-space font-black text-base text-white">
                    Đã hoàn thành chọn người
                  </h4>
                </div>
                <p className="text-xs text-slate-300 font-space leading-relaxed">
                  Cần cả hai Đội trưởng bấm xác nhận đồng thuận (2/2) để chuyển sang bước Trao đổi.
                </p>
                <div className="text-xs font-bold text-amber-400 font-space">
                  Đồng thuận: {consensusProceedCount}/2
                </div>
                {(adminActive || isCaptain) && (
                  <Button
                    variant={myConfirmedProceed ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon="check_circle"
                    isLoading={submittingProceed}
                    onClick={handleConfirmProceed}
                    className="w-full font-space font-bold"
                  >
                    {adminActive
                      ? 'Quản trị viên chốt chuyển bước Trao đổi'
                      : myConfirmedProceed
                      ? 'Đã xác nhận (Bấm để hủy)'
                      : 'Xác nhận hoàn thành chọn người'}
                  </Button>
                )}
              </div>
            ) : !hasSpunForCurrentRound ? (
              /* Before Spin of this round: Consensus ready buttons */
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-space font-black tracking-wider uppercase">
                  <span>LƯỢT #{currentRound}</span>
                  <span>•</span>
                  <span>CÒN {availablePlayers.length} CẦU THỦ</span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <span className="material-symbols-outlined text-2xl animate-spin">rotate_right</span>
                </div>

                <div>
                  <h4 className="font-space font-black text-base text-white">
                    Bốc Thăm Quyền Chọn Lượt #{currentRound}
                  </h4>
                  <p className="text-xs text-slate-400 font-space mt-0.5 max-w-xs mx-auto">
                    Cả hai đội trưởng bấm "Sẵn sàng" để tự động kích hoạt vòng quay may mắn
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs font-space text-slate-300">
                  <span>Đồng thuận: {(captainAReady ? 1 : 0) + (captainBReady ? 1 : 0)}/2</span>
                </div>

                {isCaptain && (
                  <Button
                    variant={((isCaptainA && captainAReady) || (isCaptainB && captainBReady)) ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon="check_circle"
                    isLoading={submittingReady}
                    onClick={handleToggleReady}
                    className="w-full max-w-xs font-space font-bold shadow-lg"
                  >
                    {((isCaptainA && captainAReady) || (isCaptainB && captainBReady))
                      ? 'Đã sẵn sàng (Bấm để hủy)'
                      : `Sẵn sàng quay lượt #${currentRound}`}
                  </Button>
                )}

                {adminActive && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon="admin_panel_settings"
                    isLoading={submittingReady}
                    onClick={handleToggleReady}
                  >
                    Quản trị viên kích hoạt sẵn sàng cả hai bên
                  </Button>
                )}

                {!isCaptain && !adminActive && (
                  <div className="text-xs font-space text-slate-400 italic">
                    Đang đợi hai Đội trưởng bấm sẵn sàng để quay vòng quay...
                  </div>
                )}
              </div>
            ) : (
              /* After Spin of this round: Active timer and turn direction */
              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-space font-black tracking-wider uppercase">
                  <span>LƯỢT #{currentRound}</span>
                  <span>•</span>
                  <span>CÒN {availablePlayers.length} CẦU THỦ</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-space font-extrabold uppercase tracking-wide">
                  {activeTurnTeam === 'A' ? (
                    <span className="flex items-center gap-1 text-rose-400 animate-pulse">
                      <span className="material-symbols-outlined text-lg">arrow_back</span>
                      Đang chọn: {activeCaptainName} (Đội A)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-400 animate-pulse">
                      Đang chọn: {activeCaptainName} (Đội B)
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </span>
                  )}
                </div>

                {/* 60s Synchronized Timer */}
                <div
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border font-space font-black text-2xl transition-all shadow-lg ${
                    timeLeftSec <= 15
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-rose-500/30 animate-pulse'
                      : 'bg-slate-900 text-amber-400 border-amber-500/40 shadow-amber-500/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl animate-spin" style={{ animationDuration: '4s' }}>
                    timer
                  </span>
                  <span>{timeLeftSec}s</span>
                </div>

                {timeLeftSec === 0 && (
                  <p className="text-[11px] font-space text-rose-400 animate-pulse">
                    Đã hết 60 giây! Quyền chọn đang được xử lý hoán đổi
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ĐỘI B (PHÁP) */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
              hasSpunForCurrentRound && activeTurnTeam === 'B'
                ? 'bg-blue-950/70 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/60'
                : 'bg-slate-900/60 border-slate-800/80 opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={franceJerseyImg}
                  alt="Áo đấu Pháp"
                  className="w-7 h-7 object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
                />
                <span className="text-xs font-space font-black tracking-wider uppercase text-blue-400">
                  {TEAM_B_NAME} (Xanh)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {teamBPlayers.length} Cầu thủ
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              {captainB ? (
                <Avatar name={captainB.fullName} src={captainB.avatarUrl} jerseyNumber={captainB.jerseyNumber} size="lg" showNumber />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-space font-black text-base text-white truncate">
                    {captainB?.fullName || 'Chưa có Đội trưởng'}
                  </h4>
                  {captainB && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
                </div>
                <p className="text-xs text-blue-300/70 font-mono mt-0.5">
                  {captainB ? `@${captainB.username}` : ''}
                </p>
              </div>
            </div>

            {/* Turn status indicator for Team B */}
            <div className="pt-2 border-t border-blue-500/20">
              {hasSpunForCurrentRound ? (
                activeTurnTeam === 'B' ? (
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="flex items-center gap-1.5 font-black text-blue-300 animate-pulse">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      Đang đến lượt chọn!
                    </span>
                    {isCaptainB && (
                      <span className="text-amber-400 font-bold underline">
                        Lượt chọn của bạn
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-space">
                    Đang đợi Đội {TEAM_A_NAME} chọn...
                  </span>
                )
              ) : (
                <div className="flex items-center justify-between text-xs font-space">
                  <span className="text-slate-400">Trạng thái sẵn sàng:</span>
                  <span className={`font-bold flex items-center gap-1 ${captainBReady ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-sm">{captainBReady ? 'check_circle' : 'schedule'}</span>
                    {captainBReady ? 'Đã sẵn sàng' : 'Chưa sẵn sàng'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL ODD PLAYER DECISION CARD (Khi chỉ còn 1 cầu thủ lẻ cuối cùng) */}
      {isFinalOddPlayer && hasSpunForCurrentRound && (
        <Card elevation="glass" glow className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/40 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">sports_score</span>
            </div>
            <div>
              <span className="text-xs font-space font-bold uppercase text-amber-500 tracking-wider">
                Tình huống đặc biệt
              </span>
              <h3 className="font-space font-black text-xl text-white mt-1">
                Quyết Định Cầu Thủ Lẻ Cuối Cùng
              </h3>
              <p className="text-xs text-slate-300 font-space mt-1">
                Chỉ còn duy nhất một cầu thủ trong danh sách. Đội trưởng thắng vòng quay ({activeCaptainName}) có quyền lựa chọn tiếp nhận vào đội hình hoặc chuyển vào danh sách dự bị.
              </p>
            </div>

            {/* Display Odd Player Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex items-center gap-4 w-full max-w-sm justify-center">
              <Avatar
                name={availablePlayers[0].user.fullName}
                src={availablePlayers[0].user.avatarUrl}
                jerseyNumber={availablePlayers[0].user.jerseyNumber}
                size="md"
                showNumber
              />
              <div className="text-left">
                <div className="font-space font-bold text-sm text-white">
                  {availablePlayers[0].user.fullName}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {availablePlayers[0].user.jerseyNumber ? `Số áo ${availablePlayers[0].user.jerseyNumber}` : `@${availablePlayers[0].user.username}`}
                </div>
              </div>
            </div>

            {(adminActive || (activeTurnTeam === 'A' ? isCaptainA : isCaptainB)) && (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="person_add"
                  isLoading={submittingOddDecision}
                  onClick={() => handleOddPlayerDecision('ACCEPT')}
                >
                  Tiếp nhận vào đội hình
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon="chair"
                  isLoading={submittingOddDecision}
                  onClick={() => handleOddPlayerDecision('BENCH')}
                >
                  Chuyển vào danh sách dự bị
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 2 TEAM SQUAD COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamColumn
          team="A"
          players={teamAPlayers}
          canPick={canPick}
          onResetPlayer={onReset}
        />
        <TeamColumn
          team="B"
          players={teamBPlayers}
          canPick={canPick}
          onResetPlayer={onReset}
        />
      </div>

      {/* AVAILABLE PLAYERS POOL */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="font-space font-black text-lg text-slate-900 dark:text-white">
              Danh Sách Chờ Chọn ({availablePlayers.length})
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {hasSpunForCurrentRound
                ? `Thời gian mỗi lượt: 60s • Đang là lượt chọn của Đội ${activeTurnTeam} (${activeCaptainName})`
                : 'Cần bấm sẵn sàng để quay vòng quay may mắn trước khi chọn người'}
            </p>
          </div>

          {hasSpunForCurrentRound && canPick && (
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-space font-bold border flex items-center gap-2 ${
                activeTurnTeam === 'A'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeTurnTeam === 'A' ? TEAM_A_COLOR : TEAM_B_COLOR }} />
              Đang trong lượt: Đội {activeTurnTeam} ({activeTeamLabel})
            </div>
          )}
        </div>

        {availablePlayers.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400 italic">
            Tất cả cầu thủ đã được phân bổ vào các đội hình thi đấu!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick && hasSpunForCurrentRound}
                canPickA={canPickTeamA}
                canPickB={canPickTeamB}
                canPickBench={adminActive}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onPickBench={() => onPick(p.user.id, 'BENCH')}
              />
            ))}
          </div>
        )}
      </div>

      {/* BENCH / RESERVES */}
      {benchPlayers.length > 0 && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-space font-black text-base text-slate-900 dark:text-slate-100">
              Danh Sách Dự Bị ({benchPlayers.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benchPlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick && hasSpunForCurrentRound}
                canPickA={canPickTeamA}
                canPickB={canPickTeamB}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onReset={() => onReset(p.user.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* REAL-TIME SYNCHRONIZED SPIN WHEEL MODAL */}
      {showSpinModal &&
        typeof document !== 'undefined' &&
        captainA &&
        captainB &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSpinModal(false);
                setIsSpinning(false);
              }
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center text-white"
            >
              {/* Manual close button */}
              <button
                type="button"
                onClick={() => {
                  setShowSpinModal(false);
                  setIsSpinning(false);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-30"
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-space font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">casino</span>
                Vòng Quay Lượt Chọn #{currentRound}
              </div>

              <h3 className="font-space font-black text-2xl sm:text-3xl text-white mb-1">
                BỐC THĂM QUYỀN CHỌN TRƯỚC
              </h3>
              <p className="text-xs text-slate-400 font-space mb-3">
                {captainA.fullName} ({TEAM_A_NAME}) so tài {captainB.fullName} ({TEAM_B_NAME})
              </p>

              <div className="py-2">
                <SpinWheel
                  hostA={captainA}
                  hostB={captainB}
                  winner={spinWinner}
                  durationMs={4500}
                  isSpinning={isSpinning}
                  onSpinComplete={handleSpinComplete}
                />
              </div>

              {spinCompletedWinner ? (
                <div className="mt-3 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 animate-in zoom-in duration-300">
                  <span className="text-xs font-space uppercase text-amber-400 font-black block mb-1">
                    KẾT QUẢ VÒNG QUAY LƯỢT #{currentRound}
                  </span>
                  <div className="font-space font-black text-xl text-white">
                    {spinCompletedWinner.fullName} (Đội {spinCompletedWinner.id === captainB.id ? TEAM_B_NAME : TEAM_A_NAME})
                  </div>
                  <p className="text-xs text-emerald-400 font-space font-bold mt-1">
                    GIÀNH QUYỀN CHỌN CẦU THỦ TRƯỚC TRONG LƯỢT NÀY!
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-2">
                    Lượt chọn 60 giây đang bắt đầu...
                  </p>
                </div>
              ) : (
                <p className="text-xs text-amber-300/80 font-space animate-pulse mt-2">
                  Đang quay... Cả hai bên đang cùng theo dõi trực tiếp!
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
