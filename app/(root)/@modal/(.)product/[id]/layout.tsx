import { ChooseProductModal } from '@/components/modals';

export default function ProductModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChooseProductModal>{children}</ChooseProductModal>;
}
