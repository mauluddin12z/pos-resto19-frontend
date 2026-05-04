"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useOrders } from "@/api/orderServices";
import {
  OrderFilterInterface,
  OrderInterface,
  UserInterface,
} from "@/types";
import { PageShell } from "@/components/ui/PageShell";
import Pagination from "@/components/ui/Pagination";
import OrderDetailPanel from "@/components/order/OrderDetailPanel";
import Search from "@/components/ui/Search";
import OrderTable from "@/components/order/OrderTable";

export default function Page() {
  const [orderFilters, setOrderFilters] = useState<OrderFilterInterface>({
    minTotal: null,
    maxTotal: null,
    paymentMethod: "",
    searchQuery: "",
    page: 1,
    pageSize: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
    dateRange: "",
    fromDate: "",
    toDate: "",
    paymentStatus: "",
  });

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { orders, isLoading: loadingOrders, mutate } = useOrders(orderFilters);

  const selected =
    orders?.data?.find((o: OrderInterface) => o.orderId === selectedOrderId) ||
    orders?.data?.[0];

  const handleSearch = (value: string) => {
    setOrderFilters((p) => ({ ...p, searchQuery: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setOrderFilters((p) => ({
      ...p,
      paymentStatus: status === "semua" ? "" : status,
      page: 1,
    }));
  };

  const statusFilters = ["semua", "paid", "unpaid"];

  const statusLabel: Record<string, string> = {
    semua: "Semua",
    paid: "Lunas",
    unpaid: "Belum Bayar",
  };

  return (
    <MainLayout>
      <PageShell title="Pesanan" description="Kelola transaksi & pembayaran">
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* ================= TABLE ================= */}
          <section className="min-w-0 rounded-2xl border bg-card">
            {/* FILTER */}
            <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
              <Search
                searchQuery={orderFilters.searchQuery}
                setSearchQuery={handleSearch}
                width="min-w-56"
              />
              <div className="flex flex-wrap gap-1.5">
                {statusFilters.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusFilter(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      orderFilters.paymentStatus === s ||
                      (s === "semua" && !orderFilters.paymentStatus)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <OrderTable
              orders={orders?.data}
              isLoading={loadingOrders}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
            />

            {/* PAGINATION */}
            <div className="p-4 flex justify-center">
              <Pagination
                totalItems={orders?.pagination?.totalItems ?? 0}
                totalPages={orders?.pagination?.totalPages ?? 1}
                currentPage={orders?.pagination?.currentPage ?? 1}
                pageSize={orders?.pagination?.pageSize ?? 10}
                hasNextPage={orders?.pagination?.hasNextPage ?? false}
                isLoading={loadingOrders}
                onPageChange={(page: number) =>
                  setOrderFilters((p) => ({ ...p, page }))
                }
              />
            </div>
          </section>

          {/* ================= RIGHT DETAIL (YOUR COMPONENT) ================= */}
          <aside>
            {selected ? (
              <OrderDetailPanel
                order={selected}
                mutate={mutate}
                loading={loadingOrders}
              />
            ) : (
              <div className="rounded-2xl border bg-card p-5 text-gray-500">
                Pilih pesanan untuk melihat detail
              </div>
            )}
          </aside>
        </div>
      </PageShell>
    </MainLayout>
  );
}
