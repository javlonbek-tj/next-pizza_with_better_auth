export type PizzaSize = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    label: string;
    size: number;
}

export type PizzaSizeWithProductCount = PizzaSize & {
    _count: {
        ProductItem: number;
    };
}

export type PizzaType = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: string;
}

export type PizzaTypeWithProductCount = PizzaType & {
    _count: {
        ProductItem: number;
    };
}