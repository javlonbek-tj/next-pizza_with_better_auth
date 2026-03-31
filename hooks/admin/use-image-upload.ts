import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteImageFile, uploadFileAction } from '@/app/actions';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib/constants';

export function useImageUpload(
  initialImageUrl: string | undefined,
  open: boolean,
  imageFolder: 'products' | 'ingredients' | 'stories',
  originalImageUrl: string | null | undefined,
) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPreviewUrl(initialImageUrl ?? '');
    setUploadedImageUrl('');
    setIsSubmitted(false);
  }, [open, initialImageUrl]);

  const removeImage = async () => {
    if (uploadedImageUrl && uploadedImageUrl !== originalImageUrl) {
      await deleteImageFile(uploadedImageUrl);
      setUploadedImageUrl('');
    }
    setPreviewUrl('');
  };

  const uploadFile = async (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Неверный формат файла. Разрешены только JPG, PNG и WebP');
      return {
        success: false,
        message: 'Неверный формат файла',
        data: null,
      };
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error('Размер файла превышает 5MB');
      return {
        success: false,
        message: 'Размер файла превышает 5MB',
        data: null,
      };
    }

    setIsUploading(true);
    const result = await uploadFileAction(file, imageFolder);

    if (result.success) {
      setUploadedImageUrl(result.data?.imageUrl || '');
      setPreviewUrl(result.data?.imageUrl || '');
    } else {
      toast.error(result.message || 'Не удалось загрузить изображение');
    }
    setIsUploading(false);
    return result;
  };

  const cleanupOrphanedImage = async () => {
    if (
      uploadedImageUrl &&
      !isSubmitted &&
      uploadedImageUrl !== originalImageUrl
    ) {
      try {
        await deleteImageFile(uploadedImageUrl);
      } catch {
        // ignore
      }
    }
  };

  return {
    previewUrl,
    uploadedImageUrl,
    removeImage,
    cleanupOrphanedImage,
    markAsSubmitted: () => setIsSubmitted(true),
    uploadFile,
    isUploading,
  };
}
