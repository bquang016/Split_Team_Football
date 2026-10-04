import React, { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import toast from 'react-hot-toast';
import { Button } from '../../ui';

interface LineupExportProps {
  matchTitle?: string;
  teamLabel?: string;
  targetElementId?: string;
  variant?: 'primary' | 'secondary' | 'surface' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const LineupExport: React.FC<LineupExportProps> = ({
  matchTitle = 'so-do-doi-hinh',
  teamLabel = 'doi-hinh',
  targetElementId = 'tactical-board-export-container',
  variant = 'surface',
  size = 'sm',
  className,
  onClick,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    // Look for tactical board container, fallback to pitch canvas
    let element = document.getElementById(targetElementId);
    if (!element) {
      element = document.getElementById('football-pitch-canvas');
    }

    if (!element) {
      toast.error('Không tìm thấy sơ đồ sân để xuất ảnh');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading('Đang khởi tạo ảnh sơ đồ chất lượng cao (2K)...');

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (Full HD / 2K)
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeTitle = `${matchTitle}-${teamLabel}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-');

      link.download = `${safeTitle}-sa-ban-7v7.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Đã xuất ảnh PNG sơ đồ chiến thuật thành công!', { id: toastId });
    } catch (err) {
      console.error('Lỗi khi xuất ảnh sơ đồ:', err);
      toast.error('Có lỗi xảy ra khi tạo ảnh sơ đồ', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      leftIcon="photo_camera"
      isLoading={isExporting}
      onClick={onClick || handleExport}
      className={className}
    >
      Xuất ảnh Poster
    </Button>
  );
};
