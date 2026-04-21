"use client";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { OrderInterface, CartItemInterface } from "../../types";
import useCart from "@/app/hooks/useCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CartItem from "../cart/CartItem";
import { priceFormat } from "@/app/utils/priceFormat";
import useOrderActions from "@/app/hooks/useOrderActions";
import AddOrderItemModal from "./AddOrderItemModal";
import LoadingButton from "../ui/LoadingButton";
import PaymentMethod from "../payment/PaymentMethod";
import { ShoppingCart } from "lucide-react";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: OrderInterface;
  mutate: () => void;
  paymentOptions: string[];
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  handlePayment: (onSuccess?: () => void) => void;
}

const EditOrderModal = ({
  isOpen,
  onClose,
  selectedOrder,
  mutate,
  paymentOptions,
  paymentMethod,
  setPaymentMethod,
}: EditOrderModalProps) => {
  const {
    cart,
    setCart,
    handleNotesChange,
    handleRemove,
    handleQuantityChange,
    stockMessage,
    handleAddToCart,
  } = useCart();

  const { handleUpdateOrder, isSubmitting } = useOrderActions();

  // Load order into cart on modal open
  useEffect(() => {
    if (isOpen && selectedOrder) {
      const mappedItems: CartItemInterface[] = selectedOrder.orderDetails.map(
        (item) => ({
          id: item.menu.menuId,
          imageUrl: item.menu.menuImageUrl,
          name: item.menu.menuName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          notes: item.notes || "",
          stock: item.menu.stock,
        }),
      );

      const total = mappedItems
        .reduce((acc, item) => acc + item.subtotal, 0)
        .toFixed(2);

      setCart({
        cartItems: mappedItems,
        total,
      });
      setPaymentMethod(selectedOrder.paymentMethod ?? "");
    }
  }, [isOpen, selectedOrder, setCart]);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const openAddItemModal = useCallback(() => {
    setIsAddItemModalOpen(true);
  }, []);

  const closeAddItemModal = useCallback(() => {
    setIsAddItemModalOpen(false);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 lg:rounded-lg px-4 bg-white">
          <div className="flex justify-between mb-2 pb-2 border-b border-gray-200 gap-x-2 items-center sticky top-0 bg-white pt-4">
            <h2 className="text-lg font-semibold">
              <FontAwesomeIcon icon={faCartShopping} />
              Edit Pesanan #{selectedOrder.orderId}
            </h2>
            <button
              onClick={openAddItemModal}
              className={`px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium cursor-pointer`}
            >
              Tambah Item
            </button>
          </div>
          {cart.cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
                <ShoppingCart className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Belum ada pesanan
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pilih menu untuk memulai
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  stockMessage={stockMessage}
                  onQuantityChange={handleQuantityChange}
                  onNotesChange={handleNotesChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          {cart.cartItems.length > 0 && (
            <>
              {/* Summary + Order */}
              <div className="sticky bottom-0 bg-white pt-2 pb-4 mt-auto">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-sm font-semibold">
                    {priceFormat(parseInt(cart.total))}
                  </span>
                </div>
                <div className="flex flex-col border-t border-gray-200 pt-2">
                  <PaymentMethod
                    paymentOptions={paymentOptions}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                  <button
                    onClick={() => {
                      handleUpdateOrder(
                        selectedOrder.orderId,
                        cart.cartItems,
                        cart.total,
                        paymentMethod,
                        mutate,
                        onClose,
                      );
                    }}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex gap-2 justify-center items-center">
                        <LoadingButton /> Loading...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className={`w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer mt-2`}
                  >
                    Cancel Edit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Add Item Modal */}
        <AddOrderItemModal
          isAddItemModalOpen={isAddItemModalOpen}
          closeAddItemModal={closeAddItemModal}
          onAddToCart={handleAddToCart}
          cart={cart}
          onQuantityChange={handleQuantityChange}
        />
      </Modal>
    </>
  );
};

export default EditOrderModal;
