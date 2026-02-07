import { prisma } from "../prisma";

export const getPizzaTypes = async () => {
    return await prisma.pizzaType.findMany();
}

export const getPizzaSizes = async () => {
    return await prisma.pizzaSize.findMany();
}