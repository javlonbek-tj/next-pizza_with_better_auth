import { z } from 'zod';

export const storyItemSchema = z.object({
  sourceUrl: z.string().min(1, 'Загрузите изображение для слайда'),
});

export const storySchema = z.object({
  previewImageUrl: z.string().min(1, 'Добавьте изображение для превью'),
  items: z
    .array(storyItemSchema)
    .min(1, 'Добавьте хотя бы один слайд'),
});

export type StoryFormValues = z.infer<typeof storySchema>;
