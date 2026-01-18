import { Ingredient } from '@/lib/generated/prisma/browser';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';

export const getAll = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<Ingredient[]>>(ApiRoutes.INGREDIENTS)
  ).data;
  return data;
};
