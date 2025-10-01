import { notFound } from 'next/navigation';
import prisma from '@/prisma/prisma-client';
import { ProductForm } from '@/components/product';
import { Container } from '@/components/shared';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;

  const product = await prisma.product.findFirst({
    where: { id: param.id },
    include: {
      ingredients: true,
      productItems: true,
      category: {
        include: {
          products: {
            include: {
              productItems: true,
            },
          },
        },
      },
    },
  });

  if (!product) return notFound();

  return (
    <Container className='my-10'>
      <ProductForm product={product} isModal={false} />
    </Container>
  );
}
