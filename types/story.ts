import type { Story, StoryItem } from '@/lib/generated/prisma/client';

export type IStory = Story & {
  items: StoryItem[];
};
