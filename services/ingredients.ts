import { Ingredient } from '@/lib/generated/prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';

export const getAll = async (): Promise<Ingredient[]> => {
  const res = await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS);
  return Array.isArray(res.data) ? res.data : [];
};
