'use client';

import StreamForm from '@/components/StreamForm';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import Table from '@/components/common/Table';
import { StatusEnum } from '@/utils/enums';
import { ICluster } from '@/utils/interfaces/cluster';
import { IStream } from '@/utils/interfaces/stream';
import { IRoute } from '@/utils/interfaces/system';
import { IUser } from '@/utils/interfaces/user';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

function Page({ params }: { params: { id: string } }) {
  const [stream, setStream] = useState<IStream>();
  const [clusters, setClusters] = useState<ICluster[]>([]);
  const [isGrading, setIsGrading] = useState<boolean>(false);

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/streams' },
    { title: 'Update Stream', url: '' },
  ];

  useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch(`/api/v1/clusters`, { method: 'GET' });
      const data = await response.json();

      setClusters(data);
    };

    const fetchStream = async () => {
      const response = await fetch(`/api/v1/streams/${params.id}`, {
        method: 'GET',
      });
      const jsonRes = await response.json();

      setStream(jsonRes);
    };

    fetchStream();
    fetchClusters();
  }, [params.id]);

  const selectedUserIDs = useMemo(
    () =>
      stream?.streamViewers
        ?.filter((item) => item.status === StatusEnum.Active)
        .map((item) => item.viewerID) ?? [],
    [stream?.streamViewers],
  );

  async function fetchUser(options: { page: number; limit: number }): Promise<{
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

  const userColumns = useMemo<ColumnDef<IUser>[]>(
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

  const onUpdate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/streams/${params.id}`, { method: 'PATCH', body });
  };

  const onSuccess = (): void => {
    toast.success('Update stream successfully');
  };

  const onGrandeViewAccess = async (): Promise<void> => {
    setIsGrading(true);

    const response = await fetch(`/api/v1/streams/${params.id}/access`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    setIsGrading(false);
    if (!response.ok) {
      toast.error('Grand user access to stream failed');
      return;
    }
    toast.success('Grand user access to stream successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Update stream failed');
  };

  if (!stream) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Breadcrumb routes={routes} />
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Update stream</h3>
        <StreamForm
          initData={stream}
          clusters={clusters}
          onSubmit={onUpdate}
          onSuccess={onSuccess}
          onFail={onFail}
        />
      </div>
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Grande view access</h3>
        <Table
          columns={userColumns}
          fetchData={fetchUser}
          enableRowSelection
          defaultSelectedIDs={selectedUserIDs}
        />
        <div className="flex mt-4 justify-end gap-4 w-full">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGrandeViewAccess}
            disabled={isGrading}
          >
            {isGrading ? 'Grading...' : 'Grand Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
