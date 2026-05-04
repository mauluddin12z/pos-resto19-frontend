"use client";
import React, { useRef } from "react";
import Modal from "../ui/Modal";
import { OrderInterface } from "@/types";
import PaymentMethod from "./PaymentMethod";
import OrderDetailsTable from "../order/OrderDetailsTable";
import LoadingButton from "../ui/LoadingButton";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderInterface;
  date: string;
  time: string;
  paymentOptions: string[];
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  handlePayment: (onSuccess?: () => void) => void;
  isSubmitting: boolean;
}

const PaymentModal = ({
  isOpen,
  onClose,
  order,
  date,
  time,
  paymentOptions,
  paymentMethod,
  setPaymentMethod,
  handlePayment,
  isSubmitting,
}: PaymentModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-between border border-gray-200 p-2">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="bg-blue-50 rounded-lg p-4 text-gray-600">{`#${order.orderId}`}</div>
          <div className="flex flex-col items-end text-gray-600">
            <div className="text-xs font-semibold">{date}</div>
            <div className="text-xs font-light">{time}</div>
          </div>
        </div>

        <OrderDetailsTable order={order} isExpanded={true} />

        <div className="flex flex-col mt-2 gap-2 justify-between">
          <PaymentMethod
            paymentOptions={paymentOptions}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded cursor-pointer"
            onClick={() => handlePayment(onClose)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex gap-2 justify-center items-center">
                <LoadingButton /> Processing...
              </div>
            ) : (
              "Lanjutkan Pembayaran"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
