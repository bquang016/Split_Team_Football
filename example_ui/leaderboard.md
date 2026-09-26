<!DOCTYPE html>

<html class="dark" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,700;0,800;0,900;1,700;1,900&amp;family=JetBrains+Mono:wght@600;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "primary-fixed": "#6ffbbe", "surface-container": "#171f33", "error": "#ffb4ab", "on-surface-variant": "#bbcabf", "background": "#0b1326", "secondary-container": "#ec6a06", "secondary-fixed": "#ffdbca", "on-tertiary": "#003640", "outline": "#86948a", "inverse-on-surface": "#283044", "on-secondary-fixed-variant": "#783200", "on-secondary-container": "#4a1c00", "tertiary-fixed": "#acedff", "outline-variant": "#3c4a42", "inverse-primary": "#006c49", "on-primary-fixed-variant": "#005236", "surface-container-high": "#222a3d", "on-surface": "#dae2fd", "on-primary-container": "#00422b", "primary": "#4edea3", "surface-container-low": "#131b2e", "secondary": "#ffb690", "surface": "#0b1326", "on-primary-fixed": "#002113", "on-tertiary-container": "#003f4b", "on-tertiary-fixed-variant": "#004e5c", "on-error": "#690005", "on-background": "#dae2fd", "secondary-fixed-dim": "#ffb690", "error-container": "#93000a", "tertiary-fixed-dim": "#4cd7f6", "primary-container": "#10b981", "on-error-container": "#ffdad6", "on-primary": "#003824", "tertiary": "#4cd7f6", "surface-tint": "#4edea3", "on-tertiary-fixed": "#001f26", "surface-container-highest": "#2d3449", "primary-fixed-dim": "#4edea3", "surface-container-lowest": "#060e20", "on-secondary": "#552100", "inverse-surface": "#dae2fd", "surface-variant": "#2d3449", "surface-dim": "#0b1326", "surface-bright": "#31394d", "tertiary-container": "#00b2d0", "on-secondary-fixed": "#341100" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "margin": "1rem", "space-lg": "1.5rem", "space-md": "1rem", "space-xl": "2.5rem", "margin-md": "1.5rem", "margin-lg": "2.5rem", "gutter": "1rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter-md": "1.5rem", "gutter-lg": "2rem" }, "fontFamily": { "score-display": ["Chivo"], "headline-md": ["Chivo"], "body-sm": ["Space Grotesk"], "label-coord": ["JetBrains Mono"], "display-hero-mobile": ["Chivo"], "body-md": ["Space Grotesk"], "score-display-mobile": ["Chivo"], "display-hero": ["Chivo"], "headline-lg-mobile": ["Chivo"], "body-lg": ["Space Grotesk"], "headline-lg": ["Chivo"], "headline-sm": ["Chivo"], "label-tactical": ["JetBrains Mono"] }, "fontSize": { "score-display": ["64px", { "lineHeight": "64px", "letterSpacing": "-0.04em", "fontWeight": "900" }], "headline-md": ["24px", { "lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "700" }], "body-sm": ["13px", { "lineHeight": "18px", "letterSpacing": "0", "fontWeight": "400" }], "label-coord": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "600" }], "display-hero-mobile": ["36px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "900" }], "body-md": ["15px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }], "score-display-mobile": ["44px", { "lineHeight": "44px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "display-hero": ["56px", { "lineHeight": "60px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "headline-lg-mobile": ["26px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "800" }], "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "500" }], "headline-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" }], "headline-sm": ["18px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "700" }], "label-tactical": ["12px", { "lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "700" }] } } } }</script></head><body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container"><aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col"><div class="px-space-md py-space-lg flex items-center gap-space-sm"><img alt="FootballSquad Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V63XxDGai6pSqrQ6SYrLqVsh8fVtdvy917bQ_Z2SSpwYCz9mxwWWGZo6wCF8kbptMpuFVh7_TFiqRrgiH7WtlSH2L7G791ShIoWPEwihg9pRimeMCkWbMlbtg2bzj6LKWv6a87-i_IhRnnou8gRTtkUlssJc5thSCkhwngGjmeVHuSKueV3oHmF9WRPqFXDoItwq3YpEeiAKbfk4cAzTgzGRs6h1XWjatut5wQE8byYJpnDMKHRl-W4TA"/><div class="flex flex-col"><span class="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface leading-tight">FootballSquad</span><span class="font-label-coord text-label-coord text-primary uppercase tracking-wider">FC Saigon Sunday League</span></div></div><div class="px-space-md py-space-xs"><div class="font-label-coord text-label-coord uppercase tracking-wider text-outline px-space-xs mb-space-xs">Match Command</div><nav class="flex flex-col gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-xl"><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="trang-chu" href="#"><span class="material-symbols-outlined text-xl">stadium</span><span>Trang chủ</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="lich-va-tran-dau" href="#"><span class="material-symbols-outlined text-xl">calendar_month</span><span>Lịch &amp; Trận đấu</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="sa-ban-va-lineup" href="#"><span class="material-symbols-outlined text-xl">sports</span><span>Sa bàn &amp; Lineup</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="bang-xep-hang" href="#"><span class="material-symbols-outlined text-xl">leaderboard</span><span>Bảng xếp hạng</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="cau-thu-va-doi-hinh" href="#"><span class="material-symbols-outlined text-xl">groups</span><span>Cầu thủ &amp; Đội hình</span></a></nav></div></div><div class="flex flex-col p-space-md gap-space-sm"><div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-xs"><div class="flex items-center justify-between"><div class="flex items-center gap-space-xs"><span class="material-symbols-outlined text-primary text-sm">admin_panel_settings</span><span class="font-label-coord text-label-coord uppercase tracking-wider text-on-surface-variant">Vai trò: Admin</span></div><span class="font-label-coord text-label-coord text-primary-fixed bg-surface-container-high px-space-xs py-0.5 rounded">CAPTAIN</span></div><button class="w-full flex items-center justify-between px-space-sm py-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors group" type="button"><span class="font-label-tactical text-label-tactical text-on-surface group-hover:text-primary transition-colors">Chế độ Quản trị</span><span class="material-symbols-outlined text-primary text-base">sync_alt</span></button></div><div class="flex items-center justify-between pt-space-xs"><div class="flex items-center gap-space-sm"><div class="relative"><img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/><span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span></div><div class="flex flex-col"><span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Hùng Nguyễn</span><span class="font-label-coord text-label-coord text-outline">Team A · Live WS</span></div></div><button aria-label="User settings" class="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-lg">tune</span></button></div></div></aside><div class="pl-64"><header class="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-gutter-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex items-center gap-space-lg"><div class="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full"><span class="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span class="w-2 h-2 rounded-full bg-secondary-container -ml-space-xs"></span><span class="font-label-tactical text-label-tactical text-secondary uppercase tracking-wider">TRẬN ĐANG ĐÁ</span><span class="font-label-coord text-label-coord text-on-surface-variant">|</span><span class="font-headline-sm text-headline-sm text-on-surface">FC SAIGON 2 - 1 TÂN BÌNH UTD</span><span class="font-label-coord text-label-coord text-primary bg-surface-container-high px-space-xs rounded">68'</span></div></div><div class="flex items-center gap-space-md"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-lg pointer-events-none">search</span><input class="bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-full pl-9 pr-space-md py-space-xs focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all" placeholder="Tìm cầu thủ, trận đấu..." type="text"/></div><button aria-label="Notifications" class="relative p-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-xl">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span></button></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Interactive Feedback Toaster -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-space-sm bg-surface-container-highest px-space-md py-space-sm rounded-xl shadow-2xl" id="toastNotification">
<span class="material-symbols-outlined text-primary text-xl">check_circle</span>
<span class="font-body-md text-body-md text-on-surface" id="toastMessage">Đã cập nhật dữ liệu BXH thành công!</span>
</div>
<div class="p-gutter lg:p-gutter-lg flex flex-col gap-space-xl">
<!-- Top Command Deck & Filters Header -->
<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg bg-surface-container-low p-space-lg rounded-xl">
<div class="flex flex-col gap-space-xs">
<div class="flex items-center gap-space-sm">
<span class="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-primary-container/20 text-primary font-label-coord text-label-coord uppercase tracking-wider">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Live Standings
          </span>
<span class="font-label-coord text-label-coord text-outline">MATCHDAY #14 • GROUND 07 SAIGON</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
          Bảng Xếp Hạng &amp; Hồ Sơ Cầu Thủ <span class="text-primary font-score-display text-headline-lg font-black tracking-normal">2025</span>
</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Hệ thống ghi nhận hiệu số, thẻ phạt và điểm MVP độc quyền Saigon Sunday League. Ban Cán Sự cập nhật tức thì sau còi mãn cuộc.
        </p>
</div>
<!-- Quick Contextual Admin Actions & Season Chooser -->
<div class="flex flex-wrap items-center gap-space-sm">
<div class="flex items-center bg-surface-container-high px-space-sm py-space-xs rounded-lg">
<span class="material-symbols-outlined text-outline text-lg mr-2">event_available</span>
<select class="bg-transparent font-label-tactical text-label-tactical text-on-surface focus:outline-none cursor-pointer pr-space-xs uppercase" id="seasonSelect">
<option class="bg-surface-container-high" value="2025">Season 2025 (Chính)</option>
<option class="bg-surface-container-high" value="2024">Season 2024 (Lưu trữ)</option>
<option class="bg-surface-container-high" value="cup">Hè Cup 2025</option>
</select>
</div>
<button class="flex items-center gap-space-xs bg-primary hover:bg-primary-fixed text-on-primary font-headline-sm text-headline-sm px-space-md py-space-sm rounded-lg shadow-md hover:-translate-y-0.5 transition-all" onclick="focusScoreInput()" type="button">
<span class="material-symbols-outlined text-xl">sports_score</span>
<span>+ Nhập Kết Quả Trận</span>
</button>
<a class="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-tactical text-label-tactical px-space-sm py-space-sm rounded-lg transition-colors" href="#pendingQueue">
<span class="material-symbols-outlined text-lg">person_add</span>
<span>Duyệt Cầu Thủ Mới</span>
<span class="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-coord text-label-coord font-bold ml-1">2</span>
</a>
</div>
</div>
<!-- Filter Bar: Sorting Toggles & Key Performance Counters -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container px-space-md py-space-sm rounded-xl">
<div class="flex items-center gap-space-xs flex-wrap">
<span class="font-label-coord text-label-coord uppercase tracking-wider text-outline mr-2">Sắp xếp theo:</span>
<button class="sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-primary-container text-on-primary-container shadow-sm transition-all flex items-center gap-1" onclick="setSortMode('goals', this)" type="button">
<span class="material-symbols-outlined text-sm">sports_soccer</span> Bàn Thắng (G)
        </button>
<button class="sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1" onclick="setSortMode('assists', this)" type="button">
<span class="material-symbols-outlined text-sm">handshake</span> Kiến Tạo (A)
        </button>
<button class="sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1" onclick="setSortMode('wins', this)" type="button">
<span class="material-symbols-outlined text-sm">emoji_events</span> Trận Thắng (W)
        </button>
<button class="sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1" onclick="setSortMode('winrate', this)" type="button">
<span class="material-symbols-outlined text-sm">percent</span> Tỷ Lệ Thắng
        </button>
</div>
<div class="flex items-center gap-space-lg text-outline">
<div class="flex items-center gap-space-xs font-label-coord text-label-coord">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span>THẮNG (W)</span>
</div>
<div class="flex items-center gap-space-xs font-label-coord text-label-coord">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span>THUA (L)</span>
</div>
<div class="flex items-center gap-space-xs font-label-coord text-label-coord text-on-surface">
<span class="material-symbols-outlined text-secondary text-sm">military_tech</span>
<span>MVP: +10 PTS</span>
</div>
</div>
</div>
<!-- Main Two-Column Tactical Battleground -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT COLUMN: Full Season Leaderboard (60% ~ 7 cols) -->
<section class="lg:col-span-7 flex flex-col gap-space-md">
<div class="bg-surface-container-low rounded-xl overflow-hidden shadow-xl">
<!-- Table Header -->
<div class="px-space-md py-space-sm bg-surface-container-high flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-primary text-xl">leaderboard</span>
<span class="font-headline-sm text-headline-sm uppercase text-on-surface">Bảng Xếp Hạng Toàn Mùa</span>
</div>
<span class="font-label-coord text-label-coord text-outline">28 CẦU THỦ ĐÃ RA SÂN</span>
</div>
<!-- Table Container -->
<div class="overflow-x-auto">
<table class="w-full text-left" id="leaderboardTable">
<thead>
<tr class="bg-surface-container-lowest text-outline font-label-coord text-label-coord uppercase tracking-wider">
<th class="py-space-sm px-space-md w-12 text-center">Hạng</th>
<th class="py-space-sm px-space-md">Cầu Thủ</th>
<th class="py-space-sm px-space-sm text-center">Trận</th>
<th class="py-space-sm px-space-sm text-center text-primary">G</th>
<th class="py-space-sm px-space-sm text-center text-tertiary">A</th>
<th class="py-space-sm px-space-sm text-center text-secondary">MVP</th>
<th class="py-space-sm px-space-md text-center">Phong Độ (5 Trận)</th>
<th class="py-space-sm px-space-md text-right">Tỷ Lệ</th>
<th class="py-space-sm px-space-sm text-center w-12"><span class="sr-only">Hành Động</span></th>
</tr>
</thead>
<tbody class="divide-y divide-transparent font-body-sm text-body-sm">
<!-- TOP 1: Golden Badge (Hoàng Minh) -->
<tr class="group bg-surface-container-low hover:bg-surface-container-high transition-colors">
<td class="py-space-md px-space-md text-center">
<div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm shadow-md">
                      1
                    </div>
</td>
<td class="py-space-md px-space-md">
<div class="flex items-center gap-space-sm">
<div class="relative">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Chiseled athletic striker in glowing dark green kit smiling confidently on floodlit stadium turf with golden rim light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6cnOZXug38PT78rOdmJo1SBBuVQztBpQvRf1exaew6H_KG7agimzl1Fhnyu5VDBJisuBzuKuUL5yoJxxun-MZ5UGP_9pNfZ6h5vj_uWAtPVTRcyb9m1lQGKtcTdNto7cCdmSHBv7qhUWzu0DrHpBMDT6L3NeyJSSLzbJh0912w4hKgJxMFZ4eMOcwo8oQUJeME8EJ2Xdx4pnbFfCCD6Fq9OJTWiTaNrzlAx8sfdJO0qgyp4udJqDI"/>
<span class="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[9px] font-black rounded-full px-1">ST</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-on-surface font-bold">Hoàng Minh</span>
<span class="material-symbols-outlined text-secondary text-base" title="Vua phá lưới">local_fire_department</span>
</div>
<span class="font-label-coord text-label-coord text-outline">Đội A • #09</span>
</div>
</div>
</td>
<td class="py-space-md px-space-sm text-center font-label-tactical text-on-surface">14</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-primary font-black">12</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-tertiary">4</td>
<td class="py-space-md px-space-sm text-center">
<span class="px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary font-label-coord text-label-coord font-bold">
                      ★ 3
                    </span>
</td>
<td class="py-space-md px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-error" title="Thua"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
</div>
</td>
<td class="py-space-md px-space-md text-right font-label-tactical text-label-tactical font-bold text-primary">
                    78.5%
                  </td>
<td class="py-space-md px-space-sm text-center">
<button class="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors" onclick="openPlayerRoleModal('Hoàng Minh', 'PLAYER')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">manage_accounts</span>
</button>
</td>
</tr>
<!-- TOP 2: Silver Badge (Hùng Nguyễn - Admin logged in) -->
<tr class="group bg-surface-container/60 hover:bg-surface-container-high transition-colors">
<td class="py-space-md px-space-md text-center">
<div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-outline-variant text-on-surface font-headline-sm text-headline-sm shadow-sm">
                      2
                    </div>
</td>
<td class="py-space-md px-space-md">
<div class="flex items-center gap-space-sm">
<div class="relative">
<img alt="Hùng Nguyễn" class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/>
<span class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-bold rounded px-1">CAP</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-headline-sm text-headline-sm text-on-surface font-bold">Hùng Nguyễn</span>
<span class="font-label-coord text-[9px] bg-primary/20 text-primary px-1 rounded uppercase">ADMIN</span>
</div>
<span class="font-label-coord text-label-coord text-outline">Đội A • #10 (Bạn)</span>
</div>
</div>
</td>
<td class="py-space-md px-space-sm text-center font-label-tactical text-on-surface">14</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-primary font-black">9</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-tertiary">8</td>
<td class="py-space-md px-space-sm text-center">
<span class="px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary font-label-coord text-label-coord font-bold">
                      ★ 4
                    </span>
</td>
<td class="py-space-md px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-error" title="Thua"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
</div>
</td>
<td class="py-space-md px-space-md text-right font-label-tactical text-label-tactical font-bold text-primary">
                    71.4%
                  </td>
<td class="py-space-md px-space-sm text-center">
<button class="p-1 rounded text-primary hover:bg-surface-container-highest transition-colors" onclick="openPlayerRoleModal('Hùng Nguyễn', 'ADMIN')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">verified_user</span>
</button>
</td>
</tr>
<!-- TOP 3: Bronze Badge (Tuấn Chelsea) -->
<tr class="group bg-surface-container-low hover:bg-surface-container-high transition-colors">
<td class="py-space-md px-space-md text-center">
<div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-on-secondary-fixed-variant text-secondary-fixed font-headline-sm text-headline-sm shadow-sm">
                      3
                    </div>
</td>
<td class="py-space-md px-space-md">
<div class="flex items-center gap-space-sm">
<div class="relative">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Intense central midfielder player with short haircut wiping sweat under outdoor football stadium floodlights dark atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7edF3YS3X6n1mGIyP8vP2xf9r-mLo1PLOJo_NymanPkttAwTz5awJco1GjXyH2cuQys0b6AfUzrOUKz0MJz1bsoBwaTtJL-jzMOhIJ5lgJFy4hL3hYyLYwu3dQjaosL8NxSdHOwwetOP7K59lqYPXgZZLFlkgQk4Cb8KZgO79v_Qr5nVaqJFCLIqx-qAPNq2KFE8Q-FnL25bKMdJKEJtczEFrvhJgzv6Uh0rH8rFXBSbk2xnYgil8"/>
<span class="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[9px] font-black rounded-full px-1">CM</span>
</div>
<div class="flex flex-col">
<span class="font-headline-sm text-headline-sm text-on-surface font-bold">Tuấn Chelsea</span>
<span class="font-label-coord text-label-coord text-outline">Đội B • #08</span>
</div>
</div>
</td>
<td class="py-space-md px-space-sm text-center font-label-tactical text-on-surface">13</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-primary font-black">8</td>
<td class="py-space-md px-space-sm text-center font-score-display text-headline-sm text-tertiary">6</td>
<td class="py-space-md px-space-sm text-center">
<span class="px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary font-label-coord text-label-coord font-bold">
                      ★ 2
                    </span>
</td>
<td class="py-space-md px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-3 h-3 rounded-full bg-error" title="Thua"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-primary" title="Thắng"></span>
<span class="w-3 h-3 rounded-full bg-error" title="Thua"></span>
</div>
</td>
<td class="py-space-md px-space-md text-right font-label-tactical text-label-tactical font-bold text-on-surface">
                    61.5%
                  </td>
<td class="py-space-md px-space-sm text-center">
<button class="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors" onclick="openPlayerRoleModal('Tuấn Chelsea', 'PLAYER')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">manage_accounts</span>
</button>
</td>
</tr>
<!-- TOP 4: Quang Hải Phủi -->
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-space-sm px-space-md text-center font-label-tactical text-outline font-bold">4</td>
<td class="py-space-sm px-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-on-surface">QH</div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Quang Hải Phủi</span>
<span class="font-label-coord text-label-coord text-outline">Đội B • #19</span>
</div>
</div>
</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-on-surface">12</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-primary font-bold">6</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-tertiary">7</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-secondary">★ 1</td>
<td class="py-space-sm px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
</div>
</td>
<td class="py-space-sm px-space-md text-right font-label-tactical text-outline">58.3%</td>
<td class="py-space-sm px-space-sm text-center">
<button class="p-1 rounded text-outline hover:text-on-surface" onclick="openPlayerRoleModal('Quang Hải Phủi', 'PLAYER')" type="button"><span class="material-symbols-outlined text-base">manage_accounts</span></button>
</td>
</tr>
<!-- TOP 5: Bảo Trọng (Thủ Môn) -->
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-space-sm px-space-md text-center font-label-tactical text-outline font-bold">5</td>
<td class="py-space-sm px-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-secondary">GK</div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Bảo Trọng</span>
<span class="font-label-coord text-label-coord text-outline">Đội A • #01</span>
</div>
</div>
</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-on-surface">14</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-primary">0</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-tertiary">2</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-secondary">★ 3</td>
<td class="py-space-sm px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
</div>
</td>
<td class="py-space-sm px-space-md text-right font-label-tactical text-outline">71.4%</td>
<td class="py-space-sm px-space-sm text-center">
<button class="p-1 rounded text-outline hover:text-on-surface" onclick="openPlayerRoleModal('Bảo Trọng', 'PLAYER')" type="button"><span class="material-symbols-outlined text-base">manage_accounts</span></button>
</td>
</tr>
<!-- TOP 6: Đăng Khoa CB -->
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-space-sm px-space-md text-center font-label-tactical text-outline font-bold">6</td>
<td class="py-space-sm px-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-on-surface">DK</div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Đăng Khoa</span>
<span class="font-label-coord text-label-coord text-outline">Đội A • #04</span>
</div>
</div>
</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-on-surface">11</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-primary">3</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-tertiary">3</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-secondary">★ 0</td>
<td class="py-space-sm px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
</div>
</td>
<td class="py-space-sm px-space-md text-right font-label-tactical text-outline">54.5%</td>
<td class="py-space-sm px-space-sm text-center">
<button class="p-1 rounded text-outline hover:text-on-surface" onclick="openPlayerRoleModal('Đăng Khoa', 'PLAYER')" type="button"><span class="material-symbols-outlined text-base">manage_accounts</span></button>
</td>
</tr>
<!-- TOP 7: Vũ Neymar -->
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-space-sm px-space-md text-center font-label-tactical text-outline font-bold">7</td>
<td class="py-space-sm px-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-on-surface">VN</div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Vũ Neymar</span>
<span class="font-label-coord text-label-coord text-outline">Đội B • #11</span>
</div>
</div>
</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-on-surface">10</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-primary">5</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-tertiary">2</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-secondary">★ 1</td>
<td class="py-space-md px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
</div>
</td>
<td class="py-space-sm px-space-md text-right font-label-tactical text-outline">40.0%</td>
<td class="py-space-sm px-space-sm text-center">
<button class="p-1 rounded text-outline hover:text-on-surface" onclick="openPlayerRoleModal('Vũ Neymar', 'PLAYER')" type="button"><span class="material-symbols-outlined text-base">manage_accounts</span></button>
</td>
</tr>
<!-- TOP 8: Minh Thắng CDM -->
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-space-sm px-space-md text-center font-label-tactical text-outline font-bold">8</td>
<td class="py-space-sm px-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-on-surface">MT</div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Minh Thắng</span>
<span class="font-label-coord text-label-coord text-outline">Đội B • #06</span>
</div>
</div>
</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-on-surface">12</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-primary">2</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-tertiary">4</td>
<td class="py-space-sm px-space-sm text-center font-label-tactical text-secondary">★ 0</td>
<td class="py-space-sm px-space-md text-center">
<div class="flex items-center justify-center gap-1">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
<span class="w-2.5 h-2.5 rounded-full bg-error"></span>
</div>
</td>
<td class="py-space-sm px-space-md text-right font-label-tactical text-outline">33.3%</td>
<td class="py-space-sm px-space-sm text-center">
<button class="p-1 rounded text-outline hover:text-on-surface" onclick="openPlayerRoleModal('Minh Thắng', 'PLAYER')" type="button"><span class="material-symbols-outlined text-base">manage_accounts</span></button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Bottom Table Info / Footnote -->
<div class="p-space-md bg-surface-container-lowest flex items-center justify-between font-label-coord text-label-coord text-outline">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-sm text-primary">verified</span>
<span>Dữ liệu xác thực tự động bởi Match Arbitrator Bot</span>
</div>
<a class="text-primary hover:underline flex items-center gap-1" href="#">
              Xem toàn bộ 28 cầu thủ <span class="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</div>
<!-- Metric Visualization Bento Strip -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between">
<span class="font-label-coord text-label-coord text-outline uppercase">Tổng bàn thắng giải</span>
<div class="flex items-baseline gap-space-xs mt-2">
<span class="font-score-display text-score-display text-primary">74</span>
<span class="font-body-sm text-body-sm text-outline">bàn / 14 trận</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 72%;"></div>
</div>
</div>
<div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between">
<span class="font-label-coord text-label-coord text-outline uppercase">Hiệu suất trung bình</span>
<div class="flex items-baseline gap-space-xs mt-2">
<span class="font-score-display text-score-display text-tertiary">5.28</span>
<span class="font-body-sm text-body-sm text-outline">bàn/trận</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-tertiary h-full rounded-full" style="width: 85%;"></div>
</div>
</div>
<div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between">
<span class="font-label-coord text-label-coord text-outline uppercase">Thẻ phạt toàn giải</span>
<div class="flex items-center gap-space-md mt-2">
<div class="flex items-center gap-1">
<span class="w-3 h-4 bg-yellow-400 rounded-sm"></span>
<span class="font-headline-sm text-headline-sm text-on-surface">18</span>
</div>
<div class="flex items-center gap-1">
<span class="w-3 h-4 bg-error rounded-sm"></span>
<span class="font-headline-sm text-headline-sm text-error">2</span>
</div>
</div>
<span class="font-label-coord text-[11px] text-outline mt-3">Tỷ lệ Fair-play: 94.2%</span>
</div>
</div>
</section>
<!-- RIGHT COLUMN: Score Entry Widget, AI Summary & Pending Approvals (40% ~ 5 cols) -->
<aside class="lg:col-span-5 flex flex-col gap-space-lg">
<!-- CARD 1: IN-SITU ADMIN MATCH SCORE & STATS ENTRY -->
<div class="bg-surface-container-low rounded-xl shadow-2xl p-space-md flex flex-col gap-space-md relative overflow-hidden" id="matchEntryWidget">
<!-- Tactical Ambient Glow Accent -->
<div class="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="flex items-center justify-between pb-space-xs">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-2xl">edit_document</span>
<div class="flex flex-col">
<h3 class="font-headline-sm text-headline-sm text-on-surface uppercase">Nhập Kết Quả Trận Vừa Đá</h3>
<span class="font-label-coord text-label-coord text-outline">Vòng 14 • Trận đá giao hữu nội bộ</span>
</div>
</div>
<span class="font-label-coord text-label-coord px-2 py-0.5 rounded bg-primary/20 text-primary uppercase font-bold">
              In-situ Live
            </span>
</div>
<!-- Direct Scoreboard Input -->
<div class="bg-surface-container-lowest p-space-md rounded-xl flex items-center justify-around gap-space-sm">
<!-- Team A -->
<div class="flex flex-col items-center gap-space-xs flex-1">
<span class="font-headline-sm text-headline-sm text-primary uppercase tracking-tight">Team A (Xanh)</span>
<span class="font-label-coord text-label-coord text-outline">Đội hình chính</span>
<div class="flex items-center gap-2 mt-1">
<button class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-lg" onclick="adjustScore('teamA', -1)" type="button">-</button>
<input class="w-16 h-16 bg-surface-container-high text-center font-score-display text-score-display text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" id="scoreA" min="0" type="number" value="4"/>
<button class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-lg" onclick="adjustScore('teamA', 1)" type="button">+</button>
</div>
</div>
<!-- VS Divider -->
<div class="flex flex-col items-center">
<span class="font-score-display text-headline-lg text-outline font-black">:</span>
<span class="font-label-coord text-[10px] text-outline uppercase tracking-widest mt-1">FT 90'</span>
</div>
<!-- Team B -->
<div class="flex flex-col items-center gap-space-xs flex-1">
<span class="font-headline-sm text-headline-sm text-secondary uppercase tracking-tight">Team B (Cam)</span>
<span class="font-label-coord text-label-coord text-outline">Đội hình phụ</span>
<div class="flex items-center gap-2 mt-1">
<button class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-lg" onclick="adjustScore('teamB', -1)" type="button">-</button>
<input class="w-16 h-16 bg-surface-container-high text-center font-score-display text-score-display text-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary" id="scoreB" min="0" type="number" value="2"/>
<button class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-lg" onclick="adjustScore('teamB', 1)" type="button">+</button>
</div>
</div>
</div>
<!-- Goal & Assist Allocation (Quick Tagging Chips) -->
<div class="flex flex-col gap-space-xs">
<div class="flex items-center justify-between">
<label class="font-label-coord text-label-coord uppercase tracking-wider text-outline">
                Danh Sách Ghi Bàn &amp; Kiến Tạo (Quick Tag)
              </label>
<button class="font-label-coord text-label-coord text-primary hover:underline flex items-center gap-0.5" onclick="addScorerRow()" type="button">
<span class="material-symbols-outlined text-xs">add</span> Thêm người
              </button>
</div>
<div class="flex flex-col gap-space-xs" id="scorersList">
<!-- Row 1: Hoàng Minh -->
<div class="flex items-center justify-between bg-surface-container p-space-sm rounded-lg">
<div class="flex items-center gap-space-sm">
<span class="font-body-md text-body-md text-on-surface font-bold">Hoàng Minh</span>
<span class="font-label-coord text-label-coord text-primary bg-primary/10 px-1.5 py-0.5 rounded">Team A</span>
</div>
<div class="flex items-center gap-space-sm">
<span class="text-sm font-label-coord text-on-surface">⚽ 2 Bàn</span>
<span class="text-sm font-label-coord text-outline">👟 0 KT</span>
<button class="text-outline hover:text-error transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
<!-- Row 2: Hùng Nguyễn -->
<div class="flex items-center justify-between bg-surface-container p-space-sm rounded-lg">
<div class="flex items-center gap-space-sm">
<span class="font-body-md text-body-md text-on-surface font-bold">Hùng Nguyễn</span>
<span class="font-label-coord text-label-coord text-primary bg-primary/10 px-1.5 py-0.5 rounded">Team A</span>
</div>
<div class="flex items-center gap-space-sm">
<span class="text-sm font-label-coord text-on-surface">⚽ 1 Bàn</span>
<span class="text-sm font-label-coord text-tertiary">👟 1 KT</span>
<button class="text-outline hover:text-error transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
<!-- Row 3: Tuấn Chelsea -->
<div class="flex items-center justify-between bg-surface-container p-space-sm rounded-lg">
<div class="flex items-center gap-space-sm">
<span class="font-body-md text-body-md text-on-surface font-bold">Tuấn Chelsea</span>
<span class="font-label-coord text-label-coord text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">Team B</span>
</div>
<div class="flex items-center gap-space-sm">
<span class="text-sm font-label-coord text-on-surface">⚽ 2 Bàn</span>
<span class="text-sm font-label-coord text-outline">👟 0 KT</span>
<button class="text-outline hover:text-error transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
</div>
</div>
<!-- Select MVP Dropdown -->
<div class="flex flex-col gap-space-xs">
<label class="font-label-coord text-label-coord uppercase tracking-wider text-outline flex items-center gap-1" for="mvpSelect">
<span class="material-symbols-outlined text-secondary text-sm">star</span>
              Cầu Thủ Xuất Sắc Nhất Trận (Man of the Match)
            </label>
<div class="relative">
<select class="w-full bg-surface-container text-on-surface font-body-md text-body-md p-space-sm rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-10" id="mvpSelect">
<option selected="" value="hung_nguyen">★ Hùng Nguyễn - Đội trưởng A (1G, 1A, Đánh chặn 6 lần)</option>
<option value="hoang_minh">★ Hoàng Minh - ST Team A (2G, Cú đúp mở tỷ số)</option>
<option value="tuan_chelsea">★ Tuấn Chelsea - CM Team B (2G sút xa uy lực)</option>
<option value="bao_trong">★ Bảo Trọng - GK Team A (Cản phá penalty 75')</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">expand_more</span>
</div>
</div>
<!-- Admin Commit Actions -->
<div class="flex items-center gap-space-sm pt-space-xs">
<button class="flex-1 bg-primary hover:bg-primary-fixed text-on-primary font-headline-sm text-headline-sm py-space-sm px-space-md rounded-lg shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-space-xs" onclick="submitMatchResult()" type="button">
<span class="material-symbols-outlined text-xl">cloud_sync</span>
<span>Lưu &amp; Cập Nhật BXH</span>
</button>
<button class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-label-tactical text-label-tactical py-space-sm px-space-md rounded-lg transition-colors" onclick="resetScoreForm()" type="button">
              Hủy
            </button>
</div>
</div>
<!-- CARD 2: GEMINI POST-MATCH AI SUMMARY -->
<div class="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm relative overflow-hidden shadow-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-tertiary text-xl">auto_awesome</span>
<span class="font-label-coord text-label-coord uppercase tracking-wider text-tertiary font-bold">Gemini Match Insight Engine</span>
</div>
<span class="font-label-coord text-label-coord text-outline">Real-time LLM Recap</span>
</div>
<p class="font-body-md text-body-md text-on-surface leading-relaxed italic bg-surface-container/60 p-space-sm rounded-lg" id="geminiSummaryText">
            “Trận đấu kịch tính với màn rượt đuổi tỷ số hiệp 1. Sự xuất sắc của tuyến giữa Đội A giúp họ kiểm soát hoàn toàn hiệp 2, trong đó Hùng Nguyễn và Hoàng Minh thể hiện sự ăn ý vượt trội với 3 bàn thắng phối hợp chuẩn mực.”
          </p>
<div class="flex items-center justify-between font-label-coord text-label-coord text-outline pt-1">
<span class="flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              Độ chuẩn xác phân tích: 98%
            </span>
<button class="text-tertiary hover:underline flex items-center gap-1" onclick="regenerateAiRecap()" type="button">
<span class="material-symbols-outlined text-xs">refresh</span> Tạo lại tóm tắt
            </button>
</div>
</div>
<!-- CARD 3: PENDING APPROVAL QUEUE (Duyệt cầu thủ mới) -->
<div class="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md shadow-md" id="pendingQueue">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-xl">how_to_reg</span>
<h4 class="font-headline-sm text-headline-sm text-on-surface uppercase">Hàng Chờ Duyệt Thành Viên</h4>
</div>
<span class="font-label-coord text-label-coord bg-secondary/20 text-secondary px-2 py-0.5 rounded font-bold">2 Chờ duyệt</span>
</div>
<div class="flex flex-col gap-space-sm" id="pendingPlayersList">
<!-- Pending Player 1 -->
<div class="bg-surface-container p-space-sm rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm" id="pendingRow1">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline-sm text-headline-sm text-primary">
                  Đ
                </div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Nguyễn Văn Đức</span>
<span class="font-label-coord text-label-coord text-outline">nguyenduc99@gmail.com • Vị trí: CB/CDM</span>
</div>
</div>
<div class="flex items-center gap-space-xs self-end sm:self-center">
<button class="px-space-sm py-1 bg-primary hover:bg-primary-fixed text-on-primary font-label-tactical text-label-tactical rounded-md transition-colors flex items-center gap-1 shadow-sm" onclick="approvePlayer('pendingRow1', 'Nguyễn Văn Đức')" type="button">
<span class="material-symbols-outlined text-sm">check</span> Duyệt Active
                </button>
<button class="px-space-sm py-1 bg-surface-container-high hover:bg-error hover:text-on-error text-outline font-label-tactical text-label-tactical rounded-md transition-colors flex items-center gap-1" onclick="rejectPlayer('pendingRow1', 'Nguyễn Văn Đức')" type="button">
<span class="material-symbols-outlined text-sm">close</span> Từ chối
                </button>
</div>
</div>
<!-- Pending Player 2 -->
<div class="bg-surface-container p-space-sm rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm" id="pendingRow2">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline-sm text-headline-sm text-tertiary">
                  L
                </div>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">Lê Hoàng Long</span>
<span class="font-label-coord text-label-coord text-outline">long.striker@outlook.com • Vị trí: RW/ST</span>
</div>
</div>
<div class="flex items-center gap-space-xs self-end sm:self-center">
<button class="px-space-sm py-1 bg-primary hover:bg-primary-fixed text-on-primary font-label-tactical text-label-tactical rounded-md transition-colors flex items-center gap-1 shadow-sm" onclick="approvePlayer('pendingRow2', 'Lê Hoàng Long')" type="button">
<span class="material-symbols-outlined text-sm">check</span> Duyệt Active
                </button>
<button class="px-space-sm py-1 bg-surface-container-high hover:bg-error hover:text-on-error text-outline font-label-tactical text-label-tactical rounded-md transition-colors flex items-center gap-1" onclick="rejectPlayer('pendingRow2', 'Lê Hoàng Long')" type="button">
<span class="material-symbols-outlined text-sm">close</span> Từ chối
                </button>
</div>
</div>
</div>
</div>
</aside>
</div>
</div>
<!-- In-situ Admin Role Setting Modal -->
<div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center hidden p-space-md" id="roleModal">
<div class="bg-surface-container-low max-w-md w-full rounded-xl p-space-lg shadow-2xl flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<h3 class="font-headline-sm text-headline-sm text-on-surface">Phân Quyền Ban Cán Sự</h3>
<button class="text-outline hover:text-on-surface" onclick="closePlayerRoleModal()" type="button">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="flex flex-col gap-space-xs">
<span class="font-label-coord text-label-coord text-outline">Cầu thủ được chọn</span>
<span class="font-headline-md text-headline-md text-primary font-bold" id="roleModalPlayerName">Hoàng Minh</span>
</div>
<div class="flex flex-col gap-space-sm">
<label class="font-label-coord text-label-coord text-outline uppercase">Chọn vai trò hệ thống:</label>
<label class="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high">
<input class="accent-primary w-4 h-4" name="playerRole" type="radio" value="ADMIN"/>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">ADMIN / CAPTAIN</span>
<span class="font-label-coord text-label-coord text-outline">Toàn quyền nhập tỷ số, duyệt thẻ phạt và thành viên mới.</span>
</div>
</label>
<label class="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high">
<input checked="" class="accent-primary w-4 h-4" name="playerRole" type="radio" value="PLAYER"/>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface font-bold">PLAYER / THÀNH VIÊN</span>
<span class="font-label-coord text-label-coord text-outline">Xem lịch, theo dõi BXH cá nhân, điểm danh thi đấu.</span>
</div>
</label>
</div>
<div class="flex items-center justify-end gap-space-sm pt-space-xs">
<button class="px-space-md py-space-xs rounded-lg text-outline hover:text-on-surface font-label-tactical text-label-tactical" onclick="closePlayerRoleModal()" type="button">Đóng</button>
<button class="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm shadow-md" onclick="savePlayerRole()" type="button">Lưu Phân Quyền</button>
</div>
</div>
</div>
<!-- Inline Micro-Interactions Script -->
<script>
    function showToast(msg) {
      const toast = document.getElementById('toastNotification');
      const text = document.getElementById('toastMessage');
      if (toast && text) {
        text.innerText = msg;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => {
          toast.classList.add('translate-y-24', 'opacity-0');
        }, 3200);
      }
    }

    function adjustScore(team, delta) {
      const input = document.getElementById(team === 'teamA' ? 'scoreA' : 'scoreB');
      if (input) {
        let val = parseInt(input.value, 10) || 0;
        val = Math.max(0, val + delta);
        input.value = val;
      }
    }

    function focusScoreInput() {
      const widget = document.getElementById('matchEntryWidget');
      if (widget) {
        widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        widget.classList.add('ring-2', 'ring-primary');
        setTimeout(() => widget.classList.remove('ring-2', 'ring-primary'), 1500);
      }
    }

    function submitMatchResult() {
      const sA = document.getElementById('scoreA').value;
      const sB = document.getElementById('scoreB').value;
      const mvp = document.getElementById('mvpSelect').options[document.getElementById('mvpSelect').selectedIndex].text;
      
      showToast(`Đã lưu tỉ số [${sA} - ${sB}] & cập nhật BXH mùa giải 2025!`);
      
      // Update AI Summary with fresh reaction
      const aiText = document.getElementById('geminiSummaryText');
      if (aiText) {
        aiText.innerText = `“Gemini Post-Match: Tỷ số chung cuộc ${sA}-${sB}. Đội A bùng nổ trong hiệp 2, ghi nhận danh hiệu MVP cho ${mvp.split('-')[0].replace('★', '').trim()}. Phong độ toàn đội được đồng bộ tức thì trên BXH.”`;
      }
    }

    function resetScoreForm() {
      document.getElementById('scoreA').value = 0;
      document.getElementById('scoreB').value = 0;
      showToast("Đã thiết lập lại bảng nhập điểm!");
    }

    function addScorerRow() {
      const list = document.getElementById('scorersList');
      if (!list) return;
      const newRow = document.createElement('div');
      newRow.className = "flex items-center justify-between bg-surface-container p-space-sm rounded-lg";
      newRow.innerHTML = `
        <div class="flex items-center gap-space-sm">
          <input type="text" placeholder="Tên cầu thủ..." class="bg-surface-container-high px-2 py-0.5 rounded text-body-sm text-on-surface focus:outline-none w-32">
          <span class="font-label-coord text-label-coord text-outline bg-surface-container-high px-1.5 py-0.5 rounded">Team B</span>
        </div>
        <div class="flex items-center gap-space-sm">
          <span class="text-sm font-label-coord text-on-surface">⚽ 1 Bàn</span>
          <button type="button" onclick="this.closest('div.flex.items-center.justify-between').remove()" class="text-outline hover:text-error transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      `;
      list.appendChild(newRow);
    }

    function setSortMode(criteria, btn) {
      document.querySelectorAll('.sort-btn').forEach(b => {
        b.className = "sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1";
      });
      btn.className = "sort-btn px-space-sm py-space-xs rounded-lg font-label-tactical text-label-tactical uppercase bg-primary-container text-on-primary-container shadow-sm transition-all flex items-center gap-1";
      showToast(`Đã sắp xếp bảng xếp hạng theo: ${criteria.toUpperCase()}`);
    }

    function openPlayerRoleModal(name, currentRole) {
      const modal = document.getElementById('roleModal');
      const label = document.getElementById('roleModalPlayerName');
      if (modal && label) {
        label.innerText = name;
        modal.classList.remove('hidden');
      }
    }

    function closePlayerRoleModal() {
      const modal = document.getElementById('roleModal');
      if (modal) modal.classList.add('hidden');
    }

    function savePlayerRole() {
      const name = document.getElementById('roleModalPlayerName').innerText;
      closePlayerRoleModal();
      showToast(`Đã lưu thay đổi phân quyền cho cầu thủ ${name}!`);
    }

    function approvePlayer(rowId, name) {
      const row = document.getElementById(rowId);
      if (row) {
        row.remove();
        showToast(`Đã duyệt thành công ${name} vào danh sách thi đấu!`);
      }
    }

    function rejectPlayer(rowId, name) {
      const row = document.getElementById(rowId);
      if (row) {
        row.remove();
        showToast(`Đã từ chối đơn tham gia của ${name}.`);
      }
    }

    function regenerateAiRecap() {
      const aiText = document.getElementById('geminiSummaryText');
      if (aiText) {
        aiText.innerText = "“Gemini Summary: Phân tích chiến thuật nâng cao cho thấy tỷ lệ kiểm soát khu trung tuyến đạt 64% nghiêng về đội hình cầm trịch của Hùng Nguyễn. Các pha chuyển trạng thái của Tuấn Chelsea là mũi nhọn nguy hiểm nhất của đối thủ.”";
        showToast("Gemini AI vừa tạo bản tóm tắt chiến thuật mới!");
      }
    }
  </script>
</div></main></div></body></html>