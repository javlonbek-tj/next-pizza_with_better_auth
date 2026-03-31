import Image from 'next/image';
import { Package, Tag, Layers } from 'lucide-react';
import { getProductById } from '@/server/data/products';
import { Badge } from '@/components/ui/badge';
import { ProductNotFound } from '@/components/product';

interface Props {
  id: string;
}

export async function ProductDetailContent({ id }: Props) {
  const product = await getProductById(id);

  if (!product) {
    return (
      <ProductNotFound
        href='/admin/products'
        text='Назад к продуктам'
        message='Продукт не найден'
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header card */}
      <div className='flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm'>
        <div className='flex items-center justify-center w-24 h-24 overflow-hidden border border-gray-100 bg-gray-50 rounded-xl shrink-0'>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={88}
            height={88}
            className='object-contain'
          />
        </div>
        <div className='space-y-1'>
          <h1 className='text-xl font-bold text-gray-900'>{product.name}</h1>
          {product.category && (
            <Badge
              variant='secondary'
              className='text-xs text-blue-600 border-blue-100 bg-blue-50'
            >
              {product.category.name}
            </Badge>
          )}
          <p className='text-xs text-gray-400'>ID: {product.id}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Variants */}
        <div className='overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='flex items-center gap-2 px-6 py-4 border-b'>
            <Layers className='w-4 h-4 text-gray-400' />
            <h2 className='text-sm font-semibold text-gray-700'>
              Варианты
              <span className='ml-2 font-normal text-gray-400'>
                ({product.productItems.length})
              </span>
            </h2>
          </div>
          {product.productItems.length === 0 ? (
            <p className='px-6 py-8 text-sm text-center text-gray-400'>
              Нет вариантов
            </p>
          ) : (
            <table className='w-full text-xs'>
              <thead className='border-b bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 font-semibold tracking-wider text-left text-gray-500 uppercase'>
                    Размер
                  </th>
                  <th className='px-6 py-3 font-semibold tracking-wider text-left text-gray-500 uppercase'>
                    Тип
                  </th>
                  <th className='px-6 py-3 font-semibold tracking-wider text-right text-gray-500 uppercase'>
                    Цена
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {product.productItems.map((item) => (
                  <tr key={item.id} className='hover:bg-gray-50/60'>
                    <td className='px-6 py-3 text-gray-700'>
                      {item.size?.label ?? (
                        <span className='text-gray-400'>—</span>
                      )}
                    </td>
                    <td className='px-6 py-3 text-gray-700'>
                      {item.type?.type ?? (
                        <span className='text-gray-400'>—</span>
                      )}
                    </td>
                    <td className='px-6 py-3 font-semibold text-right text-gray-800'>
                      {item.price.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Ingredients */}
        <div className='overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='flex items-center gap-2 px-6 py-4 border-b'>
            <Tag className='w-4 h-4 text-gray-400' />
            <h2 className='text-sm font-semibold text-gray-700'>
              Ингредиенты
              <span className='ml-2 font-normal text-gray-400'>
                ({product.ingredients.length})
              </span>
            </h2>
          </div>
          {product.ingredients.length === 0 ? (
            <p className='px-6 py-8 text-sm text-center text-gray-400'>
              Нет ингредиентов
            </p>
          ) : (
            <div className='grid grid-cols-2 gap-2 p-4 overflow-y-auto max-h-72'>
              {product.ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className='flex items-center gap-2 p-2 border border-gray-100 rounded-lg bg-gray-50/60'
                >
                  {ing.imageUrl && (
                    <Image
                      src={ing.imageUrl}
                      alt={ing.name}
                      width={28}
                      height={28}
                      className='object-contain shrink-0'
                    />
                  )}
                  <div className='min-w-0'>
                    <p className='text-xs font-medium text-gray-800 truncate'>
                      {ing.name}
                    </p>
                    <p className='text-[10px] text-gray-400'>{ing.price} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          {
            icon: Layers,
            label: 'Вариантов',
            value: product.productItems.length,
            color: 'text-purple-600 bg-purple-50',
          },
          {
            icon: Tag,
            label: 'Ингредиентов',
            value: product.ingredients.length,
            color: 'text-green-600 bg-green-50',
          },
          {
            icon: Package,
            label: 'Категория',
            value: product.category?.name ?? '—',
            color: 'text-blue-600 bg-blue-50',
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className='flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm'
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}
            >
              <Icon className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs text-gray-400'>{label}</p>
              <p className='text-sm font-bold text-gray-800'>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
