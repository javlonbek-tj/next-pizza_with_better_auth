import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Введите название категории')
    .min(3, 'Название категории должно содержать не менее 3 символов')
    .max(50, 'Название категории не должно превышать 50 символов')
    .regex(
      /^[а-яА-Я0-9\s-]+$/,
      'Название категории может содержать только кириллические буквы, цифры, пробелы и дефисы'
    )
    .transform((val) => val.toLowerCase())
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  slug: z
    .string()
    .trim()
    .min(1, 'Введите slug категории')
    .min(3, 'Slug должен содержать не менее 3 символов')
    .max(50, 'Slug не должен превышать 50 символов')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug может содержать только латинские буквы в нижнем регистре, цифры и дефисы'
    ),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
