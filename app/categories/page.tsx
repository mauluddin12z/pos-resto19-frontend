"use client";
import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { CategoryInterface } from "../types";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import Search from "../components/ui/Search";
import { useCategories } from "../api/categoryServices";
import AddCategoryForm from "../components/category/AddCategoryForm";
import EditCategoryForm from "../components/category/EditCategoryForm";
import useCategoryActions from "../hooks/useCategoryActions";

export default function Page() {
   const [searchQuery, setSearchQuery] = useState("");
   const [filters, setFilters] = useState({
      searchQuery: "",
      page: 1,
      pageSize: 10,
   });

   const {
      categories,
      isLoading: loadingCategories,
      mutate,
   } = useCategories(filters);

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

   const [selectedCategory, setSelectedCategory] =
      useState<CategoryInterface | null>(null);

   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const openAddModal = () => setIsAddModalOpen(true);
   const closeAddModal = () => setIsAddModalOpen(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const openEditModal = useCallback((category: CategoryInterface) => {
      setSelectedCategory(category);
      setIsEditModalOpen(true);
   }, []);

   const closeEditModal = useCallback(() => {
      setSelectedCategory(null);
      setIsEditModalOpen(false);
   }, []);

   const openDeleteModal = useCallback((category: CategoryInterface) => {
      setSelectedCategory(category);
      setIsDeleteModalOpen(true);
   }, []);

   const closeDeleteModal = useCallback(() => {
      setSelectedCategory(null);
      setIsDeleteModalOpen(false);
   }, []);

   const [isDeleting, setIsDeleting] = useState(false);

   const { handleDeleteCategory } = useCategoryActions();
   const confirmDeleteCategory = useCallback(async () => {
      if (!selectedCategory?.categoryId) return;

      await handleDeleteCategory({
         categoryId: selectedCategory.categoryId,
         setIsDeleting,
         closeDeleteModal,
         mutate,
      });
   }, [selectedCategory, setIsDeleting, closeDeleteModal, mutate]);

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
                  Add category
               </button>
            </div>
            <div className="relative overflow-x-auto sm:rounded-lg">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 bg-gray-50">
                     <tr>
                        <th scope="col" className="px-6 py-3">
                           Category Name
                        </th>
                        <th
                           scope="col"
                           className="px-6 py-3 bg-gray-50 sticky right-0 text-center"
                        >
                           Action
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {loadingCategories ? (
                        <tr>
                           <td colSpan={2} className="px-6 py-4 text-center">
                              <div className="flex justify-center items-center">
                                 Loading...
                              </div>
                           </td>
                        </tr>
                     ) : (
                        categories?.data.map(
                           (category: CategoryInterface, index: number) => (
                              <tr
                                 key={index}
                                 className="bg-white border-gray-200 border-b"
                              >
                                 <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                 >
                                    {category.categoryName}
                                 </th>
                                 <td className="px-6 py-4 sticky right-0 bg-white">
                                    <div className="flex flex-wrap justify-center items-center gap-2">
                                       <button
                                          onClick={() =>
                                             openEditModal(category)
                                          }
                                          className="font-medium text-blue-600 hover:underline cursor-pointer"
                                       >
                                          Edit
                                       </button>
                                       <button
                                          onClick={() =>
                                             openDeleteModal(category)
                                          }
                                          className="font-medium text-red-600 hover:underline cursor-pointer"
                                       >
                                          Delete
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           )
                        )
                     )}
                  </tbody>
               </table>
            </div>
            <div className="flex justify-center items-center">
               <Pagination
                  totalItems={categories?.pagination?.totalItems}
                  totalPages={categories?.pagination?.totalPages}
                  currentPage={categories?.pagination?.currentPage}
                  pageSize={categories?.pagination?.pageSize}
                  hasNextPage={categories?.pagination?.hasNextPage}
                  isLoading={loadingCategories}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>
         {isAddModalOpen && (
            <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
               <AddCategoryForm closeAddModal={closeAddModal} mutate={mutate} />
            </Modal>
         )}
         {selectedCategory && isEditModalOpen && (
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
               <EditCategoryForm
                  categoryId={selectedCategory.categoryId}
                  mutate={mutate}
                  closeEditModal={closeEditModal}
               />
            </Modal>
         )}

         {selectedCategory && isDeleteModalOpen && (
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
               <div>
                  <p className="text-center">
                     Are you sure you want to delete this data?
                  </p>
                  <div className="mt-4 gap-4  flex justify-center">
                     <button
                        onClick={confirmDeleteCategory}
                        className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md ${
                           isDeleting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                     </button>
                     <button
                        onClick={closeDeleteModal}
                        className="bg-gray-200 hover:bg-gray-300  cursor-pointer px-4 py-2 rounded-md"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}
      </MainLayout>
   );
}
