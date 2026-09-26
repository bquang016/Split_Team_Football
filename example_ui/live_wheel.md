<!DOCTYPE html>

<html class="dark" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,700;0,800;0,900;1,700;1,900&amp;family=JetBrains+Mono:wght@600;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "primary-fixed": "#6ffbbe", "surface-container": "#171f33", "error": "#ffb4ab", "on-surface-variant": "#bbcabf", "background": "#0b1326", "secondary-container": "#ec6a06", "secondary-fixed": "#ffdbca", "on-tertiary": "#003640", "outline": "#86948a", "inverse-on-surface": "#283044", "on-secondary-fixed-variant": "#783200", "on-secondary-container": "#4a1c00", "tertiary-fixed": "#acedff", "outline-variant": "#3c4a42", "inverse-primary": "#006c49", "on-primary-fixed-variant": "#005236", "surface-container-high": "#222a3d", "on-surface": "#dae2fd", "on-primary-container": "#00422b", "primary": "#4edea3", "surface-container-low": "#131b2e", "secondary": "#ffb690", "surface": "#0b1326", "on-primary-fixed": "#002113", "on-tertiary-container": "#003f4b", "on-tertiary-fixed-variant": "#004e5c", "on-error": "#690005", "on-background": "#dae2fd", "secondary-fixed-dim": "#ffb690", "error-container": "#93000a", "tertiary-fixed-dim": "#4cd7f6", "primary-container": "#10b981", "on-error-container": "#ffdad6", "on-primary": "#003824", "tertiary": "#4cd7f6", "surface-tint": "#4edea3", "on-tertiary-fixed": "#001f26", "surface-container-highest": "#2d3449", "primary-fixed-dim": "#4edea3", "surface-container-lowest": "#060e20", "on-secondary": "#552100", "inverse-surface": "#dae2fd", "surface-variant": "#2d3449", "surface-dim": "#0b1326", "surface-bright": "#31394d", "tertiary-container": "#00b2d0", "on-secondary-fixed": "#341100" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "margin": "1rem", "space-lg": "1.5rem", "space-md": "1rem", "space-xl": "2.5rem", "margin-md": "1.5rem", "margin-lg": "2.5rem", "gutter": "1rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter-md": "1.5rem", "gutter-lg": "2rem" }, "fontFamily": { "score-display": ["Chivo"], "headline-md": ["Chivo"], "body-sm": ["Space Grotesk"], "label-coord": ["JetBrains Mono"], "display-hero-mobile": ["Chivo"], "body-md": ["Space Grotesk"], "score-display-mobile": ["Chivo"], "display-hero": ["Chivo"], "headline-lg-mobile": ["Chivo"], "body-lg": ["Space Grotesk"], "headline-lg": ["Chivo"], "headline-sm": ["Chivo"], "label-tactical": ["JetBrains Mono"] }, "fontSize": { "score-display": ["64px", { "lineHeight": "64px", "letterSpacing": "-0.04em", "fontWeight": "900" }], "headline-md": ["24px", { "lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "700" }], "body-sm": ["13px", { "lineHeight": "18px", "letterSpacing": "0", "fontWeight": "400" }], "label-coord": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "600" }], "display-hero-mobile": ["36px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "900" }], "body-md": ["15px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }], "score-display-mobile": ["44px", { "lineHeight": "44px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "display-hero": ["56px", { "lineHeight": "60px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "headline-lg-mobile": ["26px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "800" }], "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "500" }], "headline-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" }], "headline-sm": ["18px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "700" }], "label-tactical": ["12px", { "lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "700" }] } } } }</script></head><body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container"><aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col"><div class="px-space-md py-space-lg flex items-center gap-space-sm"><img alt="FootballSquad Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V63XxDGai6pSqrQ6SYrLqVsh8fVtdvy917bQ_Z2SSpwYCz9mxwWWGZo6wCF8kbptMpuFVh7_TFiqRrgiH7WtlSH2L7G791ShIoWPEwihg9pRimeMCkWbMlbtg2bzj6LKWv6a87-i_IhRnnou8gRTtkUlssJc5thSCkhwngGjmeVHuSKueV3oHmF9WRPqFXDoItwq3YpEeiAKbfk4cAzTgzGRs6h1XWjatut5wQE8byYJpnDMKHRl-W4TA"/><div class="flex flex-col"><span class="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface leading-tight">FootballSquad</span><span class="font-label-coord text-label-coord text-primary uppercase tracking-wider">FC Saigon Sunday League</span></div></div><div class="px-space-md py-space-xs"><div class="font-label-coord text-label-coord uppercase tracking-wider text-outline px-space-xs mb-space-xs">Match Command</div><nav class="flex flex-col gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-xl"><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="trang-chu" href="#"><span class="material-symbols-outlined text-xl">stadium</span><span>Trang chủ</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="lich-va-tran-dau" href="#"><span class="material-symbols-outlined text-xl">calendar_month</span><span>Lịch &amp; Trận đấu</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="sa-ban-va-lineup" href="#"><span class="material-symbols-outlined text-xl">sports</span><span>Sa bàn &amp; Lineup</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="bang-xep-hang" href="#"><span class="material-symbols-outlined text-xl">leaderboard</span><span>Bảng xếp hạng</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="cau-thu-va-doi-hinh" href="#"><span class="material-symbols-outlined text-xl">groups</span><span>Cầu thủ &amp; Đội hình</span></a></nav></div></div><div class="flex flex-col p-space-md gap-space-sm"><div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-xs"><div class="flex items-center justify-between"><div class="flex items-center gap-space-xs"><span class="material-symbols-outlined text-primary text-sm">admin_panel_settings</span><span class="font-label-coord text-label-coord uppercase tracking-wider text-on-surface-variant">Vai trò: Admin</span></div><span class="font-label-coord text-label-coord text-primary-fixed bg-surface-container-high px-space-xs py-0.5 rounded">CAPTAIN</span></div><button class="w-full flex items-center justify-between px-space-sm py-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors group" type="button"><span class="font-label-tactical text-label-tactical text-on-surface group-hover:text-primary transition-colors">Chế độ Quản trị</span><span class="material-symbols-outlined text-primary text-base">sync_alt</span></button></div><div class="flex items-center justify-between pt-space-xs"><div class="flex items-center gap-space-sm"><div class="relative"><img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/><span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span></div><div class="flex flex-col"><span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Hùng Nguyễn</span><span class="font-label-coord text-label-coord text-outline">Team A · Live WS</span></div></div><button aria-label="User settings" class="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-lg">tune</span></button></div></div></aside><div class="pl-64"><header class="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-gutter-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex items-center gap-space-lg"><div class="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full"><span class="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span class="w-2 h-2 rounded-full bg-secondary-container -ml-space-xs"></span><span class="font-label-tactical text-label-tactical text-secondary uppercase tracking-wider">TRẬN ĐANG ĐÁ</span><span class="font-label-coord text-label-coord text-on-surface-variant">|</span><span class="font-headline-sm text-headline-sm text-on-surface">FC SAIGON 2 - 1 TÂN BÌNH UTD</span><span class="font-label-coord text-label-coord text-primary bg-surface-container-high px-space-xs rounded">68'</span></div></div><div class="flex items-center gap-space-md"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-lg pointer-events-none">search</span><input class="bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-full pl-9 pr-space-md py-space-xs focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all" placeholder="Tìm cầu thủ, trận đấu..." type="text"/></div><button aria-label="Notifications" class="relative p-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-xl">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span></button></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Top Tactical Match Header Card -->
<div class="relative w-full bg-surface-container-low px-gutter-md py-space-md shadow-md mb-space-md overflow-hidden">
<!-- Ambient Pitch Floodlight Glow -->
<div class="absolute -top-24 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute -top-24 -right-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="relative z-10 flex flex-col gap-space-md">
<!-- Title & Match Telemetry Row -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div class="flex items-center gap-space-md">
<div class="p-space-xs bg-surface-container-high rounded-lg flex items-center justify-center">
<img alt="FootballSquad Logo" class="w-10 h-10 object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V63XxDGai6pSqrQ6SYrLqVsh8fVtdvy917bQ_Z2SSpwYCz9mxwWWGZo6wCF8kbptMpuFVh7_TFiqRrgiH7WtlSH2L7G791ShIoWPEwihg9pRimeMCkWbMlbtg2bzj6LKWv6a87-i_IhRnnou8gRTtkUlssJc5thSCkhwngGjmeVHuSKueV3oHmF9WRPqFXDoItwq3YpEeiAKbfk4cAzTgzGRs6h1XWjatut5wQE8byYJpnDMKHRl-W4TA"/>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-label-tactical text-label-tactical uppercase tracking-wider text-secondary px-space-xs py-0.5 bg-secondary-container/20 rounded">Matchweek 14</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">• Sân Chánh Hưng (Sân 7A) • Format 7v7</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
              FC ĐỎ TRẮNG <span class="text-secondary font-headline-sm">VS</span> FC XANH NEON
            </h1>
</div>
</div>
<!-- Connection and Live WS Status -->
<div class="flex items-center flex-wrap gap-space-sm">
<div class="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-high rounded-full shadow-inner">
<span class="relative flex h-2.5 w-2.5">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<span class="font-label-tactical text-label-tactical text-on-surface">STOMP: LIVE SYNC</span>
<span class="font-label-coord text-label-coord text-outline">|</span>
<span class="font-label-coord text-label-coord text-primary-fixed">16 NGƯỜI XEM</span>
<span class="font-label-coord text-label-coord text-outline">|</span>
<span class="font-label-coord text-label-coord text-tertiary">24ms</span>
</div>
<div class="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest rounded-full text-on-surface-variant font-label-coord text-label-coord">
<span class="material-symbols-outlined text-primary text-sm">shield_person</span>
<span>HOST: <strong class="text-on-surface">Hùng Nguyễn</strong></span>
</div>
</div>
</div>
<!-- Navigation Tabs & Inline Admin Command Strip -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pt-space-xs">
<!-- Match Flow Tabs -->
<div class="flex items-center gap-space-xs overflow-x-auto pb-1 md:pb-0">
<button class="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap">
            Tổng quan
          </button>
<button class="px-space-md py-space-xs font-body-sm text-body-sm bg-primary-container text-on-primary-container font-bold rounded-lg flex items-center gap-space-xs shadow-md shadow-primary-container/20 whitespace-nowrap">
<span class="material-symbols-outlined text-sm">casino</span>
<span>★ Vòng quay Live (Đang chọn)</span>
</button>
<button class="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap">
            Chọn người (Pick)
          </button>
<button class="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap">
            Sa bàn Lineup
          </button>
<button class="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap">
            Kết quả &amp; Thống kê
          </button>
</div>
<!-- Admin In-line Live Execution Controls -->
<div class="flex items-center gap-space-xs">
<button class="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-all" id="adminResetBtn">
<span class="material-symbols-outlined text-sm text-error">restart_alt</span>
<span>Reset Phiên</span>
</button>
<button class="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-all">
<span class="material-symbols-outlined text-sm text-tertiary">how_to_reg</span>
<span>Sang bước Pick</span>
</button>
</div>
</div>
</div>
</div>
<!-- Main Split Tactical Center -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md px-gutter-md pb-space-xl">
<!-- LEFT PANEL: Spin Wheel Hub & Seed Telemetry (55% -> 7 Cols) -->
<div class="lg:col-span-7 flex flex-col gap-space-md">
<!-- Spin Canvas Card -->
<div class="relative bg-surface-container-low rounded-xl p-space-lg flex flex-col items-center justify-between shadow-xl overflow-hidden min-h-[580px]">
<!-- Tactical Radar Background Grid -->
<div class="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="40" id="tactical-grid" patternunits="userSpaceOnUse" width="40">
<path class="text-outline" d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5"></path>
</pattern>
</defs>
<rect fill="url(#tactical-grid)" height="100%" width="100%"></rect>
<circle class="text-primary" cx="50%" cy="50%" fill="none" r="220" stroke="currentColor" stroke-width="1"></circle>
<circle class="text-tertiary" cx="50%" cy="50%" fill="none" r="270" stroke="currentColor" stroke-dasharray="4 4" stroke-width="0.5"></circle>
</svg>
</div>
<!-- Wheel Top Status Header -->
<div class="relative z-10 w-full flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-md px-space-md py-space-xs rounded-xl">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-base">sync</span>
<span class="font-label-tactical text-label-tactical text-on-surface uppercase tracking-wider">PHÂN ĐỊNH QUYỀN PICK 1ST</span>
</div>
<span class="font-label-coord text-label-coord px-space-xs py-0.5 bg-surface-container-high text-primary rounded">LIVE BROADCAST</span>
</div>
<!-- Circular Athletic Wheel Display -->
<div class="relative z-10 my-space-lg flex items-center justify-center">
<!-- Top Radar Tactical Needle Marker -->
<div class="absolute -top-6 z-30 flex flex-col items-center filter drop-shadow-[0_4px_12px_rgba(239,68,68,0.7)]">
<div class="w-0 h-0 border-x-8 border-x-transparent border-t-[20px] border-t-secondary-container"></div>
<span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse -mt-1"></span>
</div>
<!-- The Spin Wheel Element -->
<div class="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-2xl transition-transform duration-[5000ms] cubic-bezier(0.15, 0.9, 0.25, 1) ring-4 ring-surface-container-high" id="tacticalWheel">
<!-- Team A Half (Crimson Energy) -->
<div class="absolute inset-0 bg-gradient-to-br from-error-container via-secondary-container to-surface-container-lowest flex flex-col items-center justify-start pt-8" style="clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);">
<div class="flex flex-col items-center gap-space-xs">
<span class="font-headline-md text-headline-md text-on-error uppercase font-extrabold tracking-wider">TEAM A</span>
<span class="font-label-tactical text-label-tactical text-secondary-fixed bg-surface-container-lowest/60 px-space-xs py-0.5 rounded">ĐỎ TRẮNG</span>
<div class="flex items-center gap-space-xs mt-1">
<img alt="Captain Hùng Nguyễn" class="w-10 h-10 rounded-full object-cover ring-2 ring-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/>
<div class="flex flex-col text-left">
<span class="font-body-sm text-body-sm font-bold text-on-surface leading-tight">Hùng Nguyễn</span>
<span class="font-label-coord text-label-coord text-secondary-fixed">CAPTAIN A</span>
</div>
</div>
</div>
</div>
<!-- Team B Half (Neon Emerald Energy) -->
<div class="absolute inset-0 bg-gradient-to-tl from-on-primary-container via-primary-container to-surface-container-lowest flex flex-col items-center justify-end pb-8" style="clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);">
<div class="flex flex-col items-center gap-space-xs">
<div class="flex items-center gap-space-xs mb-1">
<div class="flex flex-col text-right">
<span class="font-body-sm text-body-sm font-bold text-on-primary leading-tight">Tuấn Chelsea</span>
<span class="font-label-coord text-label-coord text-on-primary-fixed-variant">CAPTAIN B</span>
</div>
<div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-sm text-headline-sm text-primary ring-2 ring-primary">
                    TC
                  </div>
</div>
<span class="font-label-tactical text-label-tactical text-on-primary bg-surface-container-lowest/60 px-space-xs py-0.5 rounded">XANH NEON</span>
<span class="font-headline-md text-headline-md text-on-primary uppercase font-extrabold tracking-wider">TEAM B</span>
</div>
</div>
<!-- Wheel Center Hub Pivot -->
<div class="absolute inset-0 m-auto w-24 h-24 rounded-full bg-surface-container-lowest flex flex-col items-center justify-center shadow-2xl ring-4 ring-surface-container-high z-20">
<span class="material-symbols-outlined text-primary text-2xl animate-spin" style="animation-duration: 9s;">sports_soccer</span>
<span class="font-label-coord text-label-coord text-outline font-bold tracking-widest mt-0.5">RNG</span>
</div>
</div>
</div>
<!-- Winner Outcome Banner (Active State) -->
<div class="relative z-10 w-full bg-primary-container/20 rounded-xl p-space-md flex items-center justify-between shadow-lg" id="winnerBanner">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm">
<span class="material-symbols-outlined text-2xl">emoji_events</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-label-tactical text-label-tactical text-primary uppercase font-bold tracking-wider">KẾT QUẢ VÒNG QUAY:</span>
<span class="font-body-md text-body-md font-bold text-on-surface">HÙNG NGUYỄN (TEAM A) THẮNG</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">Team A được ưu tiên quyền Pick cầu thủ đầu tiên theo thể thức Snake Draft.</span>
</div>
</div>
<span class="font-label-coord text-label-coord bg-primary-container text-on-primary-container px-space-sm py-1 rounded font-bold uppercase">LƯỢT PICK #1</span>
</div>
<!-- Admin Spin Trigger Buttons -->
<div class="relative z-10 w-full flex flex-col sm:flex-row items-center gap-space-sm mt-space-md">
<button class="flex-1 w-full flex items-center justify-center gap-space-sm py-space-md px-space-lg bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wider rounded-xl transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 group" id="spinMasterBtn">
<span class="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">play_circle</span>
<span>BẮT ĐẦU QUAY LIVE</span>
</button>
<button class="w-full sm:w-auto flex items-center justify-center gap-space-xs py-space-md px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-tactical text-label-tactical uppercase tracking-wider rounded-xl transition-all" id="spinTestBtn">
<span class="material-symbols-outlined text-base">science</span>
<span>Quay thử nghiệm</span>
</button>
</div>
<!-- Technical Telemetry Footer Strip -->
<div class="relative z-10 w-full grid grid-cols-3 gap-space-xs text-center pt-space-md">
<div class="p-space-xs bg-surface-container rounded-lg">
<span class="font-label-coord text-label-coord text-outline block">SEED ĐỒNG BỘ</span>
<span class="font-label-coord text-label-coord text-tertiary font-bold">#948271038</span>
</div>
<div class="p-space-xs bg-surface-container rounded-lg">
<span class="font-label-coord text-label-coord text-outline block">THỜI GIAN QUAY</span>
<span class="font-label-coord text-label-coord text-on-surface font-bold">5.000 ms</span>
</div>
<div class="p-space-xs bg-surface-container rounded-lg">
<span class="font-label-coord text-label-coord text-outline block">THUẬT TOÁN</span>
<span class="font-label-coord text-label-coord text-primary font-bold">Deterministic RNG</span>
</div>
</div>
</div>
<!-- Live Viewers & Activity Feed Stream -->
<div class="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col gap-space-xs">
<div class="flex items-center justify-between mb-space-xs">
<div class="flex items-center gap-space-xs">
<span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
<span class="font-label-tactical text-label-tactical text-on-surface uppercase tracking-wider">LIVE ACTIVITY TICKER</span>
</div>
<span class="font-label-coord text-label-coord text-outline">STOMP topic: /topic/match.14.events</span>
</div>
<div class="flex flex-col gap-space-xs">
<div class="flex items-center justify-between p-space-xs bg-surface-container-high/60 rounded-lg">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-tertiary text-sm">login</span>
<span class="font-body-sm text-body-sm text-on-surface"><strong class="text-tertiary">Thành Đạt</strong> vừa vào phòng chờ xem quay.</span>
</div>
<span class="font-label-coord text-label-coord text-outline">10s trước</span>
</div>
<div class="flex items-center justify-between p-space-xs bg-surface-container-high/60 rounded-lg">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-sm">swap_horiz</span>
<span class="font-body-sm text-body-sm text-on-surface"><strong class="text-secondary">Đội trưởng A</strong> pick <strong class="text-primary">Tuấn Anh</strong> vào vị trí Tiền vệ trung tâm (CM).</span>
</div>
<span class="font-label-coord text-label-coord text-outline">32s trước</span>
</div>
</div>
</div>
</div>
<!-- RIGHT PANEL: Player Pool & Direct Squad Forming (45% -> 5 Cols) -->
<div class="lg:col-span-5 flex flex-col gap-space-md">
<!-- Waiting Pool (Cầu thủ chưa chọn) -->
<div class="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="font-headline-sm text-headline-sm text-on-surface uppercase">HÀNG CHỜ CẦU THỦ</span>
<span class="font-label-coord text-label-coord bg-surface-container-high text-primary px-space-xs py-0.5 rounded font-bold">4 AVAILABLE</span>
</div>
<span class="font-label-tactical text-label-tactical text-secondary animate-pulse">LƯỢT: ĐỘI TRƯỞNG A PICK</span>
</div>
<!-- Player Chips Pool Grid -->
<div class="flex flex-col gap-space-xs max-h-72 overflow-y-auto pr-1">
<!-- Player Chip 1 -->
<div class="p-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-all">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-headline-sm text-headline-sm text-primary">
                Q
              </div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Quang Hải</span>
<span class="font-label-coord text-label-coord bg-secondary-container/20 text-secondary px-1 py-0.5 rounded font-bold">ST</span>
</div>
<div class="flex items-center gap-space-xs text-outline font-label-coord text-label-coord">
<span>Phong độ: 9.4</span>
<span>•</span>
<span>14 Trận / 18 Bàn</span>
</div>
</div>
</div>
<button class="px-space-md py-space-xs bg-primary-container hover:bg-primary text-on-primary-container font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-sm">
              + Pick Team A
            </button>
</div>
<!-- Player Chip 2 -->
<div class="p-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-all">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-headline-sm text-headline-sm text-tertiary">
                V
              </div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Việt Hùng</span>
<span class="font-label-coord text-label-coord bg-tertiary-container/30 text-tertiary px-1 py-0.5 rounded font-bold">GK</span>
</div>
<div class="flex items-center gap-space-xs text-outline font-label-coord text-label-coord">
<span>Phong độ: 8.8</span>
<span>•</span>
<span>CS Rate: 65%</span>
</div>
</div>
</div>
<button class="px-space-md py-space-xs bg-primary-container hover:bg-primary text-on-primary-container font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-sm">
              + Pick Team A
            </button>
</div>
<!-- Player Chip 3 -->
<div class="p-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-all">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-headline-sm text-headline-sm text-secondary">
                D
              </div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Đăng Khoa</span>
<span class="font-label-coord text-label-coord bg-primary-container/20 text-primary px-1 py-0.5 rounded font-bold">CB</span>
</div>
<div class="flex items-center gap-space-xs text-outline font-label-coord text-label-coord">
<span>Phong độ: 8.5</span>
<span>•</span>
<span>Tranh chấp 88%</span>
</div>
</div>
</div>
<button class="px-space-md py-space-xs bg-primary-container hover:bg-primary text-on-primary-container font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-sm">
              + Pick Team A
            </button>
</div>
<!-- Player Chip 4 -->
<div class="p-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-all">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-headline-sm text-headline-sm text-on-surface">
                M
              </div>
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Minh Trí</span>
<span class="font-label-coord text-label-coord bg-surface-container-lowest text-on-surface-variant px-1 py-0.5 rounded font-bold">CM</span>
</div>
<div class="flex items-center gap-space-xs text-outline font-label-coord text-label-coord">
<span>Phong độ: 8.1</span>
<span>•</span>
<span>Chuyền chính xác 82%</span>
</div>
</div>
</div>
<button class="px-space-md py-space-xs bg-primary-container hover:bg-primary text-on-primary-container font-label-tactical text-label-tactical uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-sm">
              + Pick Team A
            </button>
</div>
</div>
</div>
<!-- Realtime Squad Formation Comparison (2 Columns) -->
<div class="grid grid-cols-2 gap-space-sm">
<!-- Team A Column (Đỏ Trắng) -->
<div class="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-space-xs shadow-md">
<div class="flex items-center justify-between p-space-xs bg-secondary-container/20 rounded-lg">
<div class="flex flex-col">
<span class="font-headline-sm text-headline-sm text-secondary uppercase font-bold">TEAM A</span>
<span class="font-label-coord text-label-coord text-outline">ÁO ĐỎ TRẮNG</span>
</div>
<span class="font-headline-md text-headline-md text-secondary font-extrabold">3/7</span>
</div>
<div class="flex flex-col gap-space-xs mt-1">
<!-- Captain -->
<div class="p-space-xs bg-surface-container rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<img alt="Captain Hùng Nguyễn" class="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/>
<span class="font-body-sm text-body-sm font-bold text-on-surface">Hùng Nguyễn</span>
</div>
<span class="font-label-coord text-label-coord bg-secondary-container text-on-secondary-container px-1 rounded font-bold">C</span>
</div>
<!-- Picked 1 -->
<div class="p-space-xs bg-surface-container rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-label-coord text-label-coord font-bold text-primary">TA</span>
<span class="font-body-sm text-body-sm text-on-surface">Tuấn Anh</span>
</div>
<span class="font-label-coord text-label-coord text-outline font-bold">CM</span>
</div>
<!-- Picked 2 -->
<div class="p-space-xs bg-surface-container rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-label-coord text-label-coord font-bold text-tertiary">BL</span>
<span class="font-body-sm text-body-sm text-on-surface">Bảo Long</span>
</div>
<span class="font-label-coord text-label-coord text-outline font-bold">CB</span>
</div>
<!-- Empty Slots -->
<div class="p-space-xs bg-surface-container-lowest/50 rounded-lg flex items-center justify-center py-2 text-outline-variant font-label-coord text-label-coord">
              [Slot 4: Trống]
            </div>
<div class="p-space-xs bg-surface-container-lowest/50 rounded-lg flex items-center justify-center py-2 text-outline-variant font-label-coord text-label-coord">
              [Slot 5: Trống]
            </div>
</div>
</div>
<!-- Team B Column (Xanh Neon) -->
<div class="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-space-xs shadow-md">
<div class="flex items-center justify-between p-space-xs bg-primary-container/20 rounded-lg">
<div class="flex flex-col">
<span class="font-headline-sm text-headline-sm text-primary uppercase font-bold">TEAM B</span>
<span class="font-label-coord text-label-coord text-outline">ÁO XANH NEON</span>
</div>
<span class="font-headline-md text-headline-md text-primary font-extrabold">2/7</span>
</div>
<div class="flex flex-col gap-space-xs mt-1">
<!-- Captain -->
<div class="p-space-xs bg-surface-container rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-coord text-label-coord font-bold">TC</span>
<span class="font-body-sm text-body-sm font-bold text-on-surface">Tuấn Chelsea</span>
</div>
<span class="font-label-coord text-label-coord bg-primary-container text-on-primary-container px-1 rounded font-bold">C</span>
</div>
<!-- Picked 1 -->
<div class="p-space-xs bg-surface-container rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-label-coord text-label-coord font-bold text-secondary">VN</span>
<span class="font-body-sm text-body-sm text-on-surface">Văn Nam</span>
</div>
<span class="font-label-coord text-label-coord text-outline font-bold">ST</span>
</div>
<!-- Empty Slots -->
<div class="p-space-xs bg-surface-container-lowest/50 rounded-lg flex items-center justify-center py-2 text-outline-variant font-label-coord text-label-coord">
              [Slot 3: Trống]
            </div>
<div class="p-space-xs bg-surface-container-lowest/50 rounded-lg flex items-center justify-center py-2 text-outline-variant font-label-coord text-label-coord">
              [Slot 4: Trống]
            </div>
<div class="p-space-xs bg-surface-container-lowest/50 rounded-lg flex items-center justify-center py-2 text-outline-variant font-label-coord text-label-coord">
              [Slot 5: Trống]
            </div>
</div>
</div>
</div>
<!-- Bench / Substitutes Tray -->
<div class="bg-surface-container-low rounded-xl p-space-md shadow-md flex flex-col gap-space-xs">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-outline text-base">chair</span>
<span class="font-label-tactical text-label-tactical text-on-surface uppercase tracking-wider">HÀNG DỰ BỊ (BENCH RESERVES)</span>
</div>
<span class="font-label-coord text-label-coord text-outline">4 Cầu thủ đăng ký</span>
</div>
<div class="grid grid-cols-2 gap-space-xs mt-1">
<div class="p-space-xs bg-surface-container-high rounded-lg flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface">Quốc Hưng</span>
<span class="font-label-coord text-label-coord text-tertiary font-bold">GK Dự bị</span>
</div>
<div class="p-space-xs bg-surface-container-high rounded-lg flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface">Đức Duy</span>
<span class="font-label-coord text-label-coord text-outline font-bold">SUB 1</span>
</div>
<div class="p-space-xs bg-surface-container-high rounded-lg flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface">Minh Tuấn</span>
<span class="font-label-coord text-label-coord text-outline font-bold">SUB 2</span>
</div>
<div class="p-space-xs bg-surface-container-high rounded-lg flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface">Khánh Hoàng</span>
<span class="font-label-coord text-label-coord text-outline font-bold">SUB 3</span>
</div>
</div>
</div>
</div>
</div>
<!-- Inline Tactical Spin Interaction Script -->
<script>
    (function() {
      const wheel = document.getElementById('tacticalWheel');
      const spinBtn = document.getElementById('spinMasterBtn');
      const testBtn = document.getElementById('spinTestBtn');
      const resetBtn = document.getElementById('adminResetBtn');
      const banner = document.getElementById('winnerBanner');

      let currentRotation = 0;
      let isSpinning = false;

      function triggerSpin(deterministicDeg) {
        if (isSpinning) return;
        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.classList.add('opacity-50');

        // 5 full rotations (1800deg) + target angle
        const extraRounds = 1800;
        currentRotation += extraRounds + deterministicDeg;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
          isSpinning = false;
          spinBtn.disabled = false;
          spinBtn.classList.remove('opacity-50');
          if (banner) {
            banner.classList.remove('opacity-40');
            banner.classList.add('scale-102');
          }
        }, 5000);
      }

      if (spinBtn) {
        spinBtn.addEventListener('click', () => {
          // Lands on Team A (top half after rotation)
          triggerSpin(180);
        });
      }

      if (testBtn) {
        testBtn.addEventListener('click', () => {
          // Quick spin simulation (randomized deterministic angle)
          const angle = Math.random() > 0.5 ? 90 : 270;
          triggerSpin(angle);
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentRotation = 0;
          wheel.style.transition = 'none';
          wheel.style.transform = 'rotate(0deg)';
          setTimeout(() => {
            wheel.style.transition = 'transform 5000ms cubic-bezier(0.15, 0.9, 0.25, 1)';
          }, 50);
        });
      }
    })();
  </script>
</div></main></div></body></html>