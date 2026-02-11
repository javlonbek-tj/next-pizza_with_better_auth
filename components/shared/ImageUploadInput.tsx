import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  value?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImageUploadInput({
  value,
  onUpload,
  onRemove,
  isUploading = false,
  disabled = false,
  className = '',
}: ImageUploadInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await onUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className={className}>
      {value ? (
        // Preview Mode
        <div className='relative flex items-center justify-center w-full overflow-hidden border rounded-lg h-52 group bg-gray-50'>
          <Image
            src={value}
            alt='Preview'
            fill
            className='object-cover'
            unoptimized
          />
          {!disabled && !isUploading && (
            <button
              type='button'
              onClick={onRemove}
              className='absolute p-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 cursor-pointer top-2 right-2 group-hover:opacity-100 hover:bg-red-600'
              aria-label='Remove image'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      ) : (
        // Upload Mode
        <label
          className={`flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-52 transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary'
          } ${
            disabled || isUploading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            // Loading State
            <div className='flex flex-col items-center justify-center gap-2 pointer-events-none'>
              <Loader2 className='w-10 h-10 text-primary animate-spin' />
              <span className='text-sm text-gray-600'>
                Загрузка изображения...
              </span>
            </div>
          ) : (
            // Upload Prompt
            <div className='flex flex-col items-center justify-center pointer-events-none'>
              <Upload
                className={`mb-3 w-10 h-10 transition-colors ${
                  isDragging ? 'text-primary' : 'text-gray-400'
                }`}
              />
              <p className='text-sm text-gray-600'>
                <span className='font-semibold'>Нажмите для загрузки</span> или
                перетащите
              </p>
              <p className='mt-1 text-xs text-gray-500'>
                PNG, JPG, WebP (макс. 5MB)
              </p>
            </div>
          )}
          <input
            type='file'
            className='hidden'
            accept='image/png,image/jpeg,image/jpg,image/webp'
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
        </label>
      )}
    </div>
  );
}
