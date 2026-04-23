"use client";

import React, { useMemo, useState, useCallback } from "react";
import { TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import { useOrders } from "../api/orderServices";
import { PageShell } from "../components/ui/PageShell";
import Loading from "../loading";
import useSalesAnalytics from "../hooks/useSalesAnalytics";

import { priceFormat } from "../utils/priceFormat";
import RangeFilter from "../components/sales/RangeFilter";
import StatsGrid from "../components/sales/StatsGrid";
import SalesChart from "../components/sales/SalesChart";
import TopItems from "../components/sales/TopItems";
import PaymentList from "../components/sales/PaymentList";
import CategoryList from "../components/sales/CategoryList";

export default function PenjualanPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 100,
    paymentStatus: "paid",
    sortBy: "createdAt",
    sortOrder: "desc",
    dateRange: "thisWeek",
  });

  const { orders, isLoading } = useOrders(filters);
  const orderList = orders?.data ?? [];

  const analytics = useSalesAnalytics(orderList, filters.dateRange);

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

  const changeRange = useCallback((range: string) => {
    setFilters((p) => ({ ...p, dateRange: range }));
  }, []);

  return (
    <MainLayout>
      <PageShell
        title="Penjualan"
        description={`Ringkasan performa penjualan ${analytics.period}`}
      >
        <div className="p-4">
          <RangeFilter value={filters.dateRange} onChange={changeRange} isLoading={isLoading} />
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
        </div>
      </PageShell>
    </MainLayout>
  );
}
