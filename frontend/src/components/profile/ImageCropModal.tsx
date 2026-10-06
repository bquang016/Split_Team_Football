import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../ui';
import clsx from 'clsx';

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  isUploading?: boolean;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  isUploading = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Viewport and Crop Circle dimensions
  const VIEWPORT_SIZE = 340;
  const CROP_DIAMETER = 260;
  const CROP_RADIUS = CROP_DIAMETER / 2;
  const CENTER = VIEWPORT_SIZE / 2;

  // Reset state when opening with a new image
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan with Pointer Events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // Wheel to zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(3, Math.max(1, prev + delta)));
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset to default
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Confirm and generate cropped image File
  const handleConfirmCrop = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    const outputSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Base scale to cover the crop circle
    const isRotatedQuarter = rotation === 90 || rotation === 270;
    const naturalW = isRotatedQuarter ? img.naturalHeight : img.naturalWidth;
    const naturalH = isRotatedQuarter ? img.naturalWidth : img.naturalHeight;

    const baseScale = Math.max(CROP_DIAMETER / naturalW, CROP_DIAMETER / naturalH);
    const finalScale = baseScale * zoom;
    const scaleRatio = outputSize / CROP_DIAMETER;

    // Transform canvas
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply pan offset (taking rotation into account)
    const rad = (-rotation * Math.PI) / 180;
    const rotatedX = position.x * Math.cos(rad) - position.y * Math.sin(rad);
    const rotatedY = position.x * Math.sin(rad) + position.y * Math.cos(rad);

    ctx.translate(rotatedX * scaleRatio, rotatedY * scaleRatio);

    const drawW = img.naturalWidth * finalScale * scaleRatio;
    const drawH = img.naturalHeight * finalScale * scaleRatio;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], 'avatar-cropped.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        onCropComplete(croppedFile);
      },
      'image/jpeg',
      0.92
    );
  }, [position, rotation, zoom, onCropComplete]);

  if (!isOpen || !imageSrc) return null;

  // Compute CSS transform for live preview
  const img = imageRef.current;
  let baseScale = 1;
  if (img && imageLoaded) {
    const isRotatedQuarter = rotation === 90 || rotation === 270;
    const naturalW = isRotatedQuarter ? img.naturalHeight : img.naturalWidth;
    const naturalH = isRotatedQuarter ? img.naturalWidth : img.naturalHeight;
    baseScale = Math.max(CROP_DIAMETER / naturalW, CROP_DIAMETER / naturalH);
  }
  const currentScale = baseScale * zoom;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-[#111A2E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="crop-modal-title" className="font-space font-black text-base text-slate-900 dark:text-white">
              Cắt Ảnh Đại Diện
            </h2>
            <p className="text-xs text-slate-500 font-space mt-0.5">
              Di chuyển và phóng to để chọn góc đẹp nhất
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body: Interactive Cropper Viewport */}
        <div className="p-6 flex flex-col items-center">
          <div
            className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-inner select-none cursor-grab active:cursor-grabbing touch-none flex items-center justify-center border border-slate-800"
            style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* The Image being transformed */}
            {imageLoaded && (
              <img
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                className="max-w-none pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${currentScale})`,
                  transformOrigin: 'center center',
                }}
              />
            )}

            {/* Circular Mask Overlay */}
            <div
              className="absolute pointer-events-none rounded-full border-2 border-emerald-500/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.7)]"
              style={{
                width: CROP_DIAMETER,
                height: CROP_DIAMETER,
                top: CENTER - CROP_RADIUS,
                left: CENTER - CROP_RADIUS,
              }}
            >
              {/* Subtle Rule of Thirds Guide Lines inside circle */}
              <div className="w-full h-full rounded-full relative overflow-hidden pointer-events-none opacity-30">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/40" />
              </div>
            </div>

            {/* Instruction tooltip badge */}
            <div className="absolute bottom-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-space text-slate-300 pointer-events-none flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-xs text-emerald-400">touch_app</span>
              <span>Kéo ảnh để căn chỉnh</span>
            </div>
          </div>

          {/* Controls Toolbar: Zoom, Rotate, Reset */}
          <div className="w-full mt-5 space-y-3 font-space">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Thu nhỏ"
              >
                <span className="material-symbols-outlined text-base">zoom_out</span>
              </button>

              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                  aria-label="Mức độ phóng to"
                />
              </div>

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Phóng to"
              >
                <span className="material-symbols-outlined text-base">zoom_in</span>
              </button>
            </div>

            {/* Secondary Action Buttons: Rotate & Reset */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-emerald-500">rotate_right</span>
                <span>Xoay 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Đặt lại vị trí</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isUploading}
            className="text-xs"
          >
            Hủy
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon="check"
            isLoading={isUploading}
            onClick={handleConfirmCrop}
            className="text-xs px-4"
          >
            Cắt & Tải Lên
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
