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

export const queryKeys = {
  cart: ['cart'] as const,
  ingredients: ['ingredients'] as const,
  categories: ['categories'] as const,
};

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
// 🍕 PIZZA TYPES & SIZES
// ==============================

import { Variant } from '@/components/product/GroupVariants';

export const mapPizzaSize = {
  20: 'Маленькая',
  30: 'Средняя',
  40: 'Большая',
} as const;

export const mapPizzaType = {
  1: 'традиционная',
  2: 'тонкая',
} as const;

export type PizzaSize = keyof typeof mapPizzaSize;
export type PizzaType = keyof typeof mapPizzaType;

export const pizzaTypes: Variant[] = Object.entries(mapPizzaType).map(
  ([value, name]) => ({
    name,
    value: Number(value) as PizzaType,
  })
);

export const pizzaSizes: Variant[] = Object.entries(mapPizzaSize).map(
  ([value, name]) => ({
    name,
    value: Number(value) as PizzaSize,
  })
);

// ==============================
// 💰 PRICE SETTINGS
// ==============================

export const DEFAULT_PRICE_FROM = 0;
export const DEFAULT_PRICE_TO = 1000;
export const DELIVERY_PRICE = 100;
