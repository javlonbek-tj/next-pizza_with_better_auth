import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib/constants';

const VALID_FOLDERS = ['ingredients', 'products', 'categories'] as const;
type UploadFolder = (typeof VALID_FOLDERS)[number];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as UploadFolder | null;

    // Validate folder
    if (!folder || !VALID_FOLDERS.includes(folder)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Загрузите изображение' },
        { status: 400 }
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Поддерживаются только изображения: png, jpg, jpeg, gif, webp',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Файл слишком большой. Максимум 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\s/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${timestamp}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);

    // Create directory
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error('[ADMIN_UPLOAD_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
