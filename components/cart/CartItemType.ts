export interface CartItemModel {
  id: string;
  name: string;
  pizzaType?: string | null;
  pizzaSize?: number | null;
  quantity: number;
  imageUrl: string;
  totalCartItemPrice: number;
  ingredients: Array<{ name: string; price: number }>;
}
