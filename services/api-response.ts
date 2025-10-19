export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  status: number;
  data: T;
};
