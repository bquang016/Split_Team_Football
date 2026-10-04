import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas-pro';
import toast from 'react-hot-toast';
import { Match, MatchLineup, MatchParticipant, Team } from '../../types';
import { MatchdayPoster, PosterRatio, PosterTheme } from './MatchdayPoster';
import { Button } from '../../ui';

interface LineupPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  activeTeam: Team;
  teamLabel: string;
  lineups: MatchLineup[];
  benchPlayers: MatchParticipant[];
  formationName?: string;
}

export const LineupPosterModal: React.FC<LineupPosterModalProps> = ({
  isOpen,
  onClose,
  match,
  activeTeam,
  teamLabel,
  lineups,
  benchPlayers,
  formationName,
}) => {
  const [theme, setTheme] = useState<PosterTheme>('emerald');
  const [ratio, setRatio] = useState<PosterRatio>('4:5');
  const [showBench, setShowBench] = useState(true);
  const [showMatchInfo, setShowMatchInfo] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const posterContainerRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const baseWidth = ratio === '16:9' ? 1920 : 1080;
  const baseHeight = ratio === '16:9' ? 1080 : ratio === '1:1' ? 1080 : 1350;
  const scale = ratio === '16:9' ? 0.32 : ratio === '1:1' ? 0.4 : 0.37;
  const scaledWidth = Math.round(baseWidth * scale);
  const scaledHeight = Math.round(baseHeight * scale);

  const isLightTheme = theme === 'daylight' || theme === 'minimal-light';

  const generateCanvas = async () => {
    const element = document.getElementById('matchday-poster-render-target');
    if (!element) {
      throw new Error('Poster element not found in DOM');
    }

    return await html2canvas(element, {
      scale: 2, // High-res 2K
      useCORS: true,
      backgroundColor: isLightTheme ? '#F8FAFC' : '#050814',
      logging: false,
      onclone: (clonedDoc) => {
        const target = clonedDoc.getElementById('matchday-poster-render-target');
        if (target) {
          // Remove all transform, scale, margin and overflow constraints on ancestors
          let p = target.parentElement;
          while (p && p !== clonedDoc.body) {
            p.style.transform = 'none';
            p.style.scale = 'none';
            p.style.width = 'auto';
            p.style.height = 'auto';
            p.style.overflow = 'visible';
            p.style.margin = '0';
            p.style.padding = '0';
            p = p.parentElement;
          }
          clonedDoc.body.style.width = `${baseWidth}px`;
          clonedDoc.body.style.overflow = 'visible';
        }
      },
    });
  };

  const handleDownload = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Đang khởi tạo poster đồ họa chất lượng cao (2K)...');

    try {
      const canvas = await generateCanvas();
      const dataUrl = canvas.toDataURL('image/png');

      const safeTitle = `${match.title || 'match'}-${teamLabel}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');

      const link = document.createElement('a');
      link.download = `${safeTitle}-matchday-squad-${ratio.replace(':', 'x')}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Đã tải poster đội hình trận đấu thành công!', { id: toastId });
    } catch (err) {
      console.error('Lỗi xuất poster:', err);
      toast.error('Có lỗi xảy ra khi tạo poster', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      toast.error('Trình duyệt không hỗ trợ sao chép ảnh trực tiếp. Vui lòng chọn Tải ảnh!');
      return;
    }

    setIsCopying(true);
    const toastId = toast.loading('Đang sao chép ảnh poster...');

    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Không thể tạo định dạng ảnh để sao chép', { id: toastId });
          setIsCopying(false);
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          toast.success(
            'Đã sao chép poster vào clipboard! Bạn có thể nhấn Ctrl+V để dán ngay vào Zalo/Messenger.',
            { id: toastId, duration: 4000 }
          );
        } catch {
          toast.error('Không thể sao chép vào bộ nhớ tạm. Hãy dùng nút Tải ảnh!', {
            id: toastId,
          });
        } finally {
          setIsCopying(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Lỗi copy poster:', err);
      toast.error('Có lỗi xảy ra khi sao chép poster', { id: toastId });
      setIsCopying(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden font-space my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">palette</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Xuất Poster Đồ Họa Đội Hình</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 uppercase">
                  Matchday Graphic
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tùy chỉnh phong cách đồ họa, tỷ lệ khung hình và xuất ảnh chất lượng cao để chia sẻ lên mạng xã hội / nhóm Zalo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body: Two columns (Left: Preview, Right: Settings) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0">
          {/* LEFT: LIVE PREVIEW AREA */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-950/90 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Xem trước đồ họa ({ratio} • {theme.toUpperCase()})
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Render 2K Ultra HD Lossless
              </span>
            </div>

            {/* Poster Preview Container with clean scaled box */}
            <div
              ref={posterContainerRef}
              className="w-full flex items-center justify-center p-3 rounded-2xl bg-black/60 border border-slate-800 shadow-inner overflow-auto max-h-[66vh]"
            >
              <div
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                className="shrink-0 transition-all duration-300"
              >
                <div
                  style={{
                    width: `${baseWidth}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <MatchdayPoster
                    match={match}
                    activeTeam={activeTeam}
                    teamLabel={teamLabel}
                    lineups={lineups}
                    benchPlayers={benchPlayers}
                    formationName={formationName}
                    theme={theme}
                    ratio={ratio}
                    showBench={showBench}
                    showMatchInfo={showMatchInfo}
                    id="matchday-poster-render-target"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS & EXPORT ACTIONS */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between gap-5 bg-slate-900 overflow-y-auto">
            <div className="flex flex-col gap-5">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-base">
                    aspect_ratio
                  </span>
                  <span>Tỉ lệ khung hình</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRatio('4:5')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      ratio === '4:5'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">
                      crop_portrait
                    </span>
                    <span className="text-xs font-bold">4:5 Đứng</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Zalo / Facebook
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRatio('16:9')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      ratio === '16:9'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">
                      crop_16_9
                    </span>
                    <span className="text-xs font-bold">16:9 Ngang</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      TV / Máy tính
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRatio('1:1')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      ratio === '1:1'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">
                      crop_square
                    </span>
                    <span className="text-xs font-bold">1:1 Vuông</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Feed / Bảng tin
                    </span>
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-base">
                    palette
                  </span>
                  <span>Chủ đề đồ họa</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('emerald')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      theme === 'emerald'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 border border-emerald-400/40 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Emerald Stadium</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Sân cỏ truyền thống, thảm cỏ sọc chân thực và ánh đèn đêm
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('daylight')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      theme === 'daylight'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 border border-emerald-300/60 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Daylight Stadium</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono border border-amber-400/30 uppercase">
                          Sáng
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Sân vận động ban ngày, cỏ xanh tươi sáng, nền trắng thanh lịch
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('minimal-light')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      theme === 'minimal-light'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-400 shrink-0 flex items-center justify-center text-slate-800">
                      <span className="material-symbols-outlined text-sm">wb_sunny</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Classic White</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-400/20 text-blue-300 text-[9px] font-mono border border-blue-400/30 uppercase">
                          Tối giản
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Phong cách tối giản nền trắng sạch sẽ, viền sắc nét hiện đại
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('midnight')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      theme === 'midnight'
                        ? 'bg-sky-500/15 border-sky-500 text-white'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-600 to-slate-900 border border-sky-400/40 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Midnight Cyber</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Phong cách Champions League đêm, line cyan neon đẳng cấp
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('carbon')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      theme === 'carbon'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-800/60 border-slate-750 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-neutral-900 border border-amber-400/40 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Carbon Stealth</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Tông đen carbon kết hợp line vàng gold sang trọng, tối giản
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-base">
                    tune
                  </span>
                  <span>Nội dung hiển thị</span>
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                    <span className="text-xs text-slate-200 font-bold">
                      Hiển thị danh sách dự bị (Reserves)
                    </span>
                    <input
                      type="checkbox"
                      checked={showBench}
                      onChange={(e) => setShowBench(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                    <span className="text-xs text-slate-200 font-bold">
                      Hiển thị thông tin sân & thời gian thi đấu
                    </span>
                    <input
                      type="checkbox"
                      checked={showMatchInfo}
                      onChange={(e) => setShowMatchInfo(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (STICKY) */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md flex flex-col gap-2.5 pt-3 pb-1 border-t border-slate-800 z-10">
              <Button
                variant="primary"
                size="lg"
                leftIcon="download"
                isLoading={isExporting}
                onClick={handleDownload}
                className="w-full font-space font-bold shadow-lg shadow-emerald-500/20"
              >
                Tải Poster PNG (2K Ultra HD)
              </Button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={isCopying}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold font-space transition-all cursor-pointer disabled:opacity-50"
              >
                {isCopying ? (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-base text-amber-400">
                    content_copy
                  </span>
                )}
                <span>Sao chép ảnh vào Clipboard (Dán Zalo/FB)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
