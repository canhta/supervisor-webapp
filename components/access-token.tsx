import { useSession } from 'next-auth/react';

export default function Component() {
  const { data } = useSession();

  return <div>Access Token: {JSON.stringify(data?.user)}</div>;
}
