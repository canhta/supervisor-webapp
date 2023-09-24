import { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import { getUsers } from '@/libs/users';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute, IUser } from '@/interfaces';
import CreateUserModal from '@/components/CreateUserModal';
import Table from '@/components/common/Table';

export default async function Page() {
  const users = await getUsers();
  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'User Management', url: '' },
  ];

  const renderKeys: (keyof IUser)[] = [
    'firstName',
    'lastName',
    'email',
    'status',
    'role',
  ];

  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Breadcrumb routes={routes} />
            <div className="actions">
              <CreateUserModal title="Create" />
            </div>
          </div>
          <Table data={users} keys={renderKeys} />
        </div>
      }
    </Suspense>
  );
}
