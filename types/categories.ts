import type {
  Category,
  Product,
  ProductItem,
} from '@/lib/generated/prisma/client';

export type ProductItemWithRelations = ProductItem & {
  size: PizzaSize | null;
  type: PizzaType | null;
};

export type ProductWithRelations = Product & {
  ingredients: Ingredient[];
  productItems: ProductItemWithRelations[];
};

export type ProductWithCategory = ProductWithRelations & {
  category: Category;
};

export type CategoryWithRelations = Category & {
  products: ProductWithRelations[];
};

export type CategoryWithProductCount = Category & {
  _count: {
    products: number;
  };
};

export type CategoryListItem = {
  id: string;
  slug: string;
  name: string;
  isPizza: boolean;
};

export type CategoryTableRow = Category & {
  _count: {
    products: number;
  };
};

export type ProductTableRow = {
  id: string;
  name: string;
  imageUrl: string;
  category: { name: string };
  _count: {
    productItems: number;
    ingredients: number;
  };
};

export type PizzaType = {
  id: string;
  type: string;
};

export type PizzaTypeTableRow = PizzaType & {
  _count: {
    productItems: number;
  };
};

export type PizzaSize = {
  id: string;
  size: number;
  label: string;
};

export type PizzaSizeTableRow = PizzaSize & {
  _count: {
    productItems: number;
  };
};

export type Ingredient = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};
