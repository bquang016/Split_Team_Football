<!DOCTYPE html>

<html class="dark" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,700;0,800;0,900;1,700;1,900&amp;family=JetBrains+Mono:wght@600;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "primary-fixed": "#6ffbbe", "surface-container": "#171f33", "error": "#ffb4ab", "on-surface-variant": "#bbcabf", "background": "#0b1326", "secondary-container": "#ec6a06", "secondary-fixed": "#ffdbca", "on-tertiary": "#003640", "outline": "#86948a", "inverse-on-surface": "#283044", "on-secondary-fixed-variant": "#783200", "on-secondary-container": "#4a1c00", "tertiary-fixed": "#acedff", "outline-variant": "#3c4a42", "inverse-primary": "#006c49", "on-primary-fixed-variant": "#005236", "surface-container-high": "#222a3d", "on-surface": "#dae2fd", "on-primary-container": "#00422b", "primary": "#4edea3", "surface-container-low": "#131b2e", "secondary": "#ffb690", "surface": "#0b1326", "on-primary-fixed": "#002113", "on-tertiary-container": "#003f4b", "on-tertiary-fixed-variant": "#004e5c", "on-error": "#690005", "on-background": "#dae2fd", "secondary-fixed-dim": "#ffb690", "error-container": "#93000a", "tertiary-fixed-dim": "#4cd7f6", "primary-container": "#10b981", "on-error-container": "#ffdad6", "on-primary": "#003824", "tertiary": "#4cd7f6", "surface-tint": "#4edea3", "on-tertiary-fixed": "#001f26", "surface-container-highest": "#2d3449", "primary-fixed-dim": "#4edea3", "surface-container-lowest": "#060e20", "on-secondary": "#552100", "inverse-surface": "#dae2fd", "surface-variant": "#2d3449", "surface-dim": "#0b1326", "surface-bright": "#31394d", "tertiary-container": "#00b2d0", "on-secondary-fixed": "#341100" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "margin": "1rem", "space-lg": "1.5rem", "space-md": "1rem", "space-xl": "2.5rem", "margin-md": "1.5rem", "margin-lg": "2.5rem", "gutter": "1rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter-md": "1.5rem", "gutter-lg": "2rem" }, "fontFamily": { "score-display": ["Chivo"], "headline-md": ["Chivo"], "body-sm": ["Space Grotesk"], "label-coord": ["JetBrains Mono"], "display-hero-mobile": ["Chivo"], "body-md": ["Space Grotesk"], "score-display-mobile": ["Chivo"], "display-hero": ["Chivo"], "headline-lg-mobile": ["Chivo"], "body-lg": ["Space Grotesk"], "headline-lg": ["Chivo"], "headline-sm": ["Chivo"], "label-tactical": ["JetBrains Mono"] }, "fontSize": { "score-display": ["64px", { "lineHeight": "64px", "letterSpacing": "-0.04em", "fontWeight": "900" }], "headline-md": ["24px", { "lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "700" }], "body-sm": ["13px", { "lineHeight": "18px", "letterSpacing": "0", "fontWeight": "400" }], "label-coord": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "600" }], "display-hero-mobile": ["36px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "900" }], "body-md": ["15px", { "lineHeight": "22px", "letterSpacing": "0", "fontWeight": "400" }], "score-display-mobile": ["44px", { "lineHeight": "44px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "display-hero": ["56px", { "lineHeight": "60px", "letterSpacing": "-0.03em", "fontWeight": "900" }], "headline-lg-mobile": ["26px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "800" }], "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "500" }], "headline-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" }], "headline-sm": ["18px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "700" }], "label-tactical": ["12px", { "lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "700" }] } } } }</script></head><body class="bg-background font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container"><aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex flex-col"><div class="px-space-md py-space-lg flex items-center gap-space-sm"><img alt="FootballSquad Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V63XxDGai6pSqrQ6SYrLqVsh8fVtdvy917bQ_Z2SSpwYCz9mxwWWGZo6wCF8kbptMpuFVh7_TFiqRrgiH7WtlSH2L7G791ShIoWPEwihg9pRimeMCkWbMlbtg2bzj6LKWv6a87-i_IhRnnou8gRTtkUlssJc5thSCkhwngGjmeVHuSKueV3oHmF9WRPqFXDoItwq3YpEeiAKbfk4cAzTgzGRs6h1XWjatut5wQE8byYJpnDMKHRl-W4TA"/><div class="flex flex-col"><span class="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface leading-tight">FootballSquad</span><span class="font-label-coord text-label-coord text-primary uppercase tracking-wider">FC Saigon Sunday League</span></div></div><div class="px-space-md py-space-xs"><div class="font-label-coord text-label-coord uppercase tracking-wider text-outline px-space-xs mb-space-xs">Match Command</div><nav class="flex flex-col gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-xl"><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="trang-chu" href="#"><span class="material-symbols-outlined text-xl">stadium</span><span>Trang chủ</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="lich-va-tran-dau" href="#"><span class="material-symbols-outlined text-xl">calendar_month</span><span>Lịch &amp; Trận đấu</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="sa-ban-va-lineup" href="#"><span class="material-symbols-outlined text-xl">sports</span><span>Sa bàn &amp; Lineup</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="bang-xep-hang" href="#"><span class="material-symbols-outlined text-xl">leaderboard</span><span>Bảng xếp hạng</span></a><a class="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md" data-path="cau-thu-va-doi-hinh" href="#"><span class="material-symbols-outlined text-xl">groups</span><span>Cầu thủ &amp; Đội hình</span></a></nav></div></div><div class="flex flex-col p-space-md gap-space-sm"><div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-xs"><div class="flex items-center justify-between"><div class="flex items-center gap-space-xs"><span class="material-symbols-outlined text-primary text-sm">admin_panel_settings</span><span class="font-label-coord text-label-coord uppercase tracking-wider text-on-surface-variant">Vai trò: Admin</span></div><span class="font-label-coord text-label-coord text-primary-fixed bg-surface-container-high px-space-xs py-0.5 rounded">CAPTAIN</span></div><button class="w-full flex items-center justify-between px-space-sm py-space-xs bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors group" type="button"><span class="font-label-tactical text-label-tactical text-on-surface group-hover:text-primary transition-colors">Chế độ Quản trị</span><span class="material-symbols-outlined text-primary text-base">sync_alt</span></button></div><div class="flex items-center justify-between pt-space-xs"><div class="flex items-center gap-space-sm"><div class="relative"><img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/><span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span></div><div class="flex flex-col"><span class="font-body-md text-body-md font-bold text-on-surface leading-tight">Hùng Nguyễn</span><span class="font-label-coord text-label-coord text-outline">Team A · Live WS</span></div></div><button aria-label="User settings" class="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-lg">tune</span></button></div></div></aside><div class="pl-64"><header class="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-gutter-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="flex items-center gap-space-lg"><div class="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full"><span class="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span><span class="w-2 h-2 rounded-full bg-secondary-container -ml-space-xs"></span><span class="font-label-tactical text-label-tactical text-secondary uppercase tracking-wider">TRẬN ĐANG ĐÁ</span><span class="font-label-coord text-label-coord text-on-surface-variant">|</span><span class="font-headline-sm text-headline-sm text-on-surface">FC SAIGON 2 - 1 TÂN BÌNH UTD</span><span class="font-label-coord text-label-coord text-primary bg-surface-container-high px-space-xs rounded">68'</span></div></div><div class="flex items-center gap-space-md"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-lg pointer-events-none">search</span><input class="bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-full pl-9 pr-space-md py-space-xs focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all" placeholder="Tìm cầu thủ, trận đấu..." type="text"/></div><button aria-label="Notifications" class="relative p-space-sm rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-xl">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container"></span></button></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<div class="p-gutter-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
<!-- Top Live Matchday Hero & In-situ Contextual Admin Bar -->
<div class="relative overflow-hidden rounded-xl bg-surface-container-low shadow-xl">
<div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
<!-- Match Banner Section -->
<div class="p-space-lg flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg relative z-10">
<div class="flex flex-col gap-space-xs max-w-3xl">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container/20 text-secondary font-label-tactical text-label-tactical uppercase tracking-wider">
<span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              SẴN SÀNG CHIA ĐỘI (PICKING)
            </span>
<span class="text-on-surface-variant font-label-coord text-label-coord uppercase tracking-wider">Tuần 24 · Matchday Live Hub</span>
<span class="inline-flex items-center gap-1 text-primary text-body-sm font-body-sm">
<span class="material-symbols-outlined text-base">location_on</span>
              Sân cỏ nhân tạo Chánh Hưng, Q.8
            </span>
</div>
<div class="flex items-baseline gap-space-sm flex-wrap mt-1">
<h1 class="font-display-hero text-headline-lg lg:text-display-hero text-on-surface uppercase tracking-tight">
              Siêu Kinh Điển Chủ Nhật
            </h1>
<span class="font-headline-md text-headline-md text-primary font-bold">16:30</span>
</div>
<p class="text-on-surface-variant font-body-md text-body-md">
            Trận cầu đinh cuối tuần phân định ngôi vương Bảng A. Đã điểm danh đủ quân số cho thể thức 7v7 đôi công tốc độ cao.
          </p>
</div>
<!-- In-situ Integrated Admin Command Cluster -->
<div class="bg-surface-container-high/90 backdrop-blur-md p-space-md rounded-xl flex flex-col gap-space-sm shadow-md min-w-[320px]">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-lg">verified_user</span>
<span class="font-label-coord text-label-coord uppercase tracking-wider text-on-surface font-bold">In-situ Admin HUD</span>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" id="adminToggle" type="checkbox"/>
<div class="w-9 h-5 bg-surface-container-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-surface-container after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
<span class="ml-2 font-label-coord text-label-coord text-primary-fixed uppercase">Admin: ON</span>
</label>
</div>
<div class="grid grid-cols-2 gap-space-xs">
<button class="flex items-center justify-center gap-1.5 px-space-sm py-2 bg-primary text-on-primary font-headline-sm text-label-tactical rounded uppercase transition-transform active:scale-95 hover:bg-primary-fixed" type="button">
<span class="material-symbols-outlined text-base">casino</span>
<span>Quay Live</span>
</button>
<button class="flex items-center justify-center gap-1.5 px-space-sm py-2 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-tactical text-label-tactical rounded transition-colors" type="button">
<span class="material-symbols-outlined text-base">add_circle</span>
<span>+ Tạo trận</span>
</button>
</div>
<div class="flex items-center justify-between pt-1">
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-coord text-label-coord transition-colors" type="button">
<span class="material-symbols-outlined text-sm">ios_share</span>
<span>Xuất PDF báo cáo</span>
</button>
<span class="font-label-coord text-label-coord text-outline">Seed: #849204</span>
</div>
</div>
</div>
<!-- Quick Stats Ticker Bar -->
<div class="bg-surface-container-lowest/80 px-space-lg py-space-sm flex flex-wrap items-center justify-between gap-space-md">
<div class="flex items-center gap-space-lg flex-wrap">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-lg">groups</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">ĐÃ ĐIỂM DANH:</span>
<span class="font-headline-sm text-headline-sm text-on-surface font-bold">18 Cầu thủ</span>
<span class="bg-surface-container-high px-1.5 py-0.5 rounded font-label-coord text-label-coord text-primary font-semibold">14 Đá chính + 4 Dự bị</span>
</div>
<div class="hidden sm:flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-lg">account_balance_wallet</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">QUỸ ĐỘI HIỆN TẠI:</span>
<span class="font-headline-sm text-headline-sm text-secondary font-bold">3.450.000 ₫</span>
</div>
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-tertiary text-lg">wb_sunny</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">THỜI TIẾT KICKOFF:</span>
<span class="font-headline-sm text-headline-sm text-on-surface">28°C · Râm Mát</span>
</div>
</div>
<div class="flex items-center gap-space-sm">
<span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
<span class="font-label-coord text-label-coord text-primary uppercase tracking-wider">Hệ thống đồng bộ trực tuyến</span>
</div>
</div>
</div>
<!-- 3-Column Tactical Bento Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<!-- Column 1 (Left - 38% / 5 cols): Match Calendar & Player Roster Flow -->
<div class="lg:col-span-5 flex flex-col gap-space-lg">
<!-- Weekly Mini-Calendar -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-primary text-xl">event</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Lịch Tuần Này</span>
</div>
<span class="font-label-coord text-label-coord text-on-surface-variant">Tháng 10 · Tuần 4</span>
</div>
<div class="grid grid-cols-7 gap-1 text-center pt-space-xs">
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1 opacity-60">
<span class="font-label-coord text-label-coord text-outline">T2</span>
<span class="font-headline-sm text-body-md text-on-surface">20</span>
<span class="w-1.5 h-1.5 rounded-full bg-transparent"></span>
</div>
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1 opacity-60">
<span class="font-label-coord text-label-coord text-outline">T3</span>
<span class="font-headline-sm text-body-md text-on-surface">21</span>
<span class="w-1.5 h-1.5 rounded-full bg-transparent"></span>
</div>
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1">
<span class="font-label-coord text-label-coord text-tertiary">T4</span>
<span class="font-headline-sm text-body-md text-on-surface font-bold">22</span>
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
</div>
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1 opacity-60">
<span class="font-label-coord text-label-coord text-outline">T5</span>
<span class="font-headline-sm text-body-md text-on-surface">23</span>
<span class="w-1.5 h-1.5 rounded-full bg-transparent"></span>
</div>
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1 opacity-60">
<span class="font-label-coord text-label-coord text-outline">T6</span>
<span class="font-headline-sm text-body-md text-on-surface">24</span>
<span class="w-1.5 h-1.5 rounded-full bg-transparent"></span>
</div>
<div class="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1 opacity-60">
<span class="font-label-coord text-label-coord text-outline">T7</span>
<span class="font-headline-sm text-body-md text-on-surface">25</span>
<span class="w-1.5 h-1.5 rounded-full bg-transparent"></span>
</div>
<!-- Active Game Day -->
<div class="p-2 rounded bg-primary-container text-on-primary-container flex flex-col items-center gap-1 shadow-md">
<span class="font-label-coord text-label-coord text-on-primary-container font-black">CN</span>
<span class="font-headline-sm text-body-md font-extrabold">26</span>
<span class="w-1.5 h-1.5 rounded-full bg-on-primary-container"></span>
</div>
</div>
</div>
<!-- Match Roster & Attendance Check with In-Situ Controls -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-md shadow-md">
<div class="flex items-center justify-between">
<div class="flex flex-col">
<div class="flex items-center gap-space-xs">
<span class="font-headline-sm text-headline-sm text-on-surface">Danh Sách Tham Gia</span>
<span class="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-coord text-label-coord font-bold">18/18</span>
</div>
<span class="font-body-sm text-body-sm text-on-surface-variant">14 Cầu thủ đá chính &amp; 4 cầu thủ dự bị chia luân phiên</span>
</div>
<div class="flex items-center gap-1">
<button class="p-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-label-coord flex items-center gap-1 transition-colors" title="Điểm danh hộ" type="button">
<span class="material-symbols-outlined text-sm">how_to_reg</span>
<span class="hidden sm:inline">Điểm danh</span>
</button>
<button class="p-1.5 rounded bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-primary font-label-coord text-label-coord transition-colors flex items-center gap-1" title="Chốt danh sách" type="button">
<span class="material-symbols-outlined text-sm">lock</span>
<span class="hidden sm:inline">Chốt DS</span>
</button>
</div>
</div>
<!-- Quick Filter Pills -->
<div class="flex items-center gap-space-xs">
<button class="px-space-sm py-1 rounded bg-primary text-on-primary font-label-coord text-label-coord font-bold uppercase" type="button">Tất cả (18)</button>
<button class="px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-coord text-label-coord font-medium uppercase" type="button">Đá chính (14)</button>
<button class="px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-coord text-label-coord font-medium uppercase" type="button">Dự bị (4)</button>
</div>
<!-- Squad Roster List with Drag Handle & Live Actions -->
<div class="flex flex-col gap-1 max-h-[380px] overflow-y-auto pr-1">
<!-- Player Row 1 (User / Host A) -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<img alt="Avatar" class="w-8 h-8 rounded-full object-cover ring-2 ring-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-1">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Hùng Nguyễn</span>
<span class="px-1 rounded bg-secondary-container text-on-secondary font-label-coord text-[9px] font-black">C - HOST A</span>
</div>
<span class="font-label-coord text-label-coord text-outline">ST / CAM · 12 Trận · Quỹ Đã đóng</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-coord text-label-coord font-bold">ĐÁ CHÍNH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-secondary transition-opacity" title="Chuyển sang Bench" type="button">
<span class="material-symbols-outlined text-base">swap_vert</span>
</button>
</div>
</div>
<!-- Player Row 2 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-tactical text-xs text-primary font-bold">TC</div>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-1">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Tuấn Chelsea</span>
<span class="px-1 rounded bg-tertiary-container text-on-tertiary font-label-coord text-[9px] font-black">C - HOST B</span>
</div>
<span class="font-label-coord text-label-coord text-outline">CM / CDM · 15 Trận · Quỹ Đã đóng</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-coord text-label-coord font-bold">ĐÁ CHÍNH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-secondary transition-opacity" title="Chuyển sang Bench" type="button">
<span class="material-symbols-outlined text-base">swap_vert</span>
</button>
</div>
</div>
<!-- Player Row 3 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-tactical text-xs text-on-surface font-bold">HM</div>
<div class="flex flex-col min-w-0">
<div class="flex items-center gap-1">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Hoàng Minh</span>
<span class="text-tertiary font-label-coord text-[10px]">★ Vua phá lưới</span>
</div>
<span class="font-label-coord text-label-coord text-outline">RW / ST · Đã nộp quỹ</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-coord text-label-coord font-bold">ĐÁ CHÍNH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-secondary transition-opacity" type="button">
<span class="material-symbols-outlined text-base">swap_vert</span>
</button>
</div>
</div>
<!-- Player Row 4 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-tactical text-xs text-on-surface font-bold">ĐH</div>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Đức Huy</span>
<span class="font-label-coord text-label-coord text-outline">CB · Thòng cứng · Đã nộp</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-coord text-label-coord font-bold">ĐÁ CHÍNH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-secondary transition-opacity" type="button">
<span class="material-symbols-outlined text-base">swap_vert</span>
</button>
</div>
</div>
<!-- Player Row 5 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-tactical text-xs text-on-surface font-bold">TL</div>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Thành Long</span>
<span class="font-label-coord text-label-coord text-outline">GK · Găng tay vàng</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-coord text-label-coord font-bold">ĐÁ CHÍNH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-secondary transition-opacity" type="button">
<span class="material-symbols-outlined text-base">swap_vert</span>
</button>
</div>
</div>
<!-- Player Row 6 (Bench Item) -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container-lowest/80 hover:bg-surface-container transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-xs text-on-surface-variant font-bold">VT</div>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface-variant truncate">Văn Toàn (Sub)</span>
<span class="font-label-coord text-label-coord text-outline">Dự bị hiệp 2 · Quỹ Đã đóng</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-coord text-label-coord font-bold">BENCH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-opacity" title="Đẩy lên đá chính" type="button">
<span class="material-symbols-outlined text-base">arrow_upward</span>
</button>
</div>
</div>
<!-- Player Row 7 (Bench Item) -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container-lowest/80 hover:bg-surface-container transition-colors group">
<div class="flex items-center gap-space-sm min-w-0">
<span class="material-symbols-outlined text-outline text-base cursor-grab">drag_indicator</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-tactical text-xs text-on-surface-variant font-bold">KP</div>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface-variant truncate">Khắc Phục</span>
<span class="font-label-coord text-label-coord text-outline">Dự bị hiệp 2 · Quỹ Đã đóng</span>
</div>
</div>
<div class="flex items-center gap-space-xs">
<span class="px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-coord text-label-coord font-bold">BENCH</span>
<button class="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-opacity" title="Đẩy lên đá chính" type="button">
<span class="material-symbols-outlined text-base">arrow_upward</span>
</button>
</div>
</div>
</div>
<!-- Bottom Action Context Strip -->
<div class="pt-space-xs">
<button class="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-tactical text-label-tactical rounded flex items-center justify-center gap-1.5 transition-colors" type="button">
<span class="material-symbols-outlined text-base">person_add</span>
<span>+ Thêm nhanh cầu thủ dự bị</span>
</button>
</div>
</div>
</div>
<!-- Column 2 (Center - 34% / 4 cols): Live Spin Wheel & Deterministic Team Picking -->
<div class="lg:col-span-4 flex flex-col gap-space-lg">
<!-- Team Picking HUD Card -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-md shadow-md relative overflow-hidden">
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-coord text-label-coord text-primary font-bold uppercase tracking-wider">Live Match Allocation</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Vòng Quay Chia Quân</span>
</div>
<div class="flex items-center gap-1 bg-surface-container-lowest px-2 py-1 rounded">
<span class="material-symbols-outlined text-secondary text-sm">lock_clock</span>
<span class="font-label-coord text-label-coord text-on-surface">AUTO-BALANCE</span>
</div>
</div>
<!-- Tactical Graphic Spin Wheel Visual Representation -->
<div class="relative flex items-center justify-center py-space-sm">
<!-- Animated SVG Tactical Wheel -->
<div class="w-56 h-56 relative flex items-center justify-center">
<svg class="w-full h-full transform -rotate-45" viewbox="0 0 100 100">
<!-- Outer Track -->
<circle cx="50" cy="50" fill="none" r="44" stroke="#222a3d" stroke-width="6"></circle>
<!-- Team A arc (Orange Red) -->
<circle cx="50" cy="50" fill="none" r="44" stroke="#ec6a06" stroke-dasharray="138 276" stroke-linecap="round" stroke-width="6"></circle>
<!-- Team B arc (Emerald Neon) -->
<circle cx="50" cy="50" fill="none" r="44" stroke="#4edea3" stroke-dasharray="138 276" stroke-dashoffset="-138" stroke-linecap="round" stroke-width="6"></circle>
<!-- Inner Ticks -->
<circle cx="50" cy="50" fill="#131b2e" r="32" stroke="#2d3449" stroke-width="1.5"></circle>
</svg>
<!-- Center Hub / Seed info -->
<div class="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
<span class="material-symbols-outlined text-primary text-2xl animate-spin" style="animation-duration: 10s;">toys</span>
<span class="font-headline-sm text-label-tactical font-black text-on-surface uppercase mt-1">7 VS 7</span>
<span class="font-label-coord text-[9px] text-outline">SEED #849204</span>
</div>
<!-- Wheel Pointer Needle -->
<div class="absolute top-0 transform -translate-y-1">
<span class="material-symbols-outlined text-secondary text-2xl">arrow_drop_down</span>
</div>
</div>
</div>
<!-- Captain Face-Off Comparison -->
<div class="grid grid-cols-2 gap-space-sm pt-space-xs">
<!-- Team A Box -->
<div class="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1 border-t-2 border-secondary-container">
<div class="flex items-center justify-between">
<span class="font-label-coord text-[10px] text-secondary uppercase font-bold">ĐỘI A (ĐỎ)</span>
<span class="font-label-tactical text-xs text-on-surface font-bold">7 / 7</span>
</div>
<div class="flex items-center gap-1.5 mt-1">
<img alt="Captain A" class="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGsJNM70xoco-ecJmGkbWD9GEnW9iwv58yeimUkaTK9gJFqg8wV2AP2YaKHC1ky8IZzqmHHh56wy54pvnjSEAO-NYw6r3VPwhaPhY5EY-qkbLdLtHW_JZV8GWyQ1VQhv3FH-uva0FlpzfJ3QzubzPWaO5_nR9xcm6X-w6HCEX85GluRXoXqb9yh8T_Fjww2RNwtR1Vdixf0bOtJ4RM_zUxcIXqTnEs-TjulE6KmCWxTkFrbnOPKofO"/>
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Hùng Nguyễn</span>
</div>
<div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-secondary-container h-full w-full"></div>
</div>
</div>
<!-- Team B Box -->
<div class="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1 border-t-2 border-primary">
<div class="flex items-center justify-between">
<span class="font-label-coord text-[10px] text-primary uppercase font-bold">ĐỘI B (XANH)</span>
<span class="font-label-tactical text-xs text-on-surface font-bold">7 / 7</span>
</div>
<div class="flex items-center gap-1.5 mt-1">
<div class="w-6 h-6 rounded-full bg-primary text-on-primary font-label-coord text-[10px] flex items-center justify-center font-bold">TC</div>
<span class="font-body-sm text-body-sm font-bold text-on-surface truncate">Tuấn Chelsea</span>
</div>
<div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-primary h-full w-full"></div>
</div>
</div>
</div>
<!-- Bench Rotation Sub Bar -->
<div class="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-outline text-base">chair</span>
<span class="font-label-coord text-label-coord text-on-surface-variant">LỰC LƯỢNG BENCH (4):</span>
</div>
<span class="font-label-tactical text-label-tactical text-primary font-bold">Xoay tua 20'</span>
</div>
<!-- In-situ Admin Team Actions -->
<div class="flex flex-col gap-space-xs pt-space-xs">
<button class="w-full py-2.5 px-space-sm bg-primary hover:bg-primary-fixed text-on-primary font-headline-sm text-body-sm uppercase rounded transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-md" type="button">
<span class="material-symbols-outlined text-lg">play_circle</span>
<span>Mở màn hình Vòng quay &amp; Chọn quân</span>
</button>
<button class="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-label-tactical text-label-tactical rounded transition-colors flex items-center justify-center gap-1.5" type="button">
<span class="material-symbols-outlined text-base">published_with_changes</span>
<span>Đổi đội trưởng 1-click</span>
</button>
</div>
</div>
<!-- Real-Time Pitch Coordinate Mini Map -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-md">
<div class="flex items-center justify-between">
<span class="font-headline-sm text-body-lg text-on-surface">Định Dạng Sân 7 (3-2-1)</span>
<span class="font-label-coord text-label-coord text-outline">Chánh Hưng Pitch 2</span>
</div>
<!-- Stylized Turf Graphic -->
<div class="w-full h-32 rounded-lg bg-surface-container-lowest relative overflow-hidden flex items-center justify-center border border-outline-variant/30">
<!-- Pitch Markings SVG -->
<svg class="absolute inset-0 w-full h-full stroke-on-surface/15" fill="none" stroke-width="1">
<rect height="84%" rx="2" width="90%" x="5%" y="8%"></rect>
<line x1="50%" x2="50%" y1="8%" y2="92%"></line>
<circle cx="50%" cy="50%" r="18"></circle>
<rect height="44%" width="12%" x="5%" y="28%"></rect>
<rect height="44%" width="12%" x="83%" y="28%"></rect>
</svg>
<div class="relative z-10 flex items-center justify-between w-full px-8">
<span class="px-2 py-1 rounded bg-secondary-container text-on-secondary font-label-coord text-xs font-bold">Team A</span>
<span class="font-label-coord text-xs text-primary font-bold">VS</span>
<span class="px-2 py-1 rounded bg-primary text-on-primary font-label-coord text-xs font-bold">Team B</span>
</div>
</div>
</div>
</div>
<!-- Column 3 (Right - 28% / 3 cols): AI Intelligence & Squad Standings -->
<div class="lg:col-span-3 flex flex-col gap-space-lg">
<!-- Gemini AI Pre-Match Tactical Insights Card -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-md relative overflow-hidden border-l-4 border-tertiary">
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-tertiary text-xl">auto_awesome</span>
<span class="font-label-tactical text-label-tactical uppercase tracking-wider text-tertiary font-bold">Gemini AI Match Scout</span>
</div>
<span class="font-label-coord text-[9px] bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded uppercase">V2.4 Live</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface leading-relaxed mt-1">
            "Phân tích AI: <strong class="text-secondary">Đội A</strong> có lợi thế kiểm soát tuyến giữa với tỷ lệ thắng dự đoán <strong>54%</strong>. <strong class="text-primary">Đội B</strong> sở hữu các pha phản công tốc độ cao từ cánh của Tuấn Chelsea."
          </p>
<!-- Predictive Stats Mini Bars -->
<div class="flex flex-col gap-2 pt-space-xs">
<div class="flex flex-col gap-1">
<div class="flex justify-between font-label-coord text-label-coord text-on-surface-variant">
<span>Kiểm soát bóng (Dự đoán)</span>
<span class="text-on-surface font-bold">54% - 46%</span>
</div>
<div class="w-full bg-surface-container-highest h-1 rounded-full flex overflow-hidden">
<div class="bg-secondary-container h-full" style="width: 54%"></div>
<div class="bg-primary h-full" style="width: 46%"></div>
</div>
</div>
<div class="flex flex-col gap-1">
<div class="flex justify-between font-label-coord text-label-coord text-on-surface-variant">
<span>Chỉ số phản công nhanh</span>
<span class="text-tertiary font-bold">Đội B +18%</span>
</div>
<div class="w-full bg-surface-container-highest h-1 rounded-full flex overflow-hidden">
<div class="bg-secondary-container h-full" style="width: 40%"></div>
<div class="bg-tertiary h-full" style="width: 60%"></div>
</div>
</div>
</div>
</div>
<!-- Top Scorer Leaderboard Widget (Top 5) -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-secondary text-xl">military_tech</span>
<span class="font-headline-sm text-headline-sm text-on-surface">Vua Phá Lưới</span>
</div>
<span class="font-label-coord text-label-coord text-outline">MÙA 2024</span>
</div>
<div class="flex flex-col gap-2 pt-1">
<!-- Rank 1 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container-high/60">
<div class="flex items-center gap-space-sm min-w-0">
<span class="font-headline-sm text-body-md font-black text-secondary">01</span>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Hoàng Minh</span>
<span class="font-label-coord text-label-coord text-outline">10 trận · 1.2 bàn/trận</span>
</div>
</div>
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md font-black text-on-surface">12</span>
<span class="font-label-coord text-[10px] text-outline">BÀN</span>
</div>
</div>
<!-- Rank 2 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container">
<div class="flex items-center gap-space-sm min-w-0">
<span class="font-headline-sm text-body-md font-black text-on-surface-variant">02</span>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Hùng Nguyễn</span>
<span class="font-label-coord text-label-coord text-outline">12 trận · 0.75 bàn/trận</span>
</div>
</div>
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md font-bold text-on-surface">9</span>
<span class="font-label-coord text-[10px] text-outline">BÀN</span>
</div>
</div>
<!-- Rank 3 -->
<div class="flex items-center justify-between p-2 rounded bg-surface-container">
<div class="flex items-center gap-space-sm min-w-0">
<span class="font-headline-sm text-body-md font-black text-on-surface-variant">03</span>
<div class="flex flex-col min-w-0">
<span class="font-body-md text-body-md font-bold text-on-surface truncate">Đức Huy</span>
<span class="font-label-coord text-label-coord text-outline">11 trận · CB dâng cao</span>
</div>
</div>
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md font-bold text-on-surface">8</span>
<span class="font-label-coord text-[10px] text-outline">BÀN</span>
</div>
</div>
<!-- Rank 4 & 5 Compact -->
<div class="flex items-center justify-between px-2 py-1.5 text-on-surface-variant font-body-sm text-body-sm">
<div class="flex items-center gap-2 truncate">
<span class="font-label-coord text-label-coord text-outline">04</span>
<span class="truncate">Tuấn Chelsea</span>
</div>
<span class="font-label-coord text-label-coord text-on-surface font-bold">6 Bàn</span>
</div>
<div class="flex items-center justify-between px-2 py-1.5 text-on-surface-variant font-body-sm text-body-sm">
<div class="flex items-center gap-2 truncate">
<span class="font-label-coord text-label-coord text-outline">05</span>
<span class="truncate">Văn Toàn</span>
</div>
<span class="font-label-coord text-label-coord text-on-surface font-bold">5 Bàn</span>
</div>
</div>
</div>
<!-- Pending Member Approval Alert Box -->
<div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs shadow-md border-t-2 border-secondary">
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-secondary text-base">person_add_disabled</span>
<span class="font-label-tactical text-label-tactical font-bold text-on-surface uppercase">Cần Duyệt (2)</span>
</div>
<span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">
            Có 2 cầu thủ mới đăng ký xin vào FC Saigon cho lượt trận tháng tới.
          </p>
<div class="flex items-center gap-2 pt-2">
<button class="flex-1 py-1.5 bg-primary hover:bg-primary-fixed text-on-primary font-label-tactical text-label-tactical rounded transition-colors text-center font-bold" type="button">
              Duyệt ngay
            </button>
<button class="flex-1 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-tactical text-label-tactical rounded transition-colors text-center" type="button">
              Xem hồ sơ
            </button>
</div>
</div>
</div>
</div>
</div>
</div>
<script>
  // Simple in-situ interactivity for demo responsiveness
  const adminToggle = document.getElementById('adminToggle');
  if (adminToggle) {
    adminToggle.addEventListener('change', (e) => {
      console.log('Match Command Mode set to:', e.target.checked);
    });
  }
</script></main></div></body></html>