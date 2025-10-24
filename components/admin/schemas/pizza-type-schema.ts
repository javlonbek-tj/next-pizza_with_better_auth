import { z } from 'zod';

export const pizzaTypeSchema = z.object({
  type: z
    .string()
    .trim()
    .min(1, 'Введите название типа пиццы')
    .max(50, 'Название не должно превышать 50 символов')
    .transform((val) => val.toLowerCase())
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
});

export type PizzaTypeFormValues = z.infer<typeof pizzaTypeSchema>;
