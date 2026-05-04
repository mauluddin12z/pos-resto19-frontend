import {
  createOrderDetail,
  deleteOrderDetailByOrderId,
} from "../api/orderDetailServices";
import { createOrder, deleteOrder, updateOrder } from "../api/orderServices";
import { useState } from "react";
import { CartInterface, CartItemInterface, UserInterface } from "../types";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { MESSAGES } from "../constants/messages";
import toast from "react-hot-toast";

const useOrderActions = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Create new order
  const handleOrder = async (
    cart: CartInterface,
    setCart: React.Dispatch<React.SetStateAction<CartInterface>>,
    mutate: () => void,
    onCloseModal?: () => void,
  ) => {
    setIsSubmitting(true);
    const orderFormData = new FormData();
    orderFormData.append("userId", user?.userId?.toString() || "");
    orderFormData.append("total", cart.total);
    const toastId = toast.loading("Sedang membuat pesanan...");
    try {
      const orderResponse = await createOrder(orderFormData);
      if (!orderResponse?.data?.orderId) {
        toast.error(MESSAGES.ORDER.CREATE_FAILED, { id: toastId });
        throw new Error("Order creation failed: Missing orderId");
      }

      for (const item of cart.cartItems) {
        const orderDetailFormData = new FormData();
        orderDetailFormData.append(
          "orderId",
          orderResponse.data.orderId.toString(),
        );
        orderDetailFormData.append("menuId", item.id.toString());
        orderDetailFormData.append("quantity", item.quantity.toString());
        orderDetailFormData.append("price", item.price.toString());
        orderDetailFormData.append(
          "subtotal",
          (item.price * item.quantity).toString(),
        );
        orderDetailFormData.append("notes", item.notes);

        await createOrderDetail(orderDetailFormData);
      }

      setCart({ total: "0", cartItems: [] });
      localStorage.removeItem("cart");

      toast.success(MESSAGES.ORDER.CREATE_SUCCESS || orderResponse?.message, {
        id: toastId,
      });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          MESSAGES.GENERAL.ERROR ||
            error?.response?.data?.message ||
            error.message,
          { id: toastId },
        );
      } else {
        toast.error(MESSAGES.GENERAL.UNKNOWN, { id: toastId });
      }
    } finally {
      if (onCloseModal) onCloseModal();
      mutate();
      setIsSubmitting(false);
    }
  };

  // Update existing order
  const handleUpdateOrder = async (
    orderId: number,
    updatedItems: CartItemInterface[],
    total: string,
    paymentMethod: string,
    mutate: () => void,
    onCloseModal?: () => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang memperbarui pesanan...");
    try {
      const formData = new FormData();
      formData.append("total", total);
      formData.append("paymentMethod", paymentMethod);
      await updateOrder(orderId, formData);

      await deleteOrderDetailByOrderId(orderId);

      for (const item of updatedItems) {
        const detailFormData = new FormData();
        detailFormData.append("orderId", orderId.toString());
        detailFormData.append("menuId", item.id.toString());
        detailFormData.append("quantity", item.quantity.toString());
        detailFormData.append("price", item.price.toString());
        detailFormData.append(
          "subtotal",
          (item.price * item.quantity).toString(),
        );
        detailFormData.append("notes", item.notes);
        await createOrderDetail(detailFormData);
      }

      toast.success(MESSAGES.ORDER.UPDATE_SUCCESS, { id: toastId });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          MESSAGES.GENERAL.ERROR ||
            error?.response?.data?.message ||
            error.message,
          { id: toastId },
        );
      } else {
        toast.error(MESSAGES.ORDER.UPDATE_FAILED, { id: toastId });
      }
    } finally {
      if (onCloseModal) onCloseModal();
      mutate();
      setIsSubmitting(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async (
    orderId: number,
    mutate: () => void,
    onCloseModal?: () => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang menghapus pesanan...");
    try {
      await deleteOrder(orderId);

      toast.success(MESSAGES.ORDER.DELETE_SUCCESS, { id: toastId });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          MESSAGES.GENERAL.ERROR ||
            error?.response?.data?.message ||
            error.message,
          { id: toastId },
        );
      } else {
        toast.error(MESSAGES.ORDER.DELETE_FAILED, { id: toastId });
      }
    } finally {
      if (onCloseModal) onCloseModal();
      mutate();
      setIsSubmitting(false);
    }
  };

  return {
    handleOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    isSubmitting,
  };
};

export default useOrderActions;
