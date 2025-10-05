'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialButtonsProps {
  loadingProvider: 'google' | 'github' | null;
  isLoading: boolean;
  onClick: (provider: 'google' | 'github') => void;
}

export function SocialButtons({
  loadingProvider,
  isLoading,
  onClick,
}: SocialButtonsProps) {
  const buttons = [
    { id: 'google', label: 'Google', icon: FcGoogle },
    { id: 'github', label: 'GitHub', icon: FaGithub },
  ] as const;

  return (
    <div className="flex gap-2">
      {buttons.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant="secondary"
          onClick={() => onClick(id)}
          type="button"
          disabled={isLoading}
          className="flex-1 gap-2 p-2 h-10 text-amber-950 cursor-pointer"
        >
          {loadingProvider === id ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
}
