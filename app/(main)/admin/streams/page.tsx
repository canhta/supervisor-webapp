'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute } from '@/utils/interfaces/system';
import { IStream } from '@/utils/interfaces/stream';
import { ColumnDef } from '@tanstack/react-table';
import Table from '@/components/common/Table';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

export default function Page() {
  const router = useRouter();

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '' },
  ];

  async function fetchData(options: { page: number; limit: number }): Promise<{
    data: IStream[];
    total: number;
  }> {
    const response = await fetch(
      `/api/v1/streams?page=${options.page}&limit=${options.limit}`,
      { method: 'GET' },
    );
    const { data, total } = await response.json();

    return { data, total };
  }

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'address', header: 'Address' },
      { accessorKey: 'status', header: 'Status' },
      {
        header: 'Actions',
        cell(props) {
          const onEditClick = () => {
            router.push(`/admin/streams/${props.row.original.id}`);
          };

          return (
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline" onClick={onEditClick}>
                <EditIcon />
              </button>
              <button className="btn btn-sm btn-outline btn-error">
                <DeleteIcon />
              </button>
            </div>
          );
        },
      },
    ],
    [router],
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
              href={'/admin/streams/create'}
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
