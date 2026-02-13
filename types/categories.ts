export type Category = {
  id: string;
  name: string;
  slug: string;
  isPizza: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithProductCount = Category & {
  _count: {
    products: number;
  };
};
