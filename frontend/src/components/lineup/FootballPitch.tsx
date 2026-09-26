import React, { useRef, useState } from 'react';
import { MatchLineup, Position, Team } from '../../types';
import { PlayerToken } from './PlayerToken';

interface FootballPitchProps {
  lineups: MatchLineup[];
  activeTeam: Team;
  isEditable?: boolean;
  onUpdatePosition?: (userId: string, xPercent: number, yPercent: number) => void;
  onUpdatePositionLabel?: (userId: string, positionLabel: Position) => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  lineups,
  activeTeam,
  isEditable = false,
  onUpdatePosition,
  onUpdatePositionLabel,
}) => {
  const pitchRef = useRef<HTMLDivElement | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [draggingUserId, setDraggingUserId] = useState<string | null>(null);

  // Filter players for active team
  const teamLineups = lineups.filter((l) => l.team === activeTeam);

  const handlePointerDown = (userId: string) => {
    if (!isEditable) return;
    setDraggingUserId(userId);
    setSelectedUserId(userId);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingUserId || !isEditable || !onUpdatePosition) return;
    const pitch = pitchRef.current;
    if (!pitch) return;

    const rect = pitch.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp coordinates within 6% to 94%
    x = Math.max(6, Math.min(94, Math.round(x * 10) / 10));
    y = Math.max(6, Math.min(94, Math.round(y * 10) / 10));

    onUpdatePosition(draggingUserId, x, y);
  };

  const handlePointerUp = () => {
    setDraggingUserId(null);
  };

  const positionsList: Position[] = [
    'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'CAM', 'ST', 'LW', 'RW'
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Pitch Canvas Area */}
      <div
        id="football-pitch-canvas"
        ref={pitchRef}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative w-full aspect-[4/5] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-inner select-none touch-none border border-slate-200"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #16a34a 0%, #15803d 70%, #166534 100%)',
        }}
      >
        {/* Grass Cut Striping Layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 44px, transparent 44px, transparent 88px)',
          }}
        />

        {/* Pitch Lines (SVG markup for standard 7v7 soccer pitch) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Boundary */}
          <rect x="25" y="25" width="750" height="550" stroke="rgba(255,255,255,0.85)" strokeWidth="3" rx="4" />
          
          {/* Halfway Line */}
          <line x1="25" y1="300" x2="775" y2="300" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
          
          {/* Center Circle */}
          <circle cx="400" cy="300" r="75" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
          <circle cx="400" cy="300" r="5" fill="rgba(255,255,255,0.9)" />

          {/* Top Penalty Area (Opponent Box) */}
          <rect x="250" y="25" width="300" height="120" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
          <rect x="330" y="25" width="140" height="45" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
          <circle cx="400" cy="100" r="4.5" fill="rgba(255,255,255,0.9)" />

          {/* Bottom Penalty Area (Our Box / GK) */}
          <rect x="250" y="455" width="300" height="120" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
          <rect x="330" y="530" width="140" height="45" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
          <circle cx="400" cy="500" r="4.5" fill="rgba(255,255,255,0.9)" />

          {/* Corner Arcs */}
          <path d="M 25 45 A 20 20 0 0 0 45 25" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
          <path d="M 755 25 A 20 20 0 0 0 775 45" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
          <path d="M 25 555 A 20 20 0 0 1 45 575" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
          <path d="M 755 575 A 20 20 0 0 1 775 555" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
        </svg>

        {/* Player Tokens on Pitch */}
        {teamLineups.map((player) => (
          <PlayerToken
            key={player.user.id}
            user={player.user}
            team={player.team}
            positionLabel={player.positionLabel}
            jerseyNumber={player.jerseyNumber}
            xPercent={player.xPercent ?? 50}
            yPercent={player.yPercent ?? 50}
            isSelected={selectedUserId === player.user.id}
            onSelect={() => setSelectedUserId(player.user.id)}
            onDragStart={() => handlePointerDown(player.user.id)}
          />
        ))}

        {teamLineups.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="px-4 py-2 rounded-xl bg-slate-900/80 text-white text-xs font-mono backdrop-blur-sm border border-white/10 shadow-lg">
              Chưa có cầu thủ nào trong sơ đồ của Đội {activeTeam}
            </span>
          </div>
        )}
      </div>

      {/* Position selector when player selected */}
      {isEditable && selectedUserId && onUpdatePositionLabel && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-1.5 animate-in fade-in duration-150 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-600 mr-2">Vị trí thi đấu:</span>
          {positionsList.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => onUpdatePositionLabel(selectedUserId, pos)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-xs font-mono font-bold text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
            >
              {pos}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
