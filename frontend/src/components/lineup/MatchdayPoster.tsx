import React from 'react';
import { Match, MatchLineup, MatchParticipant, Position, Team } from '../../types';
import { FORMATION_PRESETS_7V7, GK_COLOR, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import { formatDateVi, formatTimeVi } from '../../utils/formatters';

export type PosterTheme = 'emerald' | 'midnight' | 'carbon' | 'daylight' | 'minimal-light';
export type PosterRatio = '4:5' | '16:9' | '1:1';

export interface MatchdayPosterProps {
  match: Match;
  activeTeam: Team;
  teamLabel: string;
  lineups: MatchLineup[];
  benchPlayers: MatchParticipant[];
  formationName?: string;
  theme?: PosterTheme;
  ratio?: PosterRatio;
  showBench?: boolean;
  showMatchInfo?: boolean;
  id?: string;
}

export const MatchdayPoster: React.FC<MatchdayPosterProps> = ({
  match,
  activeTeam,
  teamLabel,
  lineups,
  benchPlayers,
  formationName,
  theme = 'emerald',
  ratio = '4:5',
  showBench = true,
  showMatchInfo = true,
  id = 'matchday-poster-render-target',
}) => {
  const teamStarters = lineups.filter((l) => l.team === activeTeam);
  const teamColor = activeTeam === 'A' ? TEAM_A_COLOR : TEAM_B_COLOR;
  const isSpain = match.jerseyWinnerTeam === 'SPAIN' ? activeTeam === 'A' : activeTeam === 'B';

  const captain = (match.participants ?? []).find(
    (p) => p.team === activeTeam && p.isHost
  );

  const formattedDate = match.matchDate ? formatDateVi(match.matchDate) : '';
  const formattedTime = match.matchTime ? formatTimeVi(match.matchTime) : '';

  // Theme configurations supporting both vibrant dark stadium and bright day stadium
  const themeConfig = {
    emerald: {
      isLight: false,
      bg: '#05110B',
      cardBg: 'linear-gradient(180deg, #071910 0%, #040D08 100%)',
      pitchBg: 'linear-gradient(180deg, #166534 0%, #14532D 50%, #0F3E22 100%)',
      stripe1: '#15803D',
      stripe2: '#166534',
      lines: 'rgba(255, 255, 255, 0.88)',
      accent: '#10B981',
      accentGlow: 'rgba(16, 185, 129, 0.35)',
      border: 'rgba(16, 185, 129, 0.25)',
      headerBg: 'linear-gradient(135deg, rgba(22, 101, 52, 0.5) 0%, rgba(5, 17, 11, 0.8) 100%)',
      glowTop: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
      textColor: '#FFFFFF',
      textMuted: '#94A3B8',
      sidebarBg: 'rgba(15, 23, 42, 0.65)',
      itemBg: 'rgba(30, 41, 59, 0.7)',
      itemBorder: 'rgba(255, 255, 255, 0.08)',
    },
    midnight: {
      isLight: false,
      bg: '#050814',
      cardBg: 'linear-gradient(180deg, #090F24 0%, #03060E 100%)',
      pitchBg: 'linear-gradient(180deg, #0F172A 0%, #0A101D 50%, #060A13 100%)',
      stripe1: '#131D33',
      stripe2: '#0C1322',
      lines: 'rgba(56, 189, 248, 0.85)',
      accent: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.35)',
      border: 'rgba(56, 189, 248, 0.25)',
      headerBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(5, 8, 20, 0.8) 100%)',
      glowTop: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
      textColor: '#FFFFFF',
      textMuted: '#94A3B8',
      sidebarBg: 'rgba(15, 23, 42, 0.65)',
      itemBg: 'rgba(30, 41, 59, 0.7)',
      itemBorder: 'rgba(255, 255, 255, 0.08)',
    },
    carbon: {
      isLight: false,
      bg: '#0A0A0C',
      cardBg: 'linear-gradient(180deg, #141418 0%, #08080A 100%)',
      pitchBg: 'linear-gradient(180deg, #1F1F24 0%, #16161A 50%, #0E0E12 100%)',
      stripe1: '#26262D',
      stripe2: '#1C1C22',
      lines: 'rgba(250, 204, 21, 0.88)',
      accent: '#EAB308',
      accentGlow: 'rgba(234, 179, 8, 0.35)',
      border: 'rgba(234, 179, 8, 0.25)',
      headerBg: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(10, 10, 12, 0.8) 100%)',
      glowTop: 'radial-gradient(ellipse at 50% 0%, rgba(234, 179, 8, 0.18) 0%, transparent 70%)',
      textColor: '#FFFFFF',
      textMuted: '#94A3B8',
      sidebarBg: 'rgba(15, 23, 42, 0.65)',
      itemBg: 'rgba(30, 41, 59, 0.7)',
      itemBorder: 'rgba(255, 255, 255, 0.08)',
    },
    daylight: {
      isLight: true,
      bg: '#F8FAFC',
      cardBg: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
      pitchBg: 'linear-gradient(180deg, #16A34A 0%, #15803D 50%, #166534 100%)',
      stripe1: '#22C55E',
      stripe2: '#16A34A',
      lines: 'rgba(255, 255, 255, 0.95)',
      accent: '#059669',
      accentGlow: 'rgba(5, 150, 105, 0.2)',
      border: '#CBD5E1',
      headerBg: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
      glowTop: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
      textColor: '#0F172A',
      textMuted: '#475569',
      sidebarBg: '#FFFFFF',
      itemBg: '#F1F5F9',
      itemBorder: '#E2E8F0',
    },
    'minimal-light': {
      isLight: true,
      bg: '#FFFFFF',
      cardBg: '#F8FAFC',
      pitchBg: 'linear-gradient(180deg, #059669 0%, #047857 50%, #065F46 100%)',
      stripe1: '#059669',
      stripe2: '#047857',
      lines: 'rgba(255, 255, 255, 0.95)',
      accent: '#2563EB',
      accentGlow: 'rgba(37, 99, 235, 0.2)',
      border: '#E2E8F0',
      headerBg: '#FFFFFF',
      glowTop: 'none',
      textColor: '#0F172A',
      textMuted: '#64748B',
      sidebarBg: '#F8FAFC',
      itemBg: '#FFFFFF',
      itemBorder: '#E2E8F0',
    },
  }[theme] || {
    isLight: false,
    bg: '#05110B',
    cardBg: '#071910',
    pitchBg: '#166534',
    stripe1: '#15803D',
    stripe2: '#166534',
    lines: 'rgba(255, 255, 255, 0.88)',
    accent: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.35)',
    border: 'rgba(16, 185, 129, 0.25)',
    headerBg: 'rgba(22, 101, 52, 0.5)',
    glowTop: 'none',
    textColor: '#FFFFFF',
    textMuted: '#94A3B8',
    sidebarBg: 'rgba(15, 23, 42, 0.65)',
    itemBg: 'rgba(30, 41, 59, 0.7)',
    itemBorder: 'rgba(255, 255, 255, 0.08)',
  };

  // Aspect ratio dimensions based on 1080px base
  const containerStyle = {
    '4:5': { width: '1080px', minHeight: '1350px' },
    '16:9': { width: '1920px', minHeight: '1080px' },
    '1:1': { width: '1080px', minHeight: '1080px' },
  }[ratio];

  const isLandscape = ratio === '16:9';

  return (
    <div
      id={id}
      style={{
        ...containerStyle,
        backgroundColor: themeConfig.bg,
        backgroundImage: themeConfig.glowTop,
        fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", "Inter", sans-serif',
        color: '#FFFFFF',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="p-8 flex flex-col justify-between select-none"
    >
      {/* ============================================================== */}
      {/* 1. TOP BROADCAST HEADER */}
      {/* ============================================================== */}
      <div
        style={{
          background: themeConfig.headerBg,
          borderColor: themeConfig.border,
          boxShadow: `0 8px 32px -4px ${themeConfig.accentGlow}`,
        }}
        className="rounded-3xl p-6 border mb-6 backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle decorative watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            top: '-20px',
            fontSize: '90px',
            fontWeight: 900,
            opacity: 0.04,
            fontFamily: 'sans-serif',
            pointerEvents: 'none',
          }}
        >
          CMC SQUAD
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Club Crest Logo Badge */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${teamColor} 0%, #111827 100%)`,
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: `0 0 20px ${teamColor}66`,
              }}
              className="flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-3xl text-white">
                sports_soccer
              </span>
            </div>

            {/* Match Title & Team Name */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{
                    backgroundColor: themeConfig.accent,
                    color: '#000000',
                  }}
                  className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase"
                >
                  MATCHDAY SQUAD
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {match.title || 'Trận Đấu Bóng Đá Phong Trào'}
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <span>{teamLabel}</span>
                <span
                  style={{
                    backgroundColor: teamColor,
                    color: '#FFFFFF',
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg font-bold border border-white/20 uppercase tracking-widest"
                >
                  {isSpain ? 'ÁO TÂY BAN NHA' : 'ÁO PHÁP'}
                </span>
              </h1>
            </div>
          </div>

          {/* Formation & Match Info Tags */}
          <div className="flex flex-col items-end gap-2 text-right">
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${themeConfig.border}`,
              }}
              className="px-4 py-2 rounded-2xl flex items-center gap-3"
            >
              <span className="text-xs text-slate-300 font-medium">Chiến thuật:</span>
              <span
                style={{ color: themeConfig.accent }}
                className="text-sm font-black tracking-wider uppercase font-mono"
              >
                {formationName || 'Sơ đồ 2-3-1'}
              </span>
            </div>

            {showMatchInfo && (
              <div className="text-xs text-slate-300 flex items-center gap-3 font-medium">
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {formattedDate} {formattedTime ? `• ${formattedTime}` : ''}
                  </span>
                )}
                {match.location && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">stadium</span>
                    {match.location}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN BODY (LANDSCAPE: 2 COLS; PORTRAIT: PITCH THEN BENCH) */}
      {/* ============================================================== */}
      <div
        className={`flex-1 flex ${
          isLandscape ? 'flex-row gap-6' : 'flex-col gap-6'
        }`}
      >
        {/* ============================================================== */}
        {/* PITCH SECTION */}
        {/* ============================================================== */}
        <div
          style={{
            flex: isLandscape ? '0 0 65%' : '1 1 auto',
            minHeight: isLandscape ? '700px' : '620px',
            backgroundColor: themeConfig.pitchBg,
            borderColor: themeConfig.border,
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7)',
          }}
          className="relative rounded-3xl border overflow-hidden p-4 flex flex-col justify-center"
        >
          {/* Authentic Grass Turf Alternating Horizontal Stripes */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: i % 2 === 0 ? themeConfig.stripe1 : themeConfig.stripe2,
                  opacity: 0.95,
                }}
              />
            ))}
          </div>

          {/* Stadium Floodlights Glow Corners */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* SVG Pitch Markings */}
          <svg
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            {/* Outer Pitch Touchline */}
            <rect
              x="20"
              y="20"
              width="760"
              height="560"
              stroke={themeConfig.lines}
              strokeWidth="2.5"
              fill="none"
              rx="4"
            />

            {/* Halfway Line */}
            <line
              x1="20"
              y1="300"
              x2="780"
              y2="300"
              stroke={themeConfig.lines}
              strokeWidth="2.5"
            />

            {/* Center Circle & Spot */}
            <circle
              cx="400"
              cy="300"
              r="70"
              stroke={themeConfig.lines}
              strokeWidth="2.5"
              fill="none"
            />
            <circle cx="400" cy="300" r="4" fill={themeConfig.lines} />

            {/* TOP GOAL AREA & PENALTY BOX (Opponent / Attacking Half) */}
            <rect
              x="220"
              y="20"
              width="360"
              height="110"
              stroke={themeConfig.lines}
              strokeWidth="2.5"
              fill="none"
            />
            <rect
              x="300"
              y="20"
              width="200"
              height="45"
              stroke={themeConfig.lines}
              strokeWidth="2"
              fill="none"
            />
            {/* Top Penalty Spot & Arc */}
            <circle cx="400" cy="90" r="3.5" fill={themeConfig.lines} />
            <path
              d="M 330 130 A 70 70 0 0 0 470 130"
              stroke={themeConfig.lines}
              strokeWidth="2"
              fill="none"
            />
            {/* Top Goal Net Visual */}
            <rect
              x="330"
              y="4"
              width="140"
              height="16"
              stroke={themeConfig.lines}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="rgba(255, 255, 255, 0.08)"
            />

            {/* BOTTOM GOAL AREA & PENALTY BOX (Defending Half / GK) */}
            <rect
              x="220"
              y="470"
              width="360"
              height="110"
              stroke={themeConfig.lines}
              strokeWidth="2.5"
              fill="none"
            />
            <rect
              x="300"
              y="535"
              width="200"
              height="45"
              stroke={themeConfig.lines}
              strokeWidth="2"
              fill="none"
            />
            {/* Bottom Penalty Spot & Arc */}
            <circle cx="400" cy="510" r="3.5" fill={themeConfig.lines} />
            <path
              d="M 330 470 A 70 70 0 0 1 470 470"
              stroke={themeConfig.lines}
              strokeWidth="2"
              fill="none"
            />
            {/* Bottom Goal Net Visual */}
            <rect
              x="330"
              y="580"
              width="140"
              height="16"
              stroke={themeConfig.lines}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="rgba(255, 255, 255, 0.08)"
            />

            {/* Corner Arcs */}
            <path d="M 20 40 A 20 20 0 0 0 40 20" stroke={themeConfig.lines} strokeWidth="2" fill="none" />
            <path d="M 760 20 A 20 20 0 0 0 780 40" stroke={themeConfig.lines} strokeWidth="2" fill="none" />
            <path d="M 20 560 A 20 20 0 0 1 40 580" stroke={themeConfig.lines} strokeWidth="2" fill="none" />
            <path d="M 760 580 A 20 20 0 0 1 780 560" stroke={themeConfig.lines} strokeWidth="2" fill="none" />
          </svg>

          {/* Attacking Direction Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              right: '24px',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.15em',
            }}
            className="flex items-center gap-1.5 uppercase font-mono"
          >
            <span>HƯỚNG TẤN CÔNG</span>
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
          </div>

          {/* Player Tokens on Pitch */}
          <div className="absolute inset-0">
            {teamStarters.map((starter, idx) => {
              const isGK = starter.positionLabel === 'GK';
              const pColor = isGK ? GK_COLOR : teamColor;
              const isPlayerCaptain = captain?.user.id === starter.user.id;
              
              // Intelligent fallback coordinates if coordinates are missing or overlapping at 50,50
              const presetFallback = FORMATION_PRESETS_7V7[0].positions[idx] || { x: 50, y: 50 };
              const hasValidCoords = starter.xPercent !== undefined && starter.yPercent !== undefined && !(starter.xPercent === 50 && starter.yPercent === 50 && idx > 0);
              const x = hasValidCoords ? starter.xPercent! : presetFallback.x;
              const y = hasValidCoords ? starter.yPercent! : presetFallback.y;

              const participant = match.participants?.find((p) => p.user.id === starter.user.id);
              const num = starter.jerseyNumber ?? participant?.jerseyNumber ?? starter.user.jerseyNumber ?? participant?.user?.jerseyNumber;
              const hasNum = typeof num === 'number' && !isNaN(num);
              const initials = starter.user.fullName ? starter.user.fullName.trim().slice(0, 2).toUpperCase() : '?';

              return (
                <div
                  key={starter.user.id}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Circular 3D Jersey Token */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: pColor,
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Jersey Number */}
                    <span
                      style={{
                        color: '#FFFFFF',
                        fontSize: '22px',
                        fontWeight: 900,
                        lineHeight: '1',
                        fontFamily: '"Be Vietnam Pro", "Plus Jakarta Sans", sans-serif',
                        textAlign: 'center',
                        textShadow: '0 2px 5px rgba(0, 0, 0, 0.9)',
                        userSelect: 'none',
                        display: 'block',
                      }}
                    >
                      {hasNum ? num : initials}
                    </span>

                    {/* Captain Armband Badge */}
                    {isPlayerCaptain && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          left: '-6px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#F59E0B',
                          color: '#000000',
                          border: '2px solid #FFFFFF',
                          fontSize: '11px',
                          fontWeight: 900,
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'sans-serif',
                        }}
                        title="Đội trưởng"
                      >
                        C
                      </span>
                    )}

                    {/* Position Label Tag */}
                    {starter.positionLabel && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-10px',
                          backgroundColor: '#0F172A',
                          color: isGK ? '#F59E0B' : '#FFFFFF',
                          border: '1.5px solid rgba(255, 255, 255, 0.5)',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '1px 6px',
                          borderRadius: '12px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase',
                        }}
                      >
                        {starter.positionLabel}
                      </span>
                    )}
                  </div>

                  {/* Player Nameplate Below Token */}
                  <div
                    style={{
                      marginTop: '5px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(3, 7, 18, 0.95)',
                      border: isPlayerCaptain
                        ? '1px solid #F59E0B'
                        : '1px solid rgba(255, 255, 255, 0.35)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
                      whiteSpace: 'nowrap',
                    }}
                    className="text-center"
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        margin: 0,
                      }}
                    >
                      {starter.user.fullName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SQUAD DETAILS & BENCH SECTION */}
        {/* ============================================================== */}
        <div
          style={{
            flex: isLandscape ? '0 0 35%' : '0 0 auto',
            backgroundColor: themeConfig.sidebarBg,
            borderColor: themeConfig.border,
            color: themeConfig.textColor,
          }}
          className="rounded-3xl border p-5 flex flex-col gap-4 backdrop-blur-md"
        >
          {/* Starting VII Roster List */}
          <div>
            <div
              style={{ borderColor: themeConfig.isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}
              className="flex items-center justify-between mb-3 pb-2 border-b"
            >
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: themeConfig.accent }}
                  className="w-2.5 h-2.5 rounded-full"
                />
                <h3
                  style={{ color: themeConfig.textColor }}
                  className="text-xs font-black uppercase tracking-wider"
                >
                  Đội Hình Ra Sân (7 Cầu Thủ)
                </h3>
              </div>
              <span
                style={{ color: themeConfig.textMuted }}
                className="text-[11px] font-mono font-bold"
              >
                {teamStarters.length} / 7
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {teamStarters.map((st) => {
                const isGK = st.positionLabel === 'GK';
                const isPlayerCaptain = captain?.user.id === st.user.id;
                const participant = match.participants?.find((p) => p.user.id === st.user.id);
                const num = st.jerseyNumber ?? participant?.jerseyNumber ?? st.user.jerseyNumber ?? participant?.user?.jerseyNumber;
                const hasStNum = typeof num === 'number' && !isNaN(num);

                return (
                  <div
                    key={st.user.id}
                    style={{
                      backgroundColor: themeConfig.itemBg,
                      borderColor: isPlayerCaptain
                        ? '#F59E0B'
                        : themeConfig.itemBorder,
                      color: themeConfig.textColor,
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span
                        style={{
                          backgroundColor: isGK ? GK_COLOR : teamColor,
                          color: '#FFFFFF',
                        }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-sm"
                      >
                        {hasStNum ? num : '—'}
                      </span>
                      <span
                        style={{ color: themeConfig.textColor }}
                        className="font-bold whitespace-nowrap text-xs"
                      >
                        {st.user.fullName}
                      </span>
                      {isPlayerCaptain && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-mono text-[9px] font-bold border border-amber-500/40 shrink-0">
                          (C)
                        </span>
                      )}
                    </div>

                    <span
                      style={{
                        backgroundColor: themeConfig.isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.4)',
                        color: isGK ? '#D97706' : themeConfig.accent,
                        borderColor: themeConfig.itemBorder,
                      }}
                      className="px-2 py-0.5 rounded font-mono font-black text-[10px] uppercase border shrink-0"
                    >
                      {st.positionLabel || 'POS'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bench Reserves List */}
          {showBench && (
            <div>
              <div
                style={{ borderColor: themeConfig.isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}
                className="flex items-center justify-between mb-2.5 pb-2 border-b"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-sm">
                    chair
                  </span>
                  <h3
                    style={{ color: themeConfig.textColor }}
                    className="text-xs font-black uppercase tracking-wider"
                  >
                    Hàng Ghế Dự Bị
                  </h3>
                </div>
                <span
                  style={{ color: themeConfig.textMuted }}
                  className="text-[11px] font-mono font-bold"
                >
                  {benchPlayers.length} Cầu thủ
                </span>
              </div>

              {benchPlayers.length === 0 ? (
                <p
                  style={{ color: themeConfig.textMuted }}
                  className="text-[11px] italic"
                >
                  Không có cầu thủ dự bị (toàn bộ đang đá chính).
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {benchPlayers.map((b) => {
                    const bNum = b.jerseyNumber ?? b.user.jerseyNumber;
                    const hasBNum = typeof bNum === 'number' && !isNaN(bNum);
                    return (
                      <div
                        key={b.user.id}
                        style={{
                          backgroundColor: themeConfig.itemBg,
                          borderColor: themeConfig.itemBorder,
                          color: themeConfig.textColor,
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
                      >
                        <span className="text-amber-500 font-mono font-bold">
                          #{hasBNum ? bNum : '--'}
                        </span>
                        <span
                          style={{
                            color: themeConfig.textColor,
                            whiteSpace: 'nowrap',
                            fontWeight: 700,
                          }}
                        >
                          {b.user.fullName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Captain Banner */}
          {captain && (
            <div
              style={{
                backgroundColor: themeConfig.isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.1)',
                borderColor: themeConfig.isLight ? '#FDE68A' : 'rgba(245, 158, 11, 0.3)',
              }}
              className="mt-auto p-3 rounded-2xl border flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  C
                </span>
                <div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-300 uppercase tracking-wider font-bold">
                    Đội trưởng quản lý
                  </div>
                  <div
                    style={{ color: themeConfig.isLight ? '#1E293B' : '#FFFFFF' }}
                    className="text-xs font-bold"
                  >
                    {captain.user.fullName}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                #{captain.jerseyNumber ?? captain.user.jerseyNumber ?? '--'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. OFFICIAL BROADCAST FOOTER */}
      {/* ============================================================== */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        className="mt-6 pt-4 flex items-center justify-between text-xs text-slate-400"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white font-black tracking-tight">
            <span
              style={{ color: themeConfig.accent }}
              className="material-symbols-outlined text-base"
            >
              sports_soccer
            </span>
            <span>CHIMMOCANH FOOTBALL SQUAD</span>
          </div>
          <span>•</span>
          <span className="text-slate-400 text-[11px]">
            Hệ thống phân chia & quản lý đội hình chiến thuật 7v7
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
            className="px-2 py-0.5 rounded text-white font-bold"
          >
            2K ULTRA HD
          </span>
          <span>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};
