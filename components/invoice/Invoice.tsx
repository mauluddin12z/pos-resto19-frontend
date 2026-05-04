import React, { forwardRef } from "react";
import { OrderInterface } from "@/types";
import { priceFormat } from "@/utils/priceFormat";
import momentInstance from "@/utils/momentConfig";

interface InvoiceProps {
  order: OrderInterface;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  const date = momentInstance(order.createdAt).format("DD MMMM YYYY");
  const time = momentInstance(order.createdAt).format("HH:mm");

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between border border-gray-200 p-4"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold text-base text=center">Fresh Jus</div>
        <div className="text-xs text=center">Citraland</div>
      </div>
      <div className="border-b border-dashed my-2"></div>
      <div className="flex justify-between">
        <div className="flex gap-x-1">
          <div className="text-xs">Order ID:</div>
          <div className="text-xs">{`${order.orderId}`}</div>
        </div>
        <div className="flex gap-x-1 justify-end">
          <div className="flex flex-col items-end">
            <div className="text-xs">{date}</div>
            <div className="text-xs">{time}</div>
          </div>
        </div>
      </div>
      <div className="border-b border-dashed my-2"></div>
      <table className="w-full text-xs text-center">
        <thead>
          <tr>
            <th scope="col" className="pt-2">
              Qty
            </th>
            <th scope="col" className="pt-2">
              Items
            </th>
            <th scope="col" className="pt-2">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {order.orderDetails.map((item, index) => (
            <tr key={index}>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{item.menu.menuName}</td>
              <td className="py-2">{priceFormat(item.subtotal)}</td>
            </tr>
          ))}
          <tr className="font-bold border-b border-dashed">
            <td colSpan={2} className="pb-2 text-left">
              Total
            </td>
            <td className="pb-2">{priceFormat(order.total)}</td>
          </tr>
          <tr className="font-bold border-b border-dashed">
            <td colSpan={2} className="py-2 text-left">
              Metode Pembayaran
            </td>
            <td className="py-2">{order.paymentMethod}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center items-center p-2">
        <div className="text-xs">Thank you for your order!</div>
      </div>
      <div className="border-b border-dashed my-2"></div>
    </div>
  );
});

Invoice.displayName = "Invoice";

export default Invoice;
