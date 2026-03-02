"use client";
import React from "react";
import NumberInput from "../ui/NumberInput";

interface OrderFilterFormProps {
   tempFilters: any;
   setTempFilters: (fn: (prev: any) => any) => void;
   onApply: () => void;
   onClear: () => void;
}

const OrderFilterForm: React.FC<OrderFilterFormProps> = ({
   tempFilters,
   setTempFilters,
   onApply,
   onClear,
}) => {
   return (
      <div className="p-2 w-full max-w-xl mx-auto">
         <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>

         <div className="flex flex-col gap-4">
            {/* Date Range */}
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium">Date Range</label>
               <div className="flex gap-2">
                  <input
                     type="date"
                     value={tempFilters.fromDate}
                     onChange={(e) =>
                        setTempFilters((prev) => ({
                           ...prev,
                           fromDate: e.target.value,
                        }))
                     }
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
                  <input
                     type="date"
                     value={tempFilters.toDate}
                     onChange={(e) =>
                        setTempFilters((prev) => ({
                           ...prev,
                           toDate: e.target.value,
                        }))
                     }
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  />
               </div>
            </div>

            {/* Payment Method Selection */}
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium mb-1">
                  Payment Method
               </label>
               <div className="flex gap-4">
                  {["CASH", "QRIS", "BANK"].map((method) => (
                     <label
                        key={method}
                        className="flex items-center space-x-1 cursor-pointer font-semibold"
                     >
                        <input
                           type="radio"
                           name="paymentMethod"
                           value={method}
                           checked={tempFilters.paymentMethod === method}
                           onChange={(e) =>
                              setTempFilters((prev) => ({
                                 ...prev,
                                 paymentMethod: e.target.value,
                              }))
                           }
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                     </label>
                  ))}
               </div>
            </div>

            {/* Min/Max Total Amount */}
            <div className="flex gap-2">
               <div className="flex flex-col w-full">
                  <label htmlFor="minTotal" className="text-sm font-medium">
                     Min Total
                  </label>
                  <NumberInput
                     id="minTotal"
                     value={tempFilters.minTotal || ""}
                     min={0}
                     onChange={(e) =>
                        setTempFilters((prev) => ({
                           ...prev,
                           minTotal: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                        }))
                     }
                     placeholder="0"
                  />
               </div>
               <div className="flex flex-col w-full">
                  <label htmlFor="maxTotal" className="text-sm font-medium">
                     Max Total
                  </label>
                  <NumberInput
                     id="maxTotal"
                     value={tempFilters.maxTotal || ""}
                     min={0}
                     onChange={(e) =>
                        setTempFilters((prev) => ({
                           ...prev,
                           maxTotal: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                        }))
                     }
                     placeholder="0"
                  />
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
               <button
                  onClick={onClear}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
               >
                  Clear
               </button>
               <button
                  onClick={onApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
               >
                  Apply Filters
               </button>
            </div>
         </div>
      </div>
   );
};

export default OrderFilterForm;
