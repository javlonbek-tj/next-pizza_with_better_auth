export function priceFormatter(value: string) {
  // Allow only digits and up to 2 decimals
  if (value === '') return '';

  const normalized = value.replace(',', '.');
  if (!/^\d*\.?\d{0,2}$/.test(normalized)) return null;

  return normalized;
}
