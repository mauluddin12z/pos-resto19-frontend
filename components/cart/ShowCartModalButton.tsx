import { ShowCartModalButtonProps } from "@/types";
import { ShoppingCart } from "lucide-react";

export default function ShowCartModalButton({
  setCartModalVisible,
  cartItemLength,
}: ShowCartModalButtonProps) {
  return (
    <button
      onClick={() => setCartModalVisible(true)}
      aria-label="Show cart"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex lg:hidden items-center justify-center bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
    >
      <span
        className={`${
          cartItemLength !== 0 ? "absolute " : "hidden"
        } absolute top-0 right-0 translate-x-[10%] -translate-y-[10%] flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full`}
      >
        {cartItemLength}
      </span>
      <ShoppingCart className="text-xl text-gray-700" />
    </button>
  );
}
