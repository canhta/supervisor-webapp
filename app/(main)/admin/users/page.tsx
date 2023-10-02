'use client';
import React, { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import { IRoute } from '@/utils/interfaces/system';
import { IUser } from '@/utils/interfaces/user';
import Table from '@/components/common/Table';
import { ColumnDef } from '@tanstack/react-table';

export default function Page() {
  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'User Management', url: '' },
  ];

  async function fetchData(options: { page: number; limit: number }): Promise<{
    data: IUser[];
    total: number;
  }> {
    const response = await fetch(
      `/api/v1/users?page=${options.page}&limit=${options.limit}`,
      { method: 'GET' },
    );
    const { data, total } = await response.json();

    return { data, total };
  }

  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

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
          <Table columns={columns} fetchData={fetchData} />
        </div>
      }
    </Suspense>
  );
}
