'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { USER_ROLES, type UserRoleValue } from '@/lib/constants';
import { updateUserRole } from '@/app/actions/admin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  userId: string;
  currentRole: string;
  isSelf: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
};

export function UserRoleSelect({ userId, currentRole, isSelf }: Props) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();

  function handleChange(newRole: string) {
    const prev = role;
    setRole(newRole);
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole as UserRoleValue);
      if (!result.success) {
        setRole(prev);
        toast.error('Ошибка при изменении роли');
      } else {
        toast.success('Роль успешно изменена');
      }
    });
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={isPending || isSelf}>
      <SelectTrigger
        size='xs'
        className={`w-36 text-xs font-medium transition-colors
          ${isSelf
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
          }
          ${role === USER_ROLES.ADMIN
            ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(USER_ROLES).map((r) => (
          <SelectItem key={r} value={r} className='text-xs cursor-pointer'>
            {ROLE_LABELS[r] ?? r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
