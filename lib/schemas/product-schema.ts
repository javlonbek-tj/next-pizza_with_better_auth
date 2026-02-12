import z from 'zod';

// Base schemas
export const productItemSchema = z.object({
  price: z
    .number({ message: 'Цена обязательна' })
    .positive('Цена обязательна')
    .max(1000000000, 'Цена не должна превышать 1,000,000,000')
    .refine(
      (val) => Number.isFinite(val) && Math.floor(val * 100) === val * 100,
      {
        message: 'Цена должна иметь максимум 2 знака после запятой',
      },
    ),
  sizeId: z.string().nullable().optional(),
  typeId: z.string().nullable().optional(),
});

export const pizzaProductItemSchema = productItemSchema.extend({
  sizeId: z
    .string({ message: 'Размер обязателен' })
    .min(1, 'Размер обязателен'),
  typeId: z
    .string({ message: 'Тип теста обязателен' })
    .min(1, 'Тип теста обязателен'),
});

export const createProductSchema = (isPizza: boolean) => {
  const itemSchema = isPizza ? pizzaProductItemSchema : productItemSchema;

  let productItemsValidation = z.array(itemSchema);

  if (isPizza) {
    productItemsValidation = productItemsValidation.min(
      1,
      'Добавьте хотя бы один вариант пиццы (размер и тип теста обязательны)',
    );
  }

  return z.object({
    name: z.string().trim().min(1, 'Название обязательно'),
    imageUrl: z
      .string()
      .trim()
      .min(1, 'Загрузите изображение')
      .refine(
        (val) => /\.(png|jpg|jpeg|gif|webp)$/i.test(val),
        'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)',
      ),
    categoryId: z.string().trim().min(1, 'Выберите категорию'),
    ingredientIds: z.array(z.string()).min(0),
    productItems: productItemsValidation,
    isPizza: z.boolean(),
  });
};

export type ProductItemFormValues = z.infer<typeof productItemSchema>;
export type ProductFormValues = z.infer<ReturnType<typeof createProductSchema>>;
