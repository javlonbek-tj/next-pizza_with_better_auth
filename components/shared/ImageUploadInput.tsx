import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
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
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        // Preview Mode
        <div className='group relative flex justify-center items-center bg-gray-50 border rounded-lg w-full h-48 overflow-hidden'>
          <Image
            src={value}
            alt='Preview'
            fill
            className='object-contain'
            unoptimized
          />
          {!disabled && !isUploading && (
            <button
              type='button'
              onClick={onRemove}
              className='top-2 right-2 absolute bg-red-500 opacity-0 group-hover:opacity-100 p-2 rounded-full text-white transition-opacity cursor-pointer hover:bg-red-600'
              aria-label='Remove image'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      ) : (
        // Upload Mode
        <label
          className={`flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-48 transition-all ${
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
          <div className='flex flex-col justify-center items-center pt-5 pb-6 pointer-events-none'>
            <Upload
              className={`mb-3 w-10 h-10 transition-colors ${
                isDragging ? 'text-primary' : 'text-gray-400'
              }`}
            />
            <p className='text-gray-600 text-sm'>
              <span className='font-semibold'>Нажмите для загрузки</span> или
              перетащите
            </p>
            <p className='mt-1 text-gray-500 text-xs'>
              PNG, JPG, WebP (макс. 5MB)
            </p>
          </div>
          <input
            type='file'
            className='hidden'
            accept='image/png,image/jpeg,image/jpg,image/webp'
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
        </label>
      )}

      {/* Loading Indicator */}
      {isUploading && (
        <div className='flex justify-center items-center gap-2 py-2'>
          <Loader2 className='w-5 h-5 text-primary animate-spin' />
          <span className='text-gray-600 text-sm'>Загрузка изображения...</span>
        </div>
      )}
    </div>
  );
}
