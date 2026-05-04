import { OrderDetailInterface, OrderInterface } from "@/types";
import { priceFormat } from "@/utils/priceFormat";

// Reusable component for Order Details Table
const OrderDetailsTable = ({
   order,
   isExpanded,
}: {
   order: OrderInterface;
   isExpanded: boolean;
}) => {
   const orderDetails = order.orderDetails;
   const displayedDetails = isExpanded
      ? orderDetails
      : orderDetails.slice(0, 4);
   const total = orderDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
   );

   return (
      <table className="w-full text-xs text-center text-gray-600 border-b border-gray-200">
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
            {displayedDetails.map((item, index) => (
               <tr
                  key={index}
                  className="bg-white border-gray-200 text-gray-600"
               >
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{item.menu.menuName}</td>
                  <td className="py-2">{priceFormat(item.price)}</td>
               </tr>
            ))}
            {!isExpanded && orderDetails.length > 4 && (
               <tr className="bg-white border-gray-200 text-gray-600">
                  <td className="pb-2">....</td>
                  <td className="pb-2">....</td>
                  <td className="pb-2">....</td>
               </tr>
            )}
            <tr className="bg-white border-gray-200 border-t text-gray-600 font-bold">
               <td colSpan={2} className="text-left py-2">
                  Total
               </td>
               <td className="py-2">{priceFormat(total)}</td>
            </tr>
            {/* Payment Method */}
            {order.paymentMethod && (
               <tr className="bg-white border-gray-200 border-t text-gray-600 font-bold">
                  <td colSpan={2} className="text-left py-2">
                     Payment Method
                  </td>
                  <td className="py-2">{order.paymentMethod}</td>
               </tr>
            )}
         </tbody>
      </table>
   );
};

export default OrderDetailsTable;
