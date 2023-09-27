import 'server-only';
import { cache } from 'react';
import { getServerSession } from 'next-auth';
import { ISession } from '@/utils/interfaces';
import { authOptions } from './auth';

export const preload = () => {
  void getServerSession(authOptions);
};

export const getSession = cache(async (): Promise<ISession> => {
  return (await getServerSession(authOptions)) as ISession;
});
