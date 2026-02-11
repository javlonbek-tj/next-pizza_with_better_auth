import slugify from 'slugify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueFilename(file: File): string {
  const uuid = crypto.randomUUID();

  const originalName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const extension = file.name.split('.').pop();

  return `${originalName}-${uuid}.${extension}`;
}

export const validateFile = (file: File): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Неверный формат файла. Разрешены только JPG, PNG и WebP';
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return 'Размер файла превышает 5MB';
  }
  return null;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const cyrillicToLatinMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ы: 'y',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ъ: '',
  ь: '',
};

export function generateSlug(name: string): string {
  if (!name) return '';

  const transliterated = name
    .toLowerCase()
    .split('')
    .map((char) => cyrillicToLatinMap[char] ?? char)
    .join('');

  return slugify(transliterated, { lower: true, strict: true, trim: true });
}
