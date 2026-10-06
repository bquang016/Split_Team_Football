import React from 'react';
import { User } from '../../types';
import { Avatar, Button, Card } from '../../ui';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';

interface CaptainFaceOffProps {
  hostA?: User | null;
  hostB?: User | null;
  winner?: User | null;
  isAdmin: boolean;
  isSpinning: boolean;
  onStartSpin: () => void;
}

export const CaptainFaceOff: React.FC<CaptainFaceOffProps> = ({
  hostA,
  hostB,
  winner,
  isAdmin,
  isSpinning,
  onStartSpin,
}) => {
  return (
    <Card elevation="level1" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-amber-600 tracking-wider">
            Đối đầu Đội trưởng
          </span>
          <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
            Vòng quay chọn quyền ưu tiên
          </h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold">
          Quy tắc: Thắng chọn trước
        </span>
      </div>

      {/* Face off columns */}
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Host A */}
        <div
          className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
            winner?.id === hostA?.id
              ? 'bg-red-50 border-red-300 shadow-md ring-2 ring-red-500/20'
              : 'bg-slate-50/80 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full border border-red-400/40" style={{ backgroundColor: TEAM_A_COLOR }} />
            <span className="text-xs font-mono font-bold uppercase text-red-600">
              {TEAM_A_NAME} (Đỏ)
            </span>
          </div>
          {hostA ? (
            <>
              <Avatar name={hostA.fullName} src={hostA.avatarUrl} jerseyNumber={hostA.jerseyNumber} size="lg" showNumber bgColor="#DC2626" />
              <div className="font-heading font-black text-slate-900 mt-2.5 line-clamp-1 text-base">{hostA.fullName}</div>
              <span className="text-xs text-red-600 font-mono font-bold mt-0.5">Đội trưởng A</span>
            </>
          ) : (
            <div className="h-24 flex items-center justify-center text-xs text-slate-400 italic">
              Chưa chọn đội trưởng
            </div>
          )}
          {winner?.id === hostA?.id && (
            <span className="mt-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs uppercase shadow-md">
              Thắng quay - Chọn trước
            </span>
          )}
        </div>

        {/* Host B */}
        <div
          className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
            winner?.id === hostB?.id
              ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-500/20'
              : 'bg-slate-50/80 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full border border-blue-400/40" style={{ backgroundColor: TEAM_B_COLOR }} />
            <span className="text-xs font-mono font-bold uppercase text-blue-600">
              {TEAM_B_NAME} (Xanh)
            </span>
          </div>
          {hostB ? (
            <>
              <Avatar name={hostB.fullName} src={hostB.avatarUrl} jerseyNumber={hostB.jerseyNumber} size="lg" showNumber bgColor="#2563EB" />
              <div className="font-heading font-black text-slate-900 mt-2.5 line-clamp-1 text-base">{hostB.fullName}</div>
              <span className="text-xs text-blue-600 font-mono font-bold mt-0.5">Đội trưởng B</span>
            </>
          ) : (
            <div className="h-24 flex items-center justify-center text-xs text-slate-400 italic">
              Chưa chọn đội trưởng
            </div>
          )}
          {winner?.id === hostB?.id && (
            <span className="mt-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs uppercase shadow-md">
              Thắng quay - Chọn trước
            </span>
          )}
        </div>
      </div>

      {/* Admin action button */}
      {isAdmin && !winner && hostA && hostB && (
        <div className="flex justify-center mt-2">
          <Button
            size="lg"
            variant="primary"
            isLoading={isSpinning}
            onClick={onStartSpin}
            leftIcon="casino"
            className="w-full sm:w-auto px-8"
          >
            {isSpinning ? 'Đang quay bánh xe...' : 'Quay bánh xe ngay'}
          </Button>
        </div>
      )}
    </Card>
  );
};
