import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayerStats, User } from '../types';
import { statsService } from '../services/statsService';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Avatar, Badge, Button, Card } from '../ui';
import { ImageCropModal } from '../components/profile/ImageCropModal';
import { AthleticJerseyCard } from '../components/profile/AthleticJerseyCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<User | null>(null);
  const [statsHistory, setStatsHistory] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'wins' | 'mvp'>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user, isAdmin, updateUser } = useAuthStore();
  const canEditAvatar = Boolean(player && (user?.id === player.id || isAdmin()));

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [playerRes, statsRes] = await Promise.all([
          api.get(`/api/players/${id}`),
          statsService.getPlayerStats(id),
        ]);

        if (playerRes.data?.success) setPlayer(playerRes.data.data);
        if (statsRes.success) setStatsHistory(statsRes.data || []);
      } catch {
        toast.error('Không thể tải thông tin cầu thủ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAvatarFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !player) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 10MB');
      return;
    }

    // Read file as Data URL and open Crop Modal
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!player) return;

    setIsUploadingAvatar(true);
    const toastId = toast.loading('Đang tải ảnh lên Cloudflare R2...');

    try {
      const res = await userService.uploadUserAvatar(player.id, croppedFile);
      if (res.success && res.data) {
        setPlayer(res.data);
        if (user?.id === player.id) {
          updateUser(res.data);
        }
        toast.success('Đã cập nhật ảnh đại diện thành công!', { id: toastId });
        setCropModalOpen(false);
        setSelectedImageSrc(null);
      } else {
        toast.error(res.message || 'Không thể cập nhật ảnh đại diện', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi tải ảnh lên Cloudflare R2', { id: toastId });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCloseCropModal = () => {
    setCropModalOpen(false);
    setSelectedImageSrc(null);
  };

  const handleRemoveAvatar = async () => {
    if (!player) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện này không?')) return;

    setIsUploadingAvatar(true);
    const toastId = toast.loading('Đang xóa ảnh đại diện...');

    try {
      const res = await userService.removeUserAvatar(player.id);
      if (res.success && res.data) {
        setPlayer(res.data);
        if (user?.id === player.id) {
          updateUser(res.data);
        }
        toast.success('Đã xóa ảnh đại diện', { id: toastId });
      } else {
        toast.error(res.message || 'Không thể xóa ảnh đại diện', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa ảnh đại diện', { id: toastId });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-9 h-9 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-space text-slate-500 dark:text-slate-400">Đang tải hồ sơ cầu thủ...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20 font-sans max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <span className="material-symbols-outlined text-3xl">person_off</span>
        </div>
        <h2 className="text-xl font-space font-black text-slate-900 dark:text-white mb-2">
          Không tìm thấy cầu thủ
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-space">
          Cầu thủ này không tồn tại hoặc đã được gỡ khỏi hệ thống ChimMocCanh.
        </p>
        <Link to="/players">
          <Button variant="primary">Quay lại danh sách cầu thủ</Button>
        </Link>
      </div>
    );
  }

  // Aggregate stats
  const totalMatches = statsHistory.length;
  const totalGoals = statsHistory.reduce((acc, s) => acc + (s.goals || 0), 0);
  const totalAssists = statsHistory.reduce((acc, s) => acc + (s.assists || 0), 0);
  const totalSaves = statsHistory.reduce((acc, s) => acc + (s.saves || 0), 0);
  const totalWins = statsHistory.filter((s) => s.isWinner).length;
  const totalLosses = totalMatches - totalWins;
  const totalMvps = statsHistory.filter((s) => s.isMvp).length;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 1000) / 10 : 0;
  const totalContributions = totalGoals + totalAssists;
  const avgContribution = totalMatches > 0 ? (totalContributions / totalMatches).toFixed(1) : '0.0';

  // Recent Form (Last 5 matches)
  const recentForm = [...statsHistory].slice(0, 5);

  // Filtered matches for history table
  const filteredMatches = statsHistory.filter((m) => {
    if (activeTab === 'wins') return m.isWinner;
    if (activeTab === 'mvp') return m.isMvp;
    return true;
  });

  const memberJoinedDate = player.createdAt
    ? new Date(player.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Thành viên sáng lập';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans pb-10">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMB NAVIGATION                                                  */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between text-xs font-space text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/players" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">groups</span>
            <span>Cầu thủ & Đội hình</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[200px]">
            {player.fullName}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hệ thống ChimMocCanh FC</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO PROFILE HEADER CARD                                               */}
      {/* ========================================================================= */}
      <Card
        elevation="glass"
        className="relative overflow-hidden p-6 sm:p-8 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 shadow-sm"
      >
        {/* Subtle decorative background beam */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 z-10">
          {/* Avatar and Identity Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1 min-w-0">
            {/* Avatar Container: showNumber is FALSE to avoid overlap with camera button */}
            <div className="relative flex-shrink-0">
              <Avatar
                name={player.fullName}
                src={player.avatarUrl}
                size="xl"
                showNumber={false}
              />

              {/* Camera Upload Button Overlay */}
              {canEditAvatar && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarFileSelected}
                  />
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                    title="Thay đổi ảnh đại diện (Lưu trữ Cloudflare R2)"
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border-2 border-white dark:border-slate-900 transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                    aria-label="Tải ảnh lên"
                  >
                    <span className="material-symbols-outlined text-base leading-none">
                      {isUploadingAvatar ? 'hourglass_top' : 'photo_camera'}
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Profile Identity Details (No '#jerseyNumber' here to avoid clutter) */}
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                  {player.fullName}
                </h1>
                <Badge variant={player.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                  {player.role === 'ADMIN' ? 'Ban Quản Trị' : 'Cầu thủ'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs font-space text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-medium">@{player.username}</span>
                {player.email && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[220px]">{player.email}</span>
                  </>
                )}
              </div>

              {/* Status and Attributes Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-space font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sẵn sàng thi đấu</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 text-xs font-space font-medium">
                  <span className="material-symbols-outlined text-sm text-slate-400">sports_soccer</span>
                  <span>Thể thức 7v7</span>
                </div>

                {totalMvps > 0 && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-space font-bold">
                    <span className="material-symbols-outlined text-sm text-amber-500">trophy</span>
                    <span>{totalMvps} lần MVP</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Avatar Management & Profile Edit */}
          {canEditAvatar && (
            <div className="flex items-center gap-2 self-center md:self-start flex-shrink-0 flex-wrap justify-center sm:justify-start">
              <Button
                variant="primary"
                size="sm"
                leftIcon="edit"
                onClick={() => setEditProfileModalOpen(true)}
                className="text-xs"
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon="upload"
                isLoading={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                Đổi ảnh đại diện
              </Button>
              {player.avatarUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon="delete"
                  isLoading={isUploadingAvatar}
                  onClick={handleRemoveAvatar}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Xóa ảnh
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN BENTO SECTION (Addresses Empty Space & Dedicated Jersey)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Dedicated Jersey Kit Card & Athletic Dossier (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* DEDICATED ATHLETIC FOOTBALL KIT & NUMBER CARD */}
          <AthleticJerseyCard player={player} />

          {/* CLUB & ATHLETE DOSSIER CARD */}
          <Card
            elevation="level1"
            className="p-5 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-emerald-500 text-lg">badge</span>
              <span className="text-xs font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Thông Tin Cầu Thủ CLB
              </span>
            </div>

            <div className="space-y-3 font-space text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Câu lạc bộ</span>
                <span className="font-bold text-slate-900 dark:text-white">ChimMocCanh FC</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Thể thức sở trường</span>
                <span className="font-bold text-slate-900 dark:text-white">Bóng đá mini 7v7</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Vị trí sở trường</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {player.favoritePosition || 'Chưa cập nhật'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Ngày gia nhập CLB</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {memberJoinedDate}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Trạng thái tài khoản</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {player.status === 'ACTIVE' ? 'Đang hoạt động' : player.status}
                </span>
              </div>

              {/* Recent 5 matches form */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Phong độ gần đây:</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {recentForm.length > 0 ? `${recentForm.length} trận gần nhất` : 'Chưa có dữ liệu'}
                  </span>
                </div>

                {recentForm.length > 0 ? (
                  <div className="flex items-center gap-1.5">
                    {recentForm.map((stat, idx) => (
                      <span
                        key={stat.id || idx}
                        title={stat.isWinner ? 'Thắng' : 'Thất bại'}
                        className={clsx(
                          'w-6 h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center transition-transform hover:scale-110 select-none',
                          stat.isWinner
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                        )}
                      >
                        {stat.isWinner ? 'W' : 'L'}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    Chưa thi đấu trận chính thức nào
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* GOAL CONTRIBUTION SUMMARY CARD */}
          <Card
            elevation="level1"
            className="p-5 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Đóng Góp Bàn Thắng (G+A)
              </span>
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {avgContribution} / trận
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-mono font-black text-3xl text-slate-900 dark:text-white">
                {totalContributions}
              </span>
              <span className="text-xs text-slate-500 font-space">
                tổng ({totalGoals} bàn + {totalAssists} kiến tạo)
              </span>
            </div>

            {/* Simple visual bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{
                  width: totalContributions > 0 ? `${(totalGoals / totalContributions) * 100}%` : '50%',
                }}
                title={`Bàn thắng: ${totalGoals}`}
              />
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{
                  width: totalContributions > 0 ? `${(totalAssists / totalContributions) * 100}%` : '50%',
                }}
                title={`Kiến tạo: ${totalAssists}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-space text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Bàn thắng ({totalGoals})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Kiến tạo ({totalAssists})</span>
              </span>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Performance Bento & Match History Log (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 4 CORE ATHLETIC METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Matches */}
            <Card
              elevation="level1"
              className="p-4 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 text-center shadow-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-base">sports_soccer</span>
              </div>
              <span className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Trận Đấu
              </span>
              <span className="font-mono font-black text-2xl text-slate-900 dark:text-white mt-1 block">
                {totalMatches}
              </span>
              <span className="text-[10px] font-space text-slate-400 mt-0.5 block">
                {totalWins} thắng • {totalLosses} thua
              </span>
            </Card>

            {/* Goals */}
            <Card
              elevation="level1"
              className="p-4 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 text-center shadow-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-base">sports</span>
              </div>
              <span className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Bàn Thắng
              </span>
              <span className="font-mono font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1 block">
                {totalGoals}
              </span>
              <span className="text-[10px] font-space text-slate-400 mt-0.5 block">
                {totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : 0} bàn / trận
              </span>
            </Card>

            {/* Assists */}
            <Card
              elevation="level1"
              className="p-4 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 text-center shadow-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-base">handshake</span>
              </div>
              <span className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Kiến Tạo
              </span>
              <span className="font-mono font-black text-2xl text-blue-600 dark:text-blue-400 mt-1 block">
                {totalAssists}
              </span>
              <span className="text-[10px] font-space text-slate-400 mt-0.5 block">
                {totalMatches > 0 ? (totalAssists / totalMatches).toFixed(1) : 0} kiến tạo / trận
              </span>
            </Card>

            {/* Win Rate */}
            <Card
              elevation="level1"
              className="p-4 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 text-center shadow-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-base">trophy</span>
              </div>
              <span className="text-[11px] font-space font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Tỉ Lệ Thắng
              </span>
              <span className="font-mono font-black text-2xl text-amber-600 dark:text-amber-400 mt-1 block">
                {winRate}%
              </span>
              <span className="text-[10px] font-space text-slate-400 mt-0.5 block">
                {totalWins} trận thắng
              </span>
            </Card>
          </div>

          {/* DETAILED MATCH HISTORY CARD WITH TABS */}
          <Card
            elevation="level1"
            className="p-5 bg-white dark:bg-[#111A2E] border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex-1"
          >
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-space font-black text-base text-slate-900 dark:text-white">
                  Lịch Sử Thi Đấu
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-space mt-0.5">
                  Thành tích các trận đấu đã hoàn thành ({statsHistory.length} trận)
                </p>
              </div>

              {/* Tab Filters */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-space font-bold transition-all cursor-pointer',
                    activeTab === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  Tất cả ({statsHistory.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('wins')}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-space font-bold transition-all cursor-pointer',
                    activeTab === 'wins'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  Thắng ({totalWins})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mvp')}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs font-space font-bold transition-all cursor-pointer',
                    activeTab === 'mvp'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  MVP ({totalMvps})
                </button>
              </div>
            </div>

            {/* Match Table or Empty State */}
            {filteredMatches.length === 0 ? (
              <div className="py-12 text-center font-space">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-2xl">event_busy</span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeTab === 'wins'
                    ? 'Chưa có chiến thắng nào được ghi nhận'
                    : activeTab === 'mvp'
                    ? 'Chưa có danh hiệu MVP nào được ghi nhận'
                    : 'Chưa có dữ liệu thống kê trận đấu nào'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dữ liệu sẽ tự động cập nhật sau khi ban tổ chức kết thúc trận đấu.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left text-xs font-space">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Đội hình</th>
                      <th className="py-2.5 px-2 text-center">Bàn</th>
                      <th className="py-2.5 px-2 text-center">Kiến tạo</th>
                      <th className="py-2.5 px-3 text-center">Kết quả</th>
                      <th className="py-2.5 px-3 text-center">Danh hiệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredMatches.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {s.enteredAt
                            ? new Date(s.enteredAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                              })
                            : 'Gần đây'}
                        </td>
                        <td className="py-3 px-3 font-bold whitespace-nowrap">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px]',
                              s.team === 'A'
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            )}
                          >
                            <span>{s.team === 'A' ? 'Đội A (Áo Pháp)' : 'Đội B (Áo TBN)'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {s.goals > 0 ? (
                            <span className="inline-flex items-center gap-0.5">
                              <span>{s.goals}</span>
                              <span className="material-symbols-outlined text-xs">sports_soccer</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                          {s.assists > 0 ? s.assists : <span className="text-slate-400">0</span>}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
                              s.isWinner
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                            )}
                          >
                            {s.isWinner ? 'Chiến thắng' : 'Thất bại'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {s.isMvp ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              <span className="material-symbols-outlined text-xs">star</span>
                              <span>MVP</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Interactive Image Crop Modal for Avatar */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={selectedImageSrc}
        onClose={handleCloseCropModal}
        onCropComplete={handleCropComplete}
        isUploading={isUploadingAvatar}
      />

      {/* Edit Profile & Password Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        user={player}
        onClose={() => setEditProfileModalOpen(false)}
        onSuccess={(updated) => {
          setPlayer(updated);
          if (user?.id === updated.id) {
            updateUser(updated);
          }
        }}
      />
    </div>
  );
};

export default PlayerProfilePage;
