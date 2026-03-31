'use client';

import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { TableActions } from '@/components/admin/table/TableActions';
import { UserRoleSelect } from './UserRoleSelect';
import { PROVIDER_CONFIG } from './provider-config';
import type { UserTableRow } from '@/types';
import { useSession } from '@/lib/auth/auth-client';

interface Props {
  dataPromise: Promise<{ data: UserTableRow[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function UsersTableBody({
  dataPromise,
  startIndex,
  isLoading,
  onDelete,
}: Props) {
  const { data } = use(dataPromise);
  const { data: session } = useSession();

  return (
    <tbody
      className={`divide-y divide-gray-100 transition-opacity duration-200 ${
        isLoading && data.length > 0 ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={9}
            className='px-6 py-12 text-sm font-medium text-center text-gray-800'
          >
            Пользователи не найдены
          </td>
        </tr>
      ) : (
        data.map((user, index) => (
          <tr
            key={user.id}
            className='transition-all duration-200 group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white'
          >
            <td className='px-6 py-2 text-xs font-bold text-gray-600 whitespace-nowrap'>
              {startIndex + index + 1}
            </td>

            <td className='px-6 py-2 whitespace-nowrap'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center justify-center text-xs font-bold text-orange-700 bg-orange-100 rounded-full w-7 h-7 shrink-0'>
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <span className='text-xs font-medium text-gray-800'>
                  {user.name}
                </span>
              </div>
            </td>

            <td className='px-6 py-2 text-xs text-gray-600 whitespace-nowrap'>
              {user.email}
            </td>

            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <Badge
                variant='secondary'
                className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                  user.emailVerified
                    ? 'bg-green-50 border-green-100 text-green-600'
                    : 'bg-yellow-50 border-yellow-100 text-yellow-600'
                }`}
              >
                {user.emailVerified ? 'Да' : 'Нет'}
              </Badge>
            </td>

            <td className='px-6 py-2 whitespace-nowrap'>
              <UserRoleSelect
                userId={user.id}
                currentRole={user.role}
                isSelf={user.id === session?.user.id}
              />
            </td>

            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <Badge
                variant='secondary'
                className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                  user._count.orders > 0
                    ? 'bg-violet-50/50 border-violet-100 text-violet-600'
                    : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}
              >
                {user._count.orders}
              </Badge>
            </td>

            <td className='px-6 py-2 whitespace-nowrap'>
              <div className='flex flex-wrap items-center gap-1'>
                {user.accounts.length === 0 ? (
                  <span className='text-xs text-gray-400'>—</span>
                ) : (
                  user.accounts.map(({ providerId }) => {
                    const config = PROVIDER_CONFIG[providerId] ?? {
                      label: providerId,
                      className: 'bg-gray-50 border-gray-100 text-gray-500',
                      icon: null,
                    };
                    return (
                      <Badge
                        key={providerId}
                        variant='secondary'
                        className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium text-[11px] ${config.className}`}
                      >
                        {config.icon}
                        {config.label}
                      </Badge>
                    );
                  })
                )}
              </div>
            </td>

            <td className='px-6 py-2 text-xs text-gray-600 whitespace-nowrap'>
              {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>

            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onDelete={() => onDelete(user.id)}
                deleteDisabled={user.id === session?.user.id}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
