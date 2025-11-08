import z from 'zod';

// Base schemas
export const productItemSchema = z.object({
  price: z
    .number({ message: 'Цена должна быть числом' })
    .positive('Цена обязательна')
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

export const pizzaProductItemSchema = productItemSchema.extend({
  sizeId: z
    .string({ message: 'Размер обязателен' })
    .min(1, 'Размер обязателен'),
  typeId: z
    .string({ message: 'Тип теста обязателен' })
    .min(1, 'Тип теста обязателен'),
});

// Schema for editing (includes optional id)
export const productItemSchemaWithId = productItemSchema.extend({
  id: z.string().optional(),
});

export const pizzaProductItemSchemaWithId = pizzaProductItemSchema.extend({
  id: z.string().optional(),
});

export const createProductSchema = (isPizzaCategory: boolean) => {
  const itemSchema = isPizzaCategory
    ? pizzaProductItemSchemaWithId
    : productItemSchemaWithId;

  let productItemsValidation = z.array(itemSchema);

  if (isPizzaCategory) {
    productItemsValidation = productItemsValidation.min(
      1,
      'Добавьте хотя бы один вариант пиццы (размер и тип теста обязательны)'
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
        'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)'
      ),
    categoryId: z.string().trim().min(1, 'Выберите категорию'),
    ingredientIds: z.array(z.string()).min(0),
    productItems: productItemsValidation,
  });
};

export type ProductItemFormValues = z.infer<typeof productItemSchemaWithId>;
export type ProductFormValues = z.infer<ReturnType<typeof createProductSchema>>;
