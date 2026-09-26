<!DOCTYPE html>

<html class="light" lang="vi"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="web_dashboard" name="shell-type"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,600;0,700;0,800;0,900;1,700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            headline: ["Chivo", "sans-serif"],
            body: ["Inter", "sans-serif"],
          },
          colors: {
            brand: {
              50: "#ecfdf5",
              100: "#d1fae5",
              200: "#a7f3d0",
              500: "#10b981",
              600: "#059669",
              700: "#047857",
              800: "#065f46",
              900: "#064e3b"
            }
          }
        }
      }
    };
  </script>
<style>
    @layer base {
      html, body { margin: 0; padding: 0; }
      body { overscroll-behavior: none; }
    }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="bg-slate-50 font-body text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-800">
<!-- Left Sidebar (Clean Modern Sports Style) -->
<aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between shadow-xs">
<div class="flex flex-col">
<!-- App Brand / Logo -->
<div class="px-5 py-4 flex items-center gap-3 border-b border-slate-100">
<img alt="FootballSquad Logo" class="h-9 w-9 rounded-lg object-contain shadow-xs" src="https://lh3.googleusercontent.com/aida/AEtjO1WpPMYtQE8-s4A2AHtIeBUaYVxdNUig0v1FmBDBNzgzJXASPC-QY_WdZIc8gQILJG9ztw6XDsjtnfvHRJRrs5RlNYPFIL9KeArVEUJsTAlvqBHLVkJhqWJKeGkk17Iw40teKFuvxIqAUst8B_LTRQe1zYVpxvbezGn8nUOtGjhU2FF5Z18AGXkB8AIWhD7uMCZEgwLJorniwqiUQk4Uxa_xW-hn_FsApl7YsVMA14toq6VDI_S1n3b_j54"/>
<div class="flex flex-col">
<span class="font-headline font-extrabold text-base tracking-tight text-slate-900 leading-snug">FootballSquad</span>
<span class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Saigon Sunday League</span>
</div>
</div>
<!-- Navigation Menu -->
<div class="px-3 py-4">
<div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Quản lý thi đấu</div>
<nav class="flex flex-col gap-1">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" data-path="trang-chu" href="#">
<span class="material-symbols-outlined text-slate-500 text-xl">stadium</span>
<span>Trang chủ</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" data-path="lich-va-tran-dau" href="#">
<span class="material-symbols-outlined text-slate-500 text-xl">calendar_month</span>
<span>Lịch &amp; Trận đấu</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" data-path="sa-ban-va-lineup" href="#">
<span class="material-symbols-outlined text-slate-500 text-xl">sports</span>
<span>Sa bàn &amp; Lineup</span>
</a>
<!-- Active Menu Item: Premier League / Sofascore clean emerald accent -->
<a class="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-sm transition-all border-l-4 border-emerald-600" data-path="bang-xep-hang" href="#">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-emerald-600 text-xl">leaderboard</span>
<span>Bảng xếp hạng</span>
</div>
<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
</a>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium" data-path="cau-thu-va-doi-hinh" href="#">
<span class="material-symbols-outlined text-slate-500 text-xl">groups</span>
<span>Cầu thủ &amp; Đội hình</span>
</a>
</nav>
</div>
</div>
<!-- Admin Status Toggle & User Profile in Sidebar -->
<div class="p-3 border-t border-slate-100 flex flex-col gap-2.5 bg-slate-50/60">
<!-- Admin Mode Status Pill -->
<div class="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-emerald-600 text-base">shield_person</span>
<div class="flex flex-col">
<span class="text-xs font-semibold text-slate-800">Quyền Admin</span>
<span class="text-[10px] text-slate-400">Ban cán sự CLB</span>
</div>
</div>
<button aria-checked="true" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-emerald-600 transition-colors duration-200 ease-in-out focus:outline-none" id="adminModeToggle" onclick="toggleAdminMode()" role="switch" title="Chuyển chế độ Admin" type="button">
<span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-4" id="adminToggleDot"></span>
</button>
</div>
<!-- Current User Card -->
<div class="flex items-center justify-between pt-1 px-1">
<div class="flex items-center gap-2.5">
<div class="relative">
<img alt="Hùng Nguyễn" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" src="https://lh3.googleusercontent.com/aida/AEtjO1Xx6VxaAD31wOxuXYvrfVJPrxTTeSDeiHA2qKv_BPQmfA_v5uRQ6uGV_4KQuAOqX3Qmut1VW70_30PyTIsMVT8OEEYKTRdrojfxmK09jRdXxdCmysTXwlJ6cQSgMcYywb1gSGD_pqr2k5hFIqCFn5XxW0Z60-N2fNV1gOIpbhUAgcX82kRGXsH53DFo518gHzM4TG7hgTzFMCghUZpseKABHZY0dEia2J7qhRD7KUDBEgSxZt6wmZG6bQ"/>
<span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
</div>
<div class="flex flex-col">
<span class="text-xs font-bold text-slate-900 leading-tight">Hùng Nguyễn</span>
<span class="text-[10px] font-medium text-slate-500">Đội trưởng A • Live</span>
</div>
</div>
<button aria-label="Cài đặt" class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" type="button">
<span class="material-symbols-outlined text-base">tune</span>
</button>
</div>
</div>
</aside>
<!-- Main Content Wrapper with 64-unit left padding -->
<div class="pl-64">
<!-- Top Header Bar -->
<header class="sticky top-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-2xs">
<!-- Live Match Banner (Clean Sofascore Badge) -->
<div class="flex items-center gap-3">
<div class="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs">
<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
<span class="font-bold text-emerald-700 tracking-wide uppercase text-[10px]">Đang Diễn Ra</span>
<span class="text-slate-300">|</span>
<span class="font-bold text-slate-800">FC SAIGON <span class="text-emerald-700 font-extrabold">2 - 1</span> TÂN BÌNH UTD</span>
<span class="bg-white text-slate-600 font-mono font-semibold px-1.5 py-0.2 rounded border border-slate-200 text-[10px]">68'</span>
</div>
</div>
<!-- Search & Contextual Tools -->
<div class="flex items-center gap-3">
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-2.5 text-slate-400 text-lg pointer-events-none">search</span>
<input class="bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-52 transition-all" placeholder="Tìm cầu thủ, chỉ số..." type="text"/>
</div>
<button aria-label="Thông báo" class="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" type="button">
<span class="material-symbols-outlined text-xl">notifications</span>
<span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
</button>
</div>
</header>
<!-- Main Page Body -->
<main class="p-6 max-w-7xl mx-auto flex flex-col gap-6">
<!-- Interactive Toast Alert -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg" id="toastNotification">
<span class="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
<span class="text-sm font-medium" id="toastMessage">Đã cập nhật dữ liệu thành công!</span>
</div>
<!-- Top Header Summary Card: Premier League Clean Style -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Live Standings
            </span>
