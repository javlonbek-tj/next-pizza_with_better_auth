import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';
import './globals.css';
import { Providers } from './providers';
import { cn } from '@/lib/utils';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={cn(
          nunito.className,
          'antialiased min-h-screen flex flex-col',
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
