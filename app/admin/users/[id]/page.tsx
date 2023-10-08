'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import UserForm from '@/components/UserForm';
import { IUser } from '@/utils/interfaces/user';
import { IRoute } from '@/utils/interfaces/system';

function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<IUser>();

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/users' },
    { title: 'Update Stream', url: '' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/v1/users/${params.id}`, {
        method: 'GET',
      });
      const user: IUser = await response.json();

      setUser(user);
    };

    fetchUser();
  }, [params.id]);

  const onUpdate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/users/${params.id}`, { method: 'PATCH', body });
  };

  const onSuccess = (): void => {
    toast.success('Update user successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Update user failed');
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Breadcrumb routes={routes} />
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Update stream</h3>
        <UserForm
          initData={user}
          onSubmit={onUpdate}
          onSuccess={onSuccess}
          onFail={onFail}
        />
      </div>
    </div>
  );
}

export default Page;
