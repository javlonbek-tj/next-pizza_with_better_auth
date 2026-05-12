'use server';

import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import { del } from '@vercel/blob';

export async function deleteImageFile(imageUrl: string) {
  try {
    if (!imageUrl) return;

    // Vercel Blob URL
    if (imageUrl.startsWith('https://')) {
      await del(imageUrl);
      return;
    }

    // Local filesystem fallback
    if (!imageUrl.startsWith('/uploads/')) return;

    const filepath = path.join(process.cwd(), 'public', imageUrl);
    const normalized = path.normalize(filepath);
    const publicDir = path.join(process.cwd(), 'public');
    if (!normalized.startsWith(publicDir)) return;

    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  } catch {
    // ignore
  }
}