<span class="text-xs text-slate-400 font-medium">Vòng đấu #14 • Sân cỏ nhân tạo D3 Bình Thạnh</span>
</div>
<h1 class="font-headline font-black text-2xl lg:text-3xl text-slate-900 tracking-tight">
            Bảng Xếp Hạng Mùa Giải <span class="text-emerald-600 font-extrabold">2025</span>
</h1>
<p class="text-xs lg:text-sm text-slate-500 max-w-2xl">
            Theo dõi bàn thắng, kiến tạo, tỷ lệ thắng và điểm thưởng MVP độc quyền giải phong trào Saigon Sunday League.
          </p>
</div>
<!-- Season Picker & Admin Primary Quick Actions -->
<div class="flex flex-wrap items-center gap-2.5">
<div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
<span class="material-symbols-outlined text-slate-400 text-base mr-1.5">calendar_today</span>
<select class="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1" id="seasonSelect">
<option value="2025">Mùa giải 2025 (Hiện tại)</option>
<option value="2024">Mùa giải 2024 (Lưu trữ)</option>
<option value="cup">Hè Cup 2025</option>
</select>
</div>
<button class="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors" onclick="focusScoreInput()" type="button">
<span class="material-symbols-outlined text-base">sports_score</span>
<span>Nhập Tỉ Số Trận</span>
</button>
<a class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg shadow-2xs transition-colors" href="#pendingQueue">
<span class="material-symbols-outlined text-base text-slate-500">person_add</span>
<span>Duyệt mới</span>
<span class="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
</a>
</div>
</div>
<!-- Quick KPI Metric Cards Bar -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
<div class="flex flex-col">
<span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng Bàn Thắng Giải</span>
<div class="flex items-baseline gap-1.5 mt-1">
<span class="font-headline font-black text-2xl text-slate-900">74</span>
<span class="text-xs text-slate-400">bàn / 14 vòng</span>
</div>
<span class="text-[11px] text-emerald-600 font-medium mt-1">↑ 12% so với mùa trước</span>
</div>
<div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
<span class="material-symbols-outlined text-xl">sports_soccer</span>
</div>
</div>
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
<div class="flex flex-col">
<span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Hiệu Suất Trung Bình</span>
<div class="flex items-baseline gap-1.5 mt-1">
<span class="font-headline font-black text-2xl text-slate-900">5.28</span>
<span class="text-xs text-slate-400">bàn / trận</span>
</div>
<span class="text-[11px] text-slate-500 font-medium mt-1">Trận đấu cởi mở, fair-play</span>
</div>
<div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
<span class="material-symbols-outlined text-xl">analytics</span>
</div>
</div>
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
<div class="flex flex-col">
<span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Chỉ Số Fair-Play</span>
<div class="flex items-center gap-3 mt-1.5">
<div class="flex items-center gap-1">
<span class="w-2.5 h-3.5 bg-amber-400 rounded-xs"></span>
<span class="text-sm font-bold text-slate-800">18</span>
</div>
<div class="flex items-center gap-1">
<span class="w-2.5 h-3.5 bg-rose-500 rounded-xs"></span>
<span class="text-sm font-bold text-slate-800">2</span>
</div>
</div>
<span class="text-[11px] text-slate-400 mt-1">Tỷ lệ thẻ thấp top đầu giải</span>
</div>
<div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
<span class="material-symbols-outlined text-xl">verified</span>
</div>
</div>
</div>
<!-- Main Two-Column Tactical Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
<!-- LEFT COLUMN: Main Standings Leaderboard (7 cols) -->
<section class="lg:col-span-7 flex flex-col gap-4">
<div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
<!-- Card Sub-Header & Tabs -->
<div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-emerald-600 text-lg">format_list_numbered</span>
<h2 class="font-headline font-bold text-base text-slate-900">Bảng Xếp Hạng Cá Nhân</h2>
<span class="text-xs font-medium text-slate-400">· 28 cầu thủ</span>
</div>
<!-- Quick Filter Segment Control (FotMob Style) -->
<div class="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600" id="sortTabGroup">
<button class="sort-tab px-2.5 py-1 rounded-md bg-white text-slate-900 font-semibold shadow-2xs transition-all" onclick="setSortMode('goals', this)" type="button">
                  Bàn Thắng (G)
                </button>
