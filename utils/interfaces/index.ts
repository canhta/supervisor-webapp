import { DefaultUser } from 'next-auth';
import { UserRole } from '../enums';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  canStream: boolean;
  role: UserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  __entity: string;
}

export interface ISession {
  user: IUser;
  token: string;
}

export interface IRoute {
  title: string;
  url: string;
}

export interface IObject {
  [key: string]: any;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user?: DefaultUser;
}
