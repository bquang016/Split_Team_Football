import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Match, MatchLineup, Position, Team } from '../types';
import { matchService } from '../services/matchService';
import { spinService } from '../services/spinService';
import { pickService } from '../services/pickService';
import { lineupService } from '../services/lineupService';
import { statsService, PlayerStatInput } from '../services/statsService';
import { useAuthStore } from '../store/authStore';
import { useWebSocketStore } from '../store/websocketStore';
import { Avatar, Badge, Button, Card, Modal, Input, Select } from '../ui';
import { ScoreBoard } from '../components/match/ScoreBoard';
import { StatusBadge } from '../components/match/StatusBadge';
import { SpinWheel } from '../components/spin/SpinWheel';
import { CaptainFaceOff } from '../components/spin/CaptainFaceOff';
import { PickList } from '../components/pick/PickList';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { FormationPreset } from '../components/lineup/FormationPreset';
import { LineupExport } from '../components/lineup/LineupExport';
import { BenchReserves } from '../components/lineup/BenchReserves';
import { AIAnalysisCard } from '../components/ai/AIAnalysisCard';
import { formatDateVi, formatTimeVi } from '../utils/formatters';
import { FORMATION_PRESETS_7V7, TEAM_A_NAME, TEAM_B_NAME } from '../utils/constants';
import toast from 'react-hot-toast';

