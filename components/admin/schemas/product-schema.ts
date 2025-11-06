import z from 'zod';

export const productItemSchema = z.object({
  price: z
    .number('Цена должна быть числом')
    .positive('Цена должна быть больше 0')
    .max(1000000000, 'Цена не должна превышать 1,000,000,000')
    .refine(
      (val) => Number.isFinite(val) && Math.floor(val * 100) === val * 100,
      {
        message: 'Цена должна иметь максимум 2 знака после запятой',
      }
    ),

  sizeId: z.string().nullable().optional(),

  typeId: z.string().nullable().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Название обязательно'),

  imageUrl: z
    .string()
    .trim()
    .min(1, 'Загрузите изображение')
    .refine(
      (val) => /\.(png|jpg|jpeg|gif|webp)$/i.test(val),
      'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)'
    ),

  categoryId: z.string().nullable().optional(),

  ingredientIds: z.array(z.string()).min(0),

  productItems: z
    .array(productItemSchema)
    .min(1, 'Добавьте хотя бы один вариант продукта'),
});

export type ProductItemFormValues = z.infer<typeof productItemSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
