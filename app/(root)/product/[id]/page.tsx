
import { Container, Spinner } from '@/components/shared';
import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizes, getPizzaTypes } from '@/server/data/pizza-options';


export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {

const {id} = await params;
const product = await getProductById(id);
const pizzaSizes = await getPizzaSizes();
const pizzaTypes = await getPizzaTypes();

  return (
    <Container className="my-10">
      {product ? (
        <div className="p-0 h-[500px]">
          <ProductForm
            product={product}
            isModal={false}
            pizzaSizes={pizzaSizes}
            pizzaTypes={pizzaTypes}
          />
        </div>
      ): <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-gray-500 text-lg">Продукт не найден</p>
            <button
              className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-white transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>}
    </Container>
  );
}
