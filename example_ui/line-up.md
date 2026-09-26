<!DOCTYPE html>

<html class="dark" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,700;0,800;0,900;1,700;1,900&amp;family=JetBrains+Mono:wght@600;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "primary-fixed": "#6ffbbe", "surface-container": "#171f33", "error": "#ffb4ab", "on-surface-variant": "#bbcabf", "background": "#0b1326", "secondary-container": "#ec6a06", "secondary-fixed": "#ffdbca", "on-tertiary": "#003640", "outline": "#86948a", "inverse-on-surface": "#283044", "on-secondary-fixed-variant": "#783200", "on-secondary-container": "#4a1c00", "tertiary-fixed": "#acedff", "outline-variant": "#3c4a42", "inverse-primary": "#006c49", "on-primary-fixed-variant": "#005236", "surface-container-high": "#222a3d", "on-surface": "#dae2fd", "on-primary-container": "#00422b", "primary": "#4edea3", "surface-container-low": "#131b2e", "secondary": "#ffb690", "surface": "#0b1326", "on-primary-fixed": "#002113", "on-tertiary-container": "#003f4b", "on-tertiary-fixed-variant": "#004e5c", "on-error": "#690005", "on-background": "#dae2fd", "secondary-fixed-dim": "#ffb690", "error-container": "#93000a", "tertiary-fixed-dim": "#4cd7f6", "primary-container": "#10b981", "on-error-container": "#ffdad6", "on-primary": "#003824", "tertiary": "#4cd7f6", "surface-tint": "#4edea3", "on-tertiary-fixed": "#001f26", "surface-container-highest": "#2d3449", "primary-fixed-dim": "#4edea3", "surface-container-lowest": "#060e20", "on-secondary": "#552100", "inverse-surface": "#dae2fd", "surface-variant": "#2d3449", "surface-dim": "#0b1326", "surface-bright": "#31394d", "tertiary-container": "#00b2d0", "on-secondary-fixed": "#341100" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "margin": "1rem", "space-lg": "1.5rem", "space-md": "1rem", "space-xl": "2.5rem", "margin-md": "1.5rem", "margin-lg": "2.5rem", "gutter": "1rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter-md": "1.5rem", "gutter-lg": "2rem" }, "fontFamily": { "score-display": ["Chivo"], "headline-md": ["Chivo"], "body-sm": ["Space Grotesk"], "label-coord": ["JetBrains Mono"], "display-hero-mobile": ["Chivo"], "body-md": ["Space Grotesk"], "score-display-mobile": ["Chivo"], "display-hero": ["Chivo"], "headline-lg-mobile": ["Chivo"], "body-lg": ["Space Grotesk"], "headline-lg": ["Chivo"], "headline-sm": ["Chivo"], "label-tactical": ["JetBrains Mono"] }, "fontSize": { "score-display": ["64px", { "lineHeight": "64px", "letterSpacing": "-0.04em", "fontWeight": "900" }], "headline-md": ["24px", { "lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "700" }], "body-sm": ["13px", { "lineHeight": "18px", "letterSpacing": "0", "fontWeight": "400" }], "label-coord": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "600" }], "display-hero-mobile": ["36px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "900" }], "body-md": ["15px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }], "score-display-mobile": ["44px", { "lineHeight": "44px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "display-hero": ["56px", { "lineHeight": "60px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "headline-lg-mobile": ["26px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "800" }], "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "500" }], "headline-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" }], "headline-sm": ["18px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "700" }], "label-tactical": ["12px", { "lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "700" }] } } } }</script></head><body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container"><aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col"><div class="px-space-md py-space-lg flex items-center gap-space-sm"><img alt="FootballSquad Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V63XxDGai6pSqrQ6SYrLqVsh8fVtdvy917bQ_Z2SSpwYCz9mxwWWGZo6wCF8kbptMpuFVh7_TFiqRrgiH7WtlSH2L7G791ShIoWPEwihg9pRimeMCkWbMlbtg2bzj6LKWv6a87-i_IhRnnou8gRTtkUlssJc5thSCkhwngGjmeVHuSKueV3oHmF9WRPqFXDoItwq3YpEeiAKbfk4cAzTgzGRs6h1XWjatut5wQE8byYJpnDMKHRl-W4TA"/><div class="flex flex-col"><span class="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface leading-tight">FootballSquad</span><span class="font-label-coord text-label-coord text-primary uppercase tracking-wider">FC Saigon Sunday League</span></div></div><div class="px-space-md py-space-xs"><div class="font-label-coord text-label-coord uppercase tracking-wider text-outline px-space-xs mb-space-xs">Match Command</div><nav class="flex flex-col gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-xl"><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="trang-chu" href="#"><span class="material-symbols-outlined text-xl">stadium</span><span>Trang chủ</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="lich-va-tran-dau" href="#"><span class="material-symbols-outlined text-xl">calendar_month</span><span>Lịch &amp; Trận đấu</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="sa-ban-va-lineup" href="#"><span class="material-symbols-outlined text-xl">sports</span><span>Sa bàn &amp; Lineup</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="bang-xep-hang" href="#"><span class="material-symbols-outlined text-xl">leaderboard</span><span>Bảng xếp hạng</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="cau-thu-va-doi-hinh" href="#"><span class="material-symbols-outlined text-xl">groups</span><span>Cầu thủ &amp; Đội hình</span></a></nav></div></div><div class="flex flex-col p-space-md gap-space-sm"><div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-xs"><div class="flex items-center justify-between"><div class="flex items-center gap-space-xs"><span class="material-symbols-outlined text-primary text-sm">admin_panel_settings</span><span class="font-label-coord text-label-coord uppercase tracking-wider text-on-surface-variant">Vai trò: Admin</span></div><span class="font-label-coord text-label-coord text-primary-fixed bg-surface-container-high px-space-xs py-0.5 rounded">CAPTAIN</span></div><button class="w-full flex items-center justify-between px-space-sm py-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors group" type="button"><span class="font-label-tactical text-label-tactical text-on-surface group-hover:text-primary transition-colors">Chế độ Quản trị</span><span class="material-symbols-outlined text-primary text-base">sync_alt</span></button></div><div class="flex items-center justify-between pt-space-xs"><div class="flex items-center gap-space-sm"><div class="relative"><img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/><span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span></div><div class="flex flex-col"><span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Hùng Nguyễn</span><span class="font-label-coord text-label-coord text-outline">Team A · Live WS</span></div></div><button aria-label="User settings" class="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-lg">tune</span></button></div></div></aside><div class="pl-64"><header class="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-gutter-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex items-center gap-space-lg"><div class="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full"><span class="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span class="w-2 h-2 rounded-full bg-secondary-container -ml-space-xs"></span><span class="font-label-tactical text-label-tactical text-secondary uppercase tracking-wider">TRẬN ĐANG ĐÁ</span><span class="font-label-coord text-label-coord text-on-surface-variant">|</span><span class="font-headline-sm text-headline-sm text-on-surface">FC SAIGON 2 - 1 TÂN BÌNH UTD</span><span class="font-label-coord text-label-coord text-primary bg-surface-container-high px-space-xs rounded">68'</span></div></div><div class="flex items-center gap-space-md"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-lg pointer-events-none">search</span><input class="bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-full pl-9 pr-space-md py-space-xs focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all" placeholder="Tìm cầu thủ, trận đấu..." type="text"/></div><button aria-label="Notifications" class="relative p-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-xl">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span></button></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Interactive Matchday Breadcrumb & Tactical Command Header -->
<section class="px-gutter-lg py-space-md bg-surface-container-lowest shadow-sm">
<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
<!-- Title & Live Match Stage -->
<div class="flex flex-col gap-space-xs">
<div class="flex items-center gap-space-sm">
<span class="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-container/20 text-primary font-label-tactical text-label-tactical uppercase tracking-wider">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Đội hình đã chốt - Sẵn sàng thi đấu
          </span>
<span class="text-outline text-label-coord font-label-coord">|</span>
<span class="text-on-surface-variant font-label-coord text-label-coord">SÂN BÓNG CHẢO LỬA SỐ 3 · VÒNG 14</span>
</div>
<div class="flex items-center gap-space-md">
<h1 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight flex items-center gap-space-sm">
<span>FC Đỏ Trắng</span>
<span class="text-secondary font-headline-sm">VS</span>
<span class="text-tertiary">FC Xanh Neon</span>
<span class="font-label-coord text-label-coord px-space-xs py-0.5 rounded bg-surface-container-high text-primary-fixed">7v7 TACTICAL</span>
</h1>
</div>
</div>
<!-- Tactical View Selectors & In-situ Presets -->
<div class="flex flex-wrap items-center gap-space-xs">
<!-- View Toggle Pills -->
<div class="bg-surface-container-high p-1 rounded-xl flex items-center gap-1">
<button class="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm text-xs uppercase shadow-sm transition-all flex items-center gap-1" id="btn-team-a" type="button">
<span class="w-2 h-2 rounded-full bg-red-400"></span>
<span>Team A (Đỏ)</span>
</button>
<button class="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm text-xs uppercase transition-all flex items-center gap-1" id="btn-team-b" type="button">
<span class="w-2 h-2 rounded-full bg-cyan-400"></span>
<span>Team B (Xanh)</span>
</button>
<button class="px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm text-xs uppercase transition-all flex items-center gap-1" id="btn-split-view" type="button">
<span class="material-symbols-outlined text-sm">splitscreen</span>
<span>Song song</span>
</button>
</div>
<div class="h-6 w-px bg-surface-container-highest mx-space-xs hidden md:block"></div>
<!-- Tactical Presets -->
<div class="flex items-center gap-space-xs">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-tactical text-label-tactical uppercase transition-colors flex items-center gap-1" onclick="applyPreset('2-3-1')" type="button">
<span class="text-primary font-bold">2-3-1</span>
<span class="text-outline text-label-coord hidden sm:inline">(Cân bằng)</span>
</button>
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-tactical text-label-tactical uppercase transition-colors flex items-center gap-1" onclick="applyPreset('3-2-1')" type="button">
<span class="text-tertiary font-bold">3-2-1</span>
<span class="text-outline text-label-coord hidden sm:inline">(Phản công)</span>
</button>
</div>
<!-- Export & Save Quick Actions -->
<div class="flex items-center gap-space-xs ml-auto">
<button class="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface transition-colors" id="btn-export-pitch" title="Xuất ảnh PNG sơ đồ (html2canvas)" type="button">
<span class="material-symbols-outlined text-lg">photo_camera</span>
</button>
<button class="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-tertiary-fixed font-headline-sm text-headline-sm text-xs uppercase flex items-center gap-1.5 transition-colors" id="btn-ask-gemini" type="button">
<span class="material-symbols-outlined text-sm text-tertiary">auto_awesome</span>
<span>Hỏi AI Tối Ưu</span>
</button>
<button class="px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-primary-fixed-dim text-on-primary font-headline-sm text-headline-sm text-xs uppercase shadow-md flex items-center gap-1.5 transition-all" id="btn-save-lineup" type="button">
<span class="material-symbols-outlined text-sm">save</span>
<span>Lưu sơ đồ vị trí</span>
</button>
</div>
</div>
</div>
</section>
<!-- Main Dual Column Command Grid -->
<div class="px-gutter-lg py-space-md">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT COLUMN: 7v7 High-Interactive Tactical Pitch Canvas (65% / 8 cols) -->
<section class="lg:col-span-8 flex flex-col gap-space-md">
<!-- Pitch Canvas Container Card -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm">
<!-- Tactical Overlay Top Bar: Formation Name, Pitch Condition, Coordinate Display -->
<div class="flex items-center justify-between px-space-xs">
<div class="flex items-center gap-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-base">sports_soccer</span>
<span class="font-headline-sm text-headline-sm text-on-surface" id="active-formation-badge">Đội Hình: 2-3-1 Tấn công</span>
</div>
<span class="text-outline text-label-coord font-label-coord">|</span>
<span class="font-label-coord text-label-coord text-on-surface-variant flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary-fixed"></span>
                Sân 7 người tiêu chuẩn VFF (52m x 32m)
              </span>
</div>
<!-- Pitch Grid & Tactical Drag Hint -->
<div class="flex items-center gap-space-sm">
<span class="hidden sm:inline-flex items-center gap-1 font-label-tactical text-label-tactical text-outline bg-surface-container px-space-xs py-0.5 rounded">
<span class="material-symbols-outlined text-xs">drag_indicator</span>
                Chế độ Kéo Thả Trực Tiếp
              </span>
<button class="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-coord font-label-coord uppercase transition-colors" id="toggle-tactical-lines" title="Bật/Tắt hướng bóng" type="button">
                Mũi tên chạy chỗ
              </button>
</div>
</div>
<!-- THE PITCH: 7v7 Pitch Canvas with Photorealistic Turf & Chalk Markings -->
<div class="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden shadow-2xl select-none" id="tactical-pitch" style="background: radial-gradient(circle at 50% 50%, #0d3822 0%, #072315 75%, #04160d 100%);">
<!-- Grass Turf Striping Layer (Photorealistic Grass Cut Stripes) -->
<div class="absolute inset-0 pointer-events-none opacity-25" style="background: repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 40px, transparent 40px, transparent 80px);"></div>
<div class="absolute inset-0 pointer-events-none opacity-15" style="background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0); background-size: 16px 16px;"></div>
<!-- Pitch Markings (White Crisp Lines via SVG with Perfect 7v7 Dimensions) -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewbox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
<!-- Outer Touchlines (10px margin) -->
<rect height="452" rx="4" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" width="752" x="24" y="24"></rect>
<!-- Halfway Line -->
<line stroke="rgba(255,255,255,0.75)" stroke-width="2.5" x1="400" x2="400" y1="24" y2="476"></line>
<!-- Center Circle (Standard 6m radius for 7v7) -->
<circle cx="400" cy="250" r="60" stroke="rgba(255,255,255,0.75)" stroke-width="2.5"></circle>
<circle cx="400" cy="250" fill="rgba(255,255,255,0.9)" r="3.5"></circle>
<!-- Left Penalty Area (Home Team A Goal Zone) -->
<rect height="220" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" width="130" x="24" y="140"></rect>
<!-- Left Goal Box (Khu vực cầu môn) -->
<rect height="110" stroke="rgba(255,255,255,0.6)" stroke-width="2" width="45" x="24" y="195"></rect>
<!-- Left Goal Frame (Khung thành bên ngoài đường biên) -->
<rect fill="rgba(255,255,255,0.05)" height="70" stroke="rgba(255,255,255,0.4)" stroke-width="2" width="16" x="8" y="215"></rect>
<!-- Left Penalty Spot (Chấm phạt đền 9m) -->
<circle cx="105" cy="250" fill="rgba(255,255,255,0.9)" r="3.5"></circle>
<!-- Left Penalty Arc -->
<path d="M 154 205 A 55 55 0 0 1 154 295" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<!-- Right Penalty Area (Away Team B Goal Zone) -->
<rect height="220" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" width="130" x="646" y="140"></rect>
<!-- Right Goal Box -->
<rect height="110" stroke="rgba(255,255,255,0.6)" stroke-width="2" width="45" x="731" y="195"></rect>
<!-- Right Goal Frame -->
<rect fill="rgba(255,255,255,0.05)" height="70" stroke="rgba(255,255,255,0.4)" stroke-width="2" width="16" x="776" y="215"></rect>
<!-- Right Penalty Spot -->
<circle cx="695" cy="250" fill="rgba(255,255,255,0.9)" r="3.5"></circle>
<!-- Right Penalty Arc -->
<path d="M 646 205 A 55 55 0 0 0 646 295" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<!-- Corner Arcs -->
<path d="M 24 38 A 14 14 0 0 0 38 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<path d="M 24 462 A 14 14 0 0 1 38 476" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<path d="M 776 38 A 14 14 0 0 1 762 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<path d="M 776 462 A 14 14 0 0 0 762 476" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"></path>
<!-- Dynamic Attack Path Vectors (Toggleable on tactical demand) -->
<g class="opacity-70 transition-opacity" id="tactical-vectors">
<!-- Wing attack tuấn anh -->
<path d="M 330 110 Q 450 70 540 130" fill="none" stroke="#4edea3" stroke-dasharray="4 4" stroke-width="2"></path>
<polygon fill="#4edea3" points="540,130 530,123 534,134"></polygon>
<!-- Through ball to ST Hoang Minh -->
<path d="M 360 250 L 510 250" fill="none" stroke="#acedff" stroke-dasharray="3 3" stroke-width="2"></path>
<polygon fill="#acedff" points="515,250 505,245 505,255"></polygon>
<!-- RM Overlap Quang Hải -->
<path d="M 330 390 Q 460 420 540 370" fill="none" stroke="#4edea3" stroke-dasharray="4 4" stroke-width="2"></path>
<polygon fill="#4edea3" points="540,370 534,364 530,375"></polygon>
</g>
</svg>
<!-- 7 Starting Lineup Player Nodes (Interactive Drag-and-drop simulated via CSS percent coordinates) -->
<!-- 1. GK: Quốc Huy (Áo vàng số 1) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-gk" style="top: 50%; left: 7.5%;">
<div class="relative flex flex-col items-center">
<!-- Shirt Avatar Token (GK: Gold/Yellow with dark number) -->
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-400 text-slate-950 shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative">
<span>1</span>
<!-- GK Role Mini Badge -->
<span class="absolute -top-1 -right-1 bg-surface-container-lowest text-amber-300 font-label-coord text-label-coord px-1 rounded-full">GK</span>
</div>
<!-- Player Name Card with In-situ coordinate indicator -->
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-on-surface whitespace-nowrap font-bold">Quốc Huy</span>
<span class="text-label-coord font-label-coord text-outline">x:8% y:50%</span>
</div>
</div>
</div>
<!-- 2. Defender: Bảo Long (CB - 4) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-cb1" style="top: 29%; left: 23%;">
<div class="relative flex flex-col items-center">
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-white/70">
<span>4</span>
<span class="absolute -top-1 -right-1 bg-surface-container-lowest text-primary font-label-coord text-label-coord px-1 rounded-full">CB</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-on-surface whitespace-nowrap font-bold">Bảo Long</span>
<span class="text-label-coord font-label-coord text-outline">x:23% y:29%</span>
</div>
</div>
</div>
<!-- 3. Defender: Minh Trí (CB - 5) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-cb2" style="top: 71%; left: 23%;">
<div class="relative flex flex-col items-center">
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-white/70">
<span>5</span>
<span class="absolute -top-1 -right-1 bg-surface-container-lowest text-primary font-label-coord text-label-coord px-1 rounded-full">CB</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-on-surface whitespace-nowrap font-bold">Minh Trí</span>
<span class="text-label-coord font-label-coord text-outline">x:23% y:71%</span>
</div>
</div>
</div>
<!-- 4. Midfielder/Captain: Hùng Nguyễn (CM / C - 7) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-30 group" id="player-cm" style="top: 50%; left: 42%;">
<div class="relative flex flex-col items-center">
<!-- Captaincy aura indicator -->
<div class="absolute -inset-1 rounded-full bg-primary/30 blur-sm animate-pulse"></div>
<div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white shadow-xl flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-primary">
<span>7</span>
<span class="absolute -top-1.5 -right-1.5 bg-primary text-on-primary font-label-coord text-label-coord px-1.5 rounded-full font-black">C</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/95 backdrop-blur text-center flex flex-col items-center shadow-md">
<div class="flex items-center gap-1">
<span class="font-headline-sm text-body-sm text-primary-fixed whitespace-nowrap font-bold">Hùng Nguyễn</span>
</div>
<span class="text-label-coord font-label-coord text-primary">CM · Playmaker</span>
</div>
</div>
</div>
<!-- 5. Left Wing: Tuấn Anh (LM - 11) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-lm" style="top: 22%; left: 45%;">
<div class="relative flex flex-col items-center">
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-white/70">
<span>11</span>
<span class="absolute -top-1 -right-1 bg-surface-container-lowest text-primary font-label-coord text-label-coord px-1 rounded-full">LM</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-on-surface whitespace-nowrap font-bold">Tuấn Anh</span>
<span class="text-label-coord font-label-coord text-outline">x:45% y:22%</span>
</div>
</div>
</div>
<!-- 6. Right Wing: Quang Hải (RM - 8) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-rm" style="top: 78%; left: 45%;">
<div class="relative flex flex-col items-center">
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-white/70">
<span>8</span>
<span class="absolute -top-1 -right-1 bg-surface-container-lowest text-primary font-label-coord text-label-coord px-1 rounded-full">RM</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-on-surface whitespace-nowrap font-bold">Quang Hải</span>
<span class="text-label-coord font-label-coord text-outline">x:45% y:78%</span>
</div>
</div>
</div>
<!-- 7. Striker: Hoàng Minh (ST - 9) -->
<div class="player-node absolute cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 z-20 group" id="player-st" style="top: 50%; left: 68%;">
<div class="relative flex flex-col items-center">
<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center font-score-display text-headline-sm font-black relative ring-2 ring-white/70">
<span>9</span>
<span class="absolute -top-1 -right-1 bg-secondary-container text-white font-label-coord text-label-coord px-1 rounded-full">ST</span>
</div>
<div class="mt-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur text-center flex flex-col items-center shadow-md">
<span class="font-headline-sm text-body-sm text-secondary-fixed whitespace-nowrap font-bold">Hoàng Minh</span>
<span class="text-label-coord font-label-coord text-outline">x:68% y:50%</span>
</div>
</div>
</div>
<!-- Ghost Opponent Nodes (Team B Preview Mode - semi-transparent contextual markings) -->
<div class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-35 hover:opacity-75 transition-opacity" style="top: 50%; left: 93%;">
<div class="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-score-display text-xs flex items-center justify-center font-bold">1</div>
</div>
<div class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-35 hover:opacity-75 transition-opacity" style="top: 30%; left: 80%;">
<div class="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-score-display text-xs flex items-center justify-center font-bold">2</div>
</div>
<div class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-35 hover:opacity-75 transition-opacity" style="top: 70%; left: 80%;">
<div class="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-score-display text-xs flex items-center justify-center font-bold">3</div>
</div>
<div class="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-35 hover:opacity-75 transition-opacity" style="top: 50%; left: 75%;">
<div class="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-score-display text-xs flex items-center justify-center font-bold">10</div>
</div>
</div>
<!-- Sideline Bench Reserves (Băng Ghế Dự Bị - 1-Click Instant Tactical Sub) -->
<div class="mt-space-xs bg-surface-container-low p-space-sm rounded-xl">
<div class="flex items-center justify-between mb-space-xs px-space-xs">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-outline text-base">chair</span>
<span class="font-label-tactical text-label-tactical uppercase tracking-wider text-on-surface">Dự Bị Chiến Lược (4 Cầu Thủ)</span>
<span class="text-label-coord font-label-coord text-primary bg-surface-container px-space-xs py-0.5 rounded">Nhấp để đổi người</span>
</div>
<button class="text-label-coord font-label-coord text-primary-fixed hover:underline flex items-center gap-0.5" type="button">
<span class="material-symbols-outlined text-xs">add</span>
                Thêm dự bị
              </button>
</div>
<!-- 4 Reserve Players Horizontal Carousel Tray -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
<!-- Sub 1 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors group cursor-pointer" onclick="swapPlayer('Đức Huy', '14', 'CDM')">
<div class="flex items-center gap-space-xs min-w-0">
<div class="w-7 h-7 rounded-full bg-red-800 text-white font-score-display text-xs flex items-center justify-center font-bold">14</div>
<div class="flex flex-col min-w-0">
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Đức Huy</span>
<span class="font-label-coord text-label-coord text-tertiary">CDM · Thể lực 95%</span>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-base">swap_vert</span>
</div>
<!-- Sub 2 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors group cursor-pointer" onclick="swapPlayer('Văn Thanh', '17', 'RB')">
<div class="flex items-center gap-space-xs min-w-0">
<div class="w-7 h-7 rounded-full bg-red-800 text-white font-score-display text-xs flex items-center justify-center font-bold">17</div>
<div class="flex flex-col min-w-0">
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Văn Thanh</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">WB · Tốc độ cao</span>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-base">swap_vert</span>
</div>
<!-- Sub 3 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors group cursor-pointer" onclick="swapPlayer('Tiến Linh', '22', 'ST')">
<div class="flex items-center gap-space-xs min-w-0">
<div class="w-7 h-7 rounded-full bg-red-800 text-white font-score-display text-xs flex items-center justify-center font-bold">22</div>
<div class="flex flex-col min-w-0">
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Tiến Linh</span>
<span class="font-label-coord text-label-coord text-secondary">ST · Càn lướt</span>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-base">swap_vert</span>
</div>
<!-- Sub 4: GK Dự Bị -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors group cursor-pointer" onclick="swapPlayer('Tuấn Mạnh', '25', 'GK')">
<div class="flex items-center gap-space-xs min-w-0">
<div class="w-7 h-7 rounded-full bg-amber-600 text-slate-950 font-score-display text-xs flex items-center justify-center font-bold">25</div>
<div class="flex flex-col min-w-0">
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Tuấn Mạnh</span>
<span class="font-label-coord text-label-coord text-amber-300">GK · Dự phòng</span>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-base">swap_vert</span>
</div>
</div>
</div>
</div>
<!-- Team Roster Quick Status Strip & Tactical Indicators -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div class="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm">
<span class="material-symbols-outlined text-primary text-2xl">speed</span>
<div class="flex flex-col">
<span class="font-label-coord text-label-coord uppercase tracking-wider text-outline">Tốc độ chuyển đổi</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Nhanh (Pace 82)</span>
</div>
</div>
<div class="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm">
<span class="material-symbols-outlined text-tertiary text-2xl">height</span>
<div class="flex flex-col">
<span class="font-label-coord text-label-coord uppercase tracking-wider text-outline">Cự ly đội hình</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Thu hẹp (28m)</span>
</div>
</div>
<div class="p-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-2xl">compress</span>
<div class="flex flex-col">
<span class="font-label-coord text-label-coord uppercase tracking-wider text-outline">Áp sát khu vực</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Midfield Press</span>
</div>
</div>
</div>
</section>
<!-- RIGHT COLUMN: Trợ lý Chiến thuật AI Gemini 1.5 Flash (35% / 4 cols) -->
<section class="lg:col-span-4 flex flex-col gap-space-md">
<!-- Gemini 1.5 Flash Contextual AI Card -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-xl flex flex-col gap-space-md">
<!-- AI Header with Flash Badge and Refresh -->
<div class="flex items-start justify-between">
<div class="flex items-center gap-space-xs">
<div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-xl">psychology</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-on-surface">Gemini 1.5 Flash</span>
<span class="font-label-coord text-label-coord bg-tertiary-container/30 text-tertiary px-1.5 py-0.5 rounded uppercase font-bold">AI Pro</span>
</div>
<span class="font-label-coord text-label-coord text-outline">Phân tích Chiến thuật Chuyên sâu</span>
</div>
</div>
<!-- Force refresh button -->
<button class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" id="btn-force-refresh-ai" title="Làm mới phân tích AI (Force Refresh)" type="button">
<span class="material-symbols-outlined text-lg">sync</span>
</button>
</div>
<!-- Win Probability Prediction Progress Bar (55% vs 45%) -->
<div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
<div class="flex items-center justify-between font-label-tactical text-label-tactical uppercase tracking-wider">
<span class="text-primary font-bold">Team A: 55%</span>
<span class="text-outline text-label-coord font-label-coord">Xác suất thắng</span>
<span class="text-tertiary font-bold">Team B: 45%</span>
</div>
<!-- Two-Tone Visual Segmented Progress Bar -->
<div class="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
<div class="h-full bg-gradient-to-r from-emerald-600 to-primary transition-all duration-500 rounded-l-full" style="width: 55%;"></div>
<div class="h-full bg-gradient-to-r from-tertiary to-cyan-600 transition-all duration-500 rounded-r-full" style="width: 45%;"></div>
</div>
<div class="flex items-center justify-between text-label-coord font-label-coord text-on-surface-variant pt-1">
<span>Độ tin cậy mô hình: 91.4%</span>
<span>Dựa trên 8 trận đã đấu</span>
</div>
</div>
<!-- Tactical Strengths Breakdown -->
<div class="flex flex-col gap-space-xs">
<span class="font-label-coord text-label-coord uppercase tracking-wider text-outline flex items-center gap-1">
<span class="material-symbols-outlined text-primary text-xs">verified</span>
              Điểm mạnh nổi bật của Team A
            </span>
<div class="p-space-sm rounded-lg bg-surface-container text-body-sm font-body-sm text-on-surface leading-relaxed">
<p>
<strong class="text-primary-fixed">Tuyến giữa cực mạnh</strong> với nhạc trưởng <span class="text-on-surface font-bold">Hùng Nguyễn</span>. Tỷ lệ chuyền chính xác trận trước đạt <span class="text-primary font-bold">88%</span>, kiểm soát 62% thời lượng bóng.
              </p>
</div>
</div>
<!-- Key Player Spotlight Card -->
<div class="p-space-sm rounded-xl bg-surface-container flex items-center gap-space-sm">
<div class="relative shrink-0">
<div class="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center font-score-display text-headline-sm font-black ring-1 ring-secondary/40">
                9
              </div>
<span class="absolute -bottom-1 -right-1 bg-secondary text-on-secondary font-label-coord text-label-coord px-1 rounded font-bold">HOT</span>
</div>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-1">
<span class="font-headline-sm text-headline-sm text-on-surface truncate">Hoàng Minh</span>
<span class="font-label-coord text-label-coord text-secondary-fixed bg-surface-container-high px-1 rounded">ST</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">Cầu thủ then chốt · 12 bàn mùa này</span>
<span class="font-label-coord text-label-coord text-primary">Hiệu suất 1.5 bàn/trận</span>
</div>
</div>
<!-- AI Tactical Advice Alert Box -->
<div class="p-space-sm rounded-xl bg-surface-container-high text-on-surface flex flex-col gap-space-xs">
<div class="flex items-center gap-space-xs text-secondary">
<span class="material-symbols-outlined text-sm">warning</span>
<span class="font-label-tactical text-label-tactical uppercase tracking-wider font-bold">Lời khuyên chiến thuật AI</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface leading-normal">
              “Cần cảnh giác các pha phản công biên trái của <strong class="text-tertiary">Tuấn Chelsea</strong> bên phía Team B. Minh Trí (CB-5) nên giữ cự ly bọc lót sâu hơn thay vì dâng cao pressing.”
            </p>
</div>
<!-- Bottom Status of AI Refresh -->
<div class="flex items-center justify-between pt-space-xs text-label-coord font-label-coord text-outline">
<span class="flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Cập nhật cách đây 12 phút (Cached)
            </span>
<button class="text-tertiary hover:underline" type="button">Chi tiết báo cáo</button>
</div>
</div>
<!-- Head-to-Head Recent History Widget -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-xl flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-label-tactical text-label-tactical uppercase tracking-wider text-on-surface flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-primary">history</span>
              Lịch sử đối đầu gần đây
            </span>
<span class="font-label-coord text-label-coord text-primary-fixed bg-surface-container px-space-xs py-0.5 rounded">Thắng 2 · Thua 1</span>
</div>
<!-- 3 Match Strips -->
<div class="flex flex-col gap-space-xs">
<!-- Match 1 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-space-xs">
<span class="w-5 h-5 rounded bg-primary-container text-on-primary font-bold text-label-coord flex items-center justify-center">W</span>
<span class="font-body-sm text-body-sm text-on-surface">26/05/2024 · Sân 7</span>
</div>
<div class="flex items-center gap-space-xs">
<span class="font-score-display text-body-lg text-primary font-bold">4 - 2</span>
<span class="font-label-coord text-label-coord text-outline">FT</span>
</div>
</div>
<!-- Match 2 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-space-xs">
<span class="w-5 h-5 rounded bg-primary-container text-on-primary font-bold text-label-coord flex items-center justify-center">W</span>
<span class="font-body-sm text-body-sm text-on-surface">12/05/2024 · Sân 7</span>
</div>
<div class="flex items-center gap-space-xs">
<span class="font-score-display text-body-lg text-primary font-bold">3 - 1</span>
<span class="font-label-coord text-label-coord text-outline">FT</span>
</div>
</div>
<!-- Match 3 -->
<div class="flex items-center justify-between p-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-space-xs">
<span class="w-5 h-5 rounded bg-error-container text-on-error-container font-bold text-label-coord flex items-center justify-center">L</span>
<span class="font-body-sm text-body-sm text-on-surface">28/04/2024 · Sân 7</span>
</div>
<div class="flex items-center gap-space-xs">
<span class="font-score-display text-body-lg text-error font-bold">1 - 2</span>
<span class="font-label-coord text-label-coord text-outline">FT</span>
</div>
</div>
</div>
</div>
</section>
</div>
</div>
<!-- Toast Notification Container for Quick Tactical Actions -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-surface-container-high text-on-surface shadow-2xl" id="tactical-toast">
<span class="material-symbols-outlined text-primary text-xl" id="toast-icon">check_circle</span>
<span class="font-body-md text-body-md" id="toast-message">Đã lưu sơ đồ chiến thuật thành công!</span>
</div>
<script>
    // Tactical Presets Coordinate Map for 7v7
    const presets = {
      '2-3-1': {
        name: 'Đội hình 2-3-1 (Tấn công Cân bằng)',
        coords: {
          'player-gk': { top: '50%', left: '7.5%' },
          'player-cb1': { top: '29%', left: '23%' },
          'player-cb2': { top: '71%', left: '23%' },
          'player-cm': { top: '50%', left: '42%' },
          'player-lm': { top: '22%', left: '45%' },
          'player-rm': { top: '78%', left: '45%' },
          'player-st': { top: '50%', left: '68%' }
        }
      },
      '3-2-1': {
        name: 'Đội hình 3-2-1 (Phòng ngự Phản công)',
        coords: {
          'player-gk': { top: '50%', left: '7.5%' },
          'player-cb1': { top: '22%', left: '25%' },
          'player-cb2': { top: '78%', left: '25%' },
          'player-cm': { top: '50%', left: '20%' }, // Sweeper CB
          'player-lm': { top: '35%', left: '42%' },
          'player-rm': { top: '65%', left: '42%' },
          'player-st': { top: '50%', left: '70%' }
        }
      }
    };

    function showToast(msg, icon = 'check_circle') {
      const toast = document.getElementById('tactical-toast');
      const msgEl = document.getElementById('toast-message');
      const iconEl = document.getElementById('toast-icon');
      if (toast && msgEl) {
        msgEl.textContent = msg;
        iconEl.textContent = icon;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => {
          toast.classList.add('translate-y-24', 'opacity-0');
        }, 3200);
      }
    }

    function applyPreset(presetName) {
      const cfg = presets[presetName];
      if (!cfg) return;
      
      const badge = document.getElementById('active-formation-badge');
      if (badge) badge.textContent = cfg.name;

      for (const [id, pos] of Object.entries(cfg.coords)) {
        const el = document.getElementById(id);
        if (el) {
          el.style.top = pos.top;
          el.style.left = pos.left;
        }
      }
      showToast(`Đã áp dụng sơ đồ ${presetName}`, 'sports_soccer');
    }

    function swapPlayer(name, number, pos) {
      showToast(`Đã chuẩn bị thay người: ${name} (#${number}) vào sân`, 'swap_horiz');
    }

    // Toggle tactical path arrows
    const toggleLinesBtn = document.getElementById('toggle-tactical-lines');
    const vectors = document.getElementById('tactical-vectors');
    if (toggleLinesBtn && vectors) {
      toggleLinesBtn.addEventListener('click', () => {
        if (vectors.classList.contains('opacity-0')) {
          vectors.classList.remove('opacity-0');
          vectors.classList.add('opacity-70');
          toggleLinesBtn.textContent = 'Ẩn mũi tên';
        } else {
          vectors.classList.add('opacity-0');
          vectors.classList.remove('opacity-70');
          toggleLinesBtn.textContent = 'Hiện mũi tên';
        }
      });
    }

    // Force Refresh AI Simulation
    const btnRefreshAi = document.getElementById('btn-force-refresh-ai');
    if (btnRefreshAi) {
      btnRefreshAi.addEventListener('click', () => {
        btnRefreshAi.classList.add('animate-spin');
        setTimeout(() => {
          btnRefreshAi.classList.remove('animate-spin');
          showToast('Gemini AI vừa cập nhật phân tích thời gian thực!', 'auto_awesome');
        }, 1000);
      });
    }

    // Quick Action Listeners
    const btnSave = document.getElementById('btn-save-lineup');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        showToast('Sơ đồ vị trí 7v7 đã được đồng bộ cho cả đội!', 'cloud_done');
      });
    }

    const btnExport = document.getElementById('btn-export-pitch');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        showToast('Đang kết xuất hình ảnh sơ đồ HD...', 'file_download');
      });
    }

    const btnAskGemini = document.getElementById('btn-ask-gemini');
    if (btnAskGemini) {
      btnAskGemini.addEventListener('click', () => {
        showToast('Gemini khuyên: Đẩy Hùng Nguyễn (7) nhô cao để khoét nách trung lộ!', 'auto_awesome');
      });
    }

    // Direct in-pitch drag setup (interactive tactical whiteboard simulation)
    const pitch = document.getElementById('tactical-pitch');
    const players = document.querySelectorAll('.player-node');

    players.forEach(node => {
      let isDragging = false;

      node.addEventListener('mousedown', (e) => {
        isDragging = true;
        node.classList.add('scale-125', 'z-40');
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          node.classList.remove('scale-125', 'z-40');
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging || !pitch) return;
        const rect = pitch.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;

        // Bounded within pitch
        x = Math.max(5, Math.min(95, x));
        y = Math.max(6, Math.min(94, y));

        node.style.left = `${x.toFixed(1)}%`;
        node.style.top = `${y.toFixed(1)}%`;

        const coordText = node.querySelector('.text-label-coord');
        if (coordText) {
          coordText.textContent = `x:${Math.round(x)}% y:${Math.round(y)}%`;
        }
      });
    });
  </script>
</div></main></div></body></html>