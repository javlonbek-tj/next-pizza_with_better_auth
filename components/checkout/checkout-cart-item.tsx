import Image from 'next/image';
import { CartItemModel } from '../cart/Cart-item-type';
import { CartUpdateButtons } from '../cart';

interface Props {
  cartItem: CartItemModel;
}

export function CheckoutCartItem({ cartItem }: Props) {
  return (
    <div className="flex justify-between items-center gap-3 py-3">
      {/* Left: image + details */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <Image
          src={cartItem.imageUrl}
          alt={cartItem.name}
          width={60}
          height={60}
          className="flex-shrink-0 rounded-full"
        />
        <div>
          <p className="font-bold">{cartItem.name}</p>
          <p className="text-gray-400 text-sm">
            {cartItem.ingredients.map((ing) => ing.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Center: price */}
      <p className="w-20 font-bold text-gray-900 text-base text-center">
        {cartItem.totalCartItemPrice} ₽
      </p>

      {/* Right: quantity controls */}
      <CartUpdateButtons
        id={cartItem.id}
        quantity={cartItem.quantity}
        cartBtnSize="md"
      />
    </div>
  );
}
