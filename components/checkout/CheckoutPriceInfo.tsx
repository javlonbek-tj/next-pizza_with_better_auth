interface Props {
  title: React.ReactNode;
  value: React.ReactNode;
}

export function CheckoutPriceInfo({ title, value }: Props) {
  return (
    <div className='flex justify-between text-lg items-center'>
      <div className='flex flex-1'>
        {title}
        <div className='border-b border-dashed border-b-neutral-200  flex-1 relative -top-1 mx-2' />
      </div>
      <div className='font-bold'>{value}</div>
    </div>
  );
}