export const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'spin' | 'pick' | 'lineup' | 'stats'>('overview');

  // Spin wheel state
  const [hostAId, setHostAId] = useState<string>('');
  const [hostBId, setHostBId] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

  // Lineup state
  const [activeLineupTeam, setActiveLineupTeam] = useState<Team>('A');
  const [localLineups, setLocalLineups] = useState<MatchLineup[]>([]);
  const [savingLineup, setSavingLineup] = useState(false);

  // Score modal
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // Stats state
  const [playerStatsInputs, setPlayerStatsInputs] = useState<Record<string, { goals: number; assists: number; isMvp: boolean }>>({});
  const [savingStats, setSavingStats] = useState(false);

  const { user, isAdmin } = useAuthStore();
  const subscribe = useWebSocketStore((state) => state.subscribe);

  const fetchMatch = async () => {
    if (!id) return;
    try {
      const res = await matchService.getMatchDetails(id);
      if (res.success && res.data) {
        setMatch(res.data);
        setLocalLineups(res.data.lineups || []);
        setScoreA(res.data.scoreTeamA || 0);
        setScoreB(res.data.scoreTeamB || 0);

        // Pre-select hosts if already recorded in spinSession
        if (res.data.spinSession) {
          setHostAId(res.data.spinSession.hostA?.id || '');
          setHostBId(res.data.spinSession.hostB?.id || '');
        } else {
          // Check participants with isHost
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
        setMatch((prev) => (prev ? { ...prev, status: updatedMatch.status } : updatedMatch));
        toast('Trạng thái trận đấu vừa được cập nhật', { icon: '⚽' });
      }),
      subscribe(`/topic/match/${id}/spin`, (session: any) => {
        setIsSpinning(true);
        setMatch((prev) => (prev ? { ...prev, spinSession: session } : prev));
      }),
      subscribe(`/topic/match/${id}/pick`, () => {
        fetchMatch();
      }),
      subscribe(`/topic/match/${id}/lineup`, (lineups: MatchLineup[]) => {
        setLocalLineups(lineups);
        setMatch((prev) => (prev ? { ...prev, lineups } : prev));
      }),
      subscribe(`/topic/match/${id}/score`, (updatedMatch: Match) => {
        setMatch((prev) => (prev ? { ...prev, scoreTeamA: updatedMatch.scoreTeamA, scoreTeamB: updatedMatch.scoreTeamB } : updatedMatch));
      }),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, [id, subscribe]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500">Đang tải dữ liệu trận đấu...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy trận đấu</h2>
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

  // Check if current user is admin OR captain
  const isCaptain = participants.some((p) => p.user.id === user?.id && p.isHost);
  const canSaveLineup = isAdmin() || isCaptain;
  const canPick = isAdmin() || isCaptain;

  const hasJoined = participants.some((p) => p.user.id === user?.id);

  const handleJoinToggle = async () => {
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
      toast.success('Bắt đầu quay chọn quyền ưu tiên!');
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
    try {
      await matchService.updateScore(match.id, scoreA, scoreB);
      toast.success('Đã cập nhật tỉ số');
      setIsScoreModalOpen(false);
      fetchMatch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật tỉ số');
    }
  };

  // Lineup manipulation
  const handleUpdateLineupCoord = (userId: string, xPercent: number, yPercent: number) => {
    setLocalLineups((prev) =>
      prev.map((item) =>
        item.user.id === userId ? { ...item, xPercent, yPercent } : item
      )
    );
  };

  const handleUpdatePositionLabel = (userId: string, positionLabel: Position) => {
    setLocalLineups((prev) =>
      prev.map((item) =>
        item.user.id === userId ? { ...item, positionLabel } : item
      )
    );
  };

  const handleApplyPreset = (presetIndex: number) => {
    const preset = FORMATION_PRESETS_7V7[presetIndex];
    if (!preset) return;

    // Get current starters of active team
    const teamPlayers = participants.filter((p) => p.team === activeLineupTeam);
    const updated = [...localLineups.filter((l) => l.team !== activeLineupTeam)];

    teamPlayers.slice(0, 7).forEach((p, idx) => {
      const pos = preset.positions[idx] || { position: 'CM', x: 50, y: 50 };
      updated.push({
        id: `temp-${p.user.id}`,
        matchId: match.id,
        user: p.user,
        team: activeLineupTeam,
        positionLabel: pos.position as Position,
        xPercent: pos.x,
        yPercent: pos.y,
        jerseyNumber: p.user.jerseyNumber,
      });
    });

    setLocalLineups(updated);
    toast.success(`Đã áp dụng sơ đồ ${preset.name}`);
  };

  const handleSaveLineupSubmit = async () => {
    setSavingLineup(true);
    try {
      const payload = localLineups.map((l) => ({
        userId: l.user.id,
        team: l.team,
        positionLabel: l.positionLabel,
        xPercent: l.xPercent,
        yPercent: l.yPercent,
        jerseyNumber: l.jerseyNumber,
      }));

      const res = await lineupService.saveLineup(match.id, payload);
      if (res.success) {
        toast.success('Đã lưu sơ đồ đội hình thành công!');
        fetchMatch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể lưu sơ đồ');
    } finally {
      setSavingLineup(false);
    }
  };

  // Record Player Stats
  const handleSaveStats = async () => {
    setSavingStats(true);
    try {
      const statsPayload: PlayerStatInput[] = participants.map((p) => {
        const input = playerStatsInputs[p.user.id] || { goals: 0, assists: 0, isMvp: false };
        const isWinner =
          (match.scoreTeamA > match.scoreTeamB && p.team === 'A') ||
          (match.scoreTeamB > match.scoreTeamA && p.team === 'B');

        return {
          userId: p.user.id,
          team: p.team,
          goals: input.goals || 0,
          assists: input.assists || 0,
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
    label: `${p.user.fullName} (${p.user.jerseyNumber ? '#' + p.user.jerseyNumber : 'Số —'})`,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <StatusBadge status={match.status} />
            <span className="text-xs font-mono text-slate-500 font-medium">
              • {match.location || 'Sân cố định'} • Thể thức 7v7
            </span>
          </div>

          {/* Quick status actions for Admin */}
          {isAdmin() && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="surface"
                onClick={() => setIsScoreModalOpen(true)}
                leftIcon="scoreboard"
              >
                Nhập tỉ số
              </Button>

              {match.status === 'PENDING' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('CAPTAIN_SPINNING')}
                  leftIcon="casino"
                >
                  Bắt đầu chia đội
                </Button>
              )}

              {match.status === 'CAPTAIN_PICKING' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus('LINEUP_SETTING')}
                  leftIcon="sports"
                >
                  Sang xếp sơ đồ
                </Button>
              )}

              {match.status === 'LINEUP_SETTING' && (
                <Button
                  size="sm"
                  variant="secondary"
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
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
              {match.title || `Trận bóng ngày ${match.matchDate}`}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-1.5 font-medium">
              <span>{formatDateVi(match.matchDate)}</span>
              {match.matchTime && <span>{formatTimeVi(match.matchTime)}</span>}
              <span>{participants.length} cầu thủ tham gia</span>
            </div>
          </div>

          {user && (
            <Button
              size="md"
              variant={hasJoined ? 'danger' : 'primary'}
              leftIcon={hasJoined ? 'cancel' : 'how_to_reg'}
              onClick={handleJoinToggle}
            >
              {hasJoined ? 'Hủy tham gia' : 'Điểm danh tham gia'}
            </Button>
          )}
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto">
          {[
            { key: 'overview', label: 'Tổng quan', icon: 'dashboard' },
            { key: 'spin', label: 'Vòng quay Đội trưởng', icon: 'casino' },
            { key: 'pick', label: 'Chọn người (Pick)', icon: 'how_to_reg' },
            { key: 'lineup', label: 'Sa bàn Lineup', icon: 'sports' },
            { key: 'stats', label: 'Kết quả & Thống kê', icon: 'sports_score' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <ScoreBoard
            scoreTeamA={match.scoreTeamA}
            scoreTeamB={match.scoreTeamB}
            hostAName={hostAUser?.fullName}
            hostBName={hostBUser?.fullName}
            isLive={match.status === 'IN_PROGRESS'}
          />

          <AIAnalysisCard
            matchId={match.id}
            initialAnalysis={match.aiAnalysis}
            initialAnalyzedAt={match.aiAnalyzedAt}
          />

          {/* Participants List */}
          <Card elevation="level1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-lg text-slate-900">
                Danh sách cầu thủ tham gia ({participants.length})
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Thể thức tiêu chuẩn: 7v7 (14 cầu thủ chính thức)
              </span>
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
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs"
                  >
                    <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="md" showNumber />
                    <div>
                      <div className="font-heading font-black text-sm text-slate-900">
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
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: SPIN WHEEL */}
      {activeTab === 'spin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wheel column */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
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
                }}
              />
            ) : (
              <div className="py-24 text-center text-sm text-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">casino</span>
                <p>Vui lòng chọn 2 đội trưởng ở bảng bên phải để bắt đầu vòng quay</p>
              </div>
            )}
          </div>

          {/* Captain setup & faceoff column */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {isAdmin() && !winnerUser && (
              <Card elevation="level1">
                <h4 className="font-heading font-black text-base text-slate-900 mb-3">
                  Chọn 2 Đội trưởng từ danh sách điểm danh
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Select
                    label="Đội trưởng A (Tây Ban Nha)"
                    options={[{ value: '', label: '-- Chọn đội trưởng A --' }, ...eligibleHosts]}
                    value={hostAId}
                    onChange={(e) => setHostAId(e.target.value)}
                  />
                  <Select
                    label="Đội trưởng B (Pháp)"
                    options={[{ value: '', label: '-- Chọn đội trưởng B --' }, ...eligibleHosts]}
                    value={hostBId}
                    onChange={(e) => setHostBId(e.target.value)}
                  />
                </div>
              </Card>
            )}

            <CaptainFaceOff
              hostA={hostAUser}
              hostB={hostBUser}
              winner={winnerUser}
              isAdmin={isAdmin()}
              isSpinning={isSpinning}
              onStartSpin={handleStartSpin}
            />
          </div>
        </div>
      )}

      {/* TAB 3: TEAM PICK */}
      {activeTab === 'pick' && (
        <PickList
          participants={participants}
          canPick={canPick}
          onPick={handlePickPlayer}
          onReset={handleResetPick}
        />
      )}

      {/* TAB 4: LINEUP BUILDER */}
      {activeTab === 'lineup' && (
        <div className="flex flex-col gap-4">
          {/* Lineup Controls */}
          <Card elevation="level1" className="flex flex-wrap items-center justify-between gap-3">
            {/* Team Toggle Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveLineupTeam('A')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeLineupTeam === 'A'
                    ? 'bg-[#DC2626] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đội A: {TEAM_A_NAME} (Đỏ)
              </button>
              <button
                type="button"
                onClick={() => setActiveLineupTeam('B')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeLineupTeam === 'B'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đội B: {TEAM_B_NAME} (Xanh)
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <FormationPreset
                onSelectFormation={handleApplyPreset}
              />
              <LineupExport
                matchTitle={match.title}
                targetElementId="football-pitch-canvas"
              />
              {canSaveLineup && (
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon="save"
                  isLoading={savingLineup}
                  onClick={handleSaveLineupSubmit}
                >
                  Lưu sơ đồ
                </Button>
              )}
            </div>
          </Card>

          {/* Tactical Pitch */}
          <FootballPitch
            lineups={localLineups}
            activeTeam={activeLineupTeam}
            isEditable={canSaveLineup}
            onUpdatePosition={handleUpdateLineupCoord}
            onUpdatePositionLabel={handleUpdatePositionLabel}
          />

          {/* Bench Reserves Row */}
          <BenchReserves
            benchPlayers={participants.filter((p) => p.team === 'BENCH')}
            team={activeLineupTeam}
          />
        </div>
      )}

      {/* TAB 5: STATS */}
      {activeTab === 'stats' && (
        <Card elevation="level1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Thống kê cá nhân trận đấu
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Admin nhập số bàn thắng, kiến tạo và MVP sau khi kết thúc trận
              </p>
            </div>
            {isAdmin() && (
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 font-mono font-bold text-slate-500 uppercase bg-slate-50/60">
                  <th className="py-2.5 px-3">Cầu thủ</th>
                  <th className="py-2.5 px-3">Đội</th>
                  <th className="py-2.5 px-3 text-center">Bàn thắng</th>
                  <th className="py-2.5 px-3 text-center">Kiến tạo</th>
                  <th className="py-2.5 px-3 text-center">Cầu thủ xuất sắc (MVP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.map((p) => {
                  const currentInput = playerStatsInputs[p.user.id] || { goals: 0, assists: 0, isMvp: false };

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
                          <span className="font-bold text-slate-900">{p.user.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        {p.team === 'A' ? (
                          <span className="text-red-600">Đội A (Đỏ)</span>
                        ) : p.team === 'B' ? (
                          <span className="text-blue-600">Đội B (Xanh)</span>
                        ) : (
                          <span className="text-slate-500">Dự bị</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isAdmin() ? (
                          <input
                            type="number"
                            min={0}
                            className="w-16 px-2 py-1 rounded-xl bg-white border border-slate-300 text-center font-mono font-bold text-red-600 focus:outline-none focus:border-red-500"
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
                          <span className="font-mono font-bold text-red-600">{currentInput.goals}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isAdmin() ? (
                          <input
                            type="number"
                            min={0}
                            className="w-16 px-2 py-1 rounded-xl bg-white border border-slate-300 text-center font-mono font-bold text-blue-600 focus:outline-none focus:border-blue-500"
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
                        {isAdmin() ? (
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-amber-500 cursor-pointer accent-amber-500"
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
                        ) : currentInput.isMvp ? (
                          <span className="text-amber-600 font-bold font-mono">★ MVP</span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal Score Update */}
      <Modal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} title="Cập nhật tỉ số trận đấu">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={`Bàn thắng Đội A (${TEAM_A_NAME})`}
              type="number"
              min={0}
              value={scoreA}
              onChange={(e) => setScoreA(Number(e.target.value))}
            />
            <Input
              label={`Bàn thắng Đội B (${TEAM_B_NAME})`}
              type="number"
              min={0}
              value={scoreB}
              onChange={(e) => setScoreB(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsScoreModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveScore}>
              Lưu tỉ số
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
