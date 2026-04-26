"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "../ui/Button";
import Search from "../ui/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { priceFormat } from "@/app/utils/priceFormat";
import momentInstance from "@/app/utils/momentConfig";
import Modal from "../ui/Modal";
import { OrderInterface } from "@/app/types";

type Props = {
  orders: OrderInterface[];
  pagination?: any;
  filters: any;
  updateFilter: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusLabel: Record<string, string>;
};

export default function SalesTransactionTable({
  orders,
  pagination,
  filters,
  updateFilter,
  searchQuery,
  setSearchQuery,
  statusLabel,
}: Props) {
  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
    null,
  );

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold">Transaksi Penjualan</h2>
          <p className="text-xs text-muted-foreground">
            Data mentah untuk audit dan analisis detail
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Cari order, kasir, menu..."
            width="max-w-fit"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="font-semibold">#{order.orderId}</TableCell>

              <TableCell className="text-muted-foreground">
                {momentInstance(order.createdAt).format("DD MMMM YYYY HH:mm")}
              </TableCell>

              <TableCell>{order.orderDetails.length} item</TableCell>

              <TableCell>
                <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary text-nowrap">
                  {statusLabel[order.paymentStatus]}
                </span>
              </TableCell>

              <TableCell className="font-bold tabular-nums">
                {priceFormat(order.total)}
              </TableCell>

              <TableCell>
                <Button
                  variant="default"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Halaman {filters.page} dari {pagination?.totalPages} •{" "}
          {pagination?.totalItems} transaksi
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={filters.page === 1}
            onClick={() => updateFilter("page", Math.max(1, filters.page - 1))}
            className="p-2 aspect-square border border-border hover:bg-secondary rounded-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            disabled={pagination?.hasNextPage === false}
            onClick={() =>
              updateFilter(
                "page",
                Math.min(pagination?.totalPages, filters.page + 1),
              )
            }
            className="p-2 aspect-square border border-border hover:bg-secondary rounded-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Detail Transaksi #${selectedOrder?.orderId}`}
        description="Rincian item, kasir, pembayaran, dan catatan pesanan."
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Metode</p>
                <p className="font-semibold">
                  {selectedOrder.paymentMethod ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold">
                  {statusLabel[selectedOrder.paymentStatus]}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedOrder.orderDetails.map((detail) => (
                <div
                  key={detail.orderDetailId}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div>
                    <p className="font-semibold">{detail.menu.menuName}</p>

                    <p className="text-xs text-muted-foreground">
                      {detail.quantity} x {priceFormat(detail.price)}
                      {detail.notes ? ` • ${detail.notes}` : ""}
                    </p>
                  </div>

                  <p className="font-bold tabular-nums">
                    {priceFormat(detail.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold">Total Transaksi</span>
              <span className="text-xl font-bold tabular-nums">
                {priceFormat(selectedOrder.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
