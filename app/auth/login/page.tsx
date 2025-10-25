'use client';

import { useState } from 'react';
import { AuthModal } from '@/components/modals';
export default function LoginPage() {
  const [open, setOpen] = useState(true);
  return <AuthModal open={open} onClose={() => setOpen(false)} />;
}
