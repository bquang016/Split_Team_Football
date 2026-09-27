import React, { useState } from 'react';
import { MatchParticipant, Team, User } from '../../types';
import { TeamColumn } from './TeamColumn';
import { PlayerPickCard } from './PlayerPickCard';
import { Card, Button, Badge } from '../../ui';
import { spinService } from '../../services/spinService';
import { TEAM_A_NAME, TEAM_B_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

interface PickListProps {
  matchId?: string;
  participants: MatchParticipant[];
  canPick: boolean;
  onPick: (userId: string, team: Team) => void;
  onReset: (userId: string) => void;
}

export const PickList: React.FC<PickListProps> = ({
  matchId,
  participants,
  canPick,
  onPick,
  onReset,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [turnWinner, setTurnWinner] = useState<User | null>(null);

  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');
  const benchPlayers = participants.filter((p) => p.team === 'BENCH');
  const availablePlayers = participants.filter((p) => p.team === 'NONE' || !p.team);

  const captainA = participants.find((p) => p.isHost && p.team === 'A')?.user;
  const captainB = participants.find((p) => p.isHost && p.team === 'B')?.user;

  const currentRound = Math.floor((teamAPlayers.length + teamBPlayers.length - 2) / 2) + 1;
  const isFinalOddPlayer = availablePlayers.length === 1;

  const handleSpinTurn = async () => {
    if (!matchId) return;
    setIsSpinning(true);
    try {
      const res = await spinService.spinRoundPick(matchId);
      if (res.success && res.data) {
        setTurnWinner(res.data.winner);
        toast.success(`${res.data.winner.fullName} đã giành lượt chọn trước ở lượt này!`);
      }
    } catch (err: any) {
      if (captainA && captainB) {
        const randWinner = Math.random() > 0.5 ? captainA : captainB;
        setTurnWinner(randWinner);
        toast.success(`${randWinner.fullName} đã giành quyền chọn trước!`);
      } else {
        toast.error(err.response?.data?.message || 'Không thể quay lượt chọn');
      }
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Round Spin & Turn Indicator Strip */}
      {canPick && (captainA || captainB) && (
        <Card elevation="glass" glow className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-space font-black">
                R{currentRound}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={isFinalOddPlayer ? 'error' : 'gold'} size="sm" dot>
                    {isFinalOddPlayer ? 'Lượt Quay Quyết Định Người Cuối Cùng' : `Lượt Pick Vòng ${currentRound}`}
                  </Badge>
                  <span className="text-xs text-slate-500 font-space">
                    Còn {availablePlayers.length} cầu thủ chưa phân đội
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-space mt-1">
                  {turnWinner ? (
                    <>
                      Lượt này: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{turnWinner.fullName}</strong> được quyền chọn trước!
                    </>
                  ) : (
                    'Quay để xác định Đội trưởng được quyền chọn trước ở lượt này.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon="casino"
                isLoading={isSpinning}
                onClick={handleSpinTurn}
              >
                {isSpinning ? 'Đang quay...' : isFinalOddPlayer ? 'Quay Lượt Người Cuối' : 'Quay Lượt Chọn'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 2 Team Columns */}
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

      {/* Available Pool */}
      <Card elevation="level1" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-heading font-black text-lg text-slate-900 dark:text-white">
              Danh sách chờ chọn ({availablePlayers.length})
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Bấm chọn vào Đội A hoặc Đội B để bổ sung cầu thủ
            </p>
          </div>
          {canPick && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Chế độ phân đội đang bật
            </span>
          )}
        </div>

        {availablePlayers.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400 italic">
            Tất cả cầu thủ đã được phân vào các đội!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onPickBench={() => onPick(p.user.id, 'BENCH')}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Bench / Reserves */}
      {benchPlayers.length > 0 && (
        <Card elevation="level1" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-black text-base text-slate-900 dark:text-slate-100">
              Cầu thủ dự bị (Bench) - {benchPlayers.length}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benchPlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onReset={() => onReset(p.user.id)}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
