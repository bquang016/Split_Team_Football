---
name: Pitchside Pulse
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#ffb690'
  on-secondary: '#552100'
  secondary-container: '#ec6a06'
  on-secondary-container: '#4a1c00'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00b2d0'
  on-tertiary-container: '#003f4b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-hero:
    fontFamily: Chivo
    fontSize: 56px
    fontWeight: '900'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Chivo
    fontSize: 36px
    fontWeight: '900'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: '0'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-tactical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-coord:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  score-display:
    fontFamily: Chivo
    fontSize: 64px
    fontWeight: '900'
    lineHeight: 64px
    letterSpacing: -0.04em
  score-display-mobile:
    fontFamily: Chivo
    fontSize: 44px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the electrifying, tactile energy of grassroots football under floodlights. It targets Sunday league organizers, grassroots players, and team captains who live and breathe matchdays. Rather than treating match planning as an administrative chore or burying actions inside sterile enterprise tables, the experience elevates grassroots football into a cinematic, match-ready stadium command center.

The aesthetic fuses **High-Contrast Athletic Modernism** with **Contextual Tactical Glassmorphism**:
- **Under-the-Floodlights Atmosphere:** A deep midnight charcoal foundation (#0B0F19 to #0F172A) keeps the focus on the pitch, evoking evening kickoffs under intense LED lighting.
- **Electric Field Vitality:** Radiant pitch-grass emeralds and neon greens pop intensely off dark substrates, signifying play readiness, active player states, and positive performance.
- **Electric Crimson Intensity:** Fiery orange-red energy marks live timers, decisive tactical actions, red cards, and match urgency.
- **Unified Contextual Command:** Admin controls are embedded directly in the match day canvas. Drag-and-drop formation slots, a randomized team generator spin wheel, interactive pitch coordinate markers, and instant bench substitutions exist in the primary match flow—never sequestered inside an uninspiring administrative back-office portal.

## Colors

The palette is engineered specifically for low-glare outdoor and locker room legibility, emphasizing razor-sharp visual hierarchy across dark pitch backdrops.

### Palette Architecture
- **Primary (`#10B981` / Pitch Neon):** The visual heartbeat of the interface. Used for confirming team lineups, match start actions, active player nodes on tactical boards, primary statistics, and active toggles. Gradients may step into `#22C55E` for live status indicators.
- **Secondary (`#F97316` / Match Energy Flame):** High-tension actions and contrasting rival team identity. Used for live match clocks, card penalties, dynamic spin-wheel prize segments, and urgent administrative approvals.
- **Tertiary (`#06B6D4` / Tactical Cyan):** Analytical layers, tactical formation vectors, substitution trajectory arrows, and heat-map data overlays.
- **Neutral Canvas (`#0F172A` / Stadium Night Slate):** 
  - `Base Canvas`: `#070B14` (Deep pitch darkness)
  - `Surface 1 (Cards, Pitches)`: `#0F172A` (Tactical charcoal)
  - `Surface 2 (Elevated Nodes, Drawers)`: `#1E293B` (Interlaced slate)
  - `Surface Border / Ghost Lines`: `rgba(255, 255, 255, 0.08)` to `rgba(16, 185, 129, 0.2)`
- **Typography & Content:**
  - `Text High Contrast`: `#F8FAFC` (Pure match daylight white)
  - `Text Muted`: `#94A3B8` (Assistant coach slate)
  - `Text Dim`: `#475569` (Field line dusk)

### Functional States
- **Pitch Ready / Active:** `#10B981` with an ambient glow blur `rgba(16, 185, 129, 0.35)`.
- **Match In-Play / Hazard:** `#EF4444` (Direct red card, live score tick).
- **Caution / Captaincy:** `#F59E0B` (Yellow card, tactical pending status).

## Typography

Typography establishes an assertive, athletic tone with technical rigor:
- **Headings (Chivo):** An aggressive, muscular grotesque with sharp terminals and dense presence. Display numbers, scoreboards, and section titles are set with heavy weights (700 to 900) to replicate physical stadium scoreboards and broadcast graphics.
- **Body Text (Space Grotesk):** Provides a forward-looking, high-clarity reading experience that retains subtle geometric quirkiness. It remains exceptionally legible even at 13px in direct sunlight or on night-shifted smartphone displays.
- **Technical & Tactical Data (JetBrains Mono):** Reserved for jersey numbers, tactical x/y coordinates, match timers (`45:00 +3`), substitution splits, and player rating differentials. Its tabular spacing ensures numbers never jitter during live updates.

Uppercase transformations are applied strictly to `label-tactical`, `label-coord`, and small section headers for military-grade precision on match sheets.

## Layout & Spacing

The layout is built on a high-density, dynamic tactical grid that adapts seamlessly between desktop manager screens and sideline mobile devices.

### Layout Model
- **Sideline Fluidity:** Utilizes a 12-column responsive fluid grid on desktop (`>1024px`) shifting to 8 columns on tablet (`768px - 1023px`) and 4 columns on mobile (`<768px`).
- **Tactical Canvas Anchor:** Match views are centered around the 4:3 or 16:9 interactive Pitch Viewport. On desktop, this viewport shares screen real estate with contextual sidebars (Bench Reserves, Quick Admin Controls, Real-Time Stats). On mobile, the pitch operates as an interactive sticky module while sub-panels dock cleanly beneath it via sliding horizontal trays.

### Spacing Principles
- Compact vertical stacking keeps critical data "above the fold" on pitch benches.
- Spacing inside tactical modules uses strict `0.5rem` (`space-sm`) and `1rem` (`space-md`) increments to prevent visual noise while preserving fingertip drag-and-drop targets of at least `48px`.

## Elevation & Depth

Visual depth mirrors the layered physical infrastructure of a stadium: grass base, touchline markings, physical dugout seating, and elevated digital stadium boards.

### Depth Hierarchy
1. **Level 0 (Pitch / Canvas):** Deep pitch backdrop `#070B14` patterned with subtle horizontal pitch-striping via linear gradients (`rgba(255, 255, 255, 0.015)`).
2. **Level 1 (Card & Module Deck):** Tonal slate `#0F172A` with a 1px crisp perimeter border of `rgba(255, 255, 255, 0.08)`. No traditional muddy drop-shadows; separation is achieved by high surface contrast.
3. **Level 2 (Active Dragging Nodes & Tactical Overlays):** `#1E293B` surrounded by an ambient athletic glow: `0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 16px rgba(16, 185, 129, 0.25)`.
4. **Level 3 (Modal Wheels, Tactical Drawers, Sticky Match Bar):** Ultra-dense frosted glass with backdrop filter (`backdrop-blur-md`, background `rgba(15, 23, 42, 0.85)` and border `rgba(255, 255, 255, 0.15)`).

Tactical elements under user manipulation (e.g., picking up a player to swap on the pitch) scale up by `1.05x` with an energetic primary shadow aura.

## Shapes

The design system embraces a **Soft / High-Precision Athletic** shape architecture (`roundedness: 1`). 

- Corners are clipped with purposeful discipline: standard UI blocks, player stat cards, and pitch panels use `0.25rem` (4px) to `0.5rem` (8px) radii. This creates a machined, technical aesthetic reminiscent of digital scoreboards and telemetry devices.
- Circular geometry (`rounded-full`) is strictly reserved for:
  - Tactical player formation pins (jersey discs).
  - The tactical randomized spin wheel.
  - Player profile avatars and micro status badges.
- Buttons and action chips feature chamfer-like sharp-soft edges (`0.375rem`), asserting high-performance athletic confidence without playful bubbly curvature.

## Components

### Buttons
- **Primary Athletic Button:** Bold neon emerald `#10B981` background, ultra-dark text `#042F2E`, `Chivo` 700 uppercase, `0.375rem` radius. On hover, triggers a radiant emerald perimeter glow and slight y-translation (`-1px`).
- **Tactical Action Button (Admin Inline):** Ghost border `rgba(16, 185, 129, 0.4)` on `#0F172A` background, white text. Embeds contextual admin triggers (e.g., "[+] Add Roster Sub", "Quick Sub") directly into match components without looking like generic back-office tools.
- **Danger / Urgent:** `#EF4444` background or border with electric orange `#F97316` hover transitions for match suspensions or match resets.

### Contextual Pitch Lineup & Tactical Canvas
- **Pitch Surface:** A stylized dark emerald/slate pitch with crisp boundary lines (`rgba(255,255,255,0.2)`).
- **Player Nodes:** Interactive circular badges featuring player squad number in `JetBrains Mono` and abbreviated position label (`CAM`, `CB`, `ST`).
- **Admin In-Pitch Controls:** Captaincy "C" badges, yellow/red card markers, and bench-swap arrows trigger directly on node click via an inline circular halo menu, eliminating the need to leave the pitch canvas to manage squad assignments.

### Chips & Tactical Badges
- **Status Chips:** Low-opacity background fills with saturated borders (`bg-emerald-950/40 border border-emerald-500/50 text-emerald-300`).
- **Position Indicators:** Monospaced micro-chips (`GK`, `DEF`, `MID`, `FWD`) color-coded using neon variants with high contrast.

### Lists & Squad Tables
- **Matchday Squad Rows:** Compact, high-efficiency roster strips. Each row features a drag handle for instant order shifting, payment/availability toggle pills, and an inline status indicator. Hover states reveal instant context actions (promote to starter, assign vice-captain) rather than buried dropdowns.

### Inputs & Administrative Controls
- **Field Inputs:** High-density `#0B0F19` fields with razor 1px borders in `rgba(255, 255, 255, 0.12)`. When focused, borders snap to energetic primary green `#10B981` with zero fuzzy focus rings, replaced by a crisp 1px offset accent.
- **Checkboxes & Radios:** Sharp, industrial 4px rounded squares and circles that illuminate in high-voltage emerald upon selection.

### Cards & Match Stat Panels
- **Match Header Card:** Contains live game timer in `JetBrains Mono` with animated glowing pulse dot, dual team badges, and dominant, large-scale scores in `Chivo`.
- **Admin Quick-Bar:** Stays docked at the bottom of the screen during live matches, offering one-tap increment/decrement score controls, card allocation, and the tactical "Random Team Wheel" trigger.