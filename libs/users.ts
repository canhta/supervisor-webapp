import { ENDPOINT_URL } from '@/constants';
import { IUser } from '@/interfaces';
import { getHeaders } from '@/utils/get-headers';

export const getUsers = async (): Promise<IUser[]> => {
  const headers = await getHeaders();
  const response = await fetch(`${ENDPOINT_URL}/api/v1/users`, {
    headers,
    method: 'GET',
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch users');
  }

  const { data } = await response.json();

  return data;
};
