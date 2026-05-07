"use client";

import React from "react";
import SkeletonLoading from "../ui/SkeletonLoading";
import { OrderInterface, UserInterface } from "@/types";
import momentInstance from "@/utils/momentConfig";
import { priceFormat } from "@/utils/priceFormat";
import PaymentStatus from "../payment/PaymentStatus";
import { ArrowDown, ArrowDownUp } from "lucide-react";
import {
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

export interface OrderTableInterface {
  orders: (OrderInterface & { user: UserInterface })[];
  isLoading: boolean;
  selectedOrderId: number | null;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number | null>>;
  updateFilter: any;
  filters: any;
}

export default function OrderTable({
  orders,
  isLoading,
  selectedOrderId,
  setSelectedOrderId,
  updateFilter,
  filters,
}: OrderTableInterface) {
  const handleSort = (field: string) => {
    let newSort = field;

    if (filters.sort === field) {
      newSort = `-${field}`;
    } else if (filters.sort === `-${field}`) {
      newSort = field;
    }

    updateFilter((prev: any) => ({
      ...prev,
      sort: newSort,
      page: 1,
    }));
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-3 text-left">
              <SortableHeader
                label="ID"
                field="orderId"
                currentSort={filters.sort}
                onSort={handleSort}
              />
            </TableHead>

            <TableHead className="p-3 text-left">
              <SortableHeader
                label="Waktu"
                field="createdAt"
                currentSort={filters.sort}
                onSort={handleSort}
              />
            </TableHead>

            <TableHead className="p-3 text-left">Kasir</TableHead>

            <TableHead className="p-3 text-left">Item</TableHead>

            <TableHead className="text-left">
              <SortableHeader
                label="Total"
                field="total"
                currentSort={filters.sort}
                onSort={handleSort}
              />
            </TableHead>

            <TableHead className="text-center">
              <SortableHeader
                label="Status"
                field="paymentStatus"
                currentSort={filters.sort}
                onSort={handleSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="w-full h-3.5">
                      <SkeletonLoading />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : orders?.map((o) => (
                <TableRow
                  key={o.orderId}
                  onClick={() => setSelectedOrderId(o.orderId)}
                  className={`cursor-pointer ${
                    selectedOrderId === o.orderId ? "bg-blue-50" : ""
                  }`}
                >
                  <TableCell className="p-3 font-semibold">
                    #{o.orderId}
                  </TableCell>

                  <TableCell className="p-3 text-muted-foreground">
                    {momentInstance(o.createdAt).format("DD MMMM YYYY HH:mm")}
                  </TableCell>

                  <TableCell>{o.user?.name}</TableCell>

                  <TableCell className="p-3 text-muted-foreground">
                    {o.orderDetails.length} item
                  </TableCell>

                  <TableCell className="p-3 text-left font-bold">
                    {priceFormat(o.total)}
                  </TableCell>

                  <TableCell className="text-left">
                    <PaymentStatus status={o.paymentStatus} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
