'use client';

import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AddButton } from '@/components/shared';

interface Props {
  onCreateClick: () => void;
}

export function ProductNotFound({ onCreateClick }: Props) {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col justify-center items-center py-16">
        <Package className="mb-4 w-16 h-16 text-gray-300" />
        <h3 className="mb-2 font-semibold text-gray-900 text-xl">
          Нет продуктов
        </h3>
        <p className="mb-6 max-w-sm text-gray-500 text-center">
          Начните с создания вашего первого продукта
        </p>
        <AddButton onClick={onCreateClick} text="первый продукт" />
      </CardContent>
    </Card>
  );
}
