import type {
  Order,
  OrderItem,
  Product,
  PizzaSize,
  PizzaType,
  ProductItem,
} from '@/lib/generated/prisma/client';

export type OrderItemWithRelations = OrderItem & {
  productItem: ProductItem & {
    product: Product;
    size: PizzaSize | null;
    type: PizzaType | null;
  };
};

export type OrderWithItems = Order & {
  items: OrderItemWithRelations[];
};
