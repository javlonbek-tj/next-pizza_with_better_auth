import { Variant } from '@/components/product/Group-variants';

export const mapPizzaSize = {
  20: 'Маленькая',
  30: 'Средняя',
  40: 'Большая',
} as const;

export const mapPizzaType = {
  1: 'традиционная',
  2: 'тонкая',
} as const;

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

export type PizzaSize = keyof typeof mapPizzaSize;
export type PizzaType = keyof typeof mapPizzaType;

export const DEFAULT_PRICE_FROM = 0;
export const DEFAULT_PRICE_TO = 1000;
