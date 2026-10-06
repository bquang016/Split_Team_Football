import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { getAvatarColor, getInitials } from '../utils/formatters';

export interface AvatarProps {
  name?: string;
  src?: string;
  avatarUrl?: string;
  jerseyNumber?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  bgColor?: string;
  showNumber?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  src,
  avatarUrl,
  jerseyNumber,
  size = 'md',
  className,
  bgColor,
  showNumber = false,
}) => {
  const imageSource = src || avatarUrl;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageSource]);

  const initials = getInitials(name);
  const background = bgColor || getAvatarColor(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-lg font-black',
    xl: 'w-20 h-20 text-2xl font-black',
  };

  const badgeSizes = {
    sm: 'text-[9px] w-4 h-4 -bottom-1 -right-1',
    md: 'text-[10px] w-5 h-5 -bottom-1 -right-1',
    lg: 'text-xs w-6 h-6 -bottom-1.5 -right-1.5',
    xl: 'text-sm w-7 h-7 -bottom-2 -right-2',
  };

  const hasImage = Boolean(imageSource && !imgError);

  return (
    <div className={clsx('relative inline-flex flex-shrink-0 select-none rounded-full', className)}>
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-heading text-white shadow-md border-2 border-white/20 overflow-hidden',
          sizeClasses[size]
        )}
        style={{ backgroundColor: hasImage ? 'transparent' : background }}
        title={name}
      >
        {hasImage ? (
          <img
            src={imageSource}
            alt={name || 'Avatar'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {showNumber && jerseyNumber !== undefined && jerseyNumber !== null && (
        <span
          className={clsx(
            'absolute rounded-full bg-slate-950 border border-white/30 text-amber-400 font-mono font-black flex items-center justify-center shadow-md',
            badgeSizes[size]
          )}
        >
          {jerseyNumber}
        </span>
      )}
    </div>
  );
};
