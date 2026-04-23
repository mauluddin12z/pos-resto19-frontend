import { useMemo } from "react";
import { OrderDetailInterface, OrderInterface, TopItem } from "../types";

export default function useSalesAnalytics(
  orderList: OrderInterface[],
  dateRange: string,
) {
  return useMemo(() => {
    const { totalRevenue, totalOrders, avgOrder } =
      calculateBasicStats(orderList);

    const totalItemsSold = calculateItemsSold(orderList);

    const { labels, groupKey, period } = getChartConfig(dateRange);

    const { salesData, max } = buildSalesData(orderList, labels, groupKey);

    const topItems = calculateTopItems(orderList);
    const paymentList = calculatePaymentStats(orderList);
    const categoryList = calculateCategoryStats(orderList);

    return {
      totalRevenue,
      totalOrders,
      avgOrder,
      totalItemsSold,
      salesData,
      topItems,
      paymentList,
      categoryList,
      period,
      max,
    };
  }, [orderList, dateRange]);
}

function calculateBasicStats(orderList: OrderInterface[]) {
  const totalRevenue = orderList.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orderList.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  return { totalRevenue, totalOrders, avgOrder };
}

function calculateItemsSold(orderList: OrderInterface[]) {
  return orderList.reduce((sum, order) => {
    return sum + order.orderDetails.reduce((s, d) => s + d.quantity, 0);
  }, 0);
}

function getChartConfig(dateRange: string) {
  if (dateRange === "thisWeek") {
    return {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      groupKey: (date: Date) => (date.getDay() + 6) % 7,
      period: "Mingguan",
    };
  }

  if (dateRange === "thisMonth") {
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return {
      labels: Array.from({ length: days }, (_, i) => (i + 1).toString()),
      groupKey: (date: Date) => date.getDate() - 1,
      period: "Bulanan",
    };
  }

  return {
    labels: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    groupKey: (date: Date) => date.getMonth(),
    period: "Tahunan",
  };
}

function buildSalesData(
  orderList: OrderInterface[],
  labels: string[],
  groupKey: (date: Date) => number,
) {
  const grouped: Record<
    number,
    { label: string; revenue: number; orders: number }
  > = {};

  labels.forEach((label, i) => {
    grouped[i] = { label, revenue: 0, orders: 0 };
  });

  orderList.forEach((order) => {
    const key = groupKey(new Date(order.createdAt));

    if (grouped[key]) {
      grouped[key].revenue += order.total || 0;
      grouped[key].orders += 1;
    }
  });

  const salesData = Object.values(grouped);

  const max = salesData.length
    ? Math.max(...salesData.map((d) => d.revenue))
    : 1;

  return { salesData, max };
}

function calculateTopItems(orderList: OrderInterface[]) {
  const itemMap: Record<string, TopItem> =
    {};

  orderList.forEach((order) => {
    order.orderDetails.forEach((detail) => {
      const menu = detail.menu;
      if (!menu) return;

      if (!itemMap[menu.menuId]) {
        itemMap[menu.menuId] = {
          item: menu,
          sold: 0,
          revenue: 0,
        };
      }

      itemMap[menu.menuId].sold += detail.quantity;
      itemMap[menu.menuId].revenue += detail.subtotal;
    });
  });

  return Object.values(itemMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
}

function calculatePaymentStats(orderList: OrderInterface[]) {
  const paymentStats: Record<string, number> = {};

  orderList.forEach((order) => {
    const method = order.paymentMethod || "UNKNOWN";

    if (!paymentStats[method]) paymentStats[method] = 0;
    paymentStats[method] += order.total || 0;
  });

  return Object.entries(paymentStats).map(([method, total]) => ({
    method,
    total,
  }));
}

function calculateCategoryStats(orderList: OrderInterface[]) {
  const categoryMap: Record<string, number> = {};

  orderList.forEach((order) => {
    order.orderDetails.forEach((detail) => {
      const category = detail.menu?.category?.categoryName || "Lainnya";

      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += detail.subtotal;
    });
  });

  return Object.entries(categoryMap).map(([name, total]) => ({
    name,
    total,
  }));
}
