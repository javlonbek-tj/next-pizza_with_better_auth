'use client';

import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session } from '@/components/header/Header';

interface Props {
  session: Session | null;
}

export function AdminPageHeader({ session }: Props) {
  if (!session?.user) return null;

  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-gray-600" />
        <div>
          <p className="font-medium text-sm">{session.user.name}</p>
          <p className="text-gray-500 text-xs">{session.user.email}</p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <LogOut className="mr-2 w-4 h-4" />
        Выйти
      </Button>
    </header>
  );
}
