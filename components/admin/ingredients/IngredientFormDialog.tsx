'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useCreateIngredient,
  useUpdateIngredient,
  useUploadImage,
} from '@/hooks/admin/use-ingredients';
import { Loader2, Upload, X } from 'lucide-react';
import { Ingredient } from '@/lib/generated/prisma';
import Image from 'next/image';
import { IngredientFormValues, ingredientSchema } from '../schemas';
import toast from 'react-hot-toast';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib';
import { deleteImageFile } from '@/lib/admin';

interface Props {
  open: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export function IngredientFormDialog({ open, onClose, ingredient }: Props) {
  const isEditing = !!ingredient;
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [priceInput, setPriceInput] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null); // Track new upload
  const [isSubmitted, setIsSubmitted] = useState(false); // Track successful submission

  const { mutate: createIngredient, isPending: isCreating } =
    useCreateIngredient();
  const { mutate: updateIngredient, isPending: isUpdating } =
    useUpdateIngredient();
  const { mutateAsync: uploadImage } = useUploadImage();
  const isPending = isCreating || isUpdating;

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      price: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        name: ingredient.name,
        price: ingredient.price,
        imageUrl: ingredient.imageUrl,
      });
      setPriceInput(ingredient.price.toString());
      setPreviewUrl(ingredient.imageUrl);
      setNewImageUrl(null); // Reset new image for edit
    } else {
      form.reset({
        name: '',
        price: 0,
        imageUrl: '',
      });
      setPriceInput('');
      setPreviewUrl('');
      setNewImageUrl(null);
    }
    setIsSubmitted(false); // Reset submission flag
  }, [ingredient, form, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.clearErrors('imageUrl');

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError('imageUrl', {
        type: 'manual',
        message: 'Неверный формат файла. Разрешены только JPG, PNG и WebP',
      });
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      form.setError('imageUrl', {
        type: 'manual',
        message: 'Размер файла превышает 5MB',
      });
      return;
    }

    // Delete previous new image if exists
    if (newImageUrl) {
      await deleteImageFile(newImageUrl);
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const imageUrl = result?.imageUrl;

      if (!imageUrl) {
        throw new Error('No imageUrl in response');
      }
      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      setPreviewUrl(result.imageUrl);
      setNewImageUrl(result.imageUrl); // Mark as new upload
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Не удалось загрузить изображение');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    // Delete new image if it was uploaded
    if (newImageUrl) {
      deleteImageFile(newImageUrl);
      setNewImageUrl(null);
    }
    form.setValue('imageUrl', '', { shouldValidate: true });
    setPreviewUrl('');
  };

  const onSubmit = (data: IngredientFormValues) => {
    if (isEditing) {
      updateIngredient(
        { id: ingredient.id, dto: data },
        {
          onSuccess: () => {
            setIsSubmitted(true); // Mark as submitted
            onClose();
            form.reset();
            setPriceInput('');
            setPreviewUrl('');
            setNewImageUrl(null);
          },
          onError: () => {
            toast.error('Не удалось обновить ингредиент');
          },
        }
      );
    } else {
      createIngredient(data, {
        onSuccess: () => {
          setIsSubmitted(true); // Mark as submitted
          onClose();
          form.reset();
          setPriceInput('');
          setPreviewUrl('');
          setNewImageUrl(null);
        },
        onError: () => {
          toast.error('Не удалось создать ингредиент');
        },
      });
    }
  };

  // Cleanup new image on modal close if not submitted
  const handleClose = async (isOpen: boolean) => {
    if (!isOpen && newImageUrl && !isSubmitted) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать ингредиент' : 'Создать ингредиент'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Image Upload */}
            <FormField
              control={form.control}
              name='imageUrl'
              render={() => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      {previewUrl ? (
                        <div className='group relative border rounded-lg w-full h-48 overflow-hidden bg-gray-50 flex justify-center items-center'>
                          <Image
                            src={previewUrl}
                            alt='Preview'
                            fill
                            className='object-contain'
                          />
                          <button
                            type='button'
                            onClick={handleRemoveImage}
                            className='absolute top-2 right-2 bg-red-500 opacity-0 group-hover:opacity-100 p-2 rounded-full text-white transition-opacity cursor-pointer'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ) : (
                        <label
                          className='flex flex-col justify-center items-center border-2 border-gray-300 hover:border-primary border-dashed rounded-lg w-full h-48 transition-colors cursor-pointer'
                          onDragOver={(e) => {
                            e.preventDefault(); // Prevent default to allow drop
                            e.currentTarget.classList.add('border-primary'); // Optional: Add visual feedback
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-primary'); // Highlight drop zone
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-primary'); // Remove highlight
                          }}
                          onDrop={async (e) => {
                            e.preventDefault(); // Prevent browser from opening the file
                            e.currentTarget.classList.remove('border-primary'); // Remove highlight

                            const file = e.dataTransfer.files?.[0]; // Get the first dropped file
                            if (!file) return;

                            form.clearErrors('imageUrl');

                            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                              form.setError('imageUrl', {
                                type: 'manual',
                                message:
                                  'Неверный формат файла. Разрешены только JPG, PNG и WebP',
                              });
                              return;
                            }

                            if (file.size > MAX_UPLOAD_SIZE) {
                              form.setError('imageUrl', {
                                type: 'manual',
                                message: 'Размер файла превышает 5MB',
                              });
                              return;
                            }

                            // Delete previous new image if exists
                            if (newImageUrl) {
                              await deleteImageFile(newImageUrl);
                            }

                            setIsUploading(true);
                            try {
                              const result = await uploadImage(file);
                              const imageUrl = result?.imageUrl;

                              if (!imageUrl) {
                                throw new Error('No imageUrl in response');
                              }
                              form.setValue('imageUrl', result.imageUrl, {
                                shouldValidate: true,
                              });
                              setPreviewUrl(result.imageUrl);
                              setNewImageUrl(result.imageUrl); // Mark as new upload
                            } catch (error) {
                              console.error('Upload error:', error);
                              toast.error('Не удалось загрузить изображение');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        >
                          <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                            <Upload className='mb-3 w-10 h-10 text-gray-400' />
                            <p className='text-gray-600 text-sm'>
                              <span className='font-semibold'>
                                Нажмите для загрузки
                              </span>{' '}
                              или перетащите
                            </p>
                            <p className='mt-1 text-gray-500 text-xs'>
                              PNG, JPG, WebP (макс. 5MB)
                            </p>
                          </div>
                          <input
                            type='file'
                            className='hidden'
                            accept='image/png,image/jpeg,image/jpg,image/webp'
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                      {isUploading && (
                        <div className='flex justify-center items-center'>
                          <Loader2 className='w-6 h-6 animate-spin' />
                          <span className='ml-2 text-gray-600 text-sm'>
                            Загрузка...
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название (на русском)</FormLabel>
                  <FormControl>
                    <Input placeholder='Например: Сыр моцарелла' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='5000.00'
                      value={priceInput}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Allow empty string
                        if (value === '') {
                          setPriceInput('');
                          field.onChange(0);
                          return;
                        }

                        // Allow only valid number format with max 2 decimals
                        if (!/^\d*\.?\d{0,2}$/.test(value)) {
                          return;
                        }

                        // Update local state (keep string with decimal point)
                        setPriceInput(value);

                        // Update form state with number (for validation)
                        const numValue = parseFloat(value);
                        field.onChange(isNaN(numValue) ? 0 : numValue);
                      }}
                      onBlur={() => {
                        // Format on blur only if there's content
                        if (priceInput === '' || priceInput === '.') {
                          setPriceInput('');
                          field.onChange(0);
                          return;
                        }

                        const numValue = parseFloat(priceInput);
                        if (!isNaN(numValue)) {
                          // Only format to 2 decimals if the input had a decimal point
                          const formatted = priceInput.includes('.')
                            ? numValue.toFixed(2)
                            : numValue.toString();
                          setPriceInput(formatted);
                          field.onChange(parseFloat(formatted));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleClose(false)}
                disabled={isPending || isUploading}
                className={`cursor-pointer min-w-[90px] transition-colors ${
                  isPending || isUploading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-muted'
                }`}
              >
                Отмена
              </Button>

              <Button
                type='submit'
                disabled={isPending || isUploading}
                className='cursor-pointer min-w-[110px]'
              >
                {isPending ? (
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                ) : (
                  <>{isEditing ? 'Изменить' : 'Создать'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
