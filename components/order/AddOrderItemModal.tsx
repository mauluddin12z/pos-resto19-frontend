import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import MenuGrid from "../menu/MenuGrid";
import { useMenus } from "@/api/menuServices";
import {
  CartInterface,
  MenuFilterInterface,
  ProductInterface,
} from "@/types";
import Pagination from "../ui/Pagination";
import Search from "../ui/Search";
import { useDebounce } from "@/hooks/useDebounce";

interface AddOrderItemModalProps {
  isAddItemModalOpen: boolean;
  closeAddItemModal: () => void;
  onAddToCart: (product: ProductInterface) => void;
  cart: CartInterface;
  onQuantityChange: (id: number, quantity: number) => void;
}

export default function AddOrderItemModal({
  isAddItemModalOpen,
  closeAddItemModal,
  onAddToCart,
  cart,
  onQuantityChange,
}: AddOrderItemModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MenuFilterInterface>({
    categoryId: null,
    menuName: "",
    minPrice: null,
    maxPrice: null,
    searchQuery: "",
    sortBy: "categoryId",
    sortOrder: "asc",
    page: 1,
    pageSize: 12,
  });
  const { menus, isLoading } = useMenus(filters);

  // Handle Page Change
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

  return (
    <Modal isOpen={isAddItemModalOpen} onClose={closeAddItemModal}>
      <div className="flex flex-col gap-2">
        {/* Search Input */}
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <MenuGrid
          menus={menus?.data}
          loading={isLoading}
          onAddToCart={onAddToCart}
          cart={cart}
          onQuantityChange={onQuantityChange}
          grid="grid-cols-2"
        />
        <div className="flex justify-center items-center">
          <Pagination
            totalItems={menus?.pagination?.totalItems}
            totalPages={menus?.pagination?.totalPages}
            currentPage={menus?.pagination?.currentPage}
            pageSize={menus?.pagination?.pageSize}
            hasNextPage={menus?.pagination?.hasNextPage}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Modal>
  );
}
