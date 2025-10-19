import { z } from 'zod';

/* const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]; */

/* const imageSchema = z
  .instanceof(File, { message: 'Input must be a File' })
  .refine(
    (file) => file.size <= MAX_UPLOAD_SIZE,
    `Max image size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png, .webp and .gif formats are supported.'
  ); */

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название должно содержать не менее 2 символов')
    .max(50, 'Название не должно превышать 50 символов'),

  price: z
    .number('Цена должна быть числом')
    .min(0, 'Цена не может быть отрицательной')
    .max(10000, 'Цена не должна превышать 10,000'),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Загрузите изображение')
    .refine(
      (val) => /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(val),
      'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)'
    ),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
