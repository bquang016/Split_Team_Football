import React, { useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const DesignShowcasePage: React.FC = () => {
  // Theme & Accent controls
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState<'emerald' | 'volt' | 'blue' | 'crimson'>('emerald');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Selected Style state for each component
  const [selectedStyles, setSelectedStyles] = useState<{ [key: string]: number }>({
    button: 1,
    breadcrumb: 1,
    input: 1,
    font: 2,
    dropdown: 1,
    card: 1,
    badge: 1,
    tabs: 1,
    toggle: 1,
  });

  // Interactive demo states
  const [btnLoading, setBtnLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [dropdownSelected, setDropdownSelected] = useState<string>('Quang Bùi (Tiền đạo #7)');
  const [activeTabDemo1, setActiveTabDemo1] = useState(0);
  const [activeTabDemo2, setActiveTabDemo2] = useState(0);
  const [toggleState1, setToggleState1] = useState(true);
  const [toggleState2, setToggleState2] = useState(true);
  const [toggleState3, setToggleState3] = useState(false);
  const [toggleState4, setToggleState4] = useState(true);
  const [inputVal1, setInputVal1] = useState('');
  const [inputVal2, setInputVal2] = useState('Sân bóng Chảo Lửa');
  const [inputVal3, setInputVal3] = useState('7. Cristiano Ronaldo');
  const [inputVal4, setInputVal4] = useState('');
  const [inputVal5, setInputVal5] = useState('');

  const handlePickStyle = (componentKey: string, styleNum: number, styleTitle: string) => {
    setSelectedStyles((prev) => ({ ...prev, [componentKey]: styleNum }));
    toast.success(`Đã chọn Kiểu ${styleNum}: ${styleTitle} cho ${componentKey.toUpperCase()}!`);
  };

  const handleCopySummary = () => {
    const summaryText = `BẢN PHỐI GIAO DIỆN CHỌN BỞI BẠN:
- Chế độ hiển thị: ${previewTheme === 'dark' ? 'Stadium Night Dark' : 'Modern Daylight Pro'}
- Màu sắc chủ đạo: ${accentColor.toUpperCase()}
- Button (Nút bấm): Kiểu ${selectedStyles.button}
- Breadcrumbs (Vụn bánh mì): Kiểu ${selectedStyles.breadcrumb}
- Input & Form (Ô nhập liệu): Kiểu ${selectedStyles.input}
- Typography (Phông chữ): Kiểu ${selectedStyles.font}
- Dropdown & Select (Menu chọn): Kiểu ${selectedStyles.dropdown}
- Cards (Thẻ thông tin): Kiểu ${selectedStyles.card}
- Badges & Tags (Huy hiệu): Kiểu ${selectedStyles.badge}
- Tabs (Thanh chuyển tab): Kiểu ${selectedStyles.tabs}
- Toggles (Nút gạt): Kiểu ${selectedStyles.toggle}`;

    navigator.clipboard.writeText(summaryText);
    toast.success('Đã sao chép danh sách cấu hình bạn chọn vào Clipboard!');
  };

  const categories = [
    { id: 'all', label: 'Tất cả thành phần', icon: 'dashboard' },
    { id: 'buttons', label: 'Buttons (Nút bấm)', icon: 'smart_button' },
    { id: 'breadcrumbs', label: 'Breadcrumbs (Điều hướng)', icon: 'linear_scale' },
    { id: 'inputs', label: 'Inputs & Form (Ô nhập)', icon: 'input' },
    { id: 'typography', label: 'Typography (Phông chữ)', icon: 'font_download' },
    { id: 'dropdowns', label: 'Dropdown & Select', icon: 'arrow_drop_down_circle' },
    { id: 'cards', label: 'Cards (Thẻ giao diện)', icon: 'view_agenda' },
    { id: 'badges', label: 'Badges (Huy hiệu & Live)', icon: 'label' },
    { id: 'tabs', label: 'Tabs & Toggles', icon: 'toggle_on' },
  ];

  return (
    <div
      className={clsx(
        'min-h-screen transition-colors duration-300 pb-24',
        previewTheme === 'dark' ? 'bg-[#0B111E] text-slate-100' : 'bg-slate-50 text-slate-800'
      )}
    >
      {/* Top Banner / Hero */}
      <div
        className={clsx(
          'relative border-b overflow-hidden',
          previewTheme === 'dark'
            ? 'bg-gradient-to-b from-[#111A2E] via-[#0B111E] to-[#0B111E] border-slate-800'
            : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        {/* Glow ambient background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>UI/UX Design Review Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-syne tracking-tight">
                Duyệt & Chọn Phong Cách Thiết Kế UI/UX
              </h1>
              <p
                className={clsx(
                  'mt-2 text-sm sm:text-base max-w-2xl',
                  previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                )}
              >
                Mỗi thành phần được thiết kế riêng biệt <strong>3 - 5 phong cách độc đáo</strong> (được đánh số rõ ràng).
                Bấm <strong>"Chọn kiểu này"</strong> ở mục bạn ưng ý để tạo bộ Design System bóng đá ấn tượng nhất!
              </p>
            </div>

            {/* Live Mode & Color Accent Switchers */}
            <div
              className={clsx(
                'p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 shadow-xl',
                previewTheme === 'dark' ? 'bg-[#151F33] border-slate-700/60' : 'bg-white border-slate-200'
              )}
            >
              {/* Dark / Light Stadium Mode Toggle */}
              <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Chế độ nền
                </span>
                <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-700/50">
                  <button
                    onClick={() => setPreviewTheme('dark')}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      previewTheme === 'dark'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">dark_mode</span>
                    <span>Stadium Dark</span>
                  </button>
                  <button
                    onClick={() => setPreviewTheme('light')}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      previewTheme === 'light'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">light_mode</span>
                    <span>Daylight Pro</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tone màu thể thao
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAccentColor('emerald')}
                    title="Emerald Pitch"
                    className={clsx(
                      'w-7 h-7 rounded-full bg-emerald-500 transition-transform flex items-center justify-center',
                      accentColor === 'emerald' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {accentColor === 'emerald' && <span className="material-symbols-outlined text-white text-xs">check</span>}
                  </button>
                  <button
                    onClick={() => setAccentColor('volt')}
                    title="Volt Stadium Neon"
                    className={clsx(
                      'w-7 h-7 rounded-full bg-yellow-400 transition-transform flex items-center justify-center',
                      accentColor === 'volt' ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {accentColor === 'volt' && <span className="material-symbols-outlined text-slate-950 text-xs font-black">check</span>}
                  </button>
                  <button
                    onClick={() => setAccentColor('blue')}
                    title="Cyber Tech Blue"
                    className={clsx(
                      'w-7 h-7 rounded-full bg-blue-500 transition-transform flex items-center justify-center',
                      accentColor === 'blue' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {accentColor === 'blue' && <span className="material-symbols-outlined text-white text-xs">check</span>}
                  </button>
                  <button
                    onClick={() => setAccentColor('crimson')}
                    title="Crimson Derby Red"
                    className={clsx(
                      'w-7 h-7 rounded-full bg-rose-500 transition-transform flex items-center justify-center',
                      accentColor === 'crimson' ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    {accentColor === 'crimson' && <span className="material-symbols-outlined text-white text-xs">check</span>}
                  </button>
                </div>
              </div>

              {/* Summary button */}
              <button
                onClick={handleCopySummary}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Copy lựa chọn</span>
              </button>
            </div>
          </div>

          {/* Quick Category Filters Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                  activeCategory === cat.id
                    ? previewTheme === 'dark'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : previewTheme === 'dark'
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                )}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* ========================================================================= */}
        {/* 1. BUTTONS SECTION (5 KIỂU THIẾT KẾ) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'buttons') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                  <span className="material-symbols-outlined text-xl">smart_button</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    1. Button & Action Controls (5 Kiểu Thiết Kế)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Thử nghiệm hover, click để cảm nhận chuyển động micro-physics & độ nảy của nút
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Đang chọn: Kiểu {selectedStyles.button}
                </span>
                <button
                  onClick={() => setBtnLoading(!btnLoading)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {btnLoading ? 'Dừng Loading' : 'Mô phỏng Loading'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* KIỂU 1: Cyber Neon Glow */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative flex flex-col justify-between',
                  selectedStyles.button === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Cyber Neon Glow</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">
                    Đèn neon sân đấu ban đêm, viền quét Shimmer ánh sáng, hiệu ứng phát quang rực rỡ khi tương tác.
                  </p>

                  <div className="space-y-3">
                    <button
                      className="w-full relative group overflow-hidden px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer animate-shimmer"
                    >
                      {btnLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                          sports_soccer
                        </span>
                      )}
                      <span>Chia đội tự động</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">casino</span>
                      <span>Quay vòng may mắn</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Phong cách: E-Sport / Stadium LED</span>
                  <button
                    onClick={() => handlePickStyle('button', 1, 'Cyber Neon Glow')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.button === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.button === 1 ? '✓ Đã chọn' : 'Chọn Kiểu 1'}
                  </button>
                </div>
              </div>

              {/* KIỂU 2: Modern Glassmorphic Pill */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative flex flex-col justify-between',
                  selectedStyles.button === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-blue-400">Modern Glassmorphic Pill</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">
                    Kính mờ phủ sương Apple Sports, bo tròn viên nang mềm mại, phản xạ ánh sáng cao cấp sang trọng.
                  </p>

                  <div className="space-y-3">
                    <button
                      className="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:border-white/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {btnLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      )}
                      <span>Tạo trận cầu mới</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 rounded-full bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                      <span>Cài đặt luật sân 7</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Phong cách: Apple Glass / Sleek</span>
                  <button
                    onClick={() => handlePickStyle('button', 2, 'Modern Glassmorphic Pill')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.button === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.button === 2 ? '✓ Đã chọn' : 'Chọn Kiểu 2'}
                  </button>
                </div>
              </div>

              {/* KIỂU 3: 3D Athletic Chunky / Tactile Press */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative flex flex-col justify-between',
                  selectedStyles.button === 3
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-400">3D Athletic Chunky Press</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">
                    Khối 3D cơ học đổ bóng đáy 4px, khi nhấn có cảm giác phím vật lý lún xuống cực kỳ đầm tay.
                  </p>

                  <div className="space-y-3">
                    <button
                      className="w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm btn-3d-emerald active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      {btnLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-lg">bolt</span>
                      )}
                      <span>Bắt đầu hiệp 1</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs btn-3d-slate active:translate-y-1 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Xuất ảnh đội hình</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Phong cách: Tactical Arcade / Nike</span>
                  <button
                    onClick={() => handlePickStyle('button', 3, '3D Athletic Chunky Press')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.button === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.button === 3 ? '✓ Đã chọn' : 'Chọn Kiểu 3'}
                  </button>
                </div>
              </div>

              {/* KIỂU 4: Minimalist Sharp Luxury Carbon */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative flex flex-col justify-between',
                  selectedStyles.button === 4
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-slate-200 text-slate-900">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-slate-300">Minimalist Sharp Carbon</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">
                    Góc vát 4px sắc nét, viền xước kim loại tương phản đen trắng, tinh giản theo phong cách đồng hồ thể thao.
                  </p>

                  <div className="space-y-3">
                    <button
                      className="w-full px-5 py-3 rounded-md bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-widest border border-white hover:border-slate-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">leaderboard</span>
                      <span>Xem bảng vàng MVP</span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 rounded-md bg-transparent hover:bg-white/5 border border-slate-600 hover:border-slate-400 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      <span>Hồ sơ cầu thủ</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Phong cách: Swiss Athletic / Precision</span>
                  <button
                    onClick={() => handlePickStyle('button', 4, 'Minimalist Sharp Carbon')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.button === 4
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.button === 4 ? '✓ Đã chọn' : 'Chọn Kiểu 4'}
                  </button>
                </div>
              </div>

              {/* KIỂU 5: Kinetic Gradient Pulse & Jersey Tag */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative flex flex-col justify-between md:col-span-2 lg:col-span-1',
                  selectedStyles.button === 5
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-rose-500 text-white">
                      KIỂU 5
                    </span>
                    <span className="text-xs font-bold text-rose-400">Kinetic Gradient & Badge</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">
                    Dải màu tương phản kết hợp huy hiệu số lượng động, nhấp nháy hạt năng lượng khi rê chuột.
                  </p>

                  <div className="space-y-3">
                    <button
                      className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-rose-900/30 hover:shadow-rose-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">stars</span>
                        <span>Điểm danh trận này</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
                        14/14
                      </span>
                    </button>

                    <button
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Đang có 12 người online</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Phong cách: Dynamic Pulse / Vibrant</span>
                  <button
                    onClick={() => handlePickStyle('button', 5, 'Kinetic Gradient & Badge')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.button === 5
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.button === 5 ? '✓ Đã chọn' : 'Chọn Kiểu 5'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. BREADCRUMBS SECTION (5 KIỂU THIẾT KẾ) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'breadcrumbs') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                  <span className="material-symbols-outlined text-xl">linear_scale</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    2. Breadcrumbs & Steppers (5 Kiểu Phân Cấp)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Thanh điều hướng chỉ đường giúp người xem nắm rõ bối cảnh giải đấu, vòng đấu & trận cầu
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Đang chọn: Kiểu {selectedStyles.breadcrumb}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* KIỂU 1: Segmented Floating Capsule */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.breadcrumb === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Floating Glass Capsule</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Viên nang nổi kính mờ, các phân đoạn có icon bóng đá và màu sáng phân cấp rõ nét.
                  </p>

                  <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <nav className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner text-xs font-medium">
                      <a href="#home" className="text-slate-400 hover:text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">stadium</span>
                        <span>Giải Mùa Hè</span>
                      </a>
                      <span className="text-slate-600">/</span>
                      <a href="#matches" className="text-slate-400 hover:text-white">
                        Lịch Thi Đấu
                      </a>
                      <span className="text-slate-600">/</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Trận 14: Đỏ vs Xanh
                      </span>
                    </nav>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Kính mờ + Icon chỉ mục</span>
                  <button
                    onClick={() => handlePickStyle('breadcrumb', 1, 'Floating Glass Capsule')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.breadcrumb === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.breadcrumb === 1 ? '✓ Đã chọn' : 'Chọn Kiểu 1'}
                  </button>
                </div>
              </div>

              {/* KIỂU 2: Cyber Chevron Glow */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.breadcrumb === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-blue-400">Cyber Chevron Glow</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Thanh mũi tên công nghệ dạng HUD, nhấp nháy neon, mang âm hưởng bảng tỷ số hiện đại.
                  </p>

                  <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <nav className="flex items-center text-xs font-bold font-space uppercase tracking-wider">
                      <span className="text-slate-400 hover:text-slate-200 cursor-pointer">BẢNG A</span>
                      <span className="material-symbols-outlined text-sm text-cyan-400 mx-1">
                        chevron_right
                      </span>
                      <span className="text-slate-400 hover:text-slate-200 cursor-pointer">VÒNG 5</span>
                      <span className="material-symbols-outlined text-sm text-cyan-400 mx-1">
                        chevron_right
                      </span>
                      <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                        SƠ ĐỒ TÂY BAN NHA
                      </span>
                    </nav>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Góc mũi tên Cyber + Glow viền</span>
                  <button
                    onClick={() => handlePickStyle('breadcrumb', 2, 'Cyber Chevron Glow')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.breadcrumb === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.breadcrumb === 2 ? '✓ Đã chọn' : 'Chọn Kiểu 2'}
                  </button>
                </div>
              </div>

              {/* KIỂU 3: Match Stepper Flow */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.breadcrumb === 3
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-400">Match Stepper Step Flow</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Thanh tiến trình trận đấu dạng các bước logic: Điểm danh → Chia đội → Đá bóng → Báo cáo.
                  </p>

                  <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                        <span>Điểm danh</span>
                      </div>
                      <div className="h-0.5 flex-1 bg-emerald-500/40 mx-2" />
                      <div className="flex items-center gap-1.5 text-white font-bold bg-slate-800 px-2 py-1 rounded-lg border border-emerald-500/40">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black animate-pulse">
                          2
                        </span>
                        <span>Chia đội</span>
                      </div>
                      <div className="h-0.5 flex-1 bg-slate-700 mx-2" />
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                          3
                        </span>
                        <span>Thi đấu</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Dạng các bước chuẩn giải đấu</span>
                  <button
                    onClick={() => handlePickStyle('breadcrumb', 3, 'Match Stepper Step Flow')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.breadcrumb === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.breadcrumb === 3 ? '✓ Đã chọn' : 'Chọn Kiểu 3'}
                  </button>
                </div>
              </div>

              {/* KIỂU 4: Minimal Slash with Dot Pulse */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.breadcrumb === 4
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-rose-500 text-white">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-rose-400">Minimalist Slash & Live Dot</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Gọn gàng thanh lịch, chữ nghiêng tinh tế với đèn trạng thái trực tiếp nhấp nháy xanh.
                  </p>

                  <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="text-slate-400 hover:text-white cursor-pointer">Bảng Xếp Hạng</span>
                      <span className="text-slate-600 font-light text-sm">/</span>
                      <span className="text-slate-400 hover:text-white cursor-pointer">Vua Phá Lưới</span>
                      <span className="text-slate-600 font-light text-sm">/</span>
                      <span className="text-slate-100 font-bold bg-slate-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Quang Bùi (9 Bàn)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Thanh thoát tối giản Thụy Sĩ</span>
                  <button
                    onClick={() => handlePickStyle('breadcrumb', 4, 'Minimalist Slash & Live Dot')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.breadcrumb === 4
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.breadcrumb === 4 ? '✓ Đã chọn' : 'Chọn Kiểu 4'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. INPUT & FORM SECTION (5 KIỂU THIẾT KẾ) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'inputs') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-amber-900/30">
                  <span className="material-symbols-outlined text-xl">input</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    3. Input & Form Controls (5 Kiểu Nhập Liệu)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Thử gõ phím vào các ô dưới đây để xem viền phát sáng, nhãn nổi, icon và micro-animation
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Đang chọn: Kiểu {selectedStyles.input}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* KIỂU 1: Floating Label Neon Ring */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.input === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Floating Label Neon Ring</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Nhãn nổi bay lên viền khi click, vòng sáng Neon xanh lục bao phủ khi Focus.
                  </p>

                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="float-demo"
                      value={inputVal1}
                      onChange={(e) => setInputVal1(e.target.value)}
                      placeholder=" "
                      className="peer w-full px-4 pt-5 pb-2 text-sm bg-slate-950/60 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-transparent"
                    />
                    <label
                      htmlFor="float-demo"
                      className="absolute left-4 top-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-slate-400 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-emerald-400 pointer-events-none"
                    >
                      Tên trận đấu / Kèo đá
                    </label>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Floating Label + Neon Ring</span>
                  <button
                    onClick={() => handlePickStyle('input', 1, 'Floating Label Neon Ring')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.input === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.input === 1 ? '✓ Đã chọn' : 'Chọn Kiểu 1'}
                  </button>
                </div>
              </div>

              {/* KIỂU 2: Frosted Glass Inner Inset */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.input === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-blue-400">Frosted Glass Inset</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Kính mờ phủ sương, đổ bóng rãnh trong mềm mại, tích hợp icon và nút xóa nhanh.
                  </p>

                  <div className="relative mt-2">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-lg">
                      location_on
                    </span>
                    <input
                      type="text"
                      value={inputVal2}
                      onChange={(e) => setInputVal2(e.target.value)}
                      placeholder="Nhập địa điểm sân..."
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all"
                    />
                    {inputVal2 && (
                      <button
                        onClick={() => setInputVal2('')}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Kính mờ + Icon tiền tố</span>
                  <button
                    onClick={() => handlePickStyle('input', 2, 'Frosted Glass Inset')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.input === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.input === 2 ? '✓ Đã chọn' : 'Chọn Kiểu 2'}
                  </button>
                </div>
              </div>

              {/* KIỂU 3: Athletic Card with Hotkey Badge */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.input === 3
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-400">Athletic Search & Hotkey</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Thanh tìm kiếm thể thao có huy hiệu số áo, icon kính lúp và phím tắt ⌘K.
                  </p>

                  <div className="relative mt-2">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-emerald-400 text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={inputVal3}
                      onChange={(e) => setInputVal3(e.target.value)}
                      placeholder="Tìm cầu thủ, chỉ số..."
                      className="w-full pl-10 pr-16 py-2.5 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 rounded border border-slate-700">
                      ⌘K
                    </kbd>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Khung tìm kiếm + Phím tắt</span>
                  <button
                    onClick={() => handlePickStyle('input', 3, 'Athletic Search & Hotkey')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.input === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.input === 3 ? '✓ Đã chọn' : 'Chọn Kiểu 3'}
                  </button>
                </div>
              </div>

              {/* KIỂU 4: Cyber HUD Bracket Input */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.input === 4
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-cyan-300">Cyber HUD Bracket</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Khung ngắm kỹ thuật số góc vát, nhấp nháy con trỏ terminal thể thao điện tử.
                  </p>

                  <div className="relative mt-2 p-1 bg-cyan-950/20 border border-cyan-500/40 rounded-lg">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/90 rounded font-mono text-xs">
                      <span className="text-cyan-400 font-bold">&gt;</span>
                      <input
                        type="text"
                        value={inputVal4}
                        onChange={(e) => setInputVal4(e.target.value)}
                        placeholder="NHAP_TI_SO_0_0"
                        className="w-full bg-transparent text-cyan-300 placeholder:text-cyan-800 focus:outline-none uppercase tracking-wider"
                      />
                      <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Góc vát HUD + Terminal Cursor</span>
                  <button
                    onClick={() => handlePickStyle('input', 4, 'Cyber HUD Bracket')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.input === 4
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.input === 4 ? '✓ Đã chọn' : 'Chọn Kiểu 4'}
                  </button>
                </div>
              </div>

              {/* KIỂU 5: Minimalist Underline Beam */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2',
                  selectedStyles.input === 5
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-purple-500 text-white">
                      KIỂU 5
                    </span>
                    <span className="text-xs font-bold text-purple-400">Minimalist Bottom Beam</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Thanh gạch đáy thanh thoát, tia sáng chạy mượt mà từ trái sang phải khi kích hoạt.
                  </p>

                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={inputVal5}
                      onChange={(e) => setInputVal5(e.target.value)}
                      placeholder="Ghi chú chiến thuật cho hiệp 2..."
                      className="w-full px-1 py-2 text-sm bg-transparent border-b-2 border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Tối giản thanh mảnh + Gạch đáy</span>
                  <button
                    onClick={() => handlePickStyle('input', 5, 'Minimalist Bottom Beam')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.input === 5
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.input === 5 ? '✓ Đã chọn' : 'Chọn Kiểu 5'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. TYPOGRAPHY & FONT PAIRINGS SHOWCASE (5 KIỂU) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'typography') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                  <span className="material-symbols-outlined text-xl">font_download</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    4. Typography & Font Pairings (5 Cặp Phông Chữ Thể Thao)
                  </h2>
                  <p className="text-xs text-slate-400">
                    So sánh trực tiếp font hiển thị tỷ số, tên cầu thủ, hiệu suất bàn thắng & tiêu đề giải đấu
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Đang chọn: Kiểu {selectedStyles.font}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* FONT KIỂU 1: Modern Tech Athletic */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.font === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Syne + Outfit</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Futuristic Athletic: Hiện đại, thanh thoát, công nghệ cao, góc bo tròn sang trọng.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                    <div className="font-syne text-lg font-extrabold text-white tracking-tight">
                      CHUNG KẾT CÚP C1 2026
                    </div>
                    <div className="font-outfit text-3xl font-black text-emerald-400 flex items-center justify-between">
                      <span>3</span>
                      <span className="text-xs text-slate-500 font-normal">FT</span>
                      <span>2</span>
                    </div>
                    <div className="font-outfit text-xs text-slate-300 flex justify-between">
                      <span>7. Quang Bùi (42', 88')</span>
                      <span>10. Minh Đức (15')</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Head: Syne • Body: Outfit</span>
                  <button
                    onClick={() => handlePickStyle('font', 1, 'Syne + Outfit')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.font === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.font === 1 ? '✓ Đã chọn' : 'Chọn Kiểu 1'}
                  </button>
                </div>
              </div>

              {/* FONT KIỂU 2: High Energy Stadium */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.font === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-blue-400">Chivo + Plus Jakarta</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    High-Energy Stadium: Cơ bắp, dứt khoát, chuẩn giao diện thể thao Châu Âu chuyên nghiệp.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                    <div className="font-chivo text-lg font-black text-white tracking-tight">
                      SAIGON SUNDAY LEAGUE
                    </div>
                    <div className="font-chivo text-3xl font-black text-blue-400 flex items-center justify-between">
                      <span>TÂY BAN NHA</span>
                      <span className="text-amber-400 font-extrabold text-2xl">4 - 1</span>
                    </div>
                    <div className="font-jakarta text-xs text-slate-300 font-medium">
                      Tỷ lệ kiểm soát bóng: <strong className="text-emerald-400">64.8%</strong> • XG: 2.8
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Head: Chivo • Body: Jakarta</span>
                  <button
                    onClick={() => handlePickStyle('font', 2, 'Chivo + Plus Jakarta')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.font === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.font === 2 ? '✓ Đã chọn' : 'Chọn Kiểu 2'}
                  </button>
                </div>
              </div>

              {/* FONT KIỂU 3: Cyber Scoreboard Impact */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.font === 3
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-400">Space Grotesk + Inter</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Scoreboard Tech: Số áo, đồng hồ phút thi đấu điện tử và thông số kỹ thuật sắc nét.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                    <div className="font-space text-base font-bold text-slate-200 tracking-wide">
                      TRẬN ĐẤU ĐANG DIỄN RA
                    </div>
                    <div className="font-space text-3xl font-extrabold text-amber-400 flex items-center gap-2">
                      <span>72:15</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        H2
                      </span>
                    </div>
                    <div className="font-inter text-xs text-slate-400">
                      Hiệu suất chuyền chính xác: <span className="text-white font-bold">92.4%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Head: Space Grotesk • Body: Inter</span>
                  <button
                    onClick={() => handlePickStyle('font', 3, 'Space Grotesk + Inter')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.font === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.font === 3 ? '✓ Đã chọn' : 'Chọn Kiểu 3'}
                  </button>
                </div>
              </div>

              {/* FONT KIỂU 4: Bold Condensed Stadium Headline */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.font === 4
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-rose-500 text-white">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-rose-400">Bebas Neue + DM Sans</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Poster Impact: Số áo to bản 48px, tiêu đề in hoa áp đảo như poster trận Derby đỉnh cao.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-bebas text-2xl text-rose-400 tracking-wider">
                      SUPER DERBY SUNDAY
                    </div>
                    <div className="font-bebas text-5xl text-white tracking-widest flex items-center justify-between">
                      <span>#10</span>
                      <span className="text-2xl text-slate-600">VS</span>
                      <span>#07</span>
                    </div>
                    <div className="font-dm text-xs text-slate-300 font-medium">
                      Sân Chảo Lửa • 19:30 Chủ Nhật
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Head: Bebas Neue • Body: DM Sans</span>
                  <button
                    onClick={() => handlePickStyle('font', 4, 'Bebas Neue + DM Sans')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.font === 4
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.font === 4 ? '✓ Đã chọn' : 'Chọn Kiểu 4'}
                  </button>
                </div>
              </div>

              {/* FONT KIỂU 5: Editorial Football Magazine */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2',
                  selectedStyles.font === 5
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-teal-400 text-slate-950">
                      KIỂU 5
                    </span>
                    <span className="text-xs font-bold text-teal-300">Hanken Grotesk + Inter</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Editorial Magazine: Báo chí thể thao trang nhã, phân tích chiều sâu đội hình, dễ đọc nhất.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-hanken text-lg font-black text-white">
                      Phân tích chiến thuật: Sơ đồ 3-2-1 tạo áp lực tầm cao
                    </div>
                    <div className="font-inter text-xs text-slate-300 leading-relaxed">
                      Đội Đỏ đã tận dụng tốt tốc độ của 2 tiền vệ cánh để kéo giãn cự ly phòng ngự đối phương,
                      tạo 14 cơ hội dứt điểm nguy hiểm trong hiệp 2.
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Head: Hanken Grotesk • Body: Inter</span>
                  <button
                    onClick={() => handlePickStyle('font', 5, 'Hanken Grotesk + Inter')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.font === 5
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.font === 5 ? '✓ Đã chọn' : 'Chọn Kiểu 5'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 5. DROPDOWN & SELECT SECTION (4 KIỂU THIẾT KẾ) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'dropdowns') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30">
                  <span className="material-symbols-outlined text-xl">arrow_drop_down_circle</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    5. Dropdown & Selectors (4 Kiểu Chọn Cầu Thủ / Đội Hình)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bấm vào từng dropdown dưới đây để xem animation mở rộng menu thả xuống
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Đang chọn: Kiểu {selectedStyles.dropdown}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* DROPDOWN KIỂU 1: Floating Glass Panel with Avatars */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative',
                  selectedStyles.dropdown === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                    KIỂU 1
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Glass Panel with Avatars</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Bảng kính mờ hiển thị cầu thủ có avatar, số áo và badge vị trí trực quan.
                </p>

                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen((prev) => ({ ...prev, dd1: !prev.dd1 }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold flex items-center justify-between hover:border-emerald-500 transition-all cursor-pointer shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        7
                      </div>
                      <span>{dropdownSelected}</span>
                    </div>
                    <span
                      className={clsx(
                        'material-symbols-outlined text-base transition-transform',
                        dropdownOpen.dd1 ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                      )}
                    >
                      expand_more
                    </span>
                  </button>

                  {dropdownOpen.dd1 && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl z-30 space-y-1">
                      {[
                        { name: 'Quang Bùi', num: 7, pos: 'Tiền đạo ST', team: 'A' },
                        { name: 'Minh Đức', num: 10, pos: 'Tiền vệ CAM', team: 'A' },
                        { name: 'Tuấn Anh', num: 11, pos: 'Hậu vệ CB', team: 'B' },
                        { name: 'Văn Lâm', num: 1, pos: 'Thủ môn GK', team: 'GK' },
                      ].map((p) => (
                        <button
                          key={p.name}
                          onClick={() => {
                            setDropdownSelected(`${p.name} (${p.pos} #${p.num})`);
                            setDropdownOpen((prev) => ({ ...prev, dd1: false }));
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-emerald-500/20 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold flex items-center justify-center border border-slate-700">
                              {p.num}
                            </span>
                            <span>{p.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {p.pos}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Thẻ cầu thủ chi tiết</span>
                  <button
                    onClick={() => handlePickStyle('dropdown', 1, 'Glass Panel with Avatars')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.dropdown === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.dropdown === 1 ? '✓ Đã chọn' : 'Chọn Kiểu 1'}
                  </button>
                </div>
              </div>

              {/* DROPDOWN KIỂU 2: Pill Radio Segmented */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all relative',
                  selectedStyles.dropdown === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-500 text-white">
                    KIỂU 2
                  </span>
                  <span className="text-xs font-bold text-blue-400">Segmented Pill Switcher</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Dải viên thuốc phân đoạn chọn nhanh Đội A / Đội B / Dự bị mà không cần bấm mở menu.
                </p>

                <div className="p-1 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center gap-1">
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-md flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>Đội Đỏ (A)</span>
                  </button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Đội Xanh (B)</span>
                  </button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Dự Bị</span>
                  </button>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Chọn 1 chạm trực quan</span>
                  <button
                    onClick={() => handlePickStyle('dropdown', 2, 'Segmented Pill Switcher')}
                    className={clsx(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.dropdown === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.dropdown === 2 ? '✓ Đã chọn' : 'Chọn Kiểu 2'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 6. CARDS & CONTAINERS SECTION (4 KIỂU THIẾT KẾ) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'cards') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
                  <span className="material-symbols-outlined text-xl">view_agenda</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    6. Cards & Containers (4 Kiểu Thẻ Trận Đấu / Cầu Thủ)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bento Glass, Thẻ Carbon thể thao, FUT Card FIFA vàng kim & Depth Floating
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Đang chọn: Kiểu {selectedStyles.card}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {/* CARD KIỂU 1: Bento Glass with Neon Border */}
              <div
                className={clsx(
                  'p-5 rounded-3xl border transition-all relative flex flex-col justify-between overflow-hidden group',
                  selectedStyles.card === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/70 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Bento Glass Card</span>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sân Chảo Lửa</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        LIVE 68'
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-y border-slate-800">
                      <div className="text-center">
                        <div className="text-xs font-bold text-rose-400">ĐỘI ĐỎ</div>
                        <div className="text-2xl font-black font-chivo text-white">2</div>
                      </div>
                      <span className="text-xs font-mono text-slate-500">-</span>
                      <div className="text-center">
                        <div className="text-xs font-bold text-blue-400">ĐỘI XANH</div>
                        <div className="text-2xl font-black font-chivo text-white">1</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Bento Modern Pro</span>
                  <button
                    onClick={() => handlePickStyle('card', 1, 'Bento Glass Card')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.card === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.card === 1 ? '✓ Chọn' : 'Chọn 1'}
                  </button>
                </div>
              </div>

              {/* CARD KIỂU 2: Cyber Carbon HUD */}
              <div
                className={clsx(
                  'p-5 rounded-3xl border transition-all relative flex flex-col justify-between bg-carbon',
                  selectedStyles.card === 2
                    ? 'ring-2 ring-emerald-400 border-emerald-500/50'
                    : 'border-slate-800'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-cyan-400">Cyber Carbon HUD</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-xs font-mono">[HUD:ACTIVE]</span>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-500/30">
                      <div className="text-xs font-space font-bold text-slate-300">MVP TRẬN ĐẤU</div>
                      <div className="text-base font-black text-cyan-300">QUANG BÙI #7</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        GOALS: 2 • ASSISTS: 1 • PASS: 94%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Sợi Carbon + HUD</span>
                  <button
                    onClick={() => handlePickStyle('card', 2, 'Cyber Carbon HUD')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.card === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.card === 2 ? '✓ Chọn' : 'Chọn 2'}
                  </button>
                </div>
              </div>

              {/* CARD KIỂU 3: Holographic FUT Gold Card */}
              <div
                className={clsx(
                  'p-5 rounded-3xl border transition-all relative flex flex-col justify-between bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 overflow-hidden',
                  selectedStyles.card === 3
                    ? 'ring-2 ring-emerald-400 border-emerald-500/50'
                    : 'border-amber-500/40'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-300">FUT Card Vàng Kim</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-3xl font-black font-syne text-amber-300">92</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                      ST • TIỀN ĐẠO
                    </div>
                    <div className="text-sm font-extrabold text-white">QUANG BÙI</div>
                    <div className="grid grid-cols-3 gap-1 pt-2 text-[10px] font-bold text-slate-300">
                      <div>TỐC 94</div>
                      <div>SÚT 91</div>
                      <div>RÊ 89</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">FIFA Ultimate Card</span>
                  <button
                    onClick={() => handlePickStyle('card', 3, 'FUT Card Vàng Kim')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.card === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.card === 3 ? '✓ Chọn' : 'Chọn 3'}
                  </button>
                </div>
              </div>

              {/* CARD KIỂU 4: Clean Floating Depth */}
              <div
                className={clsx(
                  'p-5 rounded-3xl border transition-all relative flex flex-col justify-between bg-white text-slate-900 shadow-xl',
                  selectedStyles.card === 4 ? 'ring-2 ring-emerald-400' : 'border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-900 text-white">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-slate-700">Clean Depth Pro</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-1 w-full bg-emerald-500 rounded-full" />
                    <div className="text-xs font-bold text-slate-500">ĐỘI TRƯỞNG TUẦN</div>
                    <div className="text-base font-black text-slate-900">Minh Đức #10</div>
                    <p className="text-[11px] text-slate-600">
                      Chuỗi 5 trận thắng liên tiếp cùng 8 kiến tạo mẫu mực.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Sáng bóng trang nhã</span>
                  <button
                    onClick={() => handlePickStyle('card', 4, 'Clean Depth Pro')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.card === 4
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    )}
                  >
                    {selectedStyles.card === 4 ? '✓ Chọn' : 'Chọn 4'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 7. BADGES, STATUS & LIVE RADARS (4 KIỂU) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'badges') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                  <span className="material-symbols-outlined text-xl">label</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    7. Badges & Live Status (4 Kiểu Huy Hiệu & Radar Sóng)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Hiển thị trạng thái trận đấu "ĐANG DIỄN RA", MVP, Đội trưởng, Thẻ phạt
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Đang chọn: Kiểu {selectedStyles.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {/* BADGE KIỂU 1: Pulsing Live Radar */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.badge === 1
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                      KIỂU 1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Live Radar Wave</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl flex items-center justify-center">
                    <span className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span>TRỰC TIẾP PHÚT 68'</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Sóng radar nhấp nháy</span>
                  <button
                    onClick={() => handlePickStyle('badge', 1, 'Live Radar Wave')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.badge === 1
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.badge === 1 ? '✓ Chọn' : 'Chọn 1'}
                  </button>
                </div>
              </div>

              {/* BADGE KIỂU 2: Cyber Hexagon Angled Tag */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.badge === 2
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500 text-white">
                      KIỂU 2
                    </span>
                    <span className="text-xs font-bold text-cyan-400">Cyber Hexagon Tag</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl flex items-center justify-center">
                    <span className="px-3 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 cyber-cut">
                      <span className="material-symbols-outlined text-sm">military_tech</span>
                      <span>MVP VÒNG 14</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Góc vát công nghệ HUD</span>
                  <button
                    onClick={() => handlePickStyle('badge', 2, 'Cyber Hexagon Tag')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.badge === 2
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.badge === 2 ? '✓ Chọn' : 'Chọn 2'}
                  </button>
                </div>
              </div>

              {/* BADGE KIỂU 3: Glass Pill with Metallic Glow */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.badge === 3
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                      KIỂU 3
                    </span>
                    <span className="text-xs font-bold text-amber-300">Glass Pill Metallic</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl flex items-center justify-center">
                    <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-400 text-sm">military_tech</span>
                      <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent font-extrabold">
                        ĐỘI TRƯỞNG
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Kính mờ chữ ánh kim</span>
                  <button
                    onClick={() => handlePickStyle('badge', 3, 'Glass Pill Metallic')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.badge === 3
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.badge === 3 ? '✓ Chọn' : 'Chọn 3'}
                  </button>
                </div>
              </div>

              {/* BADGE KIỂU 4: High-Contrast Athletic Score */}
              <div
                className={clsx(
                  'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                  selectedStyles.badge === 4
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                    : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
                      KIỂU 4
                    </span>
                    <span className="text-xs font-bold text-rose-400">High-Contrast Score</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl flex items-center justify-center">
                    <span className="inline-flex rounded-lg overflow-hidden border border-slate-700 font-mono text-xs">
                      <span className="bg-rose-600 px-2 py-1 text-white font-bold">A: 2</span>
                      <span className="bg-slate-800 px-2 py-1 text-slate-300">FT</span>
                      <span className="bg-blue-600 px-2 py-1 text-white font-bold">B: 1</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Tương phản cao 2 đội</span>
                  <button
                    onClick={() => handlePickStyle('badge', 4, 'High-Contrast Score')}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      selectedStyles.badge === 4
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    )}
                  >
                    {selectedStyles.badge === 4 ? '✓ Chọn' : 'Chọn 4'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 8. TABS & TOGGLE SWITCHES (4 KIỂU TABS & 4 KIỂU TOGGLES) */}
        {/* ========================================================================= */}
        {(activeCategory === 'all' || activeCategory === 'tabs') && (
          <section
            className={clsx(
              'p-6 sm:p-8 rounded-3xl border transition-all',
              previewTheme === 'dark'
                ? 'bg-[#111A2E]/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700/30 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-900/30">
                  <span className="material-symbols-outlined text-xl">toggle_on</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold font-syne tracking-tight">
                    8. Tabs & Toggle Switches (Thanh Chuyển Đổi & Công Tắc Nút Gạt)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bấm để kiểm tra chuyển động trượt êm ái của Tab và độ nảy của công tắc bóng lăn
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Tabs: Kiểu {selectedStyles.tabs} • Toggles: Kiểu {selectedStyles.toggle}
                </span>
              </div>
            </div>

            {/* TABS COMPARISON */}
            <div className="mt-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                A. Các Phong Cách Tabs (Thanh Chuyển Đổi Danh Mục)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TABS KIỂU 1: Sliding Pill Indicator */}
                <div
                  className={clsx(
                    'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.tabs === 1
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                        TAB KIỂU 1
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Sliding Pill Indicator</span>
                    </div>

                    <div className="p-1.5 bg-slate-950 rounded-2xl border border-slate-800 flex gap-1">
                      {['Đội hình sân 7', 'Thống kê bàn thắng', 'Lịch sử đối đầu'].map((tab, idx) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTabDemo1(idx)}
                          className={clsx(
                            'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer',
                            activeTabDemo1 === idx
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                              : 'text-slate-400 hover:text-white'
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Viên thuốc trượt bóng bẩy</span>
                    <button
                      onClick={() => handlePickStyle('tabs', 1, 'Sliding Pill Indicator')}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        selectedStyles.tabs === 1
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      )}
                    >
                      {selectedStyles.tabs === 1 ? '✓ Chọn' : 'Chọn Kiểu 1'}
                    </button>
                  </div>
                </div>

                {/* TABS KIỂU 2: Neon Underline Glow */}
                <div
                  className={clsx(
                    'p-5 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.tabs === 2
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500 text-white">
                        TAB KIỂU 2
                      </span>
                      <span className="text-xs font-bold text-cyan-400">Neon Underline Glow</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 flex gap-4 border-b">
                      {['TỔNG QUAN', 'ĐỘI A', 'ĐỘI B', 'TRỌNG TÀI'].map((tab, idx) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTabDemo2(idx)}
                          className={clsx(
                            'pb-2 text-xs font-space font-bold uppercase tracking-wider transition-all relative cursor-pointer',
                            activeTabDemo2 === idx
                              ? 'text-cyan-300'
                              : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          {tab}
                          {activeTabDemo2 === idx && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Gạch đáy phát sáng Neon</span>
                    <button
                      onClick={() => handlePickStyle('tabs', 2, 'Neon Underline Glow')}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                        selectedStyles.tabs === 2
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      )}
                    >
                      {selectedStyles.tabs === 2 ? '✓ Chọn' : 'Chọn Kiểu 2'}
                    </button>
                  </div>
                </div>
              </div>

              {/* TOGGLES COMPARISON */}
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pt-4">
                B. Các Phong Cách Toggle Switch (Công Tắc Nút Gạt)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* TOGGLE KIỂU 1: Cyber Neon Glow Toggle */}
                <div
                  className={clsx(
                    'p-4 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.toggle === 1
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400">1. Neon Glow Switch</span>
                    <button
                      type="button"
                      onClick={() => setToggleState1(!toggleState1)}
                      className={clsx(
                        'w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer',
                        toggleState1
                          ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'bg-slate-800 border border-slate-700'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 rounded-full bg-white transition-transform shadow-md',
                          toggleState1 ? 'translate-x-6' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Trạng thái: {toggleState1 ? 'BẬT (Live)' : 'TẮT'}</span>
                  <button
                    onClick={() => handlePickStyle('toggle', 1, 'Neon Glow Switch')}
                    className="mt-3 px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Chọn Kiểu 1
                  </button>
                </div>

                {/* TOGGLE KIỂU 2: Athletic Football Ball Switch */}
                <div
                  className={clsx(
                    'p-4 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.toggle === 2
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">2. Quả Bóng Lăn</span>
                    <button
                      type="button"
                      onClick={() => setToggleState2(!toggleState2)}
                      className={clsx(
                        'w-14 h-7 rounded-full transition-colors relative p-1 cursor-pointer flex items-center',
                        toggleState2
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md'
                          : 'bg-slate-800'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center text-[10px] font-bold transition-transform shadow',
                          toggleState2 ? 'translate-x-7 rotate-180' : 'translate-x-0 rotate-0'
                        )}
                      >
                        <span className="material-symbols-outlined text-[14px]">sports_soccer</span>
                      </div>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Bóng lăn xoay 180° sinh động</span>
                  <button
                    onClick={() => handlePickStyle('toggle', 2, 'Quả Bóng Lăn')}
                    className="mt-3 px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Chọn Kiểu 2
                  </button>
                </div>

                {/* TOGGLE KIỂU 3: 3D Tactile Push Inset */}
                <div
                  className={clsx(
                    'p-4 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.toggle === 3
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400">3. 3D Rãnh Chìm</span>
                    <button
                      type="button"
                      onClick={() => setToggleState3(!toggleState3)}
                      className={clsx(
                        'w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shadow-inner',
                        toggleState3 ? 'bg-blue-600' : 'bg-slate-950 border border-slate-800'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 rounded-full bg-slate-200 transition-transform shadow-md',
                          toggleState3 ? 'translate-x-6' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Nút cơ học đổ bóng rãnh</span>
                  <button
                    onClick={() => handlePickStyle('toggle', 3, '3D Rãnh Chìm')}
                    className="mt-3 px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Chọn Kiểu 3
                  </button>
                </div>

                {/* TOGGLE KIỂU 4: Stadium Checkbox Glow */}
                <div
                  className={clsx(
                    'p-4 rounded-2xl border transition-all flex flex-col justify-between',
                    selectedStyles.toggle === 4
                      ? 'ring-2 ring-emerald-400 bg-emerald-950/20 border-emerald-500/50'
                      : previewTheme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-400">4. Stadium Checkbox</span>
                    <button
                      type="button"
                      onClick={() => setToggleState4(!toggleState4)}
                      className={clsx(
                        'w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer',
                        toggleState4
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] font-bold'
                          : 'bg-slate-950 border border-slate-700'
                      )}
                    >
                      {toggleState4 && <span className="material-symbols-outlined text-sm font-black">check</span>}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Hộp kiểm tích phát quang</span>
                  <button
                    onClick={() => handlePickStyle('toggle', 4, 'Stadium Checkbox')}
                    className="mt-3 px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Chọn Kiểu 4
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SUMMARY CARD & NEXT STEP */}
        {/* ========================================================================= */}
        <div
          className={clsx(
            'p-8 rounded-3xl border relative overflow-hidden transition-all',
            previewTheme === 'dark'
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border-emerald-500/40 shadow-2xl'
              : 'bg-emerald-50/80 border-emerald-200 shadow-xl'
          )}
        >
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Bản tổng hợp các lựa chọn của bạn</span>
            </div>
            <h3 className="text-2xl font-black font-syne text-white tracking-tight mb-4">
              Bạn đã chọn bộ giao diện thể thao hoàn hảo!
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs mb-6">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Button</span>
                <strong className="text-emerald-400 font-bold">Kiểu {selectedStyles.button}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Breadcrumb</span>
                <strong className="text-blue-400 font-bold">Kiểu {selectedStyles.breadcrumb}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Input</span>
                <strong className="text-amber-400 font-bold">Kiểu {selectedStyles.input}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Typography</span>
                <strong className="text-purple-400 font-bold">Kiểu {selectedStyles.font}</strong>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dropdown</span>
                <strong className="text-cyan-400 font-bold">Kiểu {selectedStyles.dropdown}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopySummary}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Sao chép danh sách kiểu đã chọn</span>
              </button>

              <span className="text-xs text-slate-400">
                Hãy chọn các kiểu bạn thích nhất để áp dụng đồng bộ toàn bộ hệ thống!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcasePage;
