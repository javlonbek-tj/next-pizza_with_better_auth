import { notFound } from 'next/navigation';
import prisma from '@/prisma/prisma-client';

import { Container } from '@/components/shared';
import { ProductForm } from '@/components/product';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;

  const product = await prisma.product.findUnique({
    where: { id: param.id },
    include: {
      productItems: {
        include: {
          size: true,
          type: true,
        },
      },
      ingredients: true,
    },
  });

  if (!product) return notFound();

  return (
    <Container className='my-10'>
      <ProductForm product={product} isModal={false} />
    </Container>
  );
}
