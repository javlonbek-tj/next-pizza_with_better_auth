import { IStory } from '@/types';

import { ApiRoutes } from './apiRoutes';
import { axiosInstance } from './instance';

export const getAll = async () => {
  const { data } = await axiosInstance.get<{
    success: boolean;
    data: IStory[];
  }>(ApiRoutes.STORIES);

  return data.data;
};
