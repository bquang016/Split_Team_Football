import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { Button } from '../../ui';

interface LineupExportProps {
  matchTitle?: string;
  targetElementId?: string;
}

export const LineupExport: React.FC<LineupExportProps> = ({
  matchTitle = 'so-do-doi-hinh',
  targetElementId = 'football-pitch-canvas',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      toast.error('Không tìm thấy sơ đồ sân');
      return;
    }

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#072315',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeTitle = matchTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `${safeTitle}-lineup.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Đã xuất ảnh sơ đồ đội hình thành công!');
    } catch (err) {
      toast.error('Không thể xuất ảnh sơ đồ');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="surface"
      leftIcon="photo_camera"
      isLoading={isExporting}
      onClick={handleExport}
    >
      Xuất ảnh PNG
    </Button>
  );
};
