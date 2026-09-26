import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDateVi(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'EEEE, dd/MM/yyyy', { locale: vi });
  } catch {
    return dateStr;
  }
}

export function formatShortDateVi(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

export function formatTimeVi(timeStr?: string): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

export function getAvatarColor(name?: string): string {
  if (!name) return '#DC2626';
  const colors = [
    '#DC2626', // Spain Red
    '#2563EB', // France Blue
    '#D97706', // Gold Amber
    '#7C3AED', // Royal Purple
    '#059669', // Stadium Green
    '#0284C7', // Ocean Blue
    '#E11D48', // Crimson Rose
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
