import React, { FC, HTMLProps, useEffect, useMemo, useState } from 'react';

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

interface Props<T extends Object> {
  columns: ColumnDef<T>[];
  fetchData: (options: {
    page: number;
    limit: number;
  }) => Promise<{ data: T[]; total: number }>;
  enableRowSelection?: boolean;
  defaultSelectedIDs?: string[];
}

const Table: FC<Props<any>> = ({
  columns,
  enableRowSelection,
  defaultSelectedIDs,
  fetchData,
}) => {
  const [rowSelection, onRowSelectionChange] = React.useState({});
  const [{ pageIndex, pageSize }, onPaginationChange] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = { pageIndex, pageSize };

  const dataQuery = useQuery(
    ['data', fetchDataOptions],
    () =>
      fetchData({
        page: fetchDataOptions.pageIndex,
        limit: fetchDataOptions.pageSize,
      }),
    { keepPreviousData: true },
  );

  const data = useMemo(
    () => dataQuery.data?.data ?? [],
    [dataQuery.data?.data],
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const pageCount = useMemo(() => {
    if (dataQuery.data?.total === undefined) {
      return -1;
    }

    return Math.ceil(dataQuery.data?.total / pageSize);
  }, [dataQuery.data?.total, pageSize]);

  const renderColumns = useMemo(() => {
    if (!enableRowSelection) {
      return columns;
    }

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },

      ...columns,
    ];
  }, [enableRowSelection, columns]);

  const table = useReactTable({
    data,
    pageCount,
    enableRowSelection,
    columns: renderColumns,
    state: { pagination, rowSelection },
    manualPagination: true,
    onPaginationChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    onRowSelectionChange((preState) => {
      return {
        ...preState,
        23: true,
      };
    });
  }, []);

  return (
    <div className="p-2">
      <div className="overflow-x-auto" />
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
    </div>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);
  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);
  return <input type="checkbox" ref={ref} className="checkbox" {...rest} />;
}

export default Table;
