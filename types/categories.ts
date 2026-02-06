export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithProductCount = Category & {
  _count: {
    products: number;
  };
};
