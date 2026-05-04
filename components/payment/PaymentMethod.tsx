import React, { useState } from "react";
import Modal from "../ui/Modal";
import Image from "next/image";
import { Field } from "../ui/Field";

export interface PaymentMethodPropsInterface {
  paymentOptions: string[];
  setPaymentMethod: (paymentMethod: string) => void;
  paymentMethod: string;
}

const PaymentMethod: React.FC<PaymentMethodPropsInterface> = ({
  paymentOptions,
  setPaymentMethod,
  paymentMethod,
}) => {
  const isQrisAvailable = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePaymentMethodSelect = (option: string) => {
    setPaymentMethod(option);
    if (option === "QRIS") {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      <Field
        label="Metode pembayaran"
        error="Silakan pilih metode pembayaran"
        required
      >
        <div className="grid grid-cols-3 gap-2">
          {paymentOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPaymentMethod(option)}
              className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors cursor-pointer ${paymentMethod === option ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-secondary"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </Field>

      {/* QRIS Modal */}
      {paymentMethod === "QRIS" && isQrisAvailable && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <Image
            className="rounded-t-lg w-96 h-full aspect-square"
            src="QRIS.jpg"
            width={500}
            height={500}
            priority
            unoptimized
            alt="QRIS"
          />
        </Modal>
      )}
    </div>
  );
};

export default PaymentMethod;
