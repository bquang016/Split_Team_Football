import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
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
  onSpinComplete?: (winner?: User | null) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  hostA,
  hostB,
  winner,
  durationMs = 4500,
  isSpinning,
  colorA = TEAM_A_COLOR,
  colorB = TEAM_B_COLOR,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);
  const animIdRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);
  const currentAnimatedWinnerIdRef = useRef<string | null>(null);
  const onSpinCompleteRef = useRef(onSpinComplete);
  onSpinCompleteRef.current = onSpinComplete;

  // Number of slices on the wheel (10 slices alternating A and B)
  const sliceCount = 10;
  const sliceAngle = (2 * Math.PI) / sliceCount;

  // Draw wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, size);

    // Save and rotate
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);

    for (let i = 0; i < sliceCount; i++) {
      const isTeamA = i % 2 === 0;
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = isTeamA ? colorA : colorB;
      ctx.fill();

      // Slice inner border
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // Text inside slice
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Space Grotesk", sans-serif';
      const text = isTeamA ? hostA.fullName : hostB.fullName;
      ctx.fillText(text.slice(0, 12), radius - 24, 4);
      ctx.restore();
    }

    // Outer rim ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#F59E0B'; // Gold Rim
    ctx.stroke();

    ctx.restore();

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    // Center icon text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('VS', center, center);
  };

  // Initial draw and redraw on host/color change
  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [hostA.id, hostB.id, colorA, colorB]);

  // Main animation handler
  useEffect(() => {
    if (!isSpinning || !winner) {
      if (!isSpinning) {
        if (animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
          animIdRef.current = null;
        }
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
        isAnimatingRef.current = false;
        currentAnimatedWinnerIdRef.current = null;
      }
      return;
    }

    // If already animating for this specific winner, let it continue without interruption
    if (isAnimatingRef.current && currentAnimatedWinnerIdRef.current === winner.id) {
      return;
    }

    // Cancel any previous loop
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    isAnimatingRef.current = true;
    currentAnimatedWinnerIdRef.current = winner.id;

    const winnerIsA = winner.id === hostA.id;
    const targetSliceIndex = winnerIsA ? 0 : 1;
    const sliceCenterAngle = (targetSliceIndex + 0.5) * sliceAngle;
    const topPointerAngle = 1.5 * Math.PI;
    const baseTargetAngle = topPointerAngle - sliceCenterAngle;

    // Add 6 to 8 full rotations
    const totalRotation = 6 * 2 * Math.PI + baseTargetAngle;
    const startTime = performance.now();

    const finishSpin = () => {
      if (!isAnimatingRef.current) return;
      isAnimatingRef.current = false;
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }

      currentAngleRef.current = totalRotation % (2 * Math.PI);
      drawWheel(totalRotation);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: winnerIsA ? ['#DC2626', '#F59E0B', '#FFFFFF'] : ['#2563EB', '#F59E0B', '#FFFFFF'],
      });

      if (onSpinCompleteRef.current) {
        onSpinCompleteRef.current(winner);
      }
    };

    // Safety fallback timeout: guaranteed to finish spin even if RAF is throttled or interrupted
    safetyTimeoutRef.current = setTimeout(finishSpin, durationMs + 600);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const angle = easeProgress * totalRotation;

      currentAngleRef.current = angle;
      drawWheel(angle);

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(animate);
      } else {
        finishSpin();
      }
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      // Intentionally do not cancel RAF here on re-render if winner hasn't changed
    };
  }, [isSpinning, winner?.id, durationMs, hostA.id, sliceAngle]);

  // Clean up all timers and RAF on unmount
  useEffect(() => {
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Top indicator arrow pointing down */}
      <div className="absolute top-2 z-20 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-[#F59E0B] filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.6)]" />
      </div>

      <div className="relative rounded-full p-2.5 bg-white border border-slate-200 shadow-xl">
        <canvas
          ref={canvasRef}
          width={340}
          height={340}
          className="rounded-full max-w-full"
        />
      </div>
    </div>
  );
};
