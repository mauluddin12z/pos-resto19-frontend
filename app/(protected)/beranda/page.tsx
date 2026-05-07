"use client";
import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MenuFilters from "@/components/menu/MenuFilters";
import MenuGrid from "@/components/menu/MenuGrid";
import Pagination from "@/components/ui/Pagination";
import useCart from "@/hooks/useCart";
import { useMenus } from "@/api/menuServices";
import { MenuFilterInterface } from "@/types";
import Modal from "@/components/ui/Modal";
import Search from "@/components/ui/Search";
import { useOrders } from "@/api/orderServices";
import Cart from "@/components/cart/Cart";
import ShowCartModalButton from "@/components/cart/ShowCartModalButton";
import useOrderActions from "@/hooks/useOrderActions";
import { useCategories } from "@/api/categoryServices";
import { useDebounce } from "@/hooks/useDebounce";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MenuFilterInterface>({
    categoryId: null,
    menuName: "",
    searchQuery: "",
    price: {
      gte: null,
      lte: null,
    },
    sort: "-categoryId",
    page: 1,
    pageSize: 12,
  });

  // Load categories and menus
  const categoryFilters = { page: 1, pageSize: 100 };
  const { categories, isLoading: loadingCategories } =
    useCategories(categoryFilters);
  const { menus, isLoading: loadingMenus } = useMenus(filters);
  const handleCategoryClick = useCallback((categoryId: number | null) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
      page: 1,
    }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.searchQuery === debouncedSearch) return prev;
      return { ...prev, searchQuery: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  const {
    cart,
    setCart,
    handleAddToCart,
    handleRemove,
    handleQuantityChange,
    handleNotesChange,
    stockMessage,
  } = useCart();

  const { orders, mutate } = useOrders();
  // Handle Checkout
  const { handleOrder, isSubmitting: isOrderSubmitting } = useOrderActions();
  const [IsCartOpen, setIsCartOpen] = useState(false);
  const closeCart = () => setIsCartOpen(false);

  return (
    <MainLayout>
      <div className="w-full flex relative">
        <div className="flex flex-col w-full gap-2 py-2">
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-6 py-4">
            {/* Search Input */}
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {/* Menu Filters */}
            <MenuFilters
              categories={categories?.data}
              activeCategoryId={
                typeof filters.categoryId === "number"
                  ? filters.categoryId
                  : null
              }
              onCategoryClick={handleCategoryClick}
              loadingCategories={loadingCategories}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-1.5 md:px-6 md:py-5">
            <MenuGrid
              menus={menus?.data}
              loading={loadingMenus}
              onAddToCart={handleAddToCart}
              cart={cart}
              onQuantityChange={handleQuantityChange}
            />
          </div>
          <div className="flex justify-center items-center">
            <Pagination
              totalItems={menus?.pagination?.totalItems}
              totalPages={menus?.pagination?.totalPages}
              currentPage={menus?.pagination?.currentPage}
              pageSize={menus?.pagination?.pageSize}
              hasNextPage={menus?.pagination?.hasNextPage}
              isLoading={loadingMenus}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <div className="hidden lg:flex w-96 bg-white sticky top-4 right-0">
          <Cart
            orderId={orders?.data[0]?.orderId}
            cart={cart}
            cartItems={cart.cartItems}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
            onNotesChange={handleNotesChange}
            onOrder={() => handleOrder(cart, setCart, mutate, closeCart)}
            stockMessage={stockMessage}
            closeCart={closeCart}
            isSubmitting={isOrderSubmitting}
          />
        </div>

        {/* Mobile */}
        {IsCartOpen && (
          <Modal isOpen={IsCartOpen} onClose={closeCart}>
            <Cart
              orderId={orders?.data[0]?.orderId}
              cart={cart}
              cartItems={cart.cartItems}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
              onNotesChange={handleNotesChange}
              onOrder={() => handleOrder(cart, setCart, mutate, closeCart)}
              stockMessage={stockMessage}
              closeCart={closeCart}
              isSubmitting={isOrderSubmitting}
            />
          </Modal>
        )}

        <ShowCartModalButton
          setCartModalVisible={setIsCartOpen}
          cartItemLength={cart?.cartItems?.length}
        />
      </div>
    </MainLayout>
  );
}
