interface Props {
  children: React.ReactNode;
}

export function PizzaSizeTable({ children }: Props) {
  return (
    <div className='bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='relative w-full border-collapse'>
          <thead className='top-0 z-10 sticky bg-gray-100/80 backdrop-blur-md border-gray-200 border-b'>
            <tr>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest'>
                T/R
              </th>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest'>
                Название
              </th>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-center uppercase leading-none tracking-widest'>
                Диаметр (см)
              </th>
              <th className='px-6 py-4 pr-8 2xl:pr-10 font-bold text-[10px] text-gray-900 3xl:text-xs text-right uppercase leading-none tracking-widest'>
                Действия
              </th>
            </tr>
          </thead>
          {children}
        </table>
      </div>
    </div>
  );
}