<button class="sort-tab px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-all" onclick="setSortMode('assists', this)" type="button">
                  Kiến Tạo (A)
                </button>
<button class="sort-tab px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-all" onclick="setSortMode('winrate', this)" type="button">
                  Tỷ Lệ Thắng
                </button>
</div>
</div>
<!-- Standings Table -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse" id="leaderboardTable">
<thead>
<tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
<th class="py-2.5 px-3 w-10 text-center">#</th>
<th class="py-2.5 px-3">Cầu Thủ</th>
<th class="py-2.5 px-2 text-center" title="Số trận thi đấu">Trận</th>
<th class="py-2.5 px-2 text-center text-slate-900" title="Bàn thắng">G</th>
<th class="py-2.5 px-2 text-center" title="Kiến tạo">A</th>
<th class="py-2.5 px-2 text-center" title="Điểm MVP">MVP</th>
<th class="py-2.5 px-3 text-center">5 Trận Gần Nhất</th>
<th class="py-2.5 px-3 text-right">Tỷ Lệ</th>
<th class="py-2.5 px-2 text-center w-8"><span class="sr-only">Hành động</span></th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 text-xs">
<!-- Rank 1: Hoàng Minh (Gold Accent Pill) -->
<tr class="hover:bg-slate-50/80 transition-colors group">
<td class="py-3 px-3 text-center">
<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                        1
                      </span>
</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
<img alt="Hoàng Minh" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6cnOZXug38PT78rOdmJo1SBBuVQztBpQvRf1exaew6H_KG7agimzl1Fhnyu5VDBJisuBzuKuUL5yoJxxun-MZ5UGP_9pNfZ6h5vj_uWAtPVTRcyb9m1lQGKtcTdNto7cCdmSHBv7qhUWzu0DrHpBMDT6L3NeyJSSLzbJh0912w4hKgJxMFZ4eMOcwo8oQUJeME8EJ2Xdx4pnbFfCCD6Fq9OJTWiTaNrzlAx8sfdJO0qgyp4udJqDI"/>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-bold text-slate-900 text-sm">Hoàng Minh</span>
<span class="bg-amber-100 text-amber-800 text-[10px] font-semibold px-1 rounded">ST</span>
</div>
<span class="text-[11px] text-slate-400">Team A · #09</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">14</td>
<td class="py-3 px-2 text-center font-bold text-slate-900 text-sm">12</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">4</td>
<td class="py-3 px-2 text-center font-semibold text-amber-700">★ 3</td>
<td class="py-3 px-3 text-center">
<!-- Sofascore W/D/L Form badges -->
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center" title="Thua">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-semibold text-emerald-700">78.5%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Hoàng Minh', 'PLAYER')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 2: Hùng Nguyễn (Current User / Silver Badge) -->
<tr class="hover:bg-slate-50/80 transition-colors bg-emerald-50/30">
<td class="py-3 px-3 text-center">
<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs">
                        2
                      </span>
