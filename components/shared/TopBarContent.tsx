import { Container } from './Container';
import { SortPopup } from '../filters/SortPopup';

import { Categories } from '../categories/Categories';

// TopBarContent.tsx
export async function TopBarContent() {
  return (
    <div className="top-0 z-20 sticky bg-white shadow-black/5 shadow-lg">
      <Container className="flex justify-between items-center gap-5 py-5">
        <Categories />
        <SortPopup />
      </Container>
    </div>
  );
}
