import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { ProfileDropdown } from './Profile-dropdown';

interface Props {
  onClickSignIn?: () => void;
}

export function ProfileButton({ onClickSignIn }: Props) {
  const isAuthenticated = false;

  return (
    <>
      {!isAuthenticated ? (
        <Button
          variant='outline'
          className='flex items-center gap-2 w-[100px] transition duration-300 cursor-pointer'
          onClick={onClickSignIn}
        >
          <User size={18} />
          <span>Войти</span>
        </Button>
      ) : (
        <ProfileDropdown />
      )}
    </>
  );
}
