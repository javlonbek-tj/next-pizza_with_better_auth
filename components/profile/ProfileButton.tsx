import { User } from 'lucide-react';

import { Button } from '../ui/button';
import { ProfileDropdown } from './ProfileDropdown';
import type { Session } from '@/lib/auth';

interface Props {
  onClickSignIn?: () => void;
  session: Session | null;
}

export function ProfileButton({ onClickSignIn, session }: Props) {
  const isAuthenticated = !!session?.user;

  return (
    <>
      {!isAuthenticated ? (
        <Button
          variant='outline'
          className='flex items-center gap-2 transition duration-300 cursor-pointer w-25'
          onClick={onClickSignIn}
        >
          <User size={16} />
          <span>Войти</span>
        </Button>
      ) : (
        <ProfileDropdown user={session.user} />
      )}
    </>
  );
}
