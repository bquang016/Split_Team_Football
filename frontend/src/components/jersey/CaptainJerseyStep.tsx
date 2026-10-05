import React, { useState, useEffect, useRef } from 'react';
import { Match, MatchParticipant, User, JerseyTeam, SpinSession } from '../../types';
import { Card, Button, Badge, Avatar, Select } from '../../ui';
import { SpinWheel } from '../spin/SpinWheel';
import { matchService } from '../../services/matchService';
import { spinService } from '../../services/spinService';
import { useAuthStore } from '../../store/authStore';
import { useWebSocketStore } from '../../store/websocketStore';
import spainJerseyImg from '../../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../../assets/ao_dau/phap.webp';
import toast from 'react-hot-toast';

interface CaptainJerseyStepProps {
  match: Match;
  participants: MatchParticipant[];
  onProceedToPick: () => void;
  onRefreshMatch?: () => void;
}

export const CaptainJerseyStep: React.FC<CaptainJerseyStepProps> = ({
  match,
  participants,
  onProceedToPick,
  onRefreshMatch,
}) => {
  const { user, isAdmin } = useAuthStore();
  const adminActive = isAdmin();
  const subscribe = useWebSocketStore((state) => state.subscribe);

  // Captain selection state (Phase 1)
  const [hostAId, setHostAId] = useState<string>('');
  const [hostBId, setHostBId] = useState<string>('');
  const [submittingCaptains, setSubmittingCaptains] = useState(false);

  // Consensus ready state (Phase 2)
  const [submittingReady, setSubmittingReady] = useState(false);

  // 3s Countdown state before spin (Phase 3)
  const [countdown3s, setCountdown3s] = useState<number | null>(null);
  const [hasStarted3s, setHasStarted3s] = useState(false);

  // Spinning state (Phase 4)
  const [isSpinning, setIsSpinning] = useState(false);
  const [latestSpin, setLatestSpin] = useState<SpinSession | null>(match.spinSession || null);

  // Jersey selection state (Phase 5)
  const [selectedJersey, setSelectedJersey] = useState<JerseyTeam>('SPAIN');
  const [submittingJersey, setSubmittingJersey] = useState(false);
  const [jerseyTimeLeftSec, setJerseyTimeLeftSec] = useState<number>(60);

  // Auto notification modal (Phase 6)
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [modalCountdown, setModalCountdown] = useState<number>(3);
  const hasShownModalRef = useRef<boolean>(false);

  // Proceed consensus & 10s countdown (Phase 7 & 8)
  const [submittingProceed, setSubmittingProceed] = useState(false);
  const [countdown10s, setCountdown10s] = useState<number | null>(null);

  // Detect 2 captains (not tied to Team A / B before jersey selection!)
  const hosts = participants.filter((p) => p.isHost);
  const host1 = hosts[0]?.user || match.spinSession?.hostA || null;
  const host2 = hosts[1]?.user || match.spinSession?.hostB || null;
  const captainsAssigned = Boolean(host1 && host2 && host1.id !== host2.id);

  const isCaptain1 = Boolean(user && host1 && user.id === host1.id);
  const isCaptain2 = Boolean(user && host2 && user.id === host2.id);
  const isCaptain = isCaptain1 || isCaptain2;

  const captain1Ready = Boolean(match.jerseyCaptainAReady);
  const captain2Ready = Boolean(match.jerseyCaptainBReady);
  const bothCaptainsReady = captain1Ready && captain2Ready;

  const winner = latestSpin?.winner || match.spinSession?.winner || null;
  const isSpinWinner = Boolean(user && winner && user.id === winner.id);
  const canSelectJersey = adminActive || isSpinWinner;

  // Determining teams after jersey is selected:
  const hasSelectedJersey = Boolean(match.jerseyWinnerTeam);
  const isWinnerSpain = match.jerseyWinnerTeam === 'SPAIN';
  const isWinnerFrance = match.jerseyWinnerTeam === 'FRANCE';

  // Winner picked their jersey, other captain gets the remaining one
  const winnerCaptain = winner;
  const otherCaptain = (winner && host1 && host2) ? (winner.id === host1.id ? host2 : host1) : null;

  const captainSpain = isWinnerSpain ? winnerCaptain : otherCaptain;
  const captainFrance = isWinnerFrance ? winnerCaptain : otherCaptain;

  const isSpainCaptain = Boolean(user && captainSpain && user.id === captainSpain.id);
  const isFranceCaptain = Boolean(user && captainFrance && user.id === captainFrance.id);

  const captainSpainConfirmed = Boolean(match.jerseyCaptainAConfirmed);
  const captainFranceConfirmed = Boolean(match.jerseyCaptainBConfirmed);
  const bothConfirmedProceed = captainSpainConfirmed && captainFranceConfirmed;

  // Options for selecting captains (Admin)
  const participantOptions = participants.map((p) => ({
    value: p.user.id,
    label: `${p.user.fullName} (${p.user.jerseyNumber ? `Số ${p.user.jerseyNumber}` : `@${p.user.username}`})`,
  }));

  // Initial spin fetch
  useEffect(() => {
    if (match.id && !latestSpin) {
      spinService.getLatestSpin(match.id).then((res) => {
        if (res.success && res.data) {
          setLatestSpin(res.data);
        }
      });
    }
  }, [match.id]);

  // Subscribe to WebSocket spin & status events
  useEffect(() => {
    if (!match.id) return;
    const unsubSpin = subscribe(`/topic/match/${match.id}/spin`, (session: SpinSession) => {
      setLatestSpin(session);
      setIsSpinning(true);
    });
    const unsubStatus = subscribe(`/topic/match/${match.id}/status`, () => {
      if (onRefreshMatch) onRefreshMatch();
    });
    return () => {
      unsubSpin();
      unsubStatus();
    };
  }, [match.id, subscribe, onRefreshMatch]);

  // Phase 3: Trigger 3s countdown when both captains ready and no spin yet
  useEffect(() => {
    if (bothCaptainsReady && !latestSpin && !hasStarted3s && !isSpinning) {
      setHasStarted3s(true);
      setCountdown3s(3);
    }
  }, [bothCaptainsReady, latestSpin, hasStarted3s, isSpinning]);

  // Handle 3s countdown tick and trigger spin
  useEffect(() => {
    if (countdown3s === null) return;
    if (countdown3s > 0) {
      const timer = setTimeout(() => {
        setCountdown3s((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown3s === 0) {
      setCountdown3s(null);
      // ONLY Admin or Captain 1 triggers the API to avoid race conditions and 400 errors from spectators
      if (adminActive || isCaptain1) {
        triggerSpin();
      }
    }
  }, [countdown3s, adminActive, isCaptain1]);

  const triggerSpin = async () => {
    setIsSpinning(true);
    try {
      const res = await spinService.spinJersey(match.id);
      if (res.success && res.data) {
        setLatestSpin(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể bắt đầu vòng quay');
      setIsSpinning(false);
      setHasStarted3s(false);
    }
  };

  // Phase 5: 60s countdown for jersey selection
  useEffect(() => {
    if (match.jerseyWinnerTeam) return;
    if (!latestSpin) return;

    const calculateTimeLeft = () => {
      if (match.jerseyTurnStartedAt) {
        const start = new Date(match.jerseyTurnStartedAt).getTime();
        const elapsed = Math.floor((Date.now() - start) / 1000);
        return Math.max(0, 60 - elapsed);
      }
      return 60;
    };

    const initial = calculateTimeLeft();
    setJerseyTimeLeftSec(initial);

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setJerseyTimeLeftSec(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match.jerseyTurnStartedAt, match.jerseyWinnerTeam, latestSpin]);

  // Phase 6: Show notification modal to opponent when jersey is selected
  useEffect(() => {
    if (match.jerseyWinnerTeam && !hasShownModalRef.current) {
      hasShownModalRef.current = true;
      // Chỉ hiển thị thông báo kết quả chọn áo cho Đội trưởng đối phương (hoặc khán giả),
      // KHÔNG hiển thị cho Đội trưởng đã thực hiện chọn áo (isSpinWinner).
      if (!isSpinWinner) {
        setShowNotificationModal(true);
        setModalCountdown(3);
      }
    }
  }, [match.jerseyWinnerTeam, isSpinWinner]);

  // Modal 3s countdown
  useEffect(() => {
    if (!showNotificationModal) return;
    if (modalCountdown > 0) {
      const timer = setTimeout(() => {
        setModalCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowNotificationModal(false);
    }
  }, [showNotificationModal, modalCountdown]);

  // Phase 8: 10s countdown when both confirm proceed
  useEffect(() => {
    if (bothConfirmedProceed && countdown10s === null) {
      setCountdown10s(10);
    }
  }, [bothConfirmedProceed, countdown10s]);

  useEffect(() => {
    if (countdown10s === null) return;
    if (countdown10s > 0) {
      const timer = setTimeout(() => {
        setCountdown10s((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown10s === 0) {
      setCountdown10s(null);
      onProceedToPick();
    }
  }, [countdown10s, onProceedToPick]);

  // Handlers
  const handleAssignCaptains = async () => {
    if (!hostAId || !hostBId) {
      toast.error('Vui lòng chọn cả hai đội trưởng');
      return;
    }
    if (hostAId === hostBId) {
      toast.error('Hai đội trưởng phải là hai người khác nhau');
      return;
    }
    setSubmittingCaptains(true);
    try {
      const res = await matchService.assignCaptains(match.id, hostAId, hostBId);
      if (res.success) {
        toast.success('Đã chỉ định hai đội trưởng thành công');
        if (onRefreshMatch) onRefreshMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể chỉ định đội trưởng');
    } finally {
      setSubmittingCaptains(false);
    }
  };

  const handleToggleReady = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác');
      return;
    }
    setSubmittingReady(true);
    try {
      const res = await matchService.confirmJerseyReady(match.id);
      if (res.success) {
        toast.success('Đã cập nhật trạng thái sẵn sàng');
        if (onRefreshMatch) onRefreshMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xác nhận sẵn sàng');
    } finally {
      setSubmittingReady(false);
    }
  };

  const handleSelectJersey = async () => {
    if (!canSelectJersey) {
      toast.error('Chỉ Đội trưởng thắng bốc thăm hoặc Quản trị viên mới có quyền chọn áo');
      return;
    }
    setSubmittingJersey(true);
    try {
      const res = await matchService.selectJersey(match.id, selectedJersey);
      if (res.success) {
        toast.success(`Đã chọn áo đấu ${selectedJersey === 'SPAIN' ? 'Tây Ban Nha' : 'Pháp'}`);
        if (onRefreshMatch) onRefreshMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể chọn áo đấu');
    } finally {
      setSubmittingJersey(false);
    }
  };

  const handleConfirmProceed = async () => {
    setSubmittingProceed(true);
    try {
      const res = await matchService.confirmJerseyProceed(match.id);
      if (res.success) {
        toast.success('Đã xác nhận hoàn tất chọn áo đấu');
        if (onRefreshMatch) onRefreshMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xác nhận hoàn tất');
    } finally {
      setSubmittingProceed(false);
    }
  };

  const otherTeamJersey = match.jerseyWinnerTeam === 'SPAIN' ? 'Pháp (Màu Xanh)' : 'Tây Ban Nha (Màu Đỏ)';
  const winnerJerseyName = match.jerseyWinnerTeam === 'SPAIN' ? 'Tây Ban Nha (Màu Đỏ)' : 'Pháp (Màu Xanh)';

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto font-sans text-slate-900 dark:text-slate-100 relative">
      {/* Live Spectator Banner for non-captains */}
      {!adminActive && !isCaptain1 && !isCaptain2 && (
        <div className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-space flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chế độ xem trực tiếp • Đang đồng bộ thời gian thực quá trình chọn đội trưởng & áo đấu</span>
          </span>
          <Badge variant="live" size="sm" dot>Trực tiếp</Badge>
        </div>
      )}

      {/* 3s Countdown Fullscreen Overlay */}
      {countdown3s !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="text-slate-400 font-space text-lg font-bold uppercase tracking-widest mb-4">
            Chuẩn bị quay vòng quay bốc thăm
          </div>
          <div className="text-8xl sm:text-9xl font-black font-space text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 animate-pulse scale-110">
            {countdown3s}
          </div>
          <p className="text-slate-300 font-space text-sm mt-6">
            Đang kích hoạt vòng quay may mắn...
          </p>
        </div>
      )}

      {/* 3s Auto-dismiss notification popup modal for Jersey selection (Phase 6) */}
      {showNotificationModal && !isSpinWinner && match.jerseyWinnerTeam && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowNotificationModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 flex items-center justify-center mb-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <img
                  src={match.jerseyWinnerTeam === 'SPAIN' ? spainJerseyImg : franceJerseyImg}
                  alt={winnerJerseyName}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              </div>
              <h3 className="font-space font-black text-xl text-slate-900 dark:text-white">
                Thông Báo Kết Quả Chọn Áo
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Đội trưởng <strong>{winner?.fullName}</strong> đã lựa chọn bộ trang phục{' '}
                <strong>{winnerJerseyName}</strong>!
                <br />
                Đội của Đội trưởng <strong>{otherCaptain?.fullName}</strong> sẽ thi đấu trong trang phục{' '}
                <strong>{otherTeamJersey}</strong>.
              </p>
              <div className="mt-5 text-xs font-mono text-slate-400">
                Thông báo tự động đóng sau {modalCountdown} giây
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10s Countdown Overlay before Step 3 (Phase 8) */}
      {countdown10s !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fadeIn p-6 text-center text-white">
          <div className="text-amber-400 font-space text-sm font-bold uppercase tracking-widest mb-2">
            Đồng thuận hoàn tất chọn áo đấu thành công!
          </div>
          <div className="text-6xl sm:text-7xl font-black font-space my-4 text-emerald-400">
            {countdown10s}s
          </div>
          <h4 className="font-space font-bold text-lg text-slate-200 max-w-md mx-auto mb-2">
            Hệ thống đang chuẩn bị danh sách cầu thủ cho Bước 3: CHỌN NGƯỜI
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Mẹo chiến thuật: Mỗi đội trưởng sẽ có 60 giây ở mỗi lượt quay để lựa chọn cầu thủ bổ sung vào đội hình của mình.
          </p>
          <div className="mt-6">
            <Button variant="emerald" size="sm" onClick={onProceedToPick}>
              Bỏ qua đếm ngược và chuyển ngay
            </Button>
          </div>
        </div>
      )}

      {/* Header card */}
      <Card elevation="glass" glow className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gold" dot size="sm">
                Bước 2: CHỌN ÁO ĐẤU
              </Badge>
              <span className="text-xs text-slate-500 font-space">Chỉ định đội trưởng & Bốc thăm chọn trang phục</span>
            </div>
            <h2 className="font-space font-black text-xl sm:text-2xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Đội Trưởng & Lựa Chọn Áo Đấu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Quản trị viên chỉ định hai đội trưởng đại diện cho hai bên. Hai đội trưởng bấm sẵn sàng để bốc thăm quyền chọn màu áo đấu trước.
            </p>
          </div>

          {adminActive && (
            <div className="flex items-center gap-2">
              <Badge variant="teamB" size="md">
                Quản trị viên
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* PHASE 1: Admin chỉ định 2 Đội trưởng */}
      {(!captainsAssigned || adminActive) && (
        <Card elevation="level1" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">how_to_reg</span>
              {captainsAssigned ? 'Thay đổi hai Đội trưởng (Quản trị viên)' : 'Chỉ định hai Đội trưởng'}
            </h3>
            {captainsAssigned && (
              <Badge variant="success" size="sm">
                Đã chỉ định
              </Badge>
            )}
          </div>

          {adminActive ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Đội trưởng thứ nhất"
                  placeholder="Chọn thành viên làm Đội trưởng 1..."
                  value={hostAId || host1?.id || ''}
                  onChange={(e) => setHostAId(e.target.value)}
                  options={participantOptions}
                />
                <Select
                  label="Đội trưởng thứ hai"
                  placeholder="Chọn thành viên làm Đội trưởng 2..."
                  value={hostBId || host2?.id || ''}
                  onChange={(e) => setHostBId(e.target.value)}
                  options={participantOptions}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon="how_to_reg"
                  isLoading={submittingCaptains}
                  onClick={handleAssignCaptains}
                >
                  Xác nhận chỉ định Đội trưởng
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500 italic">
              Đang chờ Quản trị viên chỉ định hai đội trưởng cho trận đấu...
            </div>
          )}
        </Card>
      )}

      {/* PHASE 2 & 3: Hiển thị 2 Đội trưởng + Bấm sẵn sàng */}
      {captainsAssigned && (
        <Card elevation="level1" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-space font-bold uppercase text-amber-600 tracking-wider">
                Xác nhận đồng thuận
              </span>
              <h3 className="font-space font-black text-lg text-slate-900 dark:text-white mt-0.5">
                Trạng thái sẵn sàng của hai Đội trưởng
              </h3>
            </div>
            <div className="text-xs font-bold text-amber-500 font-space">
              Sẵn sàng: {(captain1Ready ? 1 : 0) + (captain2Ready ? 1 : 0)}/2
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Captain 1 */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                captain1Ready
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={host1?.fullName || 'Đội trưởng 1'}
                  jerseyNumber={host1?.jerseyNumber}
                  size="md"
                  showNumber
                  bgColor="#7c3aed"
                />
                <div>
                  <div className="font-space font-bold text-sm text-slate-900 dark:text-white">
                    {host1?.fullName}
                  </div>
                  <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                    Đội trưởng 1
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-space font-bold">
                <span className={`material-symbols-outlined text-lg ${captain1Ready ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {captain1Ready ? 'check_circle' : 'schedule'}
                </span>
                <span>{captain1Ready ? 'Đã sẵn sàng' : 'Đang chuẩn bị'}</span>
              </div>
            </div>

            {/* Captain 2 */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                captain2Ready
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={host2?.fullName || 'Đội trưởng 2'}
                  jerseyNumber={host2?.jerseyNumber}
                  size="md"
                  showNumber
                  bgColor="#0d9488"
                />
                <div>
                  <div className="font-space font-bold text-sm text-slate-900 dark:text-white">
                    {host2?.fullName}
                  </div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    Đội trưởng 2
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-space font-bold">
                <span className={`material-symbols-outlined text-lg ${captain2Ready ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {captain2Ready ? 'check_circle' : 'schedule'}
                </span>
                <span>{captain2Ready ? 'Đã sẵn sàng' : 'Đang chuẩn bị'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!latestSpin && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Khi cả hai đội trưởng bấm "Sẵn sàng", màn hình sẽ đếm ngược 3 giây và tự động quay vòng quay may mắn để xác định người được chọn áo trước.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {isCaptain1 && (
                  <Button
                    variant={captain1Ready ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon={captain1Ready ? 'check' : 'touch_app'}
                    isLoading={submittingReady}
                    onClick={handleToggleReady}
                  >
                    {captain1Ready ? 'Đội trưởng 1 đã sẵn sàng (Hủy)' : 'Đội trưởng 1: Bấm sẵn sàng'}
                  </Button>
                )}

                {isCaptain2 && (
                  <Button
                    variant={captain2Ready ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon={captain2Ready ? 'check' : 'touch_app'}
                    isLoading={submittingReady}
                    onClick={handleToggleReady}
                  >
                    {captain2Ready ? 'Đội trưởng 2 đã sẵn sàng (Hủy)' : 'Đội trưởng 2: Bấm sẵn sàng'}
                  </Button>
                )}

                {adminActive && (
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon="admin_panel_settings"
                    isLoading={submittingReady}
                    onClick={handleToggleReady}
                  >
                    Quản trị viên kích hoạt sẵn sàng cả hai bên
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* PHASE 4: Vòng quay may mắn (Spin) */}
      {captainsAssigned && (
        <Card elevation="level1" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <div className="text-center mb-5">
            <span className="text-xs font-space font-bold uppercase text-amber-600 tracking-wider">
              Bốc thăm may mắn
            </span>
            <h3 className="font-space font-black text-xl text-slate-900 dark:text-white mt-1">
              Vòng Quay Chọn Quyền Ưu Tiên Áo Đấu
            </h3>
            {winner && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-space font-bold">
                <span className="material-symbols-outlined text-sm">trophy</span>
                <span>Người thắng bốc thăm: {winner.fullName}</span>
              </div>
            )}
          </div>

          {host1 && host2 && (
            <div className="w-full max-w-sm flex justify-center my-2">
              <SpinWheel
                hostA={host1}
                hostB={host2}
                winner={winner}
                isSpinning={isSpinning}
                colorA="#7c3aed"
                colorB="#0d9488"
                onSpinComplete={() => {
                  setIsSpinning(false);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {/* PHASE 5: Chọn áo đấu (60 giây) */}
      {winner && (
        <Card elevation="glass" glow className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm" dot>
                  Lựa chọn màu áo đấu
                </Badge>
                {!match.jerseyWinnerTeam && (
                  <span className="text-xs text-amber-500 font-space font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm animate-pulse">timer</span>
                    Thời gian còn lại: {jerseyTimeLeftSec}s
                  </span>
                )}
              </div>
              <h3 className="font-space font-black text-xl text-slate-900 dark:text-white mt-1">
                {match.jerseyWinnerTeam ? 'Kết Quả Phân Định Màu Áo' : 'Đội Trưởng Thắng Bốc Thăm Chọn Áo Đấu'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {match.jerseyWinnerTeam ? (
                  <>
                    Đội trưởng <strong>{winner.fullName}</strong> đã chọn áo{' '}
                    <strong>{winnerJerseyName}</strong>. Đội còn lại thi đấu trong trang phục{' '}
                    <strong>{otherTeamJersey}</strong>.
                  </>
                ) : canSelectJersey ? (
                  'Bạn là người thắng vòng quay! Hãy chọn màu áo cho đội của mình trong 60 giây.'
                ) : (
                  `Đang chờ Đội trưởng ${winner.fullName} chọn màu áo đấu...`
                )}
              </p>
            </div>

            {/* Countdown timer badge if not selected yet */}
            {!match.jerseyWinnerTeam && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-space font-black text-lg">
                <span className="material-symbols-outlined animate-spin">schedule</span>
                <span>{jerseyTimeLeftSec} giây</span>
              </div>
            )}
          </div>

          {/* Jersey Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {/* Spain */}
            <div
              onClick={() => {
                if (canSelectJersey && !match.jerseyWinnerTeam) setSelectedJersey('SPAIN');
              }}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                (match.jerseyWinnerTeam ? match.jerseyWinnerTeam === 'SPAIN' : selectedJersey === 'SPAIN')
                  ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 shadow-lg shadow-rose-500/10 scale-102'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300'
              } ${(!canSelectJersey || Boolean(match.jerseyWinnerTeam)) ? 'cursor-default' : ''}`}
            >
              <div className="w-28 h-28 flex items-center justify-center mb-3 p-2 bg-gradient-to-b from-rose-500/10 to-transparent rounded-2xl border border-rose-500/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={spainJerseyImg}
                  alt="Áo đấu Tây Ban Nha"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.35)]"
                />
              </div>
              <h4 className="font-space font-bold text-lg text-slate-900 dark:text-white">
                Tây Ban Nha (Màu Đỏ)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bộ trang phục thi đấu sắc đỏ nhiệt huyết
              </p>
              {match.jerseyWinnerTeam === 'SPAIN' && (
                <Badge variant="error" size="sm" className="mt-3">
                  Đội trưởng {winner.fullName} đã chọn
                </Badge>
              )}
            </div>

            {/* France */}
            <div
              onClick={() => {
                if (canSelectJersey && !match.jerseyWinnerTeam) setSelectedJersey('FRANCE');
              }}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                (match.jerseyWinnerTeam ? match.jerseyWinnerTeam === 'FRANCE' : selectedJersey === 'FRANCE')
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 shadow-lg shadow-blue-500/10 scale-102'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300'
              } ${(!canSelectJersey || Boolean(match.jerseyWinnerTeam)) ? 'cursor-default' : ''}`}
            >
              <div className="w-28 h-28 flex items-center justify-center mb-3 p-2 bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={franceJerseyImg}
                  alt="Áo đấu Pháp"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)]"
                />
              </div>
              <h4 className="font-space font-bold text-lg text-slate-900 dark:text-white">
                Pháp (Màu Xanh Nước Biển)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bộ trang phục thi đấu sắc xanh thanh lịch
              </p>
              {match.jerseyWinnerTeam === 'FRANCE' && (
                <Badge variant="teamB" size="sm" className="mt-3">
                  Đội trưởng {winner.fullName} đã chọn
                </Badge>
              )}
            </div>
          </div>

          {/* Confirm Jersey selection button (before selected) */}
          {!match.jerseyWinnerTeam && canSelectJersey && (
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                leftIcon="checkroom"
                isLoading={submittingJersey}
                onClick={handleSelectJersey}
              >
                Xác nhận chọn áo đấu {selectedJersey === 'SPAIN' ? 'Tây Ban Nha' : 'Pháp'}
              </Button>
            </div>
          )}

          {/* PHASE 7: Consensus hoàn tất chọn áo để chuyển sang Bước 3 */}
          {hasSelectedJersey && (
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-space flex-wrap">
                <div className="flex items-center gap-2">
                  <img src={spainJerseyImg} alt="Áo Tây Ban Nha" className="w-6 h-6 object-contain" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Đội Tây Ban Nha ({captainSpain?.fullName || 'Đội A'}): {captainSpainConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={franceJerseyImg} alt="Áo Pháp" className="w-6 h-6 object-contain" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Đội Pháp ({captainFrance?.fullName || 'Đội B'}): {captainFranceConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Nút xác nhận cho Đội trưởng Tây Ban Nha */}
                {isSpainCaptain && (
                  <Button
                    variant={captainSpainConfirmed ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon="check_circle"
                    isLoading={submittingProceed}
                    onClick={handleConfirmProceed}
                  >
                    {captainSpainConfirmed ? 'Đã xác nhận (Bấm để hủy)' : 'Đội Tây Ban Nha xác nhận'}
                  </Button>
                )}

                {/* Nút xác nhận cho Đội trưởng Pháp */}
                {isFranceCaptain && (
                  <Button
                    variant={captainFranceConfirmed ? 'emerald' : 'primary'}
                    size="md"
                    leftIcon="check_circle"
                    isLoading={submittingProceed}
                    onClick={handleConfirmProceed}
                  >
                    {captainFranceConfirmed ? 'Đã xác nhận (Bấm để hủy)' : 'Đội Pháp xác nhận'}
                  </Button>
                )}

                {adminActive && (
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon="admin_panel_settings"
                    isLoading={submittingProceed}
                    onClick={handleConfirmProceed}
                  >
                    Quản trị viên chốt chuyển sang Bước 3
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
