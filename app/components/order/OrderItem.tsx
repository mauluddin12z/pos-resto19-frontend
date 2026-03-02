"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { formatDateToIndonesian } from "../../utils/dateFormat";
import Modal from "../ui/Modal";
import { OrderInterface } from "../../types";
import PaymentStatus from "../payment/PaymentStatus";
import usePayment from "../../hooks/usePayment";
import PaymentSuccessful from "../payment/PaymentSuccessful";
import ActionButtons from "./ActionButtons";
import PaymentModal from "../payment/PaymentModal";
import OrderDetailsTable from "./OrderDetailsTable";
import EditOrderModal from "./EditOrderModal";
import LoadingButton from "../ui/LoadingButton";
import useOrderActions from "@/app/hooks/useOrderActions";
import Invoice from "../invoice/Invoice";
import { useReactToPrint } from "react-to-print";

interface OrderItemProps {
   order: OrderInterface;
   mutate: () => void;
   loading: boolean;
}

const OrderItem = ({ order, mutate }: OrderItemProps) => {
   const { date, time } = formatDateToIndonesian(order?.createdAt);
   const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
      null
   );
   const [modalState, setModalState] = useState<{
      type: "delete" | "payment" | "edit";
      isOpen: boolean;
   } | null>(null);

   const {
      handlePayment,
      isSubmitting: isSubmittingPayment,
      paymentOptions,
      paymentMethod,
      setPaymentMethod,
      paymentSuccess,
      onClosePaymentSuccessAlert,
   } = usePayment({ orderId: order.orderId, mutate });

   const { handleDeleteOrder, isSubmitting: isSubmittingOrder } =
      useOrderActions();

   const closeModal = useCallback(() => setModalState(null), []);

   const openPaymentModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "payment", isOpen: true });
   }, []);

   const openDeleteModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "delete", isOpen: true });
   }, []);

   const openEditModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "edit", isOpen: true });
   }, []);

   const confirmDeleteOrder = useCallback(async () => {
      if (!selectedOrder?.orderId) return;
      await handleDeleteOrder(selectedOrder.orderId, mutate, closeModal);
   }, [selectedOrder, mutate, closeModal]);

   const contentRef = useRef<HTMLDivElement>(null);

   const handlePrint = useReactToPrint({ contentRef });

   return (
      <>
         <div className="flex flex-col justify-between border border-gray-200 rounded-lg p-2 hover:shadow-sm">
            <div className="flex flex-col">
               {/* Order Overview */}
               <div className="flex items-center justify-between flex-wrap border-b border-gray-200 pb-2">
                  <div className="bg-blue-50 rounded-lg p-3.5 text-gray-600 font-medium">{`#${order.orderId}`}</div>
                  <div className="flex flex-col items-end text-gray-600 gap-1">
                     <PaymentStatus status={order.paymentStatus} />
                     <div className="text-xs font-semibold">{date}</div>
                     <div className="text-xs font-light">{time}</div>
                  </div>
               </div>

               {/* Order Table */}
               <OrderDetailsTable order={order} isExpanded={false} />
            </div>

            {/* Action Buttons */}
            <ActionButtons
               onEdit={() => openEditModal(order)}
               onDelete={() => openDeleteModal(order)}
               onPayBill={() => openPaymentModal(order)}
               onPrintInvoice={() => handlePrint()}
               isPaid={order.paymentStatus === "paid"}
            />
         </div>
         {/* Modal for Payment */}
         {modalState?.type === "payment" &&
            modalState.isOpen &&
            selectedOrder && (
               <PaymentModal
                  isOpen={modalState.isOpen}
                  onClose={closeModal}
                  order={selectedOrder}
                  date={date}
                  time={time}
                  paymentOptions={paymentOptions}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  handlePayment={() => handlePayment(closeModal)}
                  isSubmitting={isSubmittingPayment}
               />
            )}

         {/* Edit Modal */}
         {modalState?.type === "edit" && modalState.isOpen && selectedOrder && (
            <EditOrderModal
               isOpen={modalState.isOpen}
               onClose={closeModal}
               selectedOrder={selectedOrder}
               mutate={mutate}
               paymentOptions={paymentOptions}
               paymentMethod={paymentMethod}
               setPaymentMethod={setPaymentMethod}
               handlePayment={() => handlePayment(closeModal)}
            />
         )}

         {/* Delete Confirmation Modal */}
         {modalState?.type === "delete" && modalState.isOpen && (
            <Modal isOpen={modalState.isOpen} onClose={closeModal}>
               <div>
                  <p className="text-center">
                     Are you sure you want to delete this data?
                  </p>
                  <div className="mt-4 gap-4 flex justify-center">
                     <button
                        onClick={confirmDeleteOrder}
                        className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md ${
                           isSubmittingOrder
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                        }`}
                        disabled={isSubmittingOrder}
                     >
                        {isSubmittingOrder ? (
                           <div className="flex gap-2 justify-center items-center">
                              <LoadingButton /> Deleting...
                           </div>
                        ) : (
                           "Yes, delete"
                        )}
                     </button>
                     <button
                        onClick={closeModal}
                        className="bg-gray-200 hover:bg-gray-300  cursor-pointer px-4 py-2 rounded-md"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}

         {/* Payment Success Modal */}
         {paymentSuccess && (
            <PaymentSuccessful
               paymentSuccess={paymentSuccess}
               onClose={onClosePaymentSuccessAlert}
               order={order}
            />
         )}
         {/* Hidden invoice for printing */}
         <div className="hidden">
            <Invoice ref={contentRef} order={order} />
         </div>
      </>
   );
};

export default OrderItem;
