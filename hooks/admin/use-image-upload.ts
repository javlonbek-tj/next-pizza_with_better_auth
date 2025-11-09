'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteImageFile } from '@/app/actions';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib/constants';
import { useUploadImage } from '@/hooks';

// Define only the form methods we need
interface FormImageUrlMethods {
  setValue: (
    name: 'imageUrl',
    value: string,
    options?: { shouldValidate?: boolean }
  ) => void;
  setError: (
    name: 'imageUrl',
    error: { type: string; message: string }
  ) => void;
  clearErrors: (name?: 'imageUrl') => void;
}

/**
 * Reusable image upload hook for any form with an imageUrl field.
 * @param imageUrl - The current image URL (from entity being edited, or empty for new)
 * @param open - Whether the dialog/modal is open
 * @param formMethods - Only the form methods we need: setValue, setError, clearErrors
 */
export function useImageUpload(
  imageUrl: string | null | undefined,
  open: boolean,
  formMethods: FormImageUrlMethods,
  imageFolder: 'products' | 'ingredients',
  originalImageUrl?: string | null // NEW: Track original image for edit mode
) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutateAsync: uploadImage } = useUploadImage(imageFolder);

  // When modal opens or imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
      setNewImageUrl(null);
    } else {
      setPreviewUrl('');
      setNewImageUrl(null);
    }
    setIsSubmitted(false);
  }, [imageUrl, open]);

  /** Validate file type and size */
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Неверный формат файла. Разрешены только JPG, PNG и WebP';
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return 'Размер файла превышает 5MB';
    }
    return null;
  };

  /** Upload image to server */
  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      formMethods.setError('imageUrl', {
        type: 'manual',
        message: error,
      });
      return;
    }
    formMethods.clearErrors('imageUrl');

    // Delete previous new image if exists (but not the original)
    if (newImageUrl && newImageUrl !== originalImageUrl) {
      await deleteImageFile(newImageUrl);
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const uploadedImageUrl = result?.imageUrl;
      if (!uploadedImageUrl) {
        throw new Error('No imageUrl in response');
      }

      formMethods.setValue('imageUrl', uploadedImageUrl, {
        shouldValidate: true,
      });
      setPreviewUrl(uploadedImageUrl);
      setNewImageUrl(uploadedImageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Не удалось загрузить изображение');
    } finally {
      setIsUploading(false);
    }
  };

  /** Remove current image */
  const handleRemoveImage = async () => {
    // Delete new image if it was uploaded (but not the original in edit mode)
    if (newImageUrl && newImageUrl !== originalImageUrl) {
      await deleteImageFile(newImageUrl);
      setNewImageUrl(null);
    }
    formMethods.setValue('imageUrl', '', { shouldValidate: true });
    setPreviewUrl('');
  };

  /** Delete any uploaded image that wasn't submitted */
  const cleanupOrphanedImage = async () => {
    // Only cleanup new images that weren't submitted and aren't the original
    if (newImageUrl && !isSubmitted && newImageUrl !== originalImageUrl) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
  };

  const resetImageState = () => {
    setPreviewUrl('');
    setNewImageUrl(null);
    setIsSubmitted(false);
  };

  return {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  };
}
