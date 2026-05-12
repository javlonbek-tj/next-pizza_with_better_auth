'use server';

import { revalidatePath, updateTag } from 'next/cache';
import type { ActionResult, IStory } from '@/types';
import { StoryFormValues, storySchema } from '@/lib';
import { prisma } from '@/server';
import { requireAdmin } from '@/lib/auth';

export async function createStory(
  data: StoryFormValues,
): Promise<ActionResult<IStory>> {
  await requireAdmin();

  const validationResult = storySchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: 'VALIDATION_ERROR' };
  }

  const { previewImageUrl, items } = validationResult.data;

  try {
    const story = await prisma.story.create({
      data: {
        previewImageUrl,
        items: {
          create: items.map((item) => ({ sourceUrl: item.sourceUrl })),
        },
      },
      include: { items: true },
    });

    revalidatePath('/admin/stories');
    updateTag('stories');
    return { success: true, data: story };
  } catch {
    return { success: false, error: 'INTERNAL_SERVER_ERROR' };
  }
}

export async function updateStory(
  id: string,
  data: StoryFormValues,
): Promise<ActionResult<IStory>> {
  await requireAdmin();

  const validationResult = storySchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: 'VALIDATION_ERROR' };
  }

  const { previewImageUrl, items } = validationResult.data;

  try {
    const story = await prisma.$transaction(async (tx) => {
      await tx.storyItem.deleteMany({ where: { storyId: id } });
      return tx.story.update({
        where: { id },
        data: {
          previewImageUrl,
          items: {
            create: items.map((item) => ({ sourceUrl: item.sourceUrl })),
          },
        },
        include: { items: true },
      });
    });

    revalidatePath('/admin/stories');
    updateTag('stories');
    return { success: true, data: story };
  } catch {
    return { success: false, error: 'INTERNAL_SERVER_ERROR' };
  }
}

export async function deleteStory(id: string): Promise<ActionResult<null>> {
  await requireAdmin();

  try {
    await prisma.$transaction([
      prisma.storyItem.deleteMany({ where: { storyId: id } }),
      prisma.story.delete({ where: { id } }),
    ]);

    revalidatePath('/admin/stories');
    updateTag('stories');
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'INTERNAL_SERVER_ERROR' };
  }
}
