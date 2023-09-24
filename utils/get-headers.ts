import 'server-only';
import { cache } from 'react';
import { getSession } from './get-session';
import { API_KEY } from '@/constants';

export const preload = () => {
  void getSession();
};

export const getHeaders = cache(async (): Promise<HeadersInit> => {
  const { token } = await getSession();

  return {
    authorization: `Bearer ${token}`,
    'api-key': API_KEY,
  };
});
