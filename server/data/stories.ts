import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../prisma';
import type { IStory } from '@/types';

export const getStories = async (): Promise<IStory[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('stories');
  return prisma.story.findMany({
    where: { isActive: true },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  });
};

export const getStoriesTableData = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ data: IStory[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.story.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.story.count(),
  ]);

  return { data, total };
};
