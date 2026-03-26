import { prisma } from '@/server';

export async function GET() {
  const stories = await prisma.story.findMany({
    include: {
      items: true,
    },
  });

  return Response.json({ success: true, data: stories });
}
