import { Spinner } from '../shared';

interface Props {
  colSpan: number;
}

export function TableBodySkeleton({ colSpan }: Props) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className='py-20 text-center'>
          <div className='flex justify-center'>
            <Spinner size='sm' />
          </div>
        </td>
      </tr>
    </tbody>
  );
}
