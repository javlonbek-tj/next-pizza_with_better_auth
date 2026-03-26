import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoryFormValues, storySchema } from '@/lib';
import { createStory, updateStory } from '@/app/actions';
import type { IStory } from '@/types';

interface Props {
  story: IStory | null;
  open: boolean;
  onClose: () => void;
  markAsSubmitted: () => void;
}

export function useStoryForm({ story, open, onClose, markAsSubmitted }: Props) {
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!story;

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      previewImageUrl: '',
      items: [{ sourceUrl: '' }],
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      story
        ? {
            previewImageUrl: story.previewImageUrl,
            items: story.items.map((item) => ({ sourceUrl: item.sourceUrl })),
          }
        : { previewImageUrl: '', items: [{ sourceUrl: '' }] },
    );
  }, [open, story, form]);

  const onSubmit = async (data: StoryFormValues) => {
    setIsPending(true);
    try {
      const result = isEditing
        ? await updateStory(story.id.toString(), data)
        : await createStory(data);

      if (!result.success) {
        toast.error(
          result.message ||
            `Не удалось ${isEditing ? 'изменить' : 'создать'} историю`,
        );
        return;
      }
      markAsSubmitted();
      toast.success(`История успешно ${isEditing ? 'изменена' : 'создана'}`);
      onClose();
    } catch {
      toast.error(
        `Не удалось ${isEditing ? 'изменить' : 'создать'} историю`,
      );
    } finally {
      setIsPending(false);
    }
  };

  return { form, isEditing, isPending, onSubmit };
}
