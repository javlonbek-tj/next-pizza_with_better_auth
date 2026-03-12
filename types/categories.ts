export type Category = {
  id: string;
  name: string;
  slug: string;
  isPizza: boolean;
};

export type CategoryWithProductCount = Category & {
  _count: {
    products: number;
  };
};