</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-300 shrink-0">
<img alt="Hùng Nguyễn" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Xx6VxaAD31wOxuXYvrfVJPrxTTeSDeiHA2qKv_BPQmfA_v5uRQ6uGV_4KQuAOqX3Qmut1VW70_30PyTIsMVT8OEEYKTRdrojfxmK09jRdXxdCmysTXwlJ6cQSgMcYywb1gSGD_pqr2k5hFIqCFn5XxW0Z60-N2fNV1gOIpbhUAgcX82kRGXsH53DFo518gHzM4TG7hgTzFMCghUZpseKABHZY0dEia2J7qhRD7KUDBEgSxZt6wmZG6bQ"/>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-bold text-slate-900 text-sm">Hùng Nguyễn</span>
<span class="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1 rounded">BẠN</span>
<span class="bg-slate-200 text-slate-700 text-[9px] font-medium px-1 rounded uppercase">ADMIN</span>
</div>
<span class="text-[11px] text-slate-500">Team A · #10 · Đội trưởng</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">14</td>
<td class="py-3 px-2 text-center font-bold text-slate-900 text-sm">9</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">8</td>
<td class="py-3 px-2 text-center font-semibold text-amber-700">★ 4</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center" title="Thua">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-semibold text-emerald-700">71.4%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Hùng Nguyễn', 'ADMIN')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">verified_user</span>
</button>
</td>
</tr>
<!-- Rank 3: Tuấn Chelsea (Bronze Badge) -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center">
<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-bold text-xs">
                        3
                      </span>
</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
<img alt="Tuấn Chelsea" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7edF3YS3X6n1mGIyP8vP2xf9r-mLo1PLOJo_NymanPkttAwTz5awJco1GjXyH2cuQys0b6AfUzrOUKz0MJz1bsoBwaTtJL-jzMOhIJ5lgJFy4hL3hYyLYwu3dQjaosL8NxSdHOwwetOP7K59lqYPXgZZLFlkgQk4Cb8KZgO79v_Qr5nVaqJFCLIqx-qAPNq2KFE8Q-FnL25bKMdJKEJtczEFrvhJgzv6Uh0rH8rFXBSbk2xnYgil8"/>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-bold text-slate-900 text-sm">Tuấn Chelsea</span>
<span class="bg-blue-100 text-blue-800 text-[10px] font-semibold px-1 rounded">CM</span>
</div>
<span class="text-[11px] text-slate-400">Team B · #08</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">13</td>
<td class="py-3 px-2 text-center font-bold text-slate-900 text-sm">8</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">6</td>
<td class="py-3 px-2 text-center font-semibold text-amber-700">★ 2</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center" title="Thua">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center" title="Thắng">W</span>
<span class="w-4 h-4 rounded-full bg-slate-400 text-white text-[9px] font-bold flex items-center justify-center" title="Hòa">D</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-slate-700">61.5%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Tuấn Chelsea', 'PLAYER')" title="Thiết lập quyền" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 4: Quang Hải Phủi -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center font-semibold text-slate-500">4</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          QH
                        </div>
<div class="flex flex-col">
<span class="font-bold text-slate-900 text-sm">Quang Hải Phủi</span>
<span class="text-[11px] text-slate-400">Team B · #19</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">12</td>
<td class="py-3 px-2 text-center font-bold text-slate-900">6</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">7</td>
<td class="py-3 px-2 text-center text-slate-500">★ 1</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-slate-600">58.3%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Quang Hải Phủi', 'PLAYER')" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 5: Bảo Trọng (GK) -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center font-semibold text-slate-500">5</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                          GK
                        </div>
<div class="flex flex-col">
<span class="font-bold text-slate-900 text-sm">Bảo Trọng</span>
<span class="text-[11px] text-slate-400">Team A · #01 · Thủ môn</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">14</td>
<td class="py-3 px-2 text-center font-bold text-slate-900">0</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">2</td>
<td class="py-3 px-2 text-center font-semibold text-amber-700">★ 3</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-emerald-700">71.4%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Bảo Trọng', 'PLAYER')" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 6: Đăng Khoa CB -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center font-semibold text-slate-500">6</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          DK
                        </div>
