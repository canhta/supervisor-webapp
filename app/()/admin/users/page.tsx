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
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'status', header: 'Status' },
      {
        header: 'Can Stream',
        cell(props) {
          return (
            <input
              type="checkbox"
              checked={props.row.original.canStream}
              className="checkbox"
              readOnly
            />
          );
        },
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
