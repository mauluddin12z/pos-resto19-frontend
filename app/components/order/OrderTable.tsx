import React from "react";
import { OrderInterface } from "../../types";
import { formatDateToIndonesian } from "../../utils/dateFormat";
import { priceFormat } from "../../utils/priceFormat";

interface OrderTableProps {
   orders: OrderInterface[];
   loading: boolean;
   onEdit: (order: OrderInterface) => void;
   onDelete: (order: OrderInterface) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
   orders,
   loading,
   onEdit,
   onDelete,
}) => {
   return (
      <div className="relative overflow-x-auto sm:rounded-lg">
         <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
               <tr>
                  <th scope="col" className="px-6 py-3">
                     Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Order ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3">
                     Total Amount
                  </th>
                  <th
                     scope="col"
                     className="px-6 py-3 bg-gray-50 sticky right-0 text-center"
                  >
                     Action
                  </th>
               </tr>
            </thead>
            <tbody>
               {loading ? (
                  <tr>
                     <td colSpan={5} className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                           Loading...
                        </div>
                     </td>
                  </tr>
               ) : (
                  orders.map((order, index) => (
                     <tr
                        key={index}
                        className="bg-white border-gray-200 border-b font-semibold"
                     >
                        <td className="px-6 py-4">
                           {formatDateToIndonesian(order.createdAt).date},{" "}
                           {formatDateToIndonesian(order.createdAt).time}
                        </td>
                        <td className="px-6 py-4">{order.orderId}</td>
                        <td className="px-6 py-4">{order.paymentMethod}</td>
                        <td className="px-6 py-4">
                           {priceFormat(order.total)}
                        </td>
                        <td className="px-6 py-4 sticky right-0 bg-white">
                           <div className="flex flex-wrap justify-center items-center gap-2">
                              <button
                                 onClick={() => onEdit(order)}
                                 className="font-medium text-blue-600 hover:underline"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => onDelete(order)}
                                 className="font-medium text-red-600 hover:underline"
                              >
                                 Delete
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
   );
};

export default OrderTable;