<div class="flex flex-col">
<span class="font-bold text-slate-900 text-sm">Đăng Khoa</span>
<span class="text-[11px] text-slate-400">Team A · #04 · Trung vệ</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">11</td>
<td class="py-3 px-2 text-center font-bold text-slate-900">3</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">3</td>
<td class="py-3 px-2 text-center text-slate-400">★ 0</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-slate-600">54.5%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Đăng Khoa', 'PLAYER')" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 7: Vũ Neymar -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center font-semibold text-slate-500">7</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          VN
                        </div>
<div class="flex flex-col">
<span class="font-bold text-slate-900 text-sm">Vũ Neymar</span>
<span class="text-[11px] text-slate-400">Team B · #11</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">10</td>
<td class="py-3 px-2 text-center font-bold text-slate-900">5</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">2</td>
<td class="py-3 px-2 text-center text-slate-500">★ 1</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-slate-600">40.0%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Vũ Neymar', 'PLAYER')" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
<!-- Rank 8: Minh Thắng -->
<tr class="hover:bg-slate-50/80 transition-colors">
<td class="py-3 px-3 text-center font-semibold text-slate-500">8</td>
<td class="py-3 px-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          MT
                        </div>
<div class="flex flex-col">
<span class="font-bold text-slate-900 text-sm">Minh Thắng</span>
<span class="text-[11px] text-slate-400">Team B · #06 · Tiền vệ trụ</span>
</div>
</div>
</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">12</td>
<td class="py-3 px-2 text-center font-bold text-slate-900">2</td>
<td class="py-3 px-2 text-center font-medium text-slate-600">4</td>
<td class="py-3 px-2 text-center text-slate-400">★ 0</td>
<td class="py-3 px-3 text-center">
<div class="inline-flex items-center gap-1">
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">W</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
<span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">L</span>
</div>
</td>
<td class="py-3 px-3 text-right font-medium text-slate-500">33.3%</td>
<td class="py-3 px-2 text-center">
<button class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" onclick="openPlayerRoleModal('Minh Thắng', 'PLAYER')" type="button">
<span class="material-symbols-outlined text-base">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer -->
<div class="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
<span class="flex items-center gap-1.5 font-medium">
<span class="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                Dữ liệu ghi nhận tự động sau mỗi lượt đấu
              </span>
<a class="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1" href="#">
                Xem đầy đủ 28 cầu thủ <span class="material-symbols-outlined text-xs">arrow_forward</span>
</a>
</div>
</div>
</section>
<!-- RIGHT COLUMN: Match Score Entry, AI Scout Notes & Pending Approvals (5 cols) -->
<aside class="lg:col-span-5 flex flex-col gap-5">
<!-- CARD 1: Modern Match Scoreboard & Goal Entry -->
<div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col gap-4" id="matchEntryWidget">
<div class="flex items-center justify-between border-b border-slate-100 pb-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-emerald-600 text-xl">sports_and_outdoors</span>
<div class="flex flex-col">
<h3 class="font-headline font-bold text-sm text-slate-900">Cập Nhật Tỉ Số Trận Đấu</h3>
<span class="text-[11px] text-slate-400">Vòng 14 · Giao hữu nội bộ cuối tuần</span>
</div>
</div>
<span class="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Sân 7 người
              </span>
</div>
<!-- Scoreboard Display with Stepper Buttons -->
<div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-around">
<!-- Team A -->
<div class="flex flex-col items-center gap-1">
<span class="text-xs font-bold text-slate-800">Team A (Xanh)</span>
<span class="text-[10px] text-slate-400">Đội chính</span>
<div class="flex items-center gap-1.5 mt-1">
<button class="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors" onclick="adjustScore('teamA', -1)" type="button">-</button>
<input class="w-12 h-11 bg-white border border-slate-300 text-center font-headline font-black text-2xl text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" id="scoreA" min="0" type="number" value="4"/>
<button class="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors" onclick="adjustScore('teamA', 1)" type="button">+</button>
</div>
</div>
<!-- Match status center -->
<div class="flex flex-col items-center">
<span class="font-headline font-bold text-slate-300 text-xl tracking-widest">:</span>
<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-1">FT 90'</span>
</div>
<!-- Team B -->
<div class="flex flex-col items-center gap-1">
<span class="text-xs font-bold text-slate-800">Team B (Cam)</span>
<span class="text-[10px] text-slate-400">Đội phụ</span>
<div class="flex items-center gap-1.5 mt-1">
<button class="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors" onclick="adjustScore('teamB', -1)" type="button">-</button>
<input class="w-12 h-11 bg-white border border-slate-300 text-center font-headline font-black text-2xl text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" id="scoreB" min="0" type="number" value="2"/>
<button class="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors" onclick="adjustScore('teamB', 1)" type="button">+</button>
</div>
</div>
</div>
<!-- Goal Scorers List -->
<div class="flex flex-col gap-2">
<div class="flex items-center justify-between">
<label class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Cầu Thủ Ghi Bàn &amp; Kiến Tạo
                </label>
