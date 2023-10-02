'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import Table, { ITableAction } from '@/components/common/CTable';
import { IRoute } from '@/utils/interfaces/system';
import { IStream } from '@/utils/interfaces/stream';

export default function Page() {
  const router = useRouter();
  const [streams, setStreams] = useState<IStream[]>([]);

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '' },
  ];

  useEffect(() => {
    const init = async () => {
      const response = await fetch(`/api/v1/streams`, { method: 'GET' });
      const data = await response.json();

      setStreams(data);
    };

    init();
  }, []);

  const renderKeys: (keyof IStream)[] = ['name', 'address', 'status'];

  const actions: ITableAction[] = [
    {
      label: 'Edit',
      onClick: (id: string) => {
        router.push(`/admin/streams/${id}`);
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
              href={'/admin/streams/create'}
            >
              Create
            </Link>
          </div>
          <Table data={streams} keys={renderKeys} actions={actions} />
        </div>
      }
    </Suspense>
  );
}
