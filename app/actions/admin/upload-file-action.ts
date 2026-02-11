'use server';

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { generateUniqueFilename, validateFile } from '@/lib';

const VALID_FOLDERS = ['ingredients', 'products', 'categories'] as const;
type UploadFolder = (typeof VALID_FOLDERS)[number];

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = generateUniqueFilename(file);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

  // Create directory
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const imageUrl = `/uploads/${folder}/${filename}`;
  return { success: true, data: { imageUrl } };
}
