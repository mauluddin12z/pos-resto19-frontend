"use client";

import React, { useCallback, useRef, useState } from "react";
import { OrderInterface, UserInterface } from "../../types";
import { priceFormat } from "@/app/utils/priceFormat";
import PaymentStatus from "../payment/PaymentStatus";
import usePayment from "../../hooks/usePayment";
import PaymentSuccessful from "../payment/PaymentSuccessful";
import ActionButtons from "./ActionButtons";
import PaymentModal from "../payment/PaymentModal";
import EditOrderModal from "./EditOrderModal";
import Modal from "../ui/Modal";
import useOrderActions from "@/app/hooks/useOrderActions";
import Invoice from "../invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import momentInstance from "@/app/utils/momentConfig";

interface Props {
  order: OrderInterface & { user: UserInterface };
  mutate: () => void;
  loading?: boolean;
}

const OrderDetailPanel = ({ order, mutate }: Props) => {
  const [modalState, setModalState] = useState<{
    type: "payment" | "edit" | "delete";
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

  const { handleDeleteOrder } = useOrderActions();

  const closeModal = useCallback(() => setModalState(null), []);

  const openPayment = () => setModalState({ type: "payment", isOpen: true });

  const openEdit = () => setModalState({ type: "edit", isOpen: true });

  const openDelete = () => setModalState({ type: "delete", isOpen: true });

  const confirmDelete = async () => {
    await handleDeleteOrder(order.orderId, mutate, closeModal);
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <>
      {/* ================= DETAIL UI (YOUR STYLE) ================= */}
      <aside className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sticky top-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Pesanan #{order.orderId}</h2>

          <PaymentStatus status={order.paymentStatus} />
        </div>

        {/* META */}
        <p className="mt-1 text-xs text-muted-foreground">
          {moment(order.createdAt).format("DD MMMM YYYY HH:mm")}· Kasir{" "}
          {order.user?.name ?? "-"} · {order.paymentMethod ?? "-"}
        </p>

        {/* ITEMS */}
        <ul className="mt-4 flex flex-col gap-3">
          {order.orderDetails.map((d) => (
            <li key={d.orderDetailId} className="flex items-center gap-3">
              {/* IMAGE */}
              {d.menu.menuImageUrl && (
                <img
                  src={d.menu.menuImageUrl}
                  alt={d.menu.menuName}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}

              {/* NAME + DESC */}
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.menu.menuName}</p>

                <p className="text-xs text-muted-foreground">
                  {d.quantity} × {priceFormat(d.price)}
                </p>

                {d.notes && (
                  <p className="text-xs italic text-muted-foreground">
                    “{d.notes}”
                  </p>
                )}
              </div>

              {/* SUBTOTAL */}
              <p className="text-sm font-bold tabular-nums">
                {priceFormat(d.subtotal)}
              </p>
            </li>
          ))}
        </ul>

        {/* TOTAL */}
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold tabular-nums">
              {priceFormat(order.total)}
            </span>
          </div>

          {order.paymentMethod && (
            <div className="mt-2 text-xs text-muted-foreground">
              Payment: {order.paymentMethod}
            </div>
          )}
        </div>

        {/* ACTIONS (ALL FEATURES HERE) */}
        <div className="mt-5">
          <ActionButtons
            onPayBill={openPayment}
            onEdit={openEdit}
            onDelete={openDelete}
            onPrintInvoice={handlePrint}
            isPaid={order.paymentStatus === "paid"}
          />
        </div>
      </aside>

      {/* ================= PAYMENT ================= */}
      {modalState?.type === "payment" && (
        <PaymentModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          order={order}
          date={momentInstance(order.createdAt).format("DD MMMM YYYY")}
          time={momentInstance(order.createdAt).format("HH:mm")}
          paymentOptions={paymentOptions}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handlePayment={() => handlePayment(closeModal)}
          isSubmitting={isSubmittingPayment}
        />
      )}

      {/* ================= EDIT ================= */}
      {modalState?.type === "edit" && (
        <EditOrderModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          selectedOrder={order}
          mutate={mutate}
          paymentOptions={paymentOptions}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handlePayment={() => handlePayment(closeModal)}
        />
      )}

      {/* ================= DELETE ================= */}
      {modalState?.type === "delete" && (
        <Modal isOpen={modalState.isOpen} onClose={closeModal}>
          <div className="text-center">
            <p>Delete this order?</p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

              <button
                onClick={closeModal}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= SUCCESS ================= */}
      {paymentSuccess && (
        <PaymentSuccessful
          paymentSuccess={paymentSuccess}
          onClose={onClosePaymentSuccessAlert}
          order={order}
        />
      )}

      {/* ================= PRINT ================= */}
      <div className="hidden">
        <Invoice ref={contentRef} order={order} />
      </div>
    </>
  );
};

export default OrderDetailPanel;
