import Image from "next/image";
import SkeletonLoading from "../ui/SkeletonLoading";
import ProductCard from "./ProductCard";
import { CartInterface, MenuInterface, ProductInterface } from "@/types";

export interface MenuGridPropsInterface {
  menus: MenuInterface[];
  loading: boolean;
  onAddToCart: (product: ProductInterface) => void;
  cart: CartInterface;
  onQuantityChange: (id: number, quantity: number) => void;
  grid?: string;
}
const MenuGrid: React.FC<MenuGridPropsInterface> = ({
  menus,
  loading,
  onAddToCart,
  cart,
  onQuantityChange,
  grid,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="w-full h-fit flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="w-full h-full">
              <Image
                className="rounded-t-lg w-full object-cover"
                src="/no-image.png"
                width={500}
                height={500}
                alt="No Image Available"
                priority
              />
            </div>
            <div className="p-4 flex flex-col gap-y-2">
              <div className="w-full h-3">
                <SkeletonLoading />
              </div>
              <div className="w-full h-3">
                <SkeletonLoading />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (menus?.length === 0)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
        <span className="text-gray-400">Tidak ada menu tersedia.</span>
      </div>
    );
  return (
    <div
      className={`grid gap-2 ${grid ?? "grid-cols-2 md:grid-cols-3 xl:grid-cols-6"}`}
    >
      {menus?.map((menu, index) => (
        <ProductCard
          key={index}
          id={menu.menuId}
          productName={menu.menuName}
          productImageUrl={menu.menuImageUrl}
          productPrice={menu.price}
          stock={menu.stock}
          onAddToCart={onAddToCart}
          cart={cart}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
};

export default MenuGrid;
