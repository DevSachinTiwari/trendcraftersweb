export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER', 
  ADMIN = 'ADMIN'
}

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