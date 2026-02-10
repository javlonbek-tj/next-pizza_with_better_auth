import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { BackButton, Title } from '../shared';
import { SheetClose } from '../ui/sheet';

interface Props {
  useSheetClose?: boolean;
}

export function EmptyCart({ useSheetClose = false }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center mx-auto w-72">
      <Image
        src="/assets/images/empty-box.png"
        alt="Empty cart"
        width={120}
        height={120}
      />
      <Title
        size="sm"
        text="Корзина пустая"
        className="my-2 font-bold text-center"
      />
      <p className="mb-5 text-neutral-500 text-center">
        Добавьте хотя бы одну пиццу, чтобы совершить заказ
      </p>

      {useSheetClose ? (
        <SheetClose asChild>
          <BackButton />
        </SheetClose>
      ) : (
        <BackButton onClick={() => router.back()} />
      )}
    </div>
  );
}
