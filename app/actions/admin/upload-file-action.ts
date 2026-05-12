'use server';

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { put } from '@vercel/blob';
import { generateUniqueFilename, validateFile } from '@/lib';

const VALID_FOLDERS = [
  'ingredients',
  'products',
  'categories',
  'stories',
] as const;
type UploadFolder = (typeof VALID_FOLDERS)[number];

const isVercel = process.env.VERCEL === '1';

export async function uploadFileAction(file: File, folder: UploadFolder) {
  if (!folder || !VALID_FOLDERS.includes(folder)) {
    throw new Error('Invalid folder');
  }

  if (!file) {
    return {
      success: false,
      message: 'Загрузите изображение',
    };
  }

  const validationError = validateFile(file);
  if (validationError) {
    return { success: false, message: validationError };
  }

  const filename = generateUniqueFilename(file);

  if (isVercel) {
    try {
      const blob = await put(`${folder}/${filename}`, file, { access: 'public' });
      return { success: true, data: { imageUrl: blob.url } };
    } catch (err) {
      console.error('[uploadFileAction] Vercel Blob error:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Не удалось загрузить изображение',
      };
    }
  }

  // Local filesystem fallback
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return {
    success: true,
    data: { imageUrl: `/uploads/${folder}/${filename}` },
  };
}
