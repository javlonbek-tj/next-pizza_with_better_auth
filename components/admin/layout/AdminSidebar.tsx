'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  ShoppingCart,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Панель управления', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/ingredients', label: 'Ингредиенты', icon: FolderTree },
  { href: '/admin/pizza-sizes', label: 'Размеры', icon: Settings },
  { href: '/admin/pizza-types', label: 'Типы пиццы', icon: Settings },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-64 bg-white border-r'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Админ-панель</h1>
      </div>
      <nav className='px-4 space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100',
              )}
            >
              <Icon className='w-5 h-5' />
              <span className='font-medium'>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
