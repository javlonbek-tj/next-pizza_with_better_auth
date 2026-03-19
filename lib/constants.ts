// ==============================
// 🔒 AUTH & SECURITY CONSTANTS
// ==============================

export const OTP_DOWN_SECONDS = 60;

// ==============================
// 🏷️ APP INFO
// ==============================

export const APP_NAME = 'Next Pizza';
export const APP_DESCRIPTION = 'Best pizza in the universe';

// ==============================
// 🔑 QUERY KEYS
// ==============================

// ==============================
// 🔽 SORT OPTIONS
// ==============================

export const sortOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Сначала дешёвые', value: 'price_asc' },
  { label: 'Сначала дорогие', value: 'price_desc' },
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
] as const;

export type SortValue = (typeof sortOptions)[number]['value'];

// ==============================
// 🖼️ IMAGE UPLOAD SETTINGS
// ==============================

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
];

// ==============================
// 💰 PRICE SETTINGS
// ==============================

export const DEFAULT_PRICE_FROM = 0;
export const DEFAULT_PRICE_TO = 1000;
export const DELIVERY_PRICE = 100;

// ==============================
// 📦 ORDER STATUS OPTIONS
// ==============================

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'В ожидании' },
  { value: 'SUCCEEDED', label: 'Оплачен' },
  { value: 'CANCELLED', label: 'Отменён' },
];
