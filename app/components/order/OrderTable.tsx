import React from "react";
import SkeletonLoading from "../ui/SkeletonLoading";
import { OrderInterface, UserInterface } from "@/app/types";
import momentInstance from "@/app/utils/momentConfig";
import { priceFormat } from "@/app/utils/priceFormat";
import PaymentStatus from "../payment/PaymentStatus";
export interface OrderTableInterface {
  orders: (OrderInterface & { user: UserInterface })[];
  isLoading: boolean;
  selectedOrderId: number | null;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function OrderTable({
  orders,
  isLoading,
  selectedOrderId,
  setSelectedOrderId,
}: OrderTableInterface) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tanggal</th>
            <th className="p-3 text-left">Kasir</th>
            <th className="p-3 text-left">Item</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-3">
                    <SkeletonLoading />
                  </td>
                </tr>
              ))
            : orders?.map((o: OrderInterface & { user: UserInterface }) => (
                <tr
                  key={o.orderId}
                  onClick={() => setSelectedOrderId(o.orderId)}
                  className={`cursor-pointer border-t hover:bg-gray-50 ${
                    selectedOrderId === o.orderId ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3 font-semibold">#{o.orderId}</td>
                  <td className="p-3 text-gray-500">
                    {momentInstance(o.createdAt).format("DD MMMM YYYY HH:mm")}
                  </td>
                  <td className="p-3">{o.user?.name}</td>
                  <td className="p-3 text-gray-500">
                    {o.orderDetails.length} item
                  </td>
                  <td className="p-3 text-right font-bold">
                    {priceFormat(o.total)}
                  </td>
                  <td className="p-3 text-center">
                    <PaymentStatus status={o.paymentStatus} />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
