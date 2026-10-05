import React, { useState } from 'react';
import { Match, JerseyTeam } from '../../types';
import { Card, Button, Badge } from '../../ui';
import { matchService } from '../../services/matchService';
import toast from 'react-hot-toast';
import spainJerseyImg from '../../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../../assets/ao_dau/phap.webp';

interface JerseySelectionStepProps {
  match: Match;
  canSelect: boolean;
  onJerseySelected: () => void;
}

export const JerseySelectionStep: React.FC<JerseySelectionStepProps> = ({
  match,
  canSelect,
  onJerseySelected,
}) => {
  const [selectedJersey, setSelectedJersey] = useState<JerseyTeam>('SPAIN');
  const [submitting, setSubmitting] = useState(false);

  const winner = match.spinSession?.winner;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await matchService.selectJersey(match.id, selectedJersey);
      if (res.success) {
        toast.success(`Đã chọn áo ${selectedJersey === 'SPAIN' ? 'Tây Ban Nha' : 'Pháp'}!`);
        onJerseySelected();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể chọn áo đấu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card elevation="glass" glow className="max-w-3xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center text-center gap-6">
        {/* Header */}
        <div>
          <Badge variant="gold" size="md" dot>
            Bước 2: Chọn Áo Đấu
          </Badge>
          <h2 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-3 tracking-tight">
            Lựa Chọn Trang Phục Thi Đấu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
            {winner ? (
              <>
                Đội trưởng <strong className="text-amber-600 dark:text-amber-400 font-bold">{winner.fullName}</strong> đã thắng vòng quay và có quyền ưu tiên chọn áo đấu trước.
              </>
            ) : (
              'Đội trưởng thắng vòng quay sẽ được chọn áo đấu cho đội của mình.'
            )}
          </p>
        </div>

        {/* Jersey Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
          {/* Spain Option */}
          <div
            onClick={() => canSelect && setSelectedJersey('SPAIN')}
            className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedJersey === 'SPAIN'
                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/10 scale-105'
                : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300'
            } ${!canSelect ? 'cursor-default opacity-80' : ''}`}
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-rose-500/10 border border-rose-500/20 shadow-md flex items-center justify-center p-2 mb-4 relative">
              <img
                src={spainJerseyImg}
                alt="Áo đấu Tây Ban Nha"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.35)]"
              />
            </div>
            <h3 className="font-space font-bold text-lg text-slate-900 dark:text-white">
              Tây Ban Nha
            </h3>
            <span className="text-xs font-space font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Bộ áo thi đấu Tây Ban Nha
            </span>
          </div>

          {/* France Option */}
          <div
            onClick={() => canSelect && setSelectedJersey('FRANCE')}
            className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedJersey === 'FRANCE'
                ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 shadow-lg shadow-blue-500/10 scale-105'
                : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300'
            } ${!canSelect ? 'cursor-default opacity-80' : ''}`}
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-700/10 to-indigo-500/10 border border-blue-500/20 shadow-md flex items-center justify-center p-2 mb-4 relative">
              <img
                src={franceJerseyImg}
                alt="Áo đấu Pháp"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)]"
              />
            </div>
            <h3 className="font-space font-bold text-lg text-slate-900 dark:text-white">
              Pháp
            </h3>
            <span className="text-xs font-space font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Bộ áo thi đấu Pháp
            </span>
          </div>
        </div>

        {/* Action button */}
        {canSelect ? (
          <div className="flex flex-col items-center gap-2 pt-2">
            <Button
              size="lg"
              variant="primary"
              isLoading={submitting}
              onClick={handleConfirm}
              rightIcon="arrow_forward"
            >
              Xác nhận chọn áo & Chuyển sang Pick quân
            </Button>
            <span className="text-xs text-slate-500 font-space">
              Đội còn lại sẽ tự động nhận màu áo đối diện
            </span>
          </div>
        ) : (
          <div className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-space flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Đang đợi đội trưởng {winner?.fullName || 'thắng spin'} chọn áo đấu...</span>
          </div>
        )}
      </div>
    </Card>
  );
};
