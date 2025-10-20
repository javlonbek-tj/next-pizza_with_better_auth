import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

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
            'URL должен указывать на изображение (png, jpg, jpeg, gif, webp)',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Файл слишком большой. Максимум 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s/g, '-')}`;
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'ingredients'
    );
    const filepath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return URL
    const imageUrl = `/uploads/ingredients/${filename}`;
    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (error) {
    // TODO REMOVE IN PRODUCTION
    console.error('[ADMIN_UPLOAD_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
