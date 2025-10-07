export const sortOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Сначала дешёвые', value: 'price_asc' },
  { label: 'Сначала дорогие', value: 'price_desc' },
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
] as const;

export type SortValue = (typeof sortOptions)[number]['value'];
