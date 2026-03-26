interface Props {
  children: React.ReactNode;
}

export function StoriesTable({ children }: Props) {
  return (
    <div className='overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='relative w-full border-collapse'>
          <thead className='sticky top-0 z-10 border-b border-gray-200 bg-gray-100/80 backdrop-blur-md'>
            <tr>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest'>
                №
              </th>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest'>
                Превью
              </th>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-center uppercase leading-none tracking-widest'>
                Кол-во слайдов
              </th>
              <th className='px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest'>
                Дата создания
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
