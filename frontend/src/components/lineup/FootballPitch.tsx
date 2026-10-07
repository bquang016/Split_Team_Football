import React, { useRef, useState } from 'react';
import { MatchLineup, Position, Team } from '../../types';
import { DEFAULT_POSITION_COORDINATES } from '../../utils/constants';
import { PlayerToken } from './PlayerToken';

interface FootballPitchProps {
  lineups: MatchLineup[];
  activeTeam: Team;
  teamLabel?: string;
  formationName?: string;
  isEditable?: boolean;
  selectedUserId?: string | null;
  pitchTheme?: 'emerald' | 'midnight' | 'charcoal' | 'daylight';
  showNames?: boolean;
  showNumbers?: boolean;
  showPositions?: boolean;
  showZones?: boolean;
  onSelectUser?: (userId: string | null) => void;
  onUpdatePosition?: (userId: string, xPercent: number, yPercent: number) => void;
  onUpdatePositionLabel?: (userId: string, positionLabel: Position) => void;
  onAddPlayerFromBench?: (userId: string, xPercent: number, yPercent: number) => void;
  onBenchPlayer?: (userId: string) => void;
}

export const FootballPitch: React.FC<FootballPitchProps> = ({
  lineups,
  activeTeam,
  teamLabel,
  formationName,
  isEditable = false,
  selectedUserId = null,
  pitchTheme = 'emerald',
  showNames = true,
  showNumbers = true,
  showPositions = true,
  showZones = false,
  onSelectUser,
  onUpdatePosition,
  onUpdatePositionLabel,
  onAddPlayerFromBench,
  onBenchPlayer,
}) => {
  const pitchRef = useRef<HTMLDivElement | null>(null);
  const [draggingUserId, setDraggingUserId] = useState<string | null>(null);
  const [isDragOverPitch, setIsDragOverPitch] = useState(false);

  // Filter players for active team
  const teamLineups = lineups.filter((l) => l.team === activeTeam);

  const handlePointerDown = (userId: string) => {
    if (!isEditable) return;
    setDraggingUserId(userId);
    onSelectUser?.(userId);
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

  // External Drag & Drop from Bench / Sidebar into Pitch
  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOverPitch(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only leave if exiting the pitch container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOverPitch(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragOverPitch(false);

    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.userId && data.from === 'bench') {
          const rect = pitchRef.current?.getBoundingClientRect();
          if (rect) {
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            let y = ((e.clientY - rect.top) / rect.height) * 100;
            x = Math.max(8, Math.min(92, Math.round(x)));
            y = Math.max(8, Math.min(92, Math.round(y)));
            onAddPlayerFromBench?.(data.userId, x, y);
          }
        }
      }
    } catch {
      // Ignore
    }
  };

  // Theme-specific styles
  const getThemeBackground = () => {
    switch (pitchTheme) {
      case 'daylight':
        return 'radial-gradient(ellipse at 50% 50%, #22c55e 0%, #16a34a 60%, #15803d 100%)';
      case 'midnight':
        return 'radial-gradient(ellipse at 50% 50%, #0f172a 0%, #090d16 65%, #020617 100%)';
      case 'charcoal':
        return 'radial-gradient(ellipse at 50% 50%, #27272a 0%, #18181b 65%, #09090b 100%)';
      case 'emerald':
      default:
        return 'radial-gradient(ellipse at 50% 50%, #15803d 0%, #166534 60%, #14532d 100%)';
    }
  };

  const getThemeStripeColor = () => {
    switch (pitchTheme) {
      case 'daylight':
        return 'rgba(255, 255, 255, 0.12)';
      case 'midnight':
        return 'rgba(56, 189, 248, 0.04)';
      case 'charcoal':
        return 'rgba(255, 255, 255, 0.035)';
      case 'emerald':
      default:
        return 'rgba(255, 255, 255, 0.06)';
    }
  };

  const getThemeLineColor = () => {
    switch (pitchTheme) {
      case 'daylight':
        return 'rgba(255, 255, 255, 0.95)';
      case 'midnight':
        return 'rgba(56, 189, 248, 0.75)';
      case 'charcoal':
        return 'rgba(244, 244, 245, 0.85)';
      case 'emerald':
      default:
        return 'rgba(255, 255, 255, 0.85)';
    }
  };

  const positionsList: Position[] = [
    'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'CAM', 'ST', 'LW', 'RW'
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Pitch Canvas Area (Target for PNG Export) */}
      <div
        id="football-pitch-canvas"
        ref={pitchRef}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onSelectUser?.(null)}
        className={`relative w-full aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl select-none touch-none border transition-all ${
          isDragOverPitch
            ? 'ring-4 ring-amber-400 border-amber-400'
            : 'border-slate-800'
        }`}
        style={{
          background: getThemeBackground(),
        }}
      >
        {/* Grass Cut Striping Layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(0deg, ${getThemeStripeColor()} 0px, ${getThemeStripeColor()} 44px, transparent 44px, transparent 88px)`,
          }}
        />

        {/* Pitch Lines (SVG markup for standard 7v7 soccer pitch) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tactical Zones Overlay (Optional) */}
          {showZones && (
            <g opacity="0.3" strokeDasharray="6 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              {/* Thirds lines */}
              <line x1="25" y1="200" x2="775" y2="200" />
              <line x1="25" y1="400" x2="775" y2="400" />
              {/* Half-spaces lines */}
              <line x1="250" y1="25" x2="250" y2="575" />
              <line x1="550" y1="25" x2="550" y2="575" />
            </g>
          )}

          {/* Outer Boundary */}
          <rect
            x="25"
            y="25"
            width="750"
            height="550"
            stroke={getThemeLineColor()}
            strokeWidth="3"
            rx="6"
          />

          {/* Halfway Line */}
          <line
            x1="25"
            y1="300"
            x2="775"
            y2="300"
            stroke={getThemeLineColor()}
            strokeWidth="3"
          />

          {/* Center Circle */}
          <circle
            cx="400"
            cy="300"
            r="75"
            stroke={getThemeLineColor()}
            strokeWidth="3"
          />
          <circle cx="400" cy="300" r="5" fill={getThemeLineColor()} />

          {/* Top Penalty Area (Opponent Box / Goal) */}
          <rect
            x="250"
            y="25"
            width="300"
            height="120"
            stroke={getThemeLineColor()}
            strokeWidth="3"
          />
          <rect
            x="330"
            y="25"
            width="140"
            height="45"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
          <circle cx="400" cy="100" r="4.5" fill={getThemeLineColor()} />

          {/* Bottom Penalty Area (Our Box / GK) */}
          <rect
            x="250"
            y="455"
            width="300"
            height="120"
            stroke={getThemeLineColor()}
            strokeWidth="3"
          />
          <rect
            x="330"
            y="530"
            width="140"
            height="45"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
          <circle cx="400" cy="500" r="4.5" fill={getThemeLineColor()} />

          {/* Corner Arcs */}
          <path
            d="M 25 45 A 20 20 0 0 0 45 25"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
          <path
            d="M 755 25 A 20 20 0 0 0 775 45"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
          <path
            d="M 25 555 A 20 20 0 0 1 45 575"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
          <path
            d="M 755 575 A 20 20 0 0 1 775 555"
            stroke={getThemeLineColor()}
            strokeWidth="2.5"
          />
        </svg>

        {/* Tactical Header Badge (Captured on PNG Export) */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-0 font-space select-none">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-black text-xs uppercase tracking-wider shadow-lg">
              {teamLabel || `Đội ${activeTeam}`}
            </span>
            {formationName && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-slate-950 font-black text-xs shadow-md">
                Sơ đồ {formationName}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest drop-shadow-sm">
              ChimMocCanh • Sa Bàn 7v7
            </span>
          </div>
        </div>

        {/* Drag Over Overlay Alert */}
        {isDragOverPitch && (
          <div className="absolute inset-0 bg-amber-500/15 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-30 animate-in fade-in duration-150">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-400 text-amber-300 font-space font-bold text-xs flex items-center gap-2 shadow-2xl">
              <span className="material-symbols-outlined text-lg animate-bounce">
                touch_app
              </span>
              <span>Thả tại đây để đặt cầu thủ vào sân</span>
            </div>
          </div>
        )}

        {/* Player Tokens on Pitch */}
        {teamLineups.map((player) => {
          const defaultCoord = player.positionLabel ? DEFAULT_POSITION_COORDINATES[player.positionLabel] : undefined;
          const x = typeof player.xPercent === 'number' && !isNaN(player.xPercent) ? player.xPercent : (defaultCoord?.x ?? 50);
          const y = typeof player.yPercent === 'number' && !isNaN(player.yPercent) ? player.yPercent : (defaultCoord?.y ?? 50);

          return (
            <PlayerToken
              key={player.user.id}
              user={player.user}
              team={player.team}
              positionLabel={player.positionLabel}
              jerseyNumber={player.jerseyNumber}
              xPercent={x}
              yPercent={y}
              isSelected={selectedUserId === player.user.id}
              showNames={showNames}
              showNumbers={showNumbers}
              showPositions={showPositions}
              onSelect={() => onSelectUser?.(player.user.id)}
              onDragStart={() => handlePointerDown(player.user.id)}
            />
          );
        })}

        {teamLineups.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-5 py-3 rounded-2xl bg-slate-900/90 text-white text-xs font-space font-medium backdrop-blur-md border border-white/10 shadow-2xl text-center max-w-xs">
              <span className="material-symbols-outlined text-3xl text-emerald-400 mb-1">
                sports_soccer
              </span>
              <p>Chưa có cầu thủ nào trên sân.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Kéo cầu thủ từ hàng ghế dự bị vào sân hoặc chọn sơ đồ mẫu ở thanh bên phải.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick position chips when a player is selected */}
      {isEditable && selectedUserId && onUpdatePositionLabel && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-sm font-space animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Vị trí:</span>
            {positionsList.map((pos) => {
              const currentPos = teamLineups.find((p) => p.user.id === selectedUserId)?.positionLabel;
              return (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onUpdatePositionLabel(selectedUserId, pos)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer border ${
                    currentPos === pos
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>

          {onBenchPlayer && (
            <button
              type="button"
              onClick={() => onBenchPlayer(selectedUserId)}
              className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              title="Đưa ra ghế dự bị"
            >
              <span className="material-symbols-outlined text-sm">chair</span>
              Dự bị
            </button>
          )}
        </div>
      )}
    </div>
  );
};
