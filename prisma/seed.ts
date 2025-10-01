import prisma from './prisma-client';
import { hashSync } from 'bcrypt';
import { categories, _ingredients, products } from './constants';

const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: string;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}) => {
  return {
    productId,
    price: randomDecimalNumber(190, 600),
    pizzaType,
    size,
  };
};

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
}

async function up() {
  // Create users first
  const user1 = await prisma.user.create({
    data: {
      name: 'User Test',
      email: 'user@test.ru',
      password: hashSync('111111', 10),
      emailVerified: new Date(),
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Admin Admin',
      email: 'admin@test.ru',
      password: hashSync('111111', 10),
      emailVerified: new Date(),
      role: 'ADMIN',
    },
  });

  // Create categories first and get their IDs
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          ...category,
        },
      })
    )
  );

  // Create ingredients first and get their IDs
  const createdIngredients = await Promise.all(
    _ingredients.map((ingredient) =>
      prisma.ingredient.create({
        data: {
          name: ingredient.name,
          price: ingredient.price,
          imageUrl: ingredient.imageUrl,
        },
      })
    )
  );

  // Create regular products (non-pizza) with correct category references
  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          name: product.name,
          imageUrl: product.imageUrl,
          categoryId: createdCategories[parseInt(product.categoryId) - 1].id,
        },
      })
    )
  );

  // Create pizza products with ingredients
  const pizza1 = await prisma.product.create({
    data: {
      name: 'Пепперони фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
      categoryId: createdCategories[0].id, // First category (Пиццы)
      ingredients: {
        connect: createdIngredients.slice(0, 5).map((ing) => ({ id: ing.id })),
      },
    },
  });

  const pizza2 = await prisma.product.create({
    data: {
      name: 'Сырная',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
      categoryId: createdCategories[0].id, // First category (Пиццы)
      ingredients: {
        connect: createdIngredients.slice(5, 10).map((ing) => ({ id: ing.id })),
      },
    },
  });

  const pizza3 = await prisma.product.create({
    data: {
      name: 'Чоризо фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp',
      categoryId: createdCategories[0].id, // First category (Пиццы)
      ingredients: {
        connect: createdIngredients
          .slice(10, 17)
          .map((ing) => ({ id: ing.id })), // Fixed slice range
      },
    },
  });

  // Create product items
  await Promise.all([
    // Pizza product items
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza1.id,
        pizzaType: 1,
        size: 20,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza1.id,
        pizzaType: 2,
        size: 30,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza1.id,
        pizzaType: 2,
        size: 40,
      }),
    }),

    // Сырная pizza
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 20,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 30,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 1,
        size: 40,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 20,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 30,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza2.id,
        pizzaType: 2,
        size: 40,
      }),
    }),

    // Чоризо pizza
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza3.id,
        pizzaType: 1,
        size: 20,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza3.id,
        pizzaType: 2,
        size: 30,
      }),
    }),
    prisma.productItem.create({
      data: generateProductItem({
        productId: pizza3.id,
        pizzaType: 2,
        size: 40,
      }),
    }),

    // Regular product items (using created product IDs)
    ...createdProducts.map((product) =>
      prisma.productItem.create({
        data: generateProductItem({ productId: product.id }),
      })
    ),
  ]);

  // Create carts with proper user references
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id, // Use the actual user ID
      token: '11111',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id, // Use the actual user ID
      token: '222222',
    },
  });

  // Get the first product item to reference
  const firstProductItem = await prisma.productItem.findFirst();

  if (firstProductItem) {
    await prisma.cartItem.create({
      data: {
        productItemId: firstProductItem.id, // Use string ID
        cartId: cart1.id, // Use string ID
        quantity: 2,
        ingredients: {
          connect: createdIngredients
            .slice(0, 3)
            .map((ing) => ({ id: ing.id })),
        },
      },
    });
  }
}

async function main() {
  try {
    await down();
    await up();
    console.log('✅ Database seeded successfully');
  } catch (e) {
    console.error('❌ Error seeding database:', e);
    throw e;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // TODO REMOVE IN PRODUCTION
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
