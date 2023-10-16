"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type OrderColumn = {
  id: string;
  customer: string;
  customer_email: string;
  product: string;
  quantity: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "customer",
    header: "Customer Name",
  },
  {
    accessorKey: "customer_email",
    header: "Customer Email",
  },
  {
    accessorKey: "product",
    header: "Product",
  }, 
  {
    accessorKey: "quantity",
    header: "Quantity"
  },
  {
    accessorKey:"createdAt",
    header: "Date"
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
