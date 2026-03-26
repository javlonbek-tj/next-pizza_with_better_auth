import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Trash2 } from 'lucide-react';

interface ImageUploadInputProps {
  value?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading?: boolean;
  disabled?: boolean;
  className?: string;
  aspectRatio?: string;
  error?: string;
  onRemoveCard?: () => void;
  canRemove?: boolean;
}

export function ImageUploadInput({
  value,
  onUpload,
  onRemove,
  isUploading = false,
  disabled = false,
  className = '',
  aspectRatio = 'object-contain',
  error,
  onRemoveCard,
  canRemove,
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
    <div className='flex flex-col'>
      <div className='relative'>
        {canRemove && onRemoveCard && !disabled && (
          <button
            type='button'
            onClick={onRemoveCard}
            className='absolute z-10 bottom-1.5 cursor-pointer right-1.5 p-1 text-red-500 hover:text-red-600 transition-colors'
            aria-label='Remove'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        )}

        {value ? (
          // Preview Mode
          <div
            className={`relative flex items-center justify-center overflow-hidden group bg-gray-50 rounded-lg border h-52 ${className}`}
          >
            <Image
              src={value}
              alt='Preview'
              fill
              className={aspectRatio}
              unoptimized
            />
            {!disabled && !isUploading && (
              <button
                type='button'
                onClick={onRemove}
                className='absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 cursor-pointer top-2 right-2 group-hover:opacity-100 hover:bg-red-600'
                aria-label='Remove image'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>
        ) : (
          // Upload Mode
          <label
            className={`flex flex-col justify-center items-center border-2 border-dashed transition-all rounded-lg h-52 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary'
            } ${
              disabled || isUploading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            } ${className}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className='flex flex-col items-center justify-center gap-2 pointer-events-none'>
                <Loader2 className='w-6 h-6 text-primary animate-spin' />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center pointer-events-none'>
                <Upload
                  className={`mb-1 w-5 h-5 transition-colors ${isDragging ? 'text-primary' : 'text-gray-400'}`}
                />
                <p className='text-sm text-center text-gray-600'>
                  <span className='font-semibold'>Нажмите для загрузки</span>{' '}
                  или перетащите
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

      {error && <p className='mt-1 text-[10px] text-red-500'>{error}</p>}
    </div>
  );
}
