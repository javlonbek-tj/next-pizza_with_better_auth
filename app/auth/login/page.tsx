'use client';
import { AuthModal } from '@/components/modals/auth-modal/auth-modal';
import { useState } from 'react';
export default function LoginPage() {
  const [open, setOpen] = useState(true);
  return <AuthModal open={open} onClose={() => setOpen(false)} />;
}
