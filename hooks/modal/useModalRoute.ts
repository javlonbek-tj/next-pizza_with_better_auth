'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useModalRoute(pathSegment: string) {
  const [open, setOpen] = useState(false);
  const hasBeenClosed = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.includes(pathSegment) && !hasBeenClosed.current) {
      setOpen(true);
    } else {
      setOpen(false);
      hasBeenClosed.current = false;
    }
  }, [pathname, pathSegment]);

  const handleClose = () => {
    hasBeenClosed.current = true;
    setOpen(false);

    const queryString = searchParams.toString();
    const targetPath = queryString ? `/?${queryString}` : '/';
    router.push(targetPath, { scroll: false });
  };

  return { open, handleClose, setOpen };
}
