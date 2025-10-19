import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file type. Only JPG, PNG, and WebP are allowed',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
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
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
