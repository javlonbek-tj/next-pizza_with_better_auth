'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  LayoutGrid,
  Salad,
  Ruler,
  Pizza,
  ShoppingCart,
  Home,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: LayoutGrid },
  { href: '/admin/ingredients', label: 'Ингредиенты', icon: Salad },
  { href: '/admin/pizza-sizes', label: 'Размеры', icon: Ruler },
  { href: '/admin/pizza-types', label: 'Типы пиццы', icon: Pizza },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white border-r w-64">
      <div className="p-6">
        <h1 className="font-bold text-gray-800 text-xl text-center">
          Админ-панель
        </h1>
      </div>
      <nav className="space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-orange-500 text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-2 px-4 pt-2 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>На главную</span>
        </Link>
      </div>
    </aside>
  );
}
