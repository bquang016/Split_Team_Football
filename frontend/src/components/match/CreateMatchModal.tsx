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
  const [loading, setLoading] = useState(false);

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
      });

      if (res.success) {
        toast.success('Tạo trận đấu mới thành công!');
        setTitle('');
        setMatchDate('');
        setNotes('');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo trận đấu mới">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            onChange={(e) => setMatchDate(e.target.value)}
          />
          <Input
            label="Giờ đá"
            type="time"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
          />
        </div>

        <Input
          label="Địa điểm"
          placeholder="Sân cố định"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Ghi chú
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl bg-white border border-slate-300 p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-sans"
            placeholder="Quy định mang áo, tiền sân, v.v..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} leftIcon="add">
            Tạo trận đấu
          </Button>
        </div>
      </form>
    </Modal>
  );
};
