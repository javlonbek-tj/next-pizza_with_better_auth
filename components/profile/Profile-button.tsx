import { User } from 'lucide-react';

import { Button } from '../ui/button';
import { ProfileDropdown } from './Profile-dropdown';
import { Session } from '../header/Header';

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
          variant="outline"
          className="flex items-center gap-2 w-[100px] transition duration-300 cursor-pointer"
          onClick={onClickSignIn}
        >
          <User size={18} />
          <span>Войти</span>
        </Button>
      ) : (
        <ProfileDropdown user={session.user} />
      )}
    </>
  );
}
