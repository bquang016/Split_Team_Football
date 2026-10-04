import React, { useState } from 'react';
import { MatchParticipant, Team } from '../../types';
import { Avatar, Button, Badge } from '../../ui';

interface BenchReservesProps {
  benchPlayers: MatchParticipant[];
  team: Team;
  isEditable?: boolean;
  onStartPlayer?: (userId: string) => void;
  onDropOnBench?: (userId: string) => void;
}

export const BenchReserves: React.FC<BenchReservesProps> = ({
  benchPlayers,
  team,
  isEditable = false,
  onStartPlayer,
  onDropOnBench,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragOver(false);

    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.userId && data.from === 'pitch') {
          onDropOnBench?.(data.userId);
        }
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl p-4 transition-all duration-200 border ${
        isDragOver
          ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.005]'
          : 'bg-slate-50/90 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md'
      }`}
    >
      {/* Bench Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">chair</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-space font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Hàng Ghế Dự Bị
              </h3>
              <Badge variant="gold" size="sm">
                {benchPlayers.length} Cầu thủ
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-space mt-0.5">
              {isEditable
                ? 'Kéo thả cầu thủ lên sân để đá chính, hoặc kéo cầu thủ từ sân xuống đây để cho ra nghỉ'
                : 'Danh sách cầu thủ dự bị của đội'}
            </p>
          </div>
        </div>

        {isDragOver && (
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-space font-bold animate-pulse">
            Thả vào đây để đưa cầu thủ ra ghế dự bị
          </span>
        )}
      </div>

      {/* Bench Player Cards Horizontal Scroll */}
      {benchPlayers.length === 0 ? (
        <div className="text-center py-5 text-xs font-space text-slate-500 italic">
          Toàn bộ thành viên của đội đều đang có mặt trên sân thi đấu.
        </div>
      ) : (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {benchPlayers.map((p) => (
            <div
              key={p.user.id}
              draggable={isEditable}
              onDragStart={(e) => {
                if (!isEditable) return;
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({ userId: p.user.id, from: 'bench' })
                );
              }}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-space transition-all select-none shrink-0 shadow-xs ${
                isEditable ? 'cursor-grab active:cursor-grabbing hover:shadow-md hover:border-amber-400/50' : ''
              }`}
            >
              <div className="relative">
                <Avatar
                  name={p.user.fullName}
                  jerseyNumber={p.user.jerseyNumber}
                  size="sm"
                  showNumber
                />
                {p.isHost && (
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center font-space shadow-xs"
                    title="Đội trưởng"
                  >
                    C
                  </span>
                )}
              </div>

              <div className="min-w-0 max-w-[180px]">
                <div className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-xs">
                  {p.user.fullName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                  Số áo: #{p.user.jerseyNumber ?? '--'}
                </div>
              </div>

              {isEditable && onStartPlayer && (
                <button
                  type="button"
                  onClick={() => onStartPlayer(p.user.id)}
                  className="w-6 h-6 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Đưa vào sân"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
