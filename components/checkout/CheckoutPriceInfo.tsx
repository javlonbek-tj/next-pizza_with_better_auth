interface Props {
  title: React.ReactNode;
  value: React.ReactNode;
}

export function CheckoutPriceInfo({ title, value }: Props) {
  return (
    <div className="flex justify-between items-center text-md">
      <div className="flex flex-1">
        {title}
        <div className="-top-1 relative flex-1 mx-2 border-b border-b-neutral-200 border-dashed" />
      </div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
