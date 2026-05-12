'use client';

import { useEffect, useRef, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';
import { useImageUpload, useStoryForm } from '@/hooks';
import { deleteImageFile, uploadFileAction } from '@/app/actions';
import type { IStory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  story: IStory | null;
}

export function StoryFormDialog({ open, onClose, story }: Props) {
  const {
    previewUrl,
    removeImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    uploadFile,
    isUploading: isImageUploading,
  } = useImageUpload(
    story?.previewImageUrl,
    open,
    'stories',
    story?.previewImageUrl,
  );

  // Track newly uploaded slide URLs and whether the form was submitted
  const submittedRef = useRef(false);
  const uploadedSlideUrlsRef = useRef<string[]>([]);
  const originalSlideUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      submittedRef.current = false;
      uploadedSlideUrlsRef.current = [];
      originalSlideUrlsRef.current = new Set(
        story?.items.map((i) => i.sourceUrl).filter(Boolean) ?? [],
      );
    }
  }, [open, story]);

  const handleMarkAsSubmitted = () => {
    submittedRef.current = true;
    markAsSubmitted();
  };

  const { form, isEditing, isPending, onSubmit } = useStoryForm({
    story,
    open,
    onClose,
    markAsSubmitted: handleMarkAsSubmitted,
  });

  const [uploadingItems, setUploadingItems] = useState<Set<number>>(new Set());

  const handleUploadSlide = async (
    file: File,
    index: number,
    onChange: (url: string) => void,
  ) => {
    // If this slot already has a newly uploaded URL, delete the old one immediately
    const existingUrl = form.getValues(`items.${index}.sourceUrl`);
    if (existingUrl && !originalSlideUrlsRef.current.has(existingUrl)) {
      uploadedSlideUrlsRef.current = uploadedSlideUrlsRef.current.filter(
        (u) => u !== existingUrl,
      );
      deleteImageFile(existingUrl);
    }

    setUploadingItems((prev) => new Set(prev).add(index));
    const res = await uploadFileAction(file, 'stories');
    setUploadingItems((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });

    if (res.success && res.data?.imageUrl) {
      const newUrl = res.data.imageUrl;
      onChange(newUrl);
      uploadedSlideUrlsRef.current = [...uploadedSlideUrlsRef.current, newUrl];
    }
  };

  const handleClearSlideImage = async (
    index: number,
    onChange: (url: string) => void,
  ) => {
    const existingUrl = form.getValues(`items.${index}.sourceUrl`);
    if (existingUrl && !originalSlideUrlsRef.current.has(existingUrl)) {
      uploadedSlideUrlsRef.current = uploadedSlideUrlsRef.current.filter(
        (u) => u !== existingUrl,
      );
      await deleteImageFile(existingUrl);
    }
    onChange('');
    form.trigger(`items.${index}.sourceUrl`);
  };

  const handleRemoveCard = async (index: number) => {
    const existingUrl = form.getValues(`items.${index}.sourceUrl`);
    if (existingUrl && !originalSlideUrlsRef.current.has(existingUrl)) {
      uploadedSlideUrlsRef.current = uploadedSlideUrlsRef.current.filter(
        (u) => u !== existingUrl,
      );
      deleteImageFile(existingUrl);
    }
    remove(index);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();

      // If cancelled (not submitted), delete all uploaded slide images
      if (!submittedRef.current && uploadedSlideUrlsRef.current.length > 0) {
        await Promise.all(
          uploadedSlideUrlsRef.current.map((url) => deleteImageFile(url)),
        );
      }
      uploadedSlideUrlsRef.current = [];
    }
    onClose();
  };

  const handleRemovePreview = async () => {
    await removeImage();
    form.setValue('previewImageUrl', '', { shouldValidate: true });
  };

  const handleUploadPreview = async (file: File) => {
    const res = await uploadFile(file);
    if (!res.success) {
      form.setError('previewImageUrl', {
        type: 'manual',
        message: res.message,
      });
      return;
    }
    form.clearErrors('previewImageUrl');
    form.setValue('previewImageUrl', res.data?.imageUrl || '', {
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-xl max-h-[90vh] overflow-y-auto' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать историю' : 'Создать историю'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            {/* Preview Image Upload */}
            <FormField
              control={form.control}
              name='previewImageUrl'
              render={() => (
                <FormItem>
                  <FormLabel>Изображение превью</FormLabel>
                  <FormControl>
                    <ImageUploadInput
                      value={previewUrl}
                      onUpload={handleUploadPreview}
                      onRemove={handleRemovePreview}
                      isUploading={isImageUploading}
                      disabled={isPending}
                      className='w-50'
                      aspectRatio='object-cover'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Story Slides */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <FormLabel className='text-sm font-medium'>
                  Слайды истории ({fields.length})
                </FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ sourceUrl: '' })}
                  disabled={isPending}
                  className='gap-1 text-xs h-7'
                >
                  <Plus className='w-3 h-3' />
                  Добавить слайд
                </Button>
              </div>

              <div className='grid grid-cols-3 gap-2'>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`items.${index}.sourceUrl`}
                    render={({ field: inputField, fieldState }) => (
                      <FormItem className='space-y-0'>
                        <FormControl>
                          <ImageUploadInput
                            value={inputField.value}
                            onUpload={(file) =>
                              handleUploadSlide(file, index, (url) => {
                                inputField.onChange(url);
                                form.trigger(`items.${index}.sourceUrl`);
                              })
                            }
                            onRemove={() =>
                              handleClearSlideImage(index, inputField.onChange)
                            }
                            onRemoveCard={() => handleRemoveCard(index)}
                            canRemove={fields.length > 1}
                            isUploading={uploadingItems.has(index)}
                            disabled={isPending}
                            error={fieldState.error?.message}
                            aspectRatio='object-cover'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {form.formState.errors.items?.root && (
                <p className='text-sm text-red-500'>
                  {form.formState.errors.items.root.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-2'>
              <FormActions
                onCancel={() => handleClose(false)}
                isPending={isPending}
                isLoading={isImageUploading}
                isEditing={isEditing}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
