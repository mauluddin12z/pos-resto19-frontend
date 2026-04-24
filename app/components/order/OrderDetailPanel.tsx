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
import useOrderActions from "@/app/hooks/useOrderActions";
import Invoice from "../invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import momentInstance from "@/app/utils/momentConfig";
import Modal from "../ui/Modal";
import { CreditCard, ReceiptText, Trash2 } from "lucide-react";
import { Field } from "../ui/Field";
import PaymentMethod from "../payment/PaymentMethod";
import { Button } from "../ui/Button";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    await handleDeleteOrder(order.orderId, mutate, closeModal);
    setIsDeleting(false);
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

      {modalState?.type === "payment" && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={`Bayar Pesanan ${order ? `#${order.orderId}` : ""}`}
          description="Pilih metode pembayaran dan konfirmasi transaksi."
          icon={<ReceiptText className="h-5 w-5" />}
          size="md"
          footer={
            <>
              <Button variant="default" onClick={closeModal}>
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={() => handlePayment(closeModal)}
              >
                <div className="flex items-center justify-center gap-x-2">
                  <CreditCard className="h-4 w-4" /> Proses Bayar
                </div>
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div className="rounded-xl bg-primary-soft px-4 py-3 text-sm font-bold text-primary">
                  #{order?.orderId}
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  {order?.createdAt.slice(0, 16)}
                </p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {order?.orderDetails.map((detail) => (
                  <div
                    key={detail.orderDetailId}
                    className="grid grid-cols-[40px_1fr_auto] gap-3"
                  >
                    <span className="text-muted-foreground">
                      {detail.quantity}×
                    </span>
                    <span>{detail.menu.menuName}</span>
                    <span className="font-semibold tabular-nums">
                      {priceFormat(detail.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold">
                <span>Total</span>
                <span className="tabular-nums">{priceFormat(order.total)}</span>
              </div>
            </div>
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paymentOptions={paymentOptions}
            />
          </div>
        </Modal>
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
        />
      )}

      {/* ================= DELETE ================= */}
      {modalState?.type === "delete" && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title="Hapus Pesanan"
          description="Tindakan ini akan menghapus pesanan dari daftar sample."
          icon={<Trash2 className="h-5 w-5" />}
          size="sm"
          footer={
            <>
              <Button variant="default" onClick={closeModal}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                isLoading={isDeleting}
                loadingText="Loading"
              >
                Hapus
              </Button>
            </>
          }
        >
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm">
            Yakin ingin menghapus{" "}
            <span className="font-bold">Pesanan #{order?.orderId}</span>? Total
            transaksi sebesar{" "}
            <span className="font-bold tabular-nums">
              {priceFormat(order?.total ?? 0)}
            </span>{" "}
            tidak akan tampil lagi.
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