<button class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5" onclick="addScorerRow()" type="button">
<span class="material-symbols-outlined text-xs">add</span> Thêm người
                </button>
</div>
<div class="flex flex-col gap-1.5" id="scorersList">
<!-- Goal Row 1 -->
<div class="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs">
<div class="flex items-center gap-2">
<span class="font-bold text-slate-800">Hoàng Minh</span>
<span class="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-1 rounded">Team A</span>
</div>
<div class="flex items-center gap-2 text-slate-600 font-medium">
<span>⚽ 2 bàn</span>
<span class="text-slate-400">·</span>
<span class="text-slate-500">👟 0 KT</span>
<button class="text-slate-400 hover:text-rose-500 ml-1 transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
<!-- Goal Row 2 -->
<div class="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs">
<div class="flex items-center gap-2">
<span class="font-bold text-slate-800">Hùng Nguyễn</span>
<span class="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-1 rounded">Team A</span>
</div>
<div class="flex items-center gap-2 text-slate-600 font-medium">
<span>⚽ 1 bàn</span>
<span class="text-slate-400">·</span>
<span class="text-emerald-700">👟 1 KT</span>
<button class="text-slate-400 hover:text-rose-500 ml-1 transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
<!-- Goal Row 3 -->
<div class="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs">
<div class="flex items-center gap-2">
<span class="font-bold text-slate-800">Tuấn Chelsea</span>
<span class="text-[10px] font-medium bg-orange-100 text-orange-800 px-1 rounded">Team B</span>
</div>
<div class="flex items-center gap-2 text-slate-600 font-medium">
<span>⚽ 2 bàn</span>
<span class="text-slate-400">·</span>
<span class="text-slate-500">👟 0 KT</span>
<button class="text-slate-400 hover:text-rose-500 ml-1 transition-colors" onclick="this.closest('div.flex.items-center.justify-between').remove()" type="button">
<span class="material-symbols-outlined text-sm">close</span>
</button>
</div>
</div>
</div>
</div>
<!-- MVP Selection -->
<div class="flex flex-col gap-1.5">
<label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1" for="mvpSelect">
<span class="material-symbols-outlined text-amber-500 text-sm">star</span>
                Cầu Thủ Xuất Sắc Nhất (MVP)
              </label>
<div class="relative">
<select class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium p-2.5 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer pr-8" id="mvpSelect">
<option selected="" value="hung_nguyen">★ Hùng Nguyễn (Đội trưởng A - 1 bàn, 1 kiến tạo, 6 cản phá)</option>
<option value="hoang_minh">★ Hoàng Minh (Tiền đạo A - 2 bàn mở tỉ số)</option>
<option value="tuan_chelsea">★ Tuấn Chelsea (Tiền vệ B - 2 bàn sút xa)</option>
<option value="bao_trong">★ Bảo Trọng (Thủ môn A - cản phá penalty phút 75)</option>
</select>
<span class="material-symbols-outlined absolute right-2.5 top-2.5 text-slate-400 text-base pointer-events-none">expand_more</span>
</div>
</div>
<!-- Submit Button Group -->
<div class="flex items-center gap-2 pt-1">
<button class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5" onclick="submitMatchResult()" type="button">
<span class="material-symbols-outlined text-base">check</span>
<span>Lưu &amp; Cập Nhật BXH</span>
</button>
<button class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs py-2.5 px-3 rounded-lg transition-colors" onclick="resetScoreForm()" type="button">
                Đặt lại
              </button>
