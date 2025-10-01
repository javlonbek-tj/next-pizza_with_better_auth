import { Session } from 'next-auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

interface ProfileDropdownProps {
  session: Session | null;
}

export function ProfileDropdown({ session }: ProfileDropdownProps) {
  const getInitial = () => {
    const name = session?.user?.name || session?.user?.email;
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex justify-center items-center gap-2 bg-primary/80 p-0 focus:border-transparent rounded-full focus:outline-none focus-visible:ring-0 focus:ring-0 w-10 h-10 font-semibold text-lg cursor-pointer">
          {getInitial()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user?.name ?? 'U'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="w-4 h-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
