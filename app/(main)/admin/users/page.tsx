'use client';
import { Suspense, useEffect, useState } from 'react';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute, IUser } from '@/interfaces';
import Table, { ITableAction } from '@/components/common/Table';
import Link from 'next/link';

export default function Page() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const init = async () => {
      const response = await fetch(`/api/users`, { method: 'GET' });
      const { data } = await response.json();
      setUsers(data);
    };

    init();
  }, []);

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

  const actions: ITableAction[] = [
    {
      label: 'Edit',
      onClick: (id: string) => {
        console.log(id);
      },
    },
    {
      label: 'Delete',
      onClick: (id: string) => {
        console.log(id);
      },
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Breadcrumb routes={routes} />
            <Link
              type="button"
              className="btn btn-sm btn-primary"
              href={'/admin/users/create'}
            >
              Create
            </Link>
          </div>
          <Table data={users} keys={renderKeys} actions={actions} />
        </div>
      }
    </Suspense>
  );
}
