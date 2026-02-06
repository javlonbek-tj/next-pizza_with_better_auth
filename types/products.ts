import { Category } from './categories';
import { Ingredient } from './ingredients';
import { PizzaSize, PizzaType } from './pizza';

export type Product = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
    categoryId: string;
}

export type ProductItem = {
    price: number;
    sizeId: string | null;
    typeId: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
}

export type ProductItems = ProductItem & {
  size: PizzaSize | null;
  type: PizzaType | null;
};


export type ProductWithRelations = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
    categoryId: string;
} & {
    productItems: ProductItems[];
    ingredients: Ingredient[];
    category?: Category | null;
}