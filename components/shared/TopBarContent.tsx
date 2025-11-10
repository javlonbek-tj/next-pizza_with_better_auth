import { Container } from './Container';
import { SortPopup } from '../filters/SortPopup';

import { Categories } from '../categories/Categories';

export async function TopBarContent() {
  return (
    <div className='sticky top-0 z-10 py-5 bg-white shadow-lg shadow-black/5'>
      <Container className='flex items-center justify-between gap-5'>
        <Categories />
        <SortPopup />
      </Container>
    </div>
  );
}
