import { CartItemModel } from '@/components/cart/Cart-item-type';

import Decimal from 'decimal.js';

export const calculateTotalAmount = (items: CartItemModel[]) =>
  items
    .reduce((acc, item) => acc.plus(item.totalCartItemPrice), new Decimal(0))
    .toNumber();
