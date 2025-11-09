'use server';

import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';

export async function deleteImageFile(imageUrl: string) {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return;
    }

    const filepath = path.join(process.cwd(), 'public', imageUrl);

    const normalized = path.normalize(filepath);
    const publicDir = path.join(process.cwd(), 'public');
    if (!normalized.startsWith(publicDir)) {
      return;
    }

    if (existsSync(filepath)) {
      await unlink(filepath);
      console.log('[IMAGE_DELETE] Deleted:', filepath);
    }
  } catch (error) {
    console.error('[IMAGE_DELETE_ERROR]', error);
    // Don't throw error - we don't want to fail the operation if image deletion fails
  }
}
