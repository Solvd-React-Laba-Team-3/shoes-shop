import { File } from './api/File';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string | null;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  customerId: number | null;
  avatar: File | null;
}
