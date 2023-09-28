import { StatusEnum, UserRole } from '../enums';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  canStream: boolean;
  role: UserRole;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  __entity: string;
}
