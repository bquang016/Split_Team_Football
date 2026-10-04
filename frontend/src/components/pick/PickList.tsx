import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Match, MatchParticipant, Team, User } from '../../types';
import { TeamColumn } from './TeamColumn';
import { PlayerPickCard } from './PlayerPickCard';
import { Button, Badge, Avatar } from '../../ui';
import { SpinWheel } from '../spin/SpinWheel';
import { spinService } from '../../services/spinService';
import { matchService } from '../../services/matchService';
import { useAuthStore } from '../../store/authStore';
import { useWebSocketStore } from '../../store/websocketStore';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import toast from 'react-hot-toast';

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

  const captainAConfirmed = Boolean(match?.captainAConfirmedProceed);
  const captainBConfirmed = Boolean(match?.captainBConfirmedProceed);
  const consensusCount = (captainAConfirmed ? 1 : 0) + (captainBConfirmed ? 1 : 0);

  const canConfirmProceed = adminActive || isCaptainA || isCaptainB;
  const myConfirmed = isCaptainA ? captainAConfirmed : isCaptainB ? captainBConfirmed : false;

  const handleConfirmProceed = async () => {
    if (!matchId) return;
    setSubmittingProceed(true);
    try {
      const res = await matchService.confirmProceedToTrade(matchId);
      if (res.success) {
        toast.success(
          adminActive
            ? 'Quản trị viên đã duyệt chuyển sang bước Chỉnh sửa (Trade)!'
            : myConfirmed
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

  // Turn calculation:
  // Count non-host players already picked to each team
  const pickedNonHostA = teamAPlayers.filter((p) => !p.isHost).length;
  const pickedNonHostB = teamBPlayers.filter((p) => !p.isHost).length;
  const totalPicked = pickedNonHostA + pickedNonHostB;

  const firstPickTeam: Team | null = (match?.firstPickTeam as Team) || null;
  const hasDeterminedFirstTurn = Boolean(firstPickTeam);

  // Deterministic turn computation:
  // Round 0 (totalPicked=0) -> firstPickTeam
  // Round 1 (totalPicked=1) -> other team
  // Round 2 (totalPicked=2) -> firstPickTeam...
  const activeTurnTeam: Team = !firstPickTeam
    ? 'A'
    : totalPicked % 2 === 0
    ? firstPickTeam
    : firstPickTeam === 'A'
    ? 'B'
    : 'A';

  const currentRound = Math.floor(totalPicked / 2) + 1;
  const isFinalOddPlayer = availablePlayers.length === 1;

  // Synchronized 60s countdown calculation based on match.pickTurnStartedAt
  useEffect(() => {
    if (!hasDeterminedFirstTurn || availablePlayers.length === 0) {
      return;
    }

    const calculateRemaining = () => {
      if (!match?.pickTurnStartedAt) return 60;
      const started = new Date(match.pickTurnStartedAt).getTime();
      const now = Date.now();
      const elapsedSec = Math.max(0, Math.floor((now - started) / 1000));
      return Math.max(0, 60 - elapsedSec);
    };

    setTimeLeftSec(calculateRemaining());

    const interval = setInterval(() => {
      setTimeLeftSec(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [hasDeterminedFirstTurn, match?.pickTurnStartedAt, availablePlayers.length]);

  // WebSocket Subscription to synchronize spin & pick events across both captains' screens
  useEffect(() => {
    if (!matchId) return;

    // Listen for spin broadcast event
    const unsubSpin = subscribe(`/topic/match/${matchId}/spin`, (session: any) => {
      if (session && session.winner) {
        setSpinWinner(session.winner);
        setSpinCompletedWinner(null);
        setShowSpinModal(true);
        setIsSpinning(true);
      }
    });

    // Listen for pick broadcast event
    const unsubPick = subscribe(`/topic/match/${matchId}/pick`, () => {
      onMatchUpdate?.();
    });

    return () => {
      unsubSpin();
      unsubPick();
    };
  }, [matchId, subscribe, onMatchUpdate]);

  // Handle spin for who picks first
  const handleSpinTurn = async () => {
    if (!matchId) return;
    if (!captainA || !captainB) {
      toast.error('Cần có đủ 2 đội trưởng để quay lượt');
      return;
    }

    try {
      setIsSpinning(true);
      const res = await spinService.spinRoundPick(matchId);
      if (res.success && res.data) {
        setSpinWinner(res.data.winner);
        setShowSpinModal(true);
      }
    } catch (err: any) {
      setIsSpinning(false);
      setShowSpinModal(false);
      toast.error(err.response?.data?.message || 'Không thể bắt đầu quay lượt');
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    if (spinWinner) {
      setSpinCompletedWinner(spinWinner);
      const wonTeam: Team = spinWinner.id === captainB?.id ? 'B' : 'A';
      toast.success(`🎉 ${spinWinner.fullName} (Đội ${wonTeam === 'A' ? TEAM_A_NAME : TEAM_B_NAME}) giành lượt pick trước!`);

      // Auto close spin modal after 2.5 seconds to start the battle
      setTimeout(() => {
        setShowSpinModal(false);
        setSpinWinner(null);
        setSpinCompletedWinner(null);
        onMatchUpdate?.();
      }, 2500);
    }
  };

  const handlePickPlayer = (userId: string, team: Team) => {
    onPick(userId, team);
  };

  const activeCaptainName =
    activeTurnTeam === 'A'
      ? captainA?.fullName || 'Đội A'
      : captainB?.fullName || 'Đội B';
  const activeTeamLabel = activeTurnTeam === 'A' ? TEAM_A_NAME : TEAM_B_NAME;

  // Determine authorized pick buttons
  const canPickTeamA =
    canPick &&
    hasDeterminedFirstTurn &&
    activeTurnTeam === 'A' &&
    (adminActive || isCaptainA) &&
    teamAPlayers.length < 7;

  const canPickTeamB =
    canPick &&
    hasDeterminedFirstTurn &&
    activeTurnTeam === 'B' &&
    (adminActive || isCaptainB) &&
    teamBPlayers.length < 7;

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-900 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* 2 FACTIONS RIVALRY ARENA (ĐẠI CHIẾN 2 PHÁI TÂY BAN NHA VS PHÁP) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl p-5 sm:p-7 text-white">
        {/* Ambient Glowing Faction Background Gradients */}
        <div className="absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-red-600/20 via-rose-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-blue-600/20 via-sky-600/5 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* ------------------------------------------------------------- */}
          {/* PHÁI ĐỎ: ĐỘI A (TÂY BAN NHA) */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
              hasDeterminedFirstTurn && activeTurnTeam === 'A'
                ? 'bg-rose-950/70 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.35)] ring-2 ring-rose-500/60'
                : 'bg-slate-900/60 border-slate-800/80 opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                <span className="text-xs font-space font-black tracking-wider uppercase text-rose-400">
                  Phái Đỏ • {TEAM_A_NAME}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {teamAPlayers.length}/7 Cầu thủ
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              {captainA ? (
                <Avatar name={captainA.fullName} jerseyNumber={captainA.jerseyNumber} size="lg" showNumber />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-space font-black text-base text-white truncate">
                    {captainA?.fullName || 'Chưa chọn Đội trưởng'}
                  </h4>
                  {captainA && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
                </div>
                <p className="text-xs text-rose-300/70 font-mono mt-0.5">
                  {captainA ? `@${captainA.username}` : 'Đang đợi gán Captain'}
                </p>
              </div>
            </div>

            {/* Turn status indicator for Team A */}
            <div className="pt-2 border-t border-rose-500/20">
              {hasDeterminedFirstTurn ? (
                activeTurnTeam === 'A' ? (
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="flex items-center gap-1.5 font-black text-rose-300 animate-pulse">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      ĐANG ĐẾN LƯỢT CHỌN!
                    </span>
                    {isCaptainA && (
                      <span className="text-amber-400 font-bold underline animate-bounce">
                        👉 Lượt của bạn!
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-space">
                    Đang đợi Đội B chọn...
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-500 font-space italic">
                  Chờ phân định lượt đầu...
                </span>
              )}

              {firstPickTeam === 'A' && (
                <div className="mt-1 flex items-center gap-1 text-[11px] font-space font-bold text-amber-400">
                  <span className="material-symbols-outlined text-xs">military_tech</span>
                  Thắng Spin (Chọn trước)
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* BATTLE ARENA CENTER (VS HUB, TIMER & VÒNG QUAY TRIGGER) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center px-2 py-2">
            {!hasDeterminedFirstTurn ? (
              /* Before Spin: Prominent Spin Button visible to both sides */
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-14 h-14 rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <span className="material-symbols-outlined text-3xl animate-bounce">casino</span>
                </div>
                <div>
                  <h3 className="font-space font-black text-lg text-white">
                    CHƯA PHÂN ĐỊNH LƯỢT ĐẦU
                  </h3>
                  <p className="text-xs text-slate-400 font-space mt-0.5 max-w-xs mx-auto">
                    Hai bên bấm nút dưới để quay vòng quay xác định đội nào được chọn người trước
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  leftIcon="casino"
                  isLoading={isSpinning}
                  disabled={!captainA || !captainB || (!adminActive && !isCaptainA && !isCaptainB)}
                  onClick={handleSpinTurn}
                  className="font-space font-black tracking-wide shadow-xl shadow-amber-500/30 px-6 py-3 cursor-pointer"
                >
                  Quay Vòng Quay Lượt Đầu
                </Button>

                {!adminActive && !isCaptainA && !isCaptainB && (
                  <span className="text-[11px] text-slate-500 font-mono italic">
                    (Chờ 2 Đội trưởng hoặc Admin bấm quay)
                  </span>
                )}
              </div>
            ) : (
              /* After Spin: Dynamic VS Center with Round and Synchronized Timer */
              <div className="flex flex-col items-center gap-2.5 w-full">
                {/* Round Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-space font-black tracking-wider uppercase">
                  <span>VÒNG #{currentRound}</span>
                  <span>•</span>
                  <span>CÒN {availablePlayers.length} CẦU THỦ</span>
                </div>

                {/* Pointing Arrow & Direction indicator */}
                <div className="flex items-center gap-2 text-xs font-space font-extrabold uppercase tracking-wide">
                  {activeTurnTeam === 'A' ? (
                    <span className="flex items-center gap-1 text-rose-400 animate-pulse">
                      <span className="material-symbols-outlined text-lg">arrow_back</span>
                      Đến lượt: {activeCaptainName} (Đội A)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-400 animate-pulse">
                      Đến lượt: {activeCaptainName} (Đội B)
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </span>
                  )}
                </div>

                {/* Synchronized 60s Timer Spotlight */}
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
                    ⏱️ Hết 60s! Quyền chọn tự do hoặc có thể can thiệp
                  </p>
                )}

                {/* Consensus Proceed to Trade Section when picking completed */}
                {availablePlayers.length === 0 && (
                  <div className="mt-3 w-full max-w-sm p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl shadow-emerald-500/10 flex flex-col items-center gap-2.5 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-lg">fact_check</span>
                      <span className="text-xs font-space font-black text-white uppercase tracking-wider">
                        Đã chọn xong đội hình
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-space text-center leading-relaxed">
                      Cần <strong className="text-amber-400">cả 2 Đội trưởng đồng ý (2/2)</strong> để chuyển sang bước Chỉnh sửa (Trade).
                    </p>

                    {/* Consensus Status Badges */}
                    <div className="flex items-center justify-center gap-2 w-full py-1 text-xs font-space">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] ${captainAConfirmed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-sm">
                          {captainAConfirmed ? 'check_circle' : 'pending'}
                        </span>
                        <span className="font-bold truncate max-w-[100px]">
                          {captainA?.fullName || 'ĐT A'}
                        </span>
                      </div>

                      <span className="text-slate-500 font-bold font-mono text-[10px]">VS</span>

                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] ${captainBConfirmed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-sm">
                          {captainBConfirmed ? 'check_circle' : 'pending'}
                        </span>
                        <span className="font-bold truncate max-w-[100px]">
                          {captainB?.fullName || 'ĐT B'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-space font-black text-amber-400">
                      Đồng thuận: {consensusCount}/2
                    </div>

                    {/* Action button */}
                    {canConfirmProceed ? (
                      <Button
                        variant={myConfirmed ? 'emerald' : 'primary'}
                        size="sm"
                        leftIcon={myConfirmed ? 'check_circle' : 'how_to_reg'}
                        isLoading={submittingProceed}
                        onClick={handleConfirmProceed}
                        className="w-full font-space font-bold shadow-md shadow-emerald-500/20"
                      >
                        {adminActive
                          ? 'Admin: Chốt duyệt sang Trade (2/2)'
                          : myConfirmed
                          ? 'Đã xác nhận (Nhấn để hủy)'
                          : 'Xác nhận sang Bước Chỉnh Sửa'}
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-space italic">
                        Đang chờ 2 Đội trưởng nhấn xác nhận...
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PHÁI XANH: ĐỘI B (PHÁP) */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
              hasDeterminedFirstTurn && activeTurnTeam === 'B'
                ? 'bg-blue-950/70 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/60'
                : 'bg-slate-900/60 border-slate-800/80 opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <span className="text-xs font-space font-black tracking-wider uppercase text-blue-400">
                  Phái Xanh • {TEAM_B_NAME}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {teamBPlayers.length}/7 Cầu thủ
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              {captainB ? (
                <Avatar name={captainB.fullName} jerseyNumber={captainB.jerseyNumber} size="lg" showNumber />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-space font-black text-base text-white truncate">
                    {captainB?.fullName || 'Chưa chọn Đội trưởng'}
                  </h4>
                  {captainB && <Badge variant="gold" size="sm">Đội trưởng</Badge>}
                </div>
                <p className="text-xs text-blue-300/70 font-mono mt-0.5">
                  {captainB ? `@${captainB.username}` : 'Đang đợi gán Captain'}
                </p>
              </div>
            </div>

            {/* Turn status indicator for Team B */}
            <div className="pt-2 border-t border-blue-500/20">
              {hasDeterminedFirstTurn ? (
                activeTurnTeam === 'B' ? (
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="flex items-center gap-1.5 font-black text-blue-300 animate-pulse">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      ĐANG ĐẾN LƯỢT CHỌN!
                    </span>
                    {isCaptainB && (
                      <span className="text-amber-400 font-bold underline animate-bounce">
                        👉 Lượt của bạn!
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-space">
                    Đang đợi Đội A chọn...
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-500 font-space italic">
                  Chờ phân định lượt đầu...
                </span>
              )}

              {firstPickTeam === 'B' && (
                <div className="mt-1 flex items-center gap-1 text-[11px] font-space font-bold text-amber-400">
                  <span className="material-symbols-outlined text-xs">military_tech</span>
                  Thắng Spin (Chọn trước)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 TEAM SQUAD COLUMNS */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* AVAILABLE PLAYERS POOL */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="font-space font-black text-lg text-slate-900 dark:text-white">
              Danh Sách Chờ Chọn ({availablePlayers.length})
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {hasDeterminedFirstTurn
                ? `Mỗi lượt có 60s • Đang là lượt chọn của Đội ${activeTurnTeam} (${activeCaptainName})`
                : 'Vui lòng quay vòng quay bên trên để mở quyền chọn cầu thủ'}
            </p>
          </div>

          {hasDeterminedFirstTurn && canPick && (
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
            Tất cả cầu thủ đã được phân vào các đội!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick && hasDeterminedFirstTurn}
                canPickA={canPickTeamA}
                canPickB={canPickTeamB}
                canPickBench={adminActive}
                onPickA={() => handlePickPlayer(p.user.id, 'A')}
                onPickB={() => handlePickPlayer(p.user.id, 'B')}
                onPickBench={() => onPick(p.user.id, 'BENCH')}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BENCH / RESERVES */}
      {/* ========================================================================= */}
      {benchPlayers.length > 0 && (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-space font-black text-base text-slate-900 dark:text-slate-100">
              Cầu thủ dự bị (Bench) - {benchPlayers.length}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benchPlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick && hasDeterminedFirstTurn}
                canPickA={canPickTeamA}
                canPickB={canPickTeamB}
                onPickA={() => handlePickPlayer(p.user.id, 'A')}
                onPickB={() => handlePickPlayer(p.user.id, 'B')}
                onReset={() => onReset(p.user.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL-TIME SYNCHRONIZED SPIN WHEEL MODAL (PORTALED) */}
      {/* Both Captain A and Captain B see this exact wheel spinning simultaneously */}
      {/* ========================================================================= */}
      {showSpinModal &&
        typeof document !== 'undefined' &&
        captainA &&
        captainB &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (!isSpinning && e.target === e.currentTarget) {
                setShowSpinModal(false);
              }
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center text-white"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-space font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">casino</span>
                Đại Chiến Lượt Chọn Cầu Thủ
              </div>

              <h3 className="font-space font-black text-2xl sm:text-3xl text-white mb-1">
                VÒNG QUAY PHÂN ĐỊNH LƯỢT ĐẦU
              </h3>
              <p className="text-xs text-slate-400 font-space mb-3">
                {captainA.fullName} (Đội A) VS {captainB.fullName} (Đội B)
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
                    🎉 KẾT QUẢ VÒNG QUAY 🎉
                  </span>
                  <div className="font-space font-black text-xl text-white">
                    {spinCompletedWinner.fullName} (Đội {spinCompletedWinner.id === captainB.id ? 'B - Pháp' : 'A - Tây Ban Nha'})
                  </div>
                  <p className="text-xs text-emerald-400 font-space font-bold mt-1">
                    GIÀNH QUYỀN CHỌN CẦU THỦ ĐẦU TIÊN!
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-2">
                    Lượt chọn 60s sẽ bắt đầu ngay bây giờ...
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
