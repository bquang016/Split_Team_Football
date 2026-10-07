import React, { useEffect, useRef, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Trophy, Sparkles, Crown } from 'lucide-react';
import { User } from '../../types';
import { TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';

interface SpinWheelProps {
  hostA: User;
  hostB: User;
  winner?: User | null;
  spinSeed?: number | null;
  durationMs?: number;
  isSpinning: boolean;
  colorA?: string;
  colorB?: string;
  showWinnerCard?: boolean;
  onSpinComplete?: (winner?: User | null) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  hostA,
  hostB,
  winner,
  spinSeed,
  durationMs = 4500,
  isSpinning,
  colorA = TEAM_A_COLOR,
  colorB = TEAM_B_COLOR,
  showWinnerCard = true,
  onSpinComplete,
}) => {
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentWinner, setCurrentWinner] = useState<User | null>(winner || null);

  const accumulatedRotationRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const onSpinCompleteRef = useRef(onSpinComplete);
  onSpinCompleteRef.current = onSpinComplete;
  const timerSafetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 10 slices alternating between Team A and Team B (5 slices each)
  const sliceCount = 10;
  const sliceAngle = 360 / sliceCount; // 36 degrees per slice

  // Initialize or get Web Audio Context
  const getAudioContext = () => {
    if (!soundEnabled) return null;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  // Synthesize realistic mechanical peg ticker click sound
  const playTickSound = (volume = 0.05, pitch = 650) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Synthesize victorious harmonic chime upon landing
  const playVictoryChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
      });
    } catch {
      // Ignored
    }
  };

  // Geometry: center (200, 200), radius 172
  const center = 200;
  const radius = 172;

  // Generate slice path data and positions
  const slices = useMemo(() => {
    return Array.from({ length: sliceCount }, (_, i) => {
      const isTeamA = i % 2 === 0;
      const startAngleDeg = i * sliceAngle;
      const endAngleDeg = (i + 1) * sliceAngle;
      const midAngleDeg = (i + 0.5) * sliceAngle;

      const toRad = (deg: number) => (deg * Math.PI) / 180;

      // Clockwise polar coordinates with 0° pointing straight UP (12 o'clock)
      const x1 = center + radius * Math.sin(toRad(startAngleDeg));
      const y1 = center - radius * Math.cos(toRad(startAngleDeg));
      const x2 = center + radius * Math.sin(toRad(endAngleDeg));
      const y2 = center - radius * Math.cos(toRad(endAngleDeg));

      // SVG path: Center -> Start Point -> Arc -> Center
      const pathData = `M ${center} ${center} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

      return {
        index: i,
        isTeamA,
        startAngleDeg,
        endAngleDeg,
        midAngleDeg,
        pathData,
        host: isTeamA ? hostA : hostB,
        label: isTeamA ? hostA.fullName : hostB.fullName,
        teamName: isTeamA ? 'ĐỘI A' : 'ĐỘI B',
      };
    });
  }, [hostA, hostB, sliceAngle]);

  // 20 outer rim LED rivets
  const ledRivets = useMemo(() => {
    const count = 20;
    const rimRadius = 186;
    return Array.from({ length: count }, (_, i) => {
      const angleDeg = (i * 360) / count;
      const rad = (angleDeg * Math.PI) / 180;
      const cx = center + rimRadius * Math.sin(rad);
      const cy = center - rimRadius * Math.cos(rad);
      return { id: i, cx, cy, angleDeg };
    });
  }, []);

  // Main Spin Trigger via CSS 3D Transform
  useEffect(() => {
    if (!isSpinning || !winner) {
      if (!isSpinning) {
        setIsAnimating(false);
      }
      return;
    }

    setIsAnimating(true);
    setHasCompleted(false);
    setCurrentWinner(winner);

    const winnerIsA = winner.id === hostA.id;
    // Choose winning wedge: index 0, 2, 4, 6, 8 for Team A; index 1, 3, 5, 7, 9 for Team B
    const availableWedges = winnerIsA ? [0, 2, 4, 6, 8] : [1, 3, 5, 7, 9];
    const seedNumber = spinSeed ? Math.abs(spinSeed) : Math.floor(Math.random() * 100);
    const chosenWedgeIndex = availableWedges[seedNumber % availableWedges.length];
    const targetMidAngle = (chosenWedgeIndex + 0.5) * sliceAngle;

    // Mathematics of top pointer alignment:
    // When wheel rotates by α degrees clockwise, slice with original midAngle arrives at top pointer when:
    // midAngle + α ≡ 360° (mod 360°)  =>  neededModulo = (360 - midAngle) % 360
    const neededModulo = (360 - targetMidAngle + 360) % 360;
    const currentModulo = ((accumulatedRotationRef.current % 360) + 360) % 360;
    let deltaToTarget = (neededModulo - currentModulo + 360) % 360;

    // Ensure at least 6 to 8 thrilling full spins (6 * 360 = 2160 deg)
    const fullSpins = 7 * 360;
    const totalNewRotation = accumulatedRotationRef.current + fullSpins + deltaToTarget;
    accumulatedRotationRef.current = totalNewRotation;

    setRotationDeg(totalNewRotation);

    // Audio clicks simulated along deceleration curve
    if (soundEnabled) {
      const clickDelays = [
        60, 120, 180, 240, 300, 360, 430, 500, 580, 670, 770, 880, 1000, 1140, 1290, 1460, 1650, 1860,
        2100, 2370, 2670, 3000, 3370, 3770, 4150,
      ];
      clickDelays.forEach((delay, idx) => {
        if (delay <= durationMs) {
          setTimeout(() => {
            playTickSound(0.04 + (idx / clickDelays.length) * 0.04, 550 + (idx % 2 === 0 ? 80 : -40));
          }, delay);
        }
      });
    }

    // Safety timeout in case transitionend does not fire (background tab, minimized, etc.)
    if (timerSafetyRef.current) clearTimeout(timerSafetyRef.current);
    timerSafetyRef.current = setTimeout(() => {
      handleComplete(winner);
    }, durationMs + 180);

    return () => {
      if (timerSafetyRef.current) clearTimeout(timerSafetyRef.current);
    };
  }, [isSpinning, winner?.id, durationMs, hostA.id, sliceAngle, spinSeed, soundEnabled]);

  const handleComplete = (wonPlayer: User) => {
    setIsAnimating(false);
    setHasCompleted(true);
    playVictoryChime();

    // Confetti celebration
    const isTeamA = wonPlayer.id === hostA.id;
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: isTeamA
        ? ['#EF4444', '#F59E0B', '#FFFFFF', '#DC2626']
        : ['#3B82F6', '#F59E0B', '#FFFFFF', '#1D4ED8'],
    });

    if (onSpinCompleteRef.current) {
      onSpinCompleteRef.current(wonPlayer);
    }
  };

  const handleTransitionEnd = () => {
    if (isAnimating && currentWinner) {
      if (timerSafetyRef.current) clearTimeout(timerSafetyRef.current);
      handleComplete(currentWinner);
    }
  };

  const winnerIsTeamA = currentWinner?.id === hostA.id;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-sm sm:max-w-md mx-auto py-2">
      {/* Custom Styles for GPU Animations & Lighting */}
      <style>{`
        @keyframes tickerFlutter {
          0% { transform: translate(-50%, 0) rotate(0deg); }
          25% { transform: translate(-50%, 0) rotate(-16deg); }
          50% { transform: translate(-50%, 0) rotate(2deg); }
          75% { transform: translate(-50%, 0) rotate(14deg); }
          100% { transform: translate(-50%, 0) rotate(0deg); }
        }
        @keyframes ledChasingGlow {
          0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.4)); }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(251, 191, 36, 1)); }
        }
        @keyframes ambientAuraPulse {
          0%, 100% { transform: scale(0.96); opacity: 0.45; }
          50% { transform: scale(1.04); opacity: 0.8; }
        }
        .ticker-wobble {
          animation: tickerFlutter 0.14s ease-in-out infinite;
        }
        .wheel-gpu-accelerated {
          will-change: transform;
          transform-origin: center center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      {/* Top Controls: Sound Toggle */}
      <div className="w-full flex items-center justify-end px-4 mb-2">
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl transition-all border ${
            soundEnabled
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={soundEnabled ? 'Tắt âm thanh vòng quay' : 'Bật âm thanh vòng quay'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Main Wheel Wrapper with Glowing Outer Aura */}
      <div className="relative flex items-center justify-center p-3">
        {/* Dynamic Neon Ambient Glow behind the wheel */}
        <div
          className={`absolute inset-4 rounded-full filter blur-2xl pointer-events-none transition-all duration-700 ${
            isAnimating
              ? 'bg-gradient-to-tr from-rose-500/40 via-amber-500/30 to-blue-500/40 animate-pulse'
              : hasCompleted && currentWinner
              ? winnerIsTeamA
                ? 'bg-rose-500/40'
                : 'bg-blue-500/40'
              : 'bg-amber-500/20'
          }`}
          style={{ animation: isAnimating ? 'ambientAuraPulse 1.8s ease-in-out infinite' : undefined }}
        />

        {/* TOP POINTER / TICKER NEEDLE (Pointed directly at 12 o'clock) */}
        <div
          className={`absolute top-0 left-1/2 z-30 pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] ${
            isAnimating ? 'ticker-wobble' : ''
          }`}
          style={{
            transform: 'translate(-50%, 0)',
            transition: !isAnimating ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          }}
        >
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
            {/* Golden Spear Pointer Body */}
            <path
              d="M 22 50 L 7 14 C 4 7 9 0 17 0 L 27 0 C 35 0 40 7 37 14 Z"
              fill="url(#pointerGoldGrad)"
              stroke="#B45309"
              strokeWidth="2"
            />
            {/* Metallic Inner Highlight */}
            <path d="M 22 43 L 13 14 L 31 14 Z" fill="url(#pointerInnerGrad)" />
            {/* Center Ruby Indicator Jewel */}
            <circle cx="22" cy="14" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="20.5" cy="12.5" r="2" fill="#FFFFFF" opacity="0.8" />

            <defs>
              <linearGradient id="pointerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="pointerInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3D Wheel Frame with Golden Bezel */}
        <div className="relative rounded-full p-2 bg-gradient-to-b from-amber-200 via-amber-600 to-amber-950 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_2px_8px_rgba(255,255,255,0.6)] border border-amber-400/40">
          {/* THE ROTATING SVG WHEEL (Hardware Accelerated CSS 3D Transform) */}
          <svg
            width="350"
            height="350"
            viewBox="0 0 400 400"
            className="rounded-full wheel-gpu-accelerated overflow-visible"
            style={{
              transform: `rotate(${rotationDeg}deg) translateZ(0)`,
              transition: isAnimating
                ? `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)`
                : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <defs>
              {/* Team A Red Gradient (Tây Ban Nha) */}
              <linearGradient id="teamAGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorA || '#EF4444'} />
                <stop offset="70%" stopColor="#B91C1C" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>

              {/* Team B Blue Gradient (Pháp) */}
              <linearGradient id="teamBGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorB || '#3B82F6'} />
                <stop offset="70%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>

              {/* Bezel Metallic Gold Rim */}
              <radialGradient id="goldBezelGrad" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="92%" stopColor="#F59E0B" />
                <stop offset="97%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              {/* Center Hub Metal Dome */}
              <radialGradient id="centerHubGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="40%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <radialGradient id="goldCapGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </radialGradient>

              {/* Drop shadow for text & pins */}
              <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Base Background Circle */}
            <circle cx={center} cy={center} r={radius + 14} fill="url(#goldBezelGrad)" />
            <circle cx={center} cy={center} r={radius} fill="#0F172A" />

            {/* SLICES (10 Slices with Rich Graphics) */}
            <g>
              {slices.map((slice) => (
                <g key={slice.index}>
                  {/* Slice Wedge Path */}
                  <path
                    d={slice.pathData}
                    fill={slice.isTeamA ? 'url(#teamAGrad)' : 'url(#teamBGrad)'}
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="1.75"
                  />

                  {/* Inner Shading Arc for 3D depth */}
                  <path
                    d={slice.pathData}
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.25)"
                    strokeWidth="1"
                  />

                  {/* Rotated Content Group inside each slice */}
                  <g transform={`rotate(${slice.midAngleDeg}, ${center}, ${center})`}>
                    {/* Team Accent Tag */}
                    <text
                      x={center}
                      y={center - radius + 32}
                      textAnchor="middle"
                      fill="#FEF08A"
                      fontSize="9"
                      fontWeight="900"
                      letterSpacing="1"
                      filter="url(#shadowFilter)"
                      className="font-space"
                    >
                      {slice.teamName}
                    </text>

                    {/* Captain / Host Name */}
                    <text
                      x={center}
                      y={center - radius + 52}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="12.5"
                      fontWeight="900"
                      filter="url(#shadowFilter)"
                      className="font-space"
                    >
                      {slice.label.length > 10 ? `${slice.label.slice(0, 9)}.` : slice.label}
                    </text>

                    {/* Decorative Star/Bullet */}
                    <circle
                      cx={center}
                      cy={center - radius + 70}
                      r="2.5"
                      fill="rgba(255, 255, 255, 0.7)"
                    />
                  </g>
                </g>
              ))}
            </g>

            {/* Outer Rim Chrome Edge */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="4"
              opacity="0.9"
            />

            {/* 20 RIM CHROME RIVETS & LED LIGHTS */}
            <g>
              {ledRivets.map((led, idx) => (
                <g key={led.id}>
                  {/* Chrome Pin Socket */}
                  <circle cx={led.cx} cy={led.cy} r="6" fill="#78350F" />
                  <circle cx={led.cx} cy={led.cy} r="4.5" fill="#F59E0B" />
                  {/* Glowing LED Bulb (Alternating marquee chase when spinning) */}
                  <circle
                    cx={led.cx}
                    cy={led.cy}
                    r="2.8"
                    fill="#FFFBEB"
                    style={{
                      animation: isAnimating
                        ? `ledChasingGlow 0.4s ease-in-out infinite ${idx * 0.04}s`
                        : undefined,
                    }}
                  />
                </g>
              ))}
            </g>

            {/* CENTER HUB (3D Metallic Sphere & VS Emblem) */}
            <g filter="url(#shadowFilter)">
              {/* Outer Golden Bezel */}
              <circle cx={center} cy={center} r="38" fill="url(#goldCapGrad)" stroke="#78350F" strokeWidth="2.5" />
              {/* Metallic Inner Dome */}
              <circle cx={center} cy={center} r="28" fill="url(#centerHubGrad)" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Glass Specular Reflection Highlight */}
              <ellipse cx={center - 7} cy={center - 10} rx="12" ry="6" fill="#FFFFFF" opacity="0.35" />

              {/* Center VS Typography */}
              <text
                x={center}
                y={center + 5}
                textAnchor="middle"
                fill="#FDE047"
                fontSize="14"
                fontWeight="900"
                letterSpacing="1.5"
                className="font-space"
                filter="url(#shadowFilter)"
              >
                VS
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* WINNER REVEAL PRESENTATION BADGE */}
      {showWinnerCard && hasCompleted && currentWinner ? (
        <div className="mt-3 w-full max-w-sm p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-500/20 border-2 border-amber-400/60 shadow-[0_8px_32px_rgba(245,158,11,0.3)] animate-in zoom-in-95 duration-400 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Crown size={18} className="text-amber-400 animate-bounce" />
            <span className="text-xs font-space font-black tracking-widest uppercase text-amber-300">
              KẾT QUẢ VÒNG QUAY MAY MẮN
            </span>
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
          </div>

          <div className="font-space font-black text-xl sm:text-2xl text-white tracking-tight">
            {currentWinner.fullName}
          </div>

          <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                winnerIsTeamA ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
              }`}
            />
            <span className="text-xs font-space font-bold text-slate-200">
              Đội {winnerIsTeamA ? 'Tây Ban Nha (Đỏ)' : 'Pháp (Xanh)'}
            </span>
            <Trophy size={14} className="text-amber-400" />
          </div>

          <p className="text-xs text-emerald-400 font-space font-bold mt-2.5">
            GIÀNH QUYỀN CHỌN CẦU THỦ TRƯỚC TRONG LƯỢT NÀY!
          </p>
        </div>
      ) : isAnimating ? (
        <div className="mt-3 flex items-center gap-2 text-xs font-space text-amber-300/90 animate-pulse">
          <Sparkles size={14} className="text-amber-400" />
          <span>Vòng quay may mắn đang phân định quyền chọn trước...</span>
        </div>
      ) : null}
    </div>
  );
};
