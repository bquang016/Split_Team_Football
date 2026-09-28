import React, { useState } from 'react';
import { Button, Input, Modal } from '../../ui';
import { matchService } from '../../services/matchService';
import toast from 'react-hot-toast';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('19:00');
  const [location, setLocation] = useState('Sân cố định');
  const [notes, setNotes] = useState('');
  const [isPastMatchMode, setIsPastMatchMode] = useState(false);
  const [scoreTeamA, setScoreTeamA] = useState(0);
  const [scoreTeamB, setScoreTeamB] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (dateVal: string) => {
    setMatchDate(dateVal);
    if (dateVal) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateVal < todayStr) {
        setIsPastMatchMode(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchDate) {
      toast.error('Vui lòng chọn ngày thi đấu');
      return;
    }

    setLoading(true);
    try {
      const res = await matchService.createMatch({
        title: title || undefined,
        matchDate,
        matchTime: matchTime || undefined,
        location: location || 'Sân cố định',
        notes: notes || undefined,
        initialStatus: isPastMatchMode ? 'COMPLETED' : 'PENDING',
        initialScoreTeamA: isPastMatchMode ? Number(scoreTeamA) : 0,
        initialScoreTeamB: isPastMatchMode ? Number(scoreTeamB) : 0,
      });

      if (res.success) {
        toast.success(
          isPastMatchMode
            ? 'Đã ghi nhận trận đấu trong quá khứ thành công!'
            : 'Tạo trận đấu mới thành công!'
        );
        setTitle('');
        setMatchDate('');
        setNotes('');
        setIsPastMatchMode(false);
        setScoreTeamA(0);
        setScoreTeamB(0);
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Không thể tạo trận đấu');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo hoặc Ghi nhận Trận Đấu">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-slate-900 dark:text-slate-100">
        {/* Match Type Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsPastMatchMode(false)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-space font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isPastMatchMode
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Lên lịch trận mới (Điểm danh)
          </button>
          <button
            type="button"
            onClick={() => setIsPastMatchMode(true)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-space font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isPastMatchMode
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">emoji_events</span>
            Nhập trận cũ đã đá xong
          </button>
        </div>

        <Input
          label="Tiêu đề trận đấu (tùy chọn)"
          placeholder="VD: Trận giao hữu tuần 38"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ngày đá *"
            type="date"
            required
            value={matchDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <Input
            label="Giờ đá"
            type="time"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
          />
        </div>

        {/* Initial Score Input if Past Match */}
        {isPastMatchMode && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
            <span className="text-xs font-space font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">sports_score</span>
              Nhập tỉ số kết quả trận đấu:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-space font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Đội A (Tây Ban Nha)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-space font-bold text-rose-600 text-base"
                  value={scoreTeamA}
                  onChange={(e) => setScoreTeamA(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-[11px] font-space font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Đội B (Pháp)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-space font-bold text-blue-600 text-base"
                  value={scoreTeamB}
                  onChange={(e) => setScoreTeamB(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-space mt-1">
              Trận đấu sẽ được tạo trực tiếp ở trạng thái <strong>Đã kết thúc (COMPLETED)</strong> và lưu vào Lịch sử đấu.
            </p>
          </div>
        )}

        <Input
          label="Địa điểm"
          placeholder="Sân cố định"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Ghi chú
          </label>
          <textarea
            rows={2}
            className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
            placeholder="Quy định mang áo, tiền sân, v.v..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} leftIcon="add">
            {isPastMatchMode ? 'Ghi nhận trận cũ' : 'Tạo trận đấu'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
