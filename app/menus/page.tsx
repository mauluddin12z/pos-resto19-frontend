"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useMenus } from "../api/menuServices";
import { MenuFilterInterface } from "../types";
import MenuTable from "../components/menu/MenuTable";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import Search from "../components/ui/Search";
import AddMenuForm from "../components/menu/AddMenuForm";

export default function Page() {
   const [searchQuery, setSearchQuery] = useState("");
   const [filters, setFilters] = useState<MenuFilterInterface>({
      categoryId: null,
      menuName: "",
      minPrice: null,
      maxPrice: null,
      searchQuery: "",
      sortBy: "price",
      sortOrder: "asc",
      page: 1,
      pageSize: 10,
   });
   const { menus, isLoading: loadingMenus, mutate } = useMenus(filters);

   // Debounce search query update
   useEffect(() => {
      const timeout = setTimeout(() => {
         setFilters((prev) => ({ ...prev, searchQuery, page: 1 }));
      }, 300);
      return () => clearTimeout(timeout);
   }, [searchQuery]);

   const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
   };

   const [IsAddModalOpen, setIsAddModalOpen] = useState(false);
   const openAddModal = () => setIsAddModalOpen(true);
   const closeAddModal = () => setIsAddModalOpen(false);

   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap w-full justify-between gap-2">
               <Search
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
               />
               <button
                  onClick={openAddModal}
                  className="flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer text-white bg-green-600 hover:bg-green-700"
               >
                  Add menu
               </button>
            </div>
            <MenuTable
               menus={menus?.data}
               loading={loadingMenus}
               mutate={mutate}
            />
            {menus?.data?.length === 0 && !loadingMenus && (
               <div className="col-span-full text-center text-gray-500">
                  No menus found.
               </div>
            )}
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
         <Modal isOpen={IsAddModalOpen} onClose={closeAddModal}>
            <AddMenuForm closeAddModal={closeAddModal} mutate={mutate} />
         </Modal>
      </MainLayout>
   );
}
