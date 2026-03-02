"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faShoppingCart,
   faMoneyBillWave,
   faStar,
   faDollarSign,
   faCreditCard,
   faCalculator, // icon for average order value
} from "@fortawesome/free-solid-svg-icons";
import { priceFormat } from "@/app/utils/priceFormat";
import { useMenus } from "@/app/api/menuServices";
import { useOrders } from "@/app/api/orderServices";
import { OrderFilterInterface, OrderInterface } from "@/app/types";

export default function SummaryCards() {
   // Filters for all orders
   const [orderFilters] = useState<OrderFilterInterface>({
      minTotal: null,
      maxTotal: null,
      paymentMethod: "",
      searchQuery: "",
      page: 1,
      pageSize: 1000,
      sortBy: "createdAt",
      sortOrder: "desc",
      dateRange: "",
      fromDate: "",
      toDate: "",
      paymentStatus: "paid",
   });

   // Filters for today's orders
   const [todayOrderFilters] = useState<OrderFilterInterface>({
      ...orderFilters,
      dateRange: "today",
      page: 1,
      pageSize: 1000,
   });

   // Filter for most ordered menus
   const [menuFilters] = useState({ mostOrdered: true, sortOrder: "desc" });

   // Fetch all orders
   const { orders: ordersResponse, isLoading: loadingOrders } =
      useOrders(orderFilters);
   // Fetch today's orders
   const { orders: ordersTodayResponse, isLoading: loadingRevenueToday } =
      useOrders(todayOrderFilters);
   // Fetch most ordered menus
   const { menus: menusResponse, isLoading: loadingMenus } =
      useMenus(menuFilters);

   // Extract arrays safely (default to empty array)
   const allOrders = ordersResponse?.data ?? [];
   const ordersToday = ordersTodayResponse?.data ?? [];
   const menus = menusResponse?.data ?? [];

   // Calculate total orders count
   const totalOrders = allOrders.length;

   // Calculate revenue today by summing order totals
   const revenueToday = ordersToday.reduce(
      (sum: number, order: OrderInterface) => sum + (order.total || 0),
      0
   );

   // Calculate total revenue all time
   const totalRevenue = allOrders.reduce(
      (sum: number, order: OrderInterface) => sum + (order.total || 0),
      0
   );

   // Determine most popular payment method
   const paymentMethodCount: Record<string, number> = {};
   allOrders.forEach((order: OrderInterface) => {
      if (order.paymentMethod) {
         paymentMethodCount[order.paymentMethod] =
            (paymentMethodCount[order.paymentMethod] || 0) + 1;
      }
   });

   const mostPopularPaymentMethod =
      Object.entries(paymentMethodCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "No data";

   // Get most ordered menu name or fallback text
   const mostOrdered = menus.length > 0 ? menus[0].menuName : "No data";

   // Calculate average order value
   const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
         {/* Total Orders */}
         <div className="p-5 bg-blue-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Total Orders
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingOrders ? "Loading..." : totalOrders}
               </p>
            </div>
         </div>

         {/* Total Revenue */}
         <div className="p-5 bg-yellow-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-yellow-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faDollarSign} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Total Revenue
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingOrders
                     ? "Loading..."
                     : `Rp ${priceFormat(totalRevenue)}`}
               </p>
            </div>
         </div>

         {/* Revenue Today */}
         <div className="p-5 bg-green-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-green-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Revenue Today
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingRevenueToday
                     ? "Loading..."
                     : `Rp ${priceFormat(revenueToday)}`}
               </p>
            </div>
         </div>

         {/* Average Order Value */}
         <div className="p-5 bg-teal-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-teal-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faCalculator} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Avg. Order Value
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingOrders
                     ? "Loading..."
                     : `Rp ${priceFormat(avgOrderValue)}`}
               </p>
            </div>
         </div>

         {/* Most Ordered Menu */}
         <div className="p-5 bg-purple-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-purple-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faStar} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Most Ordered Menu
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingMenus ? "Loading..." : mostOrdered}
               </p>
            </div>
         </div>

         {/* Most Popular Payment */}
         <div className="p-5 bg-indigo-100 rounded-lg shadow flex items-center gap-4">
            <div className="bg-indigo-500 text-white p-3 rounded-full">
               <FontAwesomeIcon icon={faCreditCard} size="lg" />
            </div>
            <div>
               <h3 className="text-sm font-semibold text-gray-600">
                  Most Popular Payment
               </h3>
               <p className="text-2xl font-bold text-gray-800">
                  {loadingOrders ? "Loading..." : mostPopularPaymentMethod}
               </p>
            </div>
         </div>
      </div>
   );
}
