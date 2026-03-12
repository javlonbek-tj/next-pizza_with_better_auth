import {
  getIngredientList,
  getPizzaSizesList,
  getPizzaTypesList,
} from '@/server';
import { Filters } from './Filters';

interface Props {
  className?: string;
}

export async function FiltersContent({ className }: Props) {
  const [ingredients, pizzaSizes, pizzaTypes] = await Promise.all([
    getIngredientList(),
    getPizzaSizesList(),
    getPizzaTypesList(),
  ]);

  return (
    <Filters
      className={className}
      ingredients={ingredients}
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}