</div>
</div>
<!-- CARD 2: Editorial Match Scout Notes (Sofascore / FotMob Style AI Recap) -->
<div class="bg-blue-50/70 border border-blue-100 rounded-xl p-4 shadow-2xs flex flex-col gap-2">
<div class="flex items-center justify-between">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-blue-700 text-base">article</span>
<span class="text-xs font-bold uppercase tracking-wider text-blue-900">Bình Luận Chuyên Môn Trận Đấu</span>
</div>
<span class="text-[10px] font-medium text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">Scout Analysis</span>
</div>
<p class="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-lg border border-blue-100/80" id="geminiSummaryText">
              “Trận đấu diễn ra cởi mở với màn rượt đuổi tỷ số kịch tính trong hiệp 1. Sang hiệp 2, tuyến giữa Team A hoàn toàn áp đảo nhờ sự năng nổ của Hùng Nguyễn và Hoàng Minh với 3 pha phối hợp bài bản, định đoạt trọn vẹn 3 điểm.”
            </p>
<div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
<span class="flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Tỷ lệ kiểm soát bóng: 58% - 42%
              </span>
<button class="text-blue-700 hover:underline font-semibold inline-flex items-center gap-0.5" onclick="regenerateAiRecap()" type="button">
<span class="material-symbols-outlined text-xs">refresh</span> Phân tích lại
              </button>
</div>
</div>
<!-- CARD 3: Pending Member Approvals -->
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col gap-3" id="pendingQueue">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-slate-600 text-lg">how_to_reg</span>
<h4 class="font-headline font-bold text-sm text-slate-900">Chờ Duyệt Tham Gia</h4>
</div>
<span class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                2 yêu cầu
              </span>
</div>
<div class="flex flex-col gap-2" id="pendingPlayersList">
<!-- Pending 1 -->
<div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-center justify-between gap-2" id="pendingRow1">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-white border border-slate-200 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                    Đ
                  </div>
<div class="flex flex-col">
<span class="font-bold text-xs text-slate-800">Nguyễn Văn Đức</span>
<span class="text-[10px] text-slate-400">Vị trí: CB/CDM · Đăng ký 2h trước</span>
</div>
</div>
<div class="flex items-center gap-1 shrink-0">
<button class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded shadow-2xs transition-colors" onclick="approvePlayer('pendingRow1', 'Nguyễn Văn Đức')" type="button">
                    Duyệt
                  </button>
<button class="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium rounded transition-colors" onclick="rejectPlayer('pendingRow1', 'Nguyễn Văn Đức')" type="button">
                    Từ chối
                  </button>
</div>
</div>
<!-- Pending 2 -->
<div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-center justify-between gap-2" id="pendingRow2">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    L
                  </div>
<div class="flex flex-col">
<span class="font-bold text-xs text-slate-800">Lê Hoàng Long</span>
<span class="text-[10px] text-slate-400">Vị trí: RW/ST · Đăng ký hôm qua</span>
</div>
</div>
<div class="flex items-center gap-1 shrink-0">
<button class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded shadow-2xs transition-colors" onclick="approvePlayer('pendingRow2', 'Lê Hoàng Long')" type="button">
                    Duyệt
                  </button>
<button class="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium rounded transition-colors" onclick="rejectPlayer('pendingRow2', 'Lê Hoàng Long')" type="button">
                    Từ chối
                  </button>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
