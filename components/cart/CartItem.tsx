import { CartItemPropsInterface } from "@/types";
import { priceFormat } from "@/utils/priceFormat";
import Image, { ImageLoader } from "next/image";
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({
  item,
  stockMessage,
  onQuantityChange,
  onNotesChange,
  onRemove,
}: CartItemPropsInterface) {

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
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        {/* IMAGE */}
        {item.imageUrl && (
          <Image
            className="h-12 w-12 rounded-lg object-cover"
            src={item.imageUrl ?? "no-image.png"}
            width={500}
            height={500}
            priority
            unoptimized
            alt={item.name}
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
            <p className="text-[10px] text-red-500 mt-1">{stockMessage}</p>
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
    </div>
  );
}
