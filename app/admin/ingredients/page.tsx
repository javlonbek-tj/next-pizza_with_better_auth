import { IngredientsTable } from '@/components/admin/ingredients/IngredientsTable';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Ингредиенты</h1>
      <IngredientsTable />
    </div>
  );
}
