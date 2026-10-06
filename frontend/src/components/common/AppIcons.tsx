import React from 'react';
import { MorphIcon } from 'morphicons/react';
import {
  Star,
  Crown,
  Trophy,
  Medal,
  Calendar,
  CalendarRange,
  Footprints,
  Shield,
  BarChart3,
  Award,
  Flame,
  Zap,
} from 'lucide';
import clsx from 'clsx';

interface IconProps {
  size?: number;
  className?: string;
  fill?: boolean;
}

// Soccer Ball (Crisp Lucide-style stroke SVG)
export const BallIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={clsx('inline-block shrink-0', className)}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m12 7-3.5 2.5 1.5 4h4l1.5-4z" />
    <path d="M12 7V2" />
    <path d="M8.5 9.5 4 8" />
    <path d="M10 13.5 7.5 17" />
    <path d="M14 13.5 16.5 17" />
    <path d="M15.5 9.5 20 8" />
  </svg>
);

// Star Icon powered by Morphicons
export const StarIcon: React.FC<IconProps> = ({ size = 16, className = '', fill = false }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon
      icon={Star}
      size={size}
      strokeWidth={2}
      className={clsx(fill && 'fill-current')}
    />
  </span>
);

// Crown Icon powered by Morphicons
export const CrownIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Crown} size={size} strokeWidth={2} />
  </span>
);

// Trophy Icon powered by Morphicons
export const TrophyIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Trophy} size={size} strokeWidth={2} />
  </span>
);

// Medal Icon powered by Morphicons
export const MedalIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Medal} size={size} strokeWidth={2} />
  </span>
);

// Calendar Icon (Tuần này) powered by Morphicons
export const CalendarIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Calendar} size={size} strokeWidth={2} />
  </span>
);

// Calendar Range Icon (Tháng này) powered by Morphicons
export const CalendarRangeIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={CalendarRange} size={size} strokeWidth={2} />
  </span>
);

// Assist / Footprints Icon powered by Morphicons
export const AssistIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Footprints} size={size} strokeWidth={2} />
  </span>
);

// Save / Goalkeeper Shield Icon powered by Morphicons
export const SaveIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Shield} size={size} strokeWidth={2} />
  </span>
);

// Chart Icon powered by Morphicons
export const ChartIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={BarChart3} size={size} strokeWidth={2} />
  </span>
);

// Award Icon powered by Morphicons
export const AwardIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Award} size={size} strokeWidth={2} />
  </span>
);

// Flame Icon powered by Morphicons
export const FlameIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Flame} size={size} strokeWidth={2} />
  </span>
);

// Zap Icon powered by Morphicons
export const ZapIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <span className={clsx('inline-flex items-center justify-center shrink-0', className)}>
    <MorphIcon icon={Zap} size={size} strokeWidth={2} />
  </span>
);
