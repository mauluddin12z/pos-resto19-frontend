"use client";
import GlobalFilter from "@/components/sales/GlobalFilter";
import MainLayout from "@/components/layout/MainLayout";
import { PageShell } from "@/components/ui/PageShell";
import useSalesAnalytics from "@/hooks/useSalesAnalytics";
import { useOrders } from "@/api/orderServices";
import useGlobalFilter from "@/hooks/useGlobalOrderFilter";
import StatsGrid from "@/components/sales/StatsGrid";
import SalesChart from "@/components/sales/SalesChart";
import TopItems from "@/components/sales/TopItems";
import PaymentList from "@/components/sales/PaymentList";
import CategoryList from "@/components/sales/CategoryList";
import { priceFormat } from "@/utils/priceFormat";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { OrderDetailInterface, OrderInterface } from "@/types";
import Modal from "@/components/ui/Modal";
import SalesTransactionTable from "@/components/sales/SalesTransactionTable";
import { exportToCSV, exportToXLSX } from "@/utils/export";
import momentInstance from "@/utils/momentConfig";

type RangeType = "today" | "thisWeek" | "thisMonth" | "thisYear";

const LABELS: Record<RangeType, string> = {
  today: "Hari Ini",
  thisWeek: "Minggu Ini",
  thisMonth: "Bulan Ini",
  thisYear: "Tahun Ini",
};

export default function PenjualanPage() {
  const { filters, updateFilter, setDate, setDateRange } = useGlobalFilter();
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, isLoading } = useOrders(filters);
  const { orders: analyticsData } = useOrders({ ...filters, pageSize: 100000 });
  const { orders: exportedFile } = useOrders({ ...filters, pageSize: 100000 });
  const analyticsDataList = analyticsData?.data ?? [];
  const orderList = orders?.data ?? [];

  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
    null,
  );

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    updateFilter("searchQuery", debouncedSearch);
  }, [debouncedSearch]);

  const analytics = useSalesAnalytics(
    analyticsDataList,
    filters.dateRange || "",
  );
  const stats = useMemo(
    () => [
      {
        label: "Pendapatan",
        value: priceFormat(analytics.totalRevenue),
        icon: DollarSign,
        bg: "bg-green-100",
        tone: "text-green-600",
      },
      {
        label: "Total Pesanan",
        value: analytics.totalOrders.toString(),
        icon: ShoppingBag,
        bg: "bg-blue-100",
        tone: "text-blue-600",
      },
      {
        label: "Rata-rata",
        value: priceFormat(analytics.avgOrder),
        icon: TrendingUp,
        bg: "bg-purple-100",
        tone: "text-purple-600",
      },
      {
        label: "Item Terjual",
        value: analytics.totalItemsSold.toString(),
        icon: Users,
        bg: "bg-orange-100",
        tone: "text-orange-600",
      },
    ],
    [analytics],
  );

  const statusLabel: Record<string, string> = {
    semua: "Semua",
    paid: "Lunas",
    unpaid: "Belum Bayar",
  };

  const mapOrders = () => {
    return exportedFile?.data?.flatMap((order: OrderInterface) =>
      order.orderDetails.map((d: OrderDetailInterface, i: number) => ({
        orderId: i === 0 ? order.orderId : "",
        tanggal:
          i === 0
            ? momentInstance(order?.createdAt).format("DD MMMM YYYY HH:mm")
            : "",
        item: d.menu.menuName,
        qty: d.quantity,
        subtotal: d.subtotal,
        total: i === 0 ? order.total : "",
        metode: i === 0 ? (order.paymentMethod ?? "—") : "",
        status: i === 0 ? statusLabel[order.paymentStatus] : "",
      })),
    );
  };

  const exportCSV = () => {
    const mapped = mapOrders();

    exportToCSV({
      filename: `${momentInstance(Date.now()).format("DD-MM-YYYY")}_Penjualan_${
        (filters.dateRange && LABELS[filters.dateRange as RangeType]) ||
        `${filters.fromDate}-${filters.toDate}`
      }.csv`,
      headers: [
        "Order ID",
        "Tanggal",
        "Item",
        "Qty",
        "Subtotal",
        "Total",
        "Metode Pembayaran",
        "Status",
      ],
      rows: mapped.map((r: any) => [
        r.orderId,
        r.tanggal,
        r.item,
        r.qty,
        r.subtotal,
        r.total,
        r.metode,
        r.status,
      ]),
    });
  };

  const exportXLSX = async () => {
    const mapped = mapOrders();

    await exportToXLSX({
      filename: `${momentInstance(Date.now()).format("DD-MM-YYYY")}_Penjualan_${
        (filters.dateRange && LABELS[filters.dateRange as RangeType]) ||
        `${filters.fromDate}-${filters.toDate}`
      }.xlsx`,
      data: mapped.map((r: any) => ({
        "Order ID": r.orderId,
        Tanggal: r.tanggal,
        Item: r.item,
        Qty: r.qty,
        Subtotal: r.subtotal,
        Total: r.total,
        "Metode Pembayaran": r.metode,
        Status: r.status,
      })),
    });
  };

  return (
    <MainLayout>
      <PageShell
        title="Penjualan"
        description={`Ringkasan performa penjualan ${analytics.period}`}
      >
        <GlobalFilter
          filters={filters}
          updateFilter={updateFilter}
          setDate={setDate}
          setDateRange={setDateRange}
          isLoading={isLoading}
          exportCSV={exportCSV}
          exportXLSX={exportXLSX}
        />
        <StatsGrid stats={stats} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <SalesChart
            data={analytics.salesData}
            title={`Pendapatan ${analytics.period}`}
            isLoading={isLoading}
          />
          <TopItems items={analytics.topItems} isLoading={isLoading} />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <PaymentList data={analytics.paymentList} isLoading={isLoading} />
          <CategoryList data={analytics.categoryList} isLoading={isLoading} />
        </div>

        <SalesTransactionTable
          orders={orderList}
          pagination={orders?.pagination}
          filters={filters}
          updateFilter={updateFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusLabel={statusLabel}
        />
      </PageShell>
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
    </MainLayout>
  );
}
