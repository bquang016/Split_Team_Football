import React, { useEffect, useRef, useState } from 'react';
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
  onSpinComplete?: () => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  hostA,
  hostB,
  winner,
  durationMs = 4500,
  isSpinning,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

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
      ctx.fillStyle = isTeamA ? TEAM_A_COLOR : TEAM_B_COLOR;
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

  useEffect(() => {
    drawWheel(currentAngle);
  }, [hostA, hostB, currentAngle]);

  useEffect(() => {
    if (!isSpinning || !winner) return;

    const winnerIsA = winner.id === hostA.id;
    const targetSliceIndex = winnerIsA ? 0 : 1;
    const sliceCenterAngle = (targetSliceIndex + 0.5) * sliceAngle;
    const topPointerAngle = 1.5 * Math.PI;
    const baseTargetAngle = topPointerAngle - sliceCenterAngle;

    // Add 6 to 8 full rotations
    const totalRotation = 6 * 2 * Math.PI + baseTargetAngle;

    const startTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const angle = easeProgress * totalRotation;

      setCurrentAngle(angle);
      drawWheel(angle);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: winnerIsA ? ['#DC2626', '#F59E0B', '#FFFFFF'] : ['#2563EB', '#F59E0B', '#FFFFFF'],
        });

        if (onSpinComplete) {
          onSpinComplete();
        }
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isSpinning, winner]);

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
