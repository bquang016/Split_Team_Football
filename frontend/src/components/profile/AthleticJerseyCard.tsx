import React, { useState } from 'react';
import { User } from '../../types';
import clsx from 'clsx';

export interface AthleticJerseyCardProps {
  player: User;
}

type KitTheme = 'spain' | 'france';

export const AthleticJerseyCard: React.FC<AthleticJerseyCardProps> = ({ player }) => {
  const [activeTheme, setActiveTheme] = useState<KitTheme>('spain');

  const jerseyNumber = player.jerseyNumber;
  const hasNumber = jerseyNumber !== undefined && jerseyNumber !== null;

  // Use full name without any slicing or cutting
  const fullNameUpper = (player.fullName || 'CẦU THỦ').trim().toUpperCase();

  // Dynamic font size and letter spacing based on length
  const nameLength = fullNameUpper.length;
  let nameFontSize = 13;
  let nameLetterSpacing = 2.2;

  if (nameLength <= 8) {
    nameFontSize = 13;
    nameLetterSpacing = 2.2;
  } else if (nameLength <= 12) {
    nameFontSize = 11;
    nameLetterSpacing = 1.4;
  } else if (nameLength <= 16) {
    nameFontSize = 9.5;
    nameLetterSpacing = 0.8;
  } else if (nameLength <= 20) {
    nameFontSize = 8.5;
    nameLetterSpacing = 0.4;
  } else {
    nameFontSize = 7.5;
    nameLetterSpacing = 0.2;
  }

  // Theme palettes: Spain (TBN) & France (Pháp)
  const themeStyles = {
    spain: {
      name: 'Tây Ban Nha (Đội A)',
      bodyGradientStart: '#DC2626',
      bodyGradientEnd: '#991B1B',
      accentColor: '#FBBF24',
      collarColor: '#7F1D1D',
      sleeveColor: '#B91C1C',
      numberFill: '#FDE047',
      numberStroke: '#78350F',
      textColor: '#FEF08A',
      glowColor: 'rgba(239, 68, 68, 0.35)',
    },
    france: {
      name: 'Pháp (Đội B)',
      bodyGradientStart: '#1D4ED8',
      bodyGradientEnd: '#1E3A8A',
      accentColor: '#F8FAFC',
      collarColor: '#172554',
      sleeveColor: '#2563EB',
      numberFill: '#FFFFFF',
      numberStroke: '#1E293B',
      textColor: '#FFFFFF',
      glowColor: 'rgba(59, 130, 246, 0.35)',
    },
  };

  const currentTheme = themeStyles[activeTheme];

  return (
    <div className="relative rounded-3xl p-5 sm:p-6 overflow-hidden border border-slate-800 bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#070A12] text-white shadow-2xl">
      {/* Stadium Spotlight Glow Effect */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle Carbon Fiber / Stadium Pitch Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Card Header: Horizontal Title & Kit Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0">
            <span className="material-symbols-outlined text-base">sports_and_outdoors</span>
          </div>
          <span className="text-xs sm:text-sm font-space font-bold tracking-tight text-slate-200 truncate">
            Trang phục và số áo thi đấu - Thiết kế chính thức của câu lạc bộ
          </span>
        </div>

        {/* Kit Switcher: Only 2 options (TBN and Pháp) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTheme('spain')}
            title="Áo đội tuyển Tây Ban Nha"
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-space font-bold transition-all cursor-pointer',
              activeTheme === 'spain'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Tây Ban Nha</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTheme('france')}
            title="Áo đội tuyển Pháp"
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-space font-bold transition-all cursor-pointer',
              activeTheme === 'france'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300" />
            <span>Pháp</span>
          </button>
        </div>
      </div>

      {/* Main Body: Jersey SVG Centered & Spacious */}
      <div className="relative z-10 flex flex-col items-center justify-center py-2 sm:py-4">
        {/* Locker Hook on top */}
        <div className="w-7 h-3.5 mx-auto border-t-2 border-x-2 border-slate-600/80 rounded-t-full -mb-0.5 opacity-60" />

        {/* SVG Jersey */}
        <div className="relative filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-[1.02]">
          <svg
            width="210"
            height="245"
            viewBox="0 0 200 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="select-none"
          >
            <defs>
              {/* Body Gradient */}
              <linearGradient id={`jerseyGrad-${activeTheme}`} x1="0" y1="0" x2="200" y2="230" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={currentTheme.bodyGradientStart} />
                <stop offset="100%" stopColor={currentTheme.bodyGradientEnd} />
              </linearGradient>

              {/* Fabric Sheen Linear Gradient */}
              <linearGradient id="fabricSheen" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </linearGradient>

              {/* Number Gradient */}
              <linearGradient id={`numberGrad-${activeTheme}`} x1="100" y1="90" x2="100" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="15%" stopColor={currentTheme.numberFill} />
                <stop offset="100%" stopColor={currentTheme.numberFill} />
              </linearGradient>

              {/* Number Drop Shadow */}
              <filter id="numberGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* 1. Main Shirt Silhouette: Collar, Shoulders, Sleeves, Torso */}
            <path
              d="M 72 26 
                 Q 100 38 128 26 
                 L 172 44 
                 L 194 88 
                 L 164 100 
                 L 155 85 
                 L 155 204 
                 Q 100 214 45 204 
                 L 45 85 
                 L 36 100 
                 L 6 88 
                 L 28 44 
                 Z"
              fill={`url(#jerseyGrad-${activeTheme})`}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
            />

            {/* Fabric Sheen Overlay */}
            <path
              d="M 72 26 Q 100 38 128 26 L 172 44 L 194 88 L 164 100 L 155 85 L 155 204 Q 100 214 45 204 L 45 85 L 36 100 L 6 88 L 28 44 Z"
              fill="url(#fabricSheen)"
            />

            {/* 2. Raglan Sleeve Seams */}
            <path d="M 72 26 Q 90 60 45 85" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5" fill="none" />
            <path d="M 128 26 Q 110 60 155 85" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5" fill="none" />

            {/* 3. Shoulder Athletic Stripes */}
            <line x1="38" y1="46" x2="68" y2="34" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <line x1="34" y1="53" x2="64" y2="41" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <line x1="30" y1="60" x2="60" y2="48" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

            <line x1="162" y1="46" x2="132" y2="34" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <line x1="166" y1="53" x2="136" y2="41" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <line x1="170" y1="60" x2="140" y2="48" stroke={currentTheme.accentColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

            {/* 4. Collar Trim */}
            <path
              d="M 72 26 Q 100 38 128 26 Q 100 18 72 26 Z"
              fill={currentTheme.collarColor}
              stroke={currentTheme.accentColor}
              strokeWidth="1"
            />

            {/* 5. Sleeve Cuffs Trim */}
            <path d="M 6 88 L 36 100" stroke={currentTheme.accentColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 194 88 L 164 100" stroke={currentTheme.accentColor} strokeWidth="3" strokeLinecap="round" />

            {/* 6. Side Ventilation Mesh Panels */}
            <path d="M 45 95 L 45 195 Q 52 195 52 95 Z" fill="#000000" fillOpacity="0.2" />
            <path d="M 155 95 L 155 195 Q 148 195 148 95 Z" fill="#000000" fillOpacity="0.2" />

            {/* 7. Player Full Name on Upper Back (No truncation, dynamic sizing, nicely lowered) */}
            <text
              x="100"
              y="72"
              textAnchor="middle"
              fontFamily="'Montserrat', 'Plus Jakarta Sans', sans-serif"
              fontWeight="800"
              fontSize={nameFontSize}
              letterSpacing={nameLetterSpacing}
              fill={currentTheme.textColor}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              {...(nameLength > 14 ? { textLength: '136', lengthAdjust: 'spacingAndGlyphs' } : {})}
            >
              {fullNameUpper}
            </text>

            {/* 8. Big Bold Football Varsity Number (Nicely centered) */}
            {hasNumber ? (
              <g filter="url(#numberGlow)">
                <text
                  x="100"
                  y="146"
                  textAnchor="middle"
                  fontFamily="'Barlow Semi Condensed', 'Montserrat', sans-serif"
                  fontWeight="900"
                  fontSize="78"
                  letterSpacing="-3"
                  fill={`url(#numberGrad-${activeTheme})`}
                  stroke={currentTheme.numberStroke}
                  strokeWidth="2.5"
                  style={{
                    paintOrder: 'stroke fill',
                  }}
                >
                  {jerseyNumber}
                </text>

                {/* Federation / Club Mini Crest inside bottom of number */}
                <circle cx="100" cy="164" r="5" fill="#0F172A" stroke={currentTheme.numberFill} strokeWidth="1" />
                <circle cx="100" cy="164" r="2" fill={currentTheme.accentColor} />
              </g>
            ) : (
              <g opacity="0.6">
                <text
                  x="100"
                  y="144"
                  textAnchor="middle"
                  fontFamily="'Barlow Semi Condensed', sans-serif"
                  fontWeight="900"
                  fontSize="48"
                  fill="#94A3B8"
                  stroke="#0F172A"
                  strokeWidth="1.5"
                >
                  ??
                </text>
                <text
                  x="100"
                  y="164"
                  textAnchor="middle"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="700"
                  fontSize="9.5"
                  fill="#94A3B8"
                >
                  CHƯA ĐĂNG KÝ
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AthleticJerseyCard;
