import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Название должно содержать не менее 2 символов')
    .max(50, 'Название не должно превышать 50 символов'),

  price: z
    .number('Цена должна быть числом')
    .min(1, 'Цена должна быть больше 0')
    .max(10000, 'Цена не должна превышать 10,000'),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Загрузите изображение')
    .refine(
      (val) => /\.(png|jpg|jpeg|gif|webp)$/i.test(val),
      'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)'
    ),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
