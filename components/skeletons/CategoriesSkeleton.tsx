'use client';

export function CategoriesSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-20 h-8 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </>
  );
}
