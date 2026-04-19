'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { OrderWithItems } from '@/types';

export function UserOrders() {
  const { data: orders, isPending } = useOrders();

  if (isPending) {
    return (
      <div className="max-w-2xl space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
        <ShoppingBag className="w-12 h-12" />
        <p className="text-lg font-medium">У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="max-w-2xl space-y-3">
      {orders.map((order: OrderWithItems) => {
        const createdDate = new Date(order.createdAt);
        const dateLabel =
          createdDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }) +
          ', в ' +
          createdDate.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          });

        return (
          <AccordionItem
            key={order.id}
            value={order.id}
            className="px-6 bg-white border-none shadow-sm rounded-2xl"
          >
            <AccordionTrigger className="py-4 cursor-pointer hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">
                  Заказ #{order.id.slice(0, 8)}
                </span>
                <span className="text-sm font-normal text-gray-400">
                  {dateLabel}
                </span>
              </div>
              <div className="ml-auto">
                <OrderStatusBadge status={order.status} />
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-0">
              <div className="border-t divide-y">
                {order.items.map((item) => {
                  const { product, size, type } = item.productItem;
                  const sizeLine = [size?.label, type?.type]
                    .filter(Boolean)
                    .join(', ');
                  const ingredients = item.ingredients as { name: string }[];
                  const ingredientsLine =
                    ingredients.length > 0
                      ? '+ ' + ingredients.map((i) => i.name).join(', ')
                      : null;

                  return (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-16 h-16 rounded-full shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>
                        {sizeLine && (
                          <p className="text-sm text-gray-400 mt-0.5">
                            {sizeLine}
                          </p>
                        )}
                        {ingredientsLine && (
                          <p className="text-sm text-gray-400">
                            {ingredientsLine}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {item.quantity} шт.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="py-4 border-t">
                <span className="text-gray-700">Итого: </span>
                <span className="font-bold text-gray-900">
                  {order.totalAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
