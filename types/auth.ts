import { UserRole } from '@prisma/client';

export { UserRole };

export interface User {
  id: string;
  name: string | null;
  email: string;
  mobile: string | null;
  password: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}