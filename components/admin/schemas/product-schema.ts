// components/admin/schemas/product-schema.ts
import z from 'zod';

// Base product fields that are common to all products
const baseProductSchema = z.object({
  name: z.string().trim().min(1, 'Название обязательно'),
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Загрузите изображение')
    .refine(
      (val) => /\.(png|jpg|jpeg|gif|webp)$/i.test(val),
      'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)'
    ),
  categoryId: z.string().min(1, 'Выберите категорию'),
  ingredientIds: z.array(z.string()).default([]),
});

// Pizza product item (requires size and type)
const pizzaItemSchema = z.object({
  price: z
    .number('Цена должна быть числом')
    .positive('Цена должна быть больше 0')
    .max(1000000000, 'Цена не должна превышать 1,000,000,000')
    .refine(
      (val) => Number.isFinite(val) && Math.floor(val * 100) === val * 100,
      { message: 'Цена должна иметь максимум 2 знака после запятой' }
    ),
  sizeId: z.string().min(1, 'Выберите размер'),
  typeId: z.string().min(1, 'Выберите тип теста'),
});

// Regular product item (only price)
const regularItemSchema = z.object({
  price: z
    .number('Цена должна быть числом')
    .positive('Цена должна быть больше 0')
    .max(1000000000, 'Цена не должна превышать 1,000,000,000')
    .refine(
      (val) => Number.isFinite(val) && Math.floor(val * 100) === val * 100,
      { message: 'Цена должна иметь максимум 2 знака после запятой' }
    ),
  sizeId: z.null().optional(),
  typeId: z.null().optional(),
});

// Pizza product schema
const pizzaProductSchema = baseProductSchema.extend({
  productType: z.literal('pizza'),
  productItems: z
    .array(pizzaItemSchema)
    .min(1, 'Добавьте хотя бы один вариант пиццы'),
});

// Regular product schema
const regularProductSchema = baseProductSchema.extend({
  productType: z.literal('regular'),
  productItems: z
    .array(regularItemSchema)
    .length(1, 'Должна быть указана одна цена'),
});

// Discriminated union
export const productSchema = z.discriminatedUnion('productType', [
  pizzaProductSchema,
  regularProductSchema,
]);

export type PizzaProductFormValues = z.infer<typeof pizzaProductSchema>;
export type RegularProductFormValues = z.infer<typeof regularProductSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
