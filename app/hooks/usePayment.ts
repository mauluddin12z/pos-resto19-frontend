import { useState } from "react";
import { AxiosError } from "axios";
import { updateOrder } from "../api/orderServices";
import { useGlobalAlert } from "../context/AlertContext";
import { MESSAGES } from "../constants/messages";

interface PaymentPropsInterface {
  orderId: number;
  mutate: () => void;
}

const usePayment = ({ orderId, mutate }: PaymentPropsInterface) => {
  const { showAlert } = useGlobalAlert();
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
    if (!isValidPaymentMethod()) {
      showAlert({
        type: "error",
        message: MESSAGES.PAYMENT.REQUIRED_METHOD,
      });
      return;
    }

    setIsSubmitting(true);
    const paymentFormData = new FormData();
    paymentFormData.append("paymentMethod", paymentMethod);
    paymentFormData.append("paymentStatus", "paid");

    try {
      const response = await updateOrder(orderId, paymentFormData);

      if (!response?.data?.orderId) {
        throw new Error("Order update failed: Missing orderId");
      }

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

        showAlert({
          type: "error",
          message: MESSAGES.GENERAL.ERROR || errorMessage,
        });
      } else {
        showAlert({
          type: "error",
          message: MESSAGES.GENERAL.UNKNOWN,
        });
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
