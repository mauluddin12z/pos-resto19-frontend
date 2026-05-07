import { useState } from "react";
import { AxiosError } from "axios";
import { payment as paymentService } from "../api/orderServices";
import { MESSAGES } from "../constants/messages";
import { toast } from "react-hot-toast";

interface PaymentPropsInterface {
  orderId: number;
  mutate: () => void;
}

const usePayment = ({ orderId, mutate }: PaymentPropsInterface) => {
  const paymentOptions = ["CASH", "QRIS", "BANK"];
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClosePaymentSuccessAlert = () => setPaymentSuccess(false);

  // Validate the payment method
  const isValidPaymentMethod = () => {
    return paymentMethod && paymentOptions.includes(paymentMethod);
  };

  // Handle the payment logic
  const handlePayment = async (onCloseModal?: () => void) => {
    const toastId = toast.loading("Sedang memproses pembayaran...");
    if (!isValidPaymentMethod()) {
      toast.error(MESSAGES.PAYMENT.REQUIRED_METHOD, { id: toastId });
      return;
    }

    setIsSubmitting(true);
    const paymentFormData = new FormData();
    paymentFormData.append("paymentMethod", paymentMethod);
    paymentFormData.append("paymentStatus", "paid");

    try {
      const response = await paymentService(orderId, paymentFormData);

      if (!response?.data?.orderId) {
        throw new Error("Order update failed: Missing orderId");
      }

      toast.success("Pembayaran berhasil. Terima kasih!", { id: toastId });
      setPaymentSuccess(true);
      mutate();
      // Call onClose when payment is successful
      if (onCloseModal) onCloseModal();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan. Silakan coba lagi.";

        toast.error(MESSAGES.GENERAL.ERROR || errorMessage, { id: toastId });
      } else {
        toast.error(MESSAGES.GENERAL.UNKNOWN, { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    paymentOptions,
    paymentMethod,
    setPaymentMethod,
    handlePayment,
    isSubmitting,
    paymentSuccess,
    onClosePaymentSuccessAlert,
  };
};

export default usePayment;
