export function AdminTableSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <div className='h-9 w-36 bg-gray-200 rounded-lg animate-pulse' />
      </div>

      <div className='bg-white rounded-lg shadow-sm'>
        <div className='flex items-center gap-3 p-4 border-b'>
          <div className='h-8 w-52 bg-gray-200 rounded animate-pulse' />
        </div>

        <div className='p-4'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                {Array.from({ length: cols }).map((_, i) => (
                  <th key={i} className='pb-3 text-left'>
                    <div className='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className='border-b last:border-0'>
                  {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className='py-3'>
                      <div className='h-4 w-24 bg-gray-100 rounded animate-pulse' />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
