import React, { useState, useEffect } from 'react';
import { Match, Team } from '../../types';
import { Card, Button, Badge, Avatar, Select, Modal } from '../../ui';
import { matchService } from '../../services/matchService';
import { TEAM_A_NAME, TEAM_B_NAME, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import toast from 'react-hot-toast';

interface LiveGoalTimelineProps {
  match: Match;
  isAdmin: boolean;
  onGoalRecorded: () => void;
}

export const LiveGoalTimeline: React.FC<LiveGoalTimelineProps> = ({
  match,
  isAdmin,
  onGoalRecorded,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>('A');
  const [scorerId, setScorerId] = useState<string>('');
  const [assistId, setAssistId] = useState<string>('');
  const [minute, setMinute] = useState<number>(1);
  const [goalCount, setGoalCount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [currentLiveMinute, setCurrentLiveMinute] = useState<number>(1);

  const isLive = match.status === 'IN_PROGRESS';
  const isFinished = match.status === 'COMPLETED';

  // Compute live match minute from start time
  // Ví dụ bắt đầu 19h00 (kết thúc 21h00), lúc 19h01 là phút thứ 1
  useEffect(() => {
    const calculateCurrentMinute = () => {
      let startTime: Date;
      if (match.startAt) {
        startTime = new Date(match.startAt);
      } else if (match.matchDate) {
        startTime = match.matchTime
          ? new Date(`${match.matchDate}T${match.matchTime}`)
          : new Date(match.matchDate);
      } else {
        startTime = new Date();
      }

      const diffMs = Date.now() - startTime.getTime();
      const diffMin = Math.max(1, Math.floor(diffMs / 60000));
      // Clamp for 2-hour match (1 - 120 mins)
      setCurrentLiveMinute(diffMin);
    };

    calculateCurrentMinute();
    const interval = setInterval(calculateCurrentMinute, 10000);
    return () => clearInterval(interval);
  }, [match.startAt, match.matchDate, match.matchTime]);

  const handleOpenAddGoal = (team?: Team) => {
    if (team) setSelectedTeam(team);
    setMinute(currentLiveMinute);
    setScorerId('');
    setAssistId('');
    setGoalCount(1);
    setIsModalOpen(true);
  };

  const participants = (match.participants || []).filter((p) => p && p.user);
  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');
  const selectableScorers =
    selectedTeam === 'A'
      ? (teamAPlayers.length > 0 ? teamAPlayers : participants)
      : (teamBPlayers.length > 0 ? teamBPlayers : participants);

  const scorerOptions = selectableScorers.map((p) => ({
    value: p.user?.id || p.id,
    label: p.user?.fullName || 'Cầu thủ',
    jerseyNumber: p.user?.jerseyNumber,
    avatar: p.user?.avatarUrl,
    sublabel: p.user?.username ? `@${p.user.username}` : undefined,
  }));

  const assistOptions = [
    { value: '', label: 'Không có kiến tạo (Solo / Penalty)', icon: 'person_off' },
    ...selectableScorers
      .filter((p) => (p.user?.id || p.id) !== scorerId)
      .map((p) => ({
        value: p.user?.id || p.id,
        label: p.user?.fullName || 'Cầu thủ',
        jerseyNumber: p.user?.jerseyNumber,
        avatar: p.user?.avatarUrl,
        sublabel: p.user?.username ? `@${p.user.username}` : undefined,
      })),
  ];

  const handleRecordGoal = async () => {
    if (!scorerId) {
      toast.error('Vui lòng chọn cầu thủ ghi bàn');
      return;
    }

    setSubmitting(true);
    try {
      const res = await matchService.recordGoal(match.id, {
        scorerId,
        assistId: assistId || undefined,
        team: selectedTeam,
        minute: Number(minute) || 1,
        goalCount: Number(goalCount) || 1,
      });

      if (res.success) {
        toast.success(`VÀOOO! Phút ${minute}': Bàn thắng đã được ghi nhận!`);
        setIsModalOpen(false);
        onGoalRecorded();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể ghi nhận bàn thắng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await matchService.deleteGoal(match.id, goalId);
      if (res.success) {
        toast.success('Đã xóa sự kiện bàn thắng');
        onGoalRecorded();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa bàn thắng');
    }
  };

  const goals = match.goals || [];

  return (
    <Card elevation="level1" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-2xl">sports_soccer</span>
            <h3 className="font-space font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Diễn Biến Bàn Thắng Trên Sân (Match Timeline)
            </h3>
            {isLive && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-space font-black animate-pulse">
                Phút {currentLiveMinute}' (Live)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ghi nhận trực tiếp cầu thủ ghi bàn, kiến tạo và thời gian phút thi đấu trên sân
          </p>
        </div>

        {isAdmin && (isLive || isFinished) && (
          <Button
            variant="primary"
            size="sm"
            leftIcon="sports_soccer"
            onClick={() => handleOpenAddGoal()}
          >
            + Thêm Bàn Thắng (Live)
          </Button>
        )}
      </div>

      {/* Goals Timeline List */}
      {goals.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 italic">
          Chưa có bàn thắng nào được ghi trong trận đấu
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-4">
          {goals.map((g) => {
            const isTeamA = g.team === 'A';
            const teamName = isTeamA ? TEAM_A_NAME : TEAM_B_NAME;
            const teamColor = isTeamA ? TEAM_A_COLOR : TEAM_B_COLOR;

            return (
              <div
                key={g.id}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {/* Minute Badge */}
                  <div
                    className="w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-space font-black text-xs text-white flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: teamColor }}
                  >
                    <span>{g.minute}'</span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="material-symbols-outlined text-emerald-500 text-base">sports_soccer</span>
                      <strong className="text-sm font-space font-bold text-slate-900 dark:text-white">
                        {g.scorer.fullName}
                      </strong>
                      <span className="text-xs text-slate-500 font-space font-medium">
                        (#{g.scorer.jerseyNumber || '—'})
                      </span>
                      {g.goalCount > 1 && (
                        <Badge variant="gold" size="sm">
                          x{g.goalCount} bàn
                        </Badge>
                      )}
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-space font-bold text-white shadow-2xs"
                        style={{ backgroundColor: teamColor }}
                      >
                        {teamName}
                      </span>
                    </div>

                    {g.assist && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-space mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-500">handshake</span>
                        Kiến tạo: <strong>{g.assist.fullName}</strong> (#{g.assist.jerseyNumber || '—'})
                      </span>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    title="Xóa bàn thắng (trừ lại tỉ số)"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ghi Nhận Bàn Thắng"
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 font-sans text-slate-900 dark:text-slate-100 pb-1">
          {/* Team Selector */}
          <div>
            <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Đội ghi bàn:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTeam('A');
                  setScorerId('');
                  setAssistId('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                  selectedTeam === 'A'
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {TEAM_A_NAME}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTeam('B');
                  setScorerId('');
                  setAssistId('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
                  selectedTeam === 'B'
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {TEAM_B_NAME}
              </button>
            </div>
          </div>

          {/* Scorer Selector */}
          <div>
            <Select
              label="Cầu thủ ghi bàn (*)"
              placeholder="Chọn cầu thủ ghi bàn..."
              value={scorerId}
              onChange={(e) => setScorerId(e.target.value)}
              options={scorerOptions}
            />
          </div>

          {/* Assist Selector */}
          <div>
            <Select
              label="Cầu thủ kiến tạo (Tùy chọn)"
              placeholder="Chọn cầu thủ kiến tạo..."
              value={assistId}
              onChange={(e) => setAssistId(e.target.value)}
              options={assistOptions}
            />
          </div>

          {/* Minute and Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phút thứ (trên sân):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-space font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-space font-bold text-slate-400 pointer-events-none">
                  phút
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-space mt-0.5 block">
                (19h01 = phút 1)
              </span>
            </div>

            <div>
              <label className="block text-xs font-space font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Số lượng quả:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={goalCount}
                onChange={(e) => setGoalCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-space font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon="sports_soccer"
              isLoading={submitting}
              onClick={handleRecordGoal}
            >
              Xác nhận bàn thắng
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
