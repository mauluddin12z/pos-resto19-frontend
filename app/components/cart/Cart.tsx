"use client";

import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import React from "react";
import { priceFormat } from "@/app/utils/priceFormat";
import LoadingButton from "../ui/LoadingButton";
import {
  CartInterface,
  CartItemInterface,
  CartItemPropsInterface,
} from "@/app/types";

export interface CartPropsInterface {
  orderId: number | null;
  cart: CartInterface;
  cartItems: CartItemInterface[];
  stockMessage: string;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onNotesChange: (id: number, notes: string) => void;
  onOrder: (onClose: () => void) => void;
  isSubmitting: boolean;
  closeCart: () => void;
}

const Cart: React.FC<CartPropsInterface> = ({
  orderId,
  cartItems,
  stockMessage,
  onRemove,
  onQuantityChange,
  onNotesChange,
  onOrder,
  isSubmitting,
  closeCart,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderNumber = cartItems.length === 0 ? "" : orderId ? orderId + 1 : 1;

  const handleIncrement = (id: number, qty: number) => {
    onQuantityChange(id, qty + 1);
  };

  const handleDecrement = (id: number, qty: number) => {
    if (qty > 1) {
      onQuantityChange(id, qty - 1);
    } else {
      onRemove(id);
    }
  };

  const handleClearAll = () => {
    onRemove(0);
    closeCart();
  };

  return (
    <aside className="flex w-full h-full flex-col border-l border-border bg-card">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-bold text-foreground">
            Pesanan #{orderNumber}
          </h2>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {cartItems.length === 0 ? (
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
          <ul className="flex flex-col gap-3">
            {cartItems.map((item: CartItemInterface) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-start gap-3">
                  {/* IMAGE */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs font-bold text-foreground">
                      {priceFormat(item.price)}
                    </p>

                    {stockMessage && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {stockMessage}
                      </p>
                    )}
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="min-w-5 text-center text-xs font-semibold tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* NOTES + REMOVE */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) => onNotesChange(item.id, e.target.value)}
                    placeholder="Tulis catatan..."
                    className="flex-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FOOTER */}
      {cartItems.length > 0 && (
        <footer className="border-t border-border px-5 py-4">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {priceFormat(total)}
            </span>
          </div>

          <button
            onClick={() => onOrder(closeCart)}
            disabled={isSubmitting}
            className="mb-2 w-full rounded-xl bg-success py-3 text-sm font-semibold text-success-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingButton /> Loading...
              </div>
            ) : (
              "Buat Pesanan Baru"
            )}
          </button>

          <button
            onClick={handleClearAll}
            className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold hover:bg-secondary cursor-pointer disabled:cursor-not-allowed"
          >
            Batalkan Pesanan
          </button>
        </footer>
      )}
    </aside>
  );
};

export default Cart;
