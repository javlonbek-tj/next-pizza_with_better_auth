import { CartIconButton } from './CartIconButton';

interface Props {
  id: string;
  quantity: number;
  cartBtnSize?: 'sm' | 'md' | 'lg';
}

export function CartUpdateButtons({ id, quantity, cartBtnSize }: Props) {
  return (
    <div className='flex items-center gap-3'>
      <CartIconButton
        type='minus'
        quantity={quantity}
        cartItemId={id}
        size={cartBtnSize}
      />
      <span className='text-sm'>{quantity}</span>
      <CartIconButton
        type='plus'
        quantity={quantity}
        cartItemId={id}
        size={cartBtnSize}
      />
    </div>
  );
}
