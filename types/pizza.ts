export type PizzaSize = {
  id: string;
  label: string;
  size: number;
};

export type PizzaSizeWithProductCount = PizzaSize & {
  _count: {
    productItems: number;
  };
};

export type PizzaType = {
  id: string;
  type: string;
};

export type PizzaTypeWithProductCount = PizzaType & {
  _count: {
    productItems: number;
  };
};
