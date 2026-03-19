import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { Container, Title } from '@/components/shared';
import { Mail, User, ShieldCheck, ShieldAlert, CalendarDays } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/');

  const { user } = session;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <Container className='py-10 max-w-xl'>
      <Title text='Профиль' size='lg' className='mb-6 font-bold' />

      <div className='bg-white rounded-2xl shadow-sm p-8 space-y-6'>
        {/* Avatar + name */}
        <div className='flex items-center gap-5'>
          <div className='w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center text-white text-2xl font-bold shrink-0'>
            {initial}
          </div>
          <div>
            <p className='text-xl font-bold text-gray-900'>{user.name}</p>
            <p className='text-sm text-gray-400'>{user.email}</p>
          </div>
        </div>

        <hr />

        {/* Info rows */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-sm'>
            <User className='w-4 h-4 text-gray-400 shrink-0' />
            <span className='text-gray-500 w-32'>Имя</span>
            <span className='font-medium text-gray-800'>{user.name}</span>
          </div>

          <div className='flex items-center gap-3 text-sm'>
            <Mail className='w-4 h-4 text-gray-400 shrink-0' />
            <span className='text-gray-500 w-32'>Email</span>
            <span className='font-medium text-gray-800'>{user.email}</span>
          </div>

          <div className='flex items-center gap-3 text-sm'>
            {user.emailVerified ? (
              <ShieldCheck className='w-4 h-4 text-green-500 shrink-0' />
            ) : (
              <ShieldAlert className='w-4 h-4 text-yellow-500 shrink-0' />
            )}
            <span className='text-gray-500 w-32'>Email подтверждён</span>
            <span className={`font-medium ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.emailVerified ? 'Да' : 'Нет'}
            </span>
          </div>

          <div className='flex items-center gap-3 text-sm'>
            <CalendarDays className='w-4 h-4 text-gray-400 shrink-0' />
            <span className='text-gray-500 w-32'>Дата регистрации</span>
            <span className='font-medium text-gray-800'>{joinedDate}</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
