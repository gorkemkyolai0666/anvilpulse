import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

export function formatWeightKg(value: number): string {
  return `${value.toFixed(1)} kg`;
}

const PROJECT_STATUS: Record<string, string> = {
  quoted: 'Teklif',
  designing: 'Tasarım',
  fabricating: 'İmalat',
  welding: 'Kaynak',
  finishing: 'Kaplama',
  installed: 'Montaj',
  cancelled: 'İptal',
};

export function formatProjectStatus(status: string): string {
  return PROJECT_STATUS[status] || status;
}

export function formatJobStatus(status: string): string {
  return formatProjectStatus(status);
}

const MATERIAL_STATUS: Record<string, string> = {
  in_stock: 'Stokta',
  low: 'Düşük',
  reorder: 'Sipariş Gerek',
  out_of_stock: 'Tükendi',
};

export function formatMaterialStatus(status: string): string {
  return MATERIAL_STATUS[status] || status;
}

export function formatMaterialStockStatus(status: string): string {
  return formatMaterialStatus(status);
}

const SITE_VISIT_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  revision: 'Revizyon',
  approved: 'Onaylandı',
  cancelled: 'İptal',
};

export function formatSiteVisitStatus(status: string): string {
  return SITE_VISIT_STATUS[status] || status;
}

export function formatProofStatus(status: string): string {
  return formatSiteVisitStatus(status);
}

const WELDING_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatWeldingStatus(status: string): string {
  return WELDING_STATUS[status] || status;
}

const MEASUREMENT_QUALITY: Record<string, string> = {
  excellent: 'Mükemmel',
  good: 'İyi',
  needs_review: 'İnceleme Gerek',
  rejected: 'Reddedildi',
};

export function formatMeasurementQuality(value: string): string {
  return MEASUREMENT_QUALITY[value] || value;
}

const SURFACE_STATUS: Record<string, string> = {
  active: 'Aktif',
  seasonal: 'Mevsimlik',
  discontinued: 'Durduruldu',
};

export function formatSurfaceStatus(status: string): string {
  return SURFACE_STATUS[status] || status;
}

const PROJECT_TYPE: Record<string, string> = {
  railing: 'Korkuluk',
  gate: 'Kapı',
  balcony: 'Balkon',
  staircase: 'Merdiven',
  canopy: 'Sundurma',
  custom: 'Özel',
};

export function formatProjectType(value: string): string {
  return PROJECT_TYPE[value] || value;
}

export function formatPrintType(value: string): string {
  return formatProjectType(value);
}
