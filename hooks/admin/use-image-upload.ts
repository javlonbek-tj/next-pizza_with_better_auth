import { useEffect, useState } from 'react';
import { useUploadImage } from './use-ingredients';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib';
import { deleteImageFile } from '@/app/actions';

interface UseImageUploadReturn {
  previewUrl: string;
  isUploading: boolean;
  uploadedImageUrl: string | null;
  uploadFile: (
    file: File,
  ) => Promise<{ success: boolean; message?: string; imageUrl?: string }>;
  removeImage: () => Promise<void>;
  cleanupOrphanedImage: () => Promise<void>;
  markAsSubmitted: () => void;
}

export function useImageUpload(
  initialImageUrl: string | null | undefined,
  open: boolean,
  imageFolder: 'products' | 'ingredients',
  originalImageUrl?: string | null,
): UseImageUploadReturn {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync: uploadImage } = useUploadImage(imageFolder);

  useEffect(() => {
    if (!open) return;
    setPreviewUrl(initialImageUrl ?? '');
    setUploadedImageUrl(null);
    setIsSubmitted(false);
  }, [open, initialImageUrl]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Неверный формат файла. Разрешены только JPG, PNG и WebP';
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return 'Размер файла превышает 5MB';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      return { success: false, message: validationError };
    }

    // Delete previous upload if exists
    if (uploadedImageUrl && uploadedImageUrl !== originalImageUrl) {
      await deleteImageFile(uploadedImageUrl);
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const newUrl = result?.imageUrl;

      if (!newUrl) throw new Error('No imageUrl in response');

      setUploadedImageUrl(newUrl);
      setPreviewUrl(newUrl);
      return { success: true, imageUrl: newUrl };
    } catch (err) {
      console.error('Upload error:', err);
      return { success: false, message: 'Не удалось загрузить изображение' };
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (uploadedImageUrl && uploadedImageUrl !== originalImageUrl) {
      await deleteImageFile(uploadedImageUrl);
      setUploadedImageUrl(null);
    }
    setPreviewUrl('');
  };

  const cleanupOrphanedImage = async () => {
    if (
      uploadedImageUrl &&
      !isSubmitted &&
      uploadedImageUrl !== originalImageUrl
    ) {
      try {
        await deleteImageFile(uploadedImageUrl);
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
  };

  return {
    previewUrl,
    isUploading,
    uploadedImageUrl,
    uploadFile,
    removeImage,
    cleanupOrphanedImage,
    markAsSubmitted: () => setIsSubmitted(true),
  };
}
