import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Введите название ингредиента')
    .min(2, 'Название должно содержать не менее 2 символов')
    .max(200, 'Название не должно превышать 200 символов')
    .transform((val) => val.toLowerCase())
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  price: z
    .number({ message: 'Цена обязательна и должна быть больше 0' })
    .positive('Цена обязательна и должна быть больше 0')
    .max(1000000000, 'Цена не должна превышать 1,000,000,000')
    .refine(
      (val) => Number.isFinite(val) && Math.floor(val * 100) === val * 100,
      {
        message: 'Цена должна иметь максимум 2 знака после запятой',
      },
    ),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Загрузите изображение')
    .refine(
      (val) => /\.(png|jpg|jpeg|gif|webp)$/i.test(val),
      'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)',
    ),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
