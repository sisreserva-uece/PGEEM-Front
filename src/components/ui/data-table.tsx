'use client';

import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { Skeleton } from './skeleton';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  isLoading?: boolean;
  isError?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading = false,
  isError = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? (
                  Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {table.getAllColumns().map(column => (
                        // eslint-disable-next-line react/no-array-index-key
                        <TableCell key={`skeleton-cell-${rowIndex}-${column.id}`}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : isError
                ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                        Ocorreu um erro ao buscar os dados.
                      </TableCell>
                    </TableRow>
                  )
                : table.getRowModel().rows?.length
                  ? (
                      table.getRowModel().rows.map(row => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          className="bg-background even:bg-muted/40"
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id} className="whitespace-nowrap">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )
                  : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Nenhum resultado encontrado.
                        </TableCell>
                      </TableRow>
                    )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
