import React from 'react';
import teamPhoto from '@/assets/anh_nen/43483f05-dcf3-42d1-b43f-1332abdcad91.jpg';

interface AuthVisualSideProps {
  mode?: 'desktop' | 'mobile';
}

export const AuthVisualSide: React.FC<AuthVisualSideProps> = ({ mode = 'desktop' }) => {
  if (mode === 'mobile') {
    return (
      <div className="w-full rounded-2xl overflow-hidden relative border border-white/15 shadow-xl aspect-[4/3] mb-6 group select-none">
        {/* Natural brightness photo in full 4:3 landscape ratio */}
        <img
          src={teamPhoto}
          alt="Tập thể Chim Mọc Cánh FC"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Lớp phủ mờ dần từ trên xuống dưới giúp chữ không bị chìm vào ảnh (không khung hộp) */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

        {/* Nội dung châm ngôn ở trên cùng, không viền khung hộp */}
        <div className="relative z-10 p-3.5 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-sans text-white/90 drop-shadow">
              Chim Mọc Cánh FC • 2025 – 2026
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-base shrink-0 mt-0.5 drop-shadow">
              format_quote
            </span>
            <div>
              <p className="text-white font-heading font-bold text-xs leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                "Bóng đá không chỉ là những bàn thắng, mà là sự gắn kết và tinh thần anh em qua từng trận đấu."
              </p>
              <p className="text-[10px] text-slate-300 font-sans mt-0.5 drop-shadow">
                Câu lạc bộ Chim Mọc Cánh
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-[28px] overflow-hidden w-full aspect-[4/3] border border-white/15 shadow-2xl group select-none">
      {/* 4:3 Landscape Photo - Natural brightness */}
      <img
        src={teamPhoto}
        alt="Tập thể Chim Mọc Cánh FC"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
      />

      {/* Lớp phủ mờ dần từ trên xuống dưới giúp chữ không bị chìm vào ảnh (không khung viền liquid) */}
      <div className="absolute top-0 inset-x-0 h-48 sm:h-56 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

      {/* Nội dung châm ngôn ở trên cùng */}
      <div className="relative z-10 p-6 sm:p-7">
        {/* Top Header Tag */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-sans text-white/90 tracking-wide drop-shadow">
            Chim Mọc Cánh FC • Mùa giải 2025 – 2026
          </span>
        </div>

        {/* Châm ngôn hiển thị trực tiếp trên lớp phủ mờ mềm mại */}
        <div className="flex items-start gap-3 max-w-xl">
          <span className="material-symbols-outlined text-emerald-400 text-2xl sm:text-3xl shrink-0 mt-0.5 drop-shadow">
            format_quote
          </span>
          <div>
            <p className="text-white font-heading font-bold text-sm sm:text-base leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              "Bóng đá không chỉ là những bàn thắng, mà là sự gắn kết và tinh thần anh em qua từng trận đấu."
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-4 h-[1.5px] bg-emerald-400/80 rounded-full" />
              <p className="text-xs text-slate-300 font-sans tracking-wide drop-shadow">
                Tập thể câu lạc bộ Chim Mọc Cánh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
