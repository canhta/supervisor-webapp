'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute } from '@/utils/interfaces/system';
import { IUser } from '@/utils/interfaces/user';
import Table from '@/components/common/Table';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { ColumnDef } from '@tanstack/react-table';
import ConfirmModal from '@/components/common/ConfirmModal';

const htmlForDelete = 'delete-user-modal';

export default function Page() {
  const router = useRouter();
  const [deletingID, setDeletingID] = useState<IUser['id'] | null>(null);
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

  const onDeleteSubmit = async () => {
    if (deletingID) {
      const res = await fetch(`/api/v1/users/${deletingID}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Something went wrong, please try again later.');
      } else {
        toast.success('User deleted successfully.');

        // TODO: Reload data
      }
    }
  };

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
      {
        header: 'Actions',
        cell(props) {
          const onEditClick = () => {
            router.push(`/admin/users/${props.row.original.id}`);
          };

          const onDeleteClicked = () => {
            setDeletingID(props.row.original.id);
          };

          return (
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline" onClick={onEditClick}>
                <EditIcon />
              </button>
              <label
                className="btn btn-sm btn-outline btn-error"
                htmlFor={htmlForDelete}
                onClick={onDeleteClicked}
              >
                <DeleteIcon />
              </label>
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
              href={'/admin/users/create'}
            >
              Create
            </Link>
          </div>
          <Table columns={columns} fetchData={fetchData} />
        </div>
      }
      <ConfirmModal
        htmlFor={htmlForDelete}
        title={'Delete User'}
        content={'Are you sure you want to delete this user?'}
        onClose={() => {
          setDeletingID(null);
        }}
        onSubmit={onDeleteSubmit}
      />
    </Suspense>
  );
}
