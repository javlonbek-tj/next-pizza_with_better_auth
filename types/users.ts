export type UserTableRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  image: string | null;
  createdAt: Date;
  accounts: { providerId: string }[];
  _count: {
    orders: number;
  };
};
