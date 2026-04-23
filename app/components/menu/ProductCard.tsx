"use client";

import { Minus, Plus } from "lucide-react";
import Image, { ImageLoader } from "next/image";
import { priceFormat } from "@/app/utils/priceFormat";
import { CartInterface, ProductInterface } from "@/app/types";

export interface ProductCardPropsInterface {
  id: number;
  productName: string;
  productImageUrl: string;
  productPrice: number;
  stock: number;
  onAddToCart: (product: ProductInterface) => void;
  cart: CartInterface;
  onQuantityChange: (id: number, quantity: number) => void;
}

export default function ProductCard({
  id,
  productName,
  productImageUrl,
  productPrice,
  stock,
  onAddToCart,
  cart,
  onQuantityChange,
}: ProductCardPropsInterface) {
  const cartItem = cart.cartItems.find((item) => item.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!cartItem) {
      onAddToCart({
        id,
        name: productName,
        imageUrl: productImageUrl,
        price: productPrice,
        stock,
      });
    } else {
      onQuantityChange(id, quantity + 1);
    }
  };

  const handleRemove = () => {
    if (cartItem && quantity > 0) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-(--shadow-card) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-elevated) relative">
      {/* OUT OF STOCK OVERLAY */}
      {stock === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/70 text-white text-sm font-semibold">
          Out of Stock
        </div>
      )}

      {/* IMAGE */}
      <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
        <Image
          src={productImageUrl ?? "no-image.png"}
          alt={productName}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* CONTENT */}
      <div className="mt-3 flex-1">
        <h3 className="text-sm font-semibold text-foreground">{productName}</h3>
        <p className="mt-0.5 text-base font-bold text-foreground">
          {priceFormat(productPrice)}
        </p>
      </div>

      {/* ACTION */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {quantity > 0 ? (
          <>
            <button
              onClick={handleRemove}
              disabled={quantity === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-foreground">
              {quantity}
            </span>

            <button
              onClick={handleAdd}
              disabled={stock === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleAdd}
            disabled={stock === 0}
            className="w-full h-8 rounded-full border-2 border-primary text-primary text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            Order
          </button>
        )}
      </div>
    </div>
  );
}
