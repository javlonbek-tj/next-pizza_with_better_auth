import { CheckoutCard } from '../checkout/checkout-card';
import { Skeleton } from '../ui/skeleton';

export function CheckoutPersonalInfoSkeleton() {
  return (
    <CheckoutCard title="2. Персональные данные">
      <div className="gap-5 grid grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="rounded w-24 h-4" />
            <Skeleton className="rounded-md w-full h-10" />
          </div>
        ))}
      </div>
    </CheckoutCard>
  );
}