</div>
<!-- Role Setting Modal -->
<div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center hidden p-4" id="roleModal">
<div class="bg-white max-w-md w-full rounded-xl p-5 shadow-xl border border-slate-200 flex flex-col gap-4">
<div class="flex items-center justify-between border-b border-slate-100 pb-3">
<h3 class="font-headline font-bold text-base text-slate-900">Phân Quyền Ban Cán Sự</h3>
<button class="text-slate-400 hover:text-slate-700" onclick="closePlayerRoleModal()" type="button">
<span class="material-symbols-outlined text-lg">close</span>
</button>
</div>
<div class="flex flex-col gap-1 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
<span class="text-[11px] font-medium text-slate-400">Cầu thủ được chọn:</span>
<span class="font-headline font-bold text-base text-emerald-700" id="roleModalPlayerName">Hoàng Minh</span>
</div>
<div class="flex flex-col gap-2">
<label class="text-xs font-bold text-slate-700 uppercase tracking-wide">Vai trò trong giải:</label>
<label class="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
<input class="accent-emerald-600 w-4 h-4 mt-0.5" name="playerRole" type="radio" value="ADMIN"/>
<div class="flex flex-col">
<span class="text-xs font-bold text-slate-900">ADMIN / CAPTAIN</span>
<span class="text-[11px] text-slate-500">Toàn quyền nhập tỷ số, duyệt thẻ phạt và thành viên mới.</span>
</div>
</label>
<label class="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
<input checked="" class="accent-emerald-600 w-4 h-4 mt-0.5" name="playerRole" type="radio" value="PLAYER"/>
<div class="flex flex-col">
<span class="text-xs font-bold text-slate-900">PLAYER / THÀNH VIÊN</span>
<span class="text-[11px] text-slate-500">Xem bảng xếp hạng, điểm danh thi đấu và hồ sơ cá nhân.</span>
</div>
</label>
</div>
<div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
<button class="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium" onclick="closePlayerRoleModal()" type="button">Hủy</button>
<button class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs" onclick="savePlayerRole()" type="button">Lưu Cập Nhật</button>
</div>
</div>
</div>
<!-- Interactive JavaScript Handling -->
<script>
    let adminModeActive = true;

    function toggleAdminMode() {
      adminModeActive = !adminModeActive;
      const toggle = document.getElementById('adminModeToggle');
      const dot = document.getElementById('adminToggleDot');
      if (adminModeActive) {
        toggle.classList.remove('bg-slate-300');
        toggle.classList.add('bg-emerald-600');
        dot.classList.remove('translate-x-0');
        dot.classList.add('translate-x-4');
        showToast("Đã kích hoạt chế độ Quản trị viên (Admin)");
      } else {
        toggle.classList.remove('bg-emerald-600');
        toggle.classList.add('bg-slate-300');
        dot.classList.remove('translate-x-4');
        dot.classList.add('translate-x-0');
        showToast("Đã chuyển về chế độ Xem Thành viên (Viewer)");
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toastNotification');
      const text = document.getElementById('toastMessage');
      if (toast && text) {
        text.innerText = msg;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
          toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
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
        widget.classList.add('ring-2', 'ring-emerald-500');
        setTimeout(() => widget.classList.remove('ring-2', 'ring-emerald-500'), 1500);
      }
    }

    function submitMatchResult() {
      const sA = document.getElementById('scoreA').value;
      const sB = document.getElementById('scoreB').value;
      const mvpSelect = document.getElementById('mvpSelect');
      const mvp = mvpSelect.options[mvpSelect.selectedIndex].text;
      
      showToast(`Đã lưu tỉ số [${sA} - ${sB}] & cập nhật BXH thành công!`);
      
      const aiText = document.getElementById('geminiSummaryText');
      if (aiText) {
        aiText.innerText = `“Kết thúc trận đấu với tỷ số ${sA}-${sB}. Điểm nhấn lớn nhất là phong độ chói sáng của ${mvp.split('(')[0].replace('★', '').trim()}. Các dữ liệu bàn thắng và kiến tạo đã được đồng bộ vào hệ thống BXH chính thức.”`;
      }
    }

    function resetScoreForm() {
      document.getElementById('scoreA').value = 0;
      document.getElementById('scoreB').value = 0;
      showToast("Đã đặt lại tỉ số về 0-0");
    }

    function addScorerRow() {
      const list = document.getElementById('scorersList');
      if (!list) return;
      const newRow = document.createElement('div');
      newRow.className = "flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs";
      newRow.innerHTML = `
        <div class="flex items-center gap-2">
          <input type="text" placeholder="Tên cầu thủ..." class="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-800 focus:outline-none w-28">
          <span class="text-[10px] font-medium bg-slate-200 text-slate-700 px-1 rounded">Team B</span>
        </div>
        <div class="flex items-center gap-2 text-slate-600 font-medium">
          <span>⚽ 1 bàn</span>
          <button type="button" onclick="this.closest('div.flex.items-center.justify-between').remove()" class="text-slate-400 hover:text-rose-500 transition-colors ml-1">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      `;
      list.appendChild(newRow);
    }

    function setSortMode(criteria, btn) {
      document.querySelectorAll('#sortTabGroup .sort-tab').forEach(b => {
        b.className = "sort-tab px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-all";
      });
      btn.className = "sort-tab px-2.5 py-1 rounded-md bg-white text-slate-900 font-semibold shadow-2xs transition-all";
      showToast(`Đã sắp xếp BXH theo tiêu chí: ${criteria.toUpperCase()}`);
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
        showToast(`Đã từ chối đăng ký của ${name}.`);
      }
    }

    function regenerateAiRecap() {
      const aiText = document.getElementById('geminiSummaryText');
      if (aiText) {
        aiText.innerText = "“Phân tích thông số chuyên sâu: Khả năng chuyển đổi cơ hội của Team A đạt mức ấn tượng 44%. Hàng thủ Team B chịu áp lực lớn ở 15 phút cuối hiệp 2 sau các pha bứt tốc bên cánh trái.”";
        showToast("Đã làm mới báo cáo chiến thuật!");
      }
    }
  </script>
</body></html>