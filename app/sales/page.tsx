"use client";
import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { OrderInterface } from "../types";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import AddCategoryForm from "../components/category/AddCategoryForm";
import EditCategoryForm from "../components/category/EditCategoryForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import SummaryCards from "../components/dashboard/SummaryCards";
import { useOrders } from "../api/orderServices";
import useOrderActions from "../hooks/useOrderActions";
import OrderTable from "../components/order/OrderTable";
import OrderFilterForm from "../components/order/OrderFilterForm";

export default function Page() {
   const [filters, setFilters] = useState({
      minTotal: null,
      maxTotal: null,
      paymentMethod: "",
      searchQuery: "",
      page: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      dateRange: "",
      fromDate: "",
      toDate: "",
      paymentStatus: "paid",
   });
   const [tempFilters, setTempFilters] = useState(filters);

   const { orders, isLoading: loadingOrders, mutate } = useOrders(filters);

   const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
   };

   const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
      null
   );

   const [modalState, setModalState] = useState<{
      type: "add" | "edit" | "delete" | "filter";
      isOpen: boolean;
   } | null>(null);

   const openAddModal = () => setModalState({ type: "add", isOpen: true });
   const closeAddModal = () => setModalState({ type: "add", isOpen: false });

   const openEditModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "edit", isOpen: true });
   }, []);

   const closeEditModal = useCallback(() => {
      setSelectedOrder(null);
      setModalState({ type: "edit", isOpen: false });
   }, []);

   const openDeleteModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "delete", isOpen: true });
   }, []);

   const closeDeleteModal = useCallback(() => {
      setSelectedOrder(null);
      setModalState({ type: "delete", isOpen: false });
   }, []);

   const openFilterModal = useCallback(() => {
      setTempFilters(filters); // load current filters into temp
      setModalState({ type: "filter", isOpen: true });
   }, [filters]);

   const closeFilterModal = useCallback(() => {
      setModalState({ type: "filter", isOpen: false });
   }, []);

   const { handleDeleteOrder, isSubmitting: isDeleting } = useOrderActions();
   const confirmDeleteOrder = useCallback(async () => {
      if (!selectedOrder?.orderId) return;

      await handleDeleteOrder(selectedOrder.orderId, mutate, closeDeleteModal);
   }, [selectedOrder, closeDeleteModal, mutate]);

   const [isOpenSummaryCards, setIsOpenSummaryCards] = useState(false);
   const [showSummary, setShowSummary] = useState(false);

   // When isOpenSummaryCards becomes true, delay setting showSummary true to trigger transition
   useEffect(() => {
      if (isOpenSummaryCards) {
         // Small delay to trigger transition
         const timer = setTimeout(() => setShowSummary(true), 10);
         return () => clearTimeout(timer);
      } else {
         setShowSummary(false);
      }
   }, [isOpenSummaryCards]);

   return (
      <MainLayout>
         <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap w-full justify-between gap-2">
               <div className="flex gap-2">
                  {/* View dashboard button */}
                  <button
                     onClick={() => openFilterModal()}
                     className={`flex justify-center items-center rounded-lg p-2 text-center cursor-pointer ${
                        modalState?.type === "filter" && modalState?.isOpen
                           ? "bg-blue-600 text-white cursor-default"
                           : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                     }`}
                  >
                     <FontAwesomeIcon icon={faFilter} />
                  </button>
                  {/* View dashboard button */}
                  <button
                     onClick={() => setIsOpenSummaryCards((prev) => !prev)}
                     className={`flex justify-center items-center font-medium rounded-lg text-sm px-2 py-2 text-center transition duration-150 cursor-pointer ${
                        isOpenSummaryCards
                           ? "bg-blue-600 text-white cursor-default"
                           : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                     }`}
                  >
                     <FontAwesomeIcon className="mr-2" icon={faEye} />
                     View dashboard
                  </button>
               </div>

               <button
                  onClick={openAddModal}
                  className="flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer text-white bg-green-600 hover:bg-green-700"
               >
                  Add sales
               </button>
            </div>
            {/* Dashboard Summary Cards */}
            <div
               className={`overflow-hidden transition-all duration-200 ease-in-out transform origin-top ${
                  isOpenSummaryCards && showSummary
                     ? "max-h-screen opacity-100 translate-y-0"
                     : "max-h-0 opacity-0 -translate-y-4"
               }`}
            >
               {isOpenSummaryCards && <SummaryCards />}
            </div>
            <OrderTable
               orders={orders?.data || []}
               loading={loadingOrders}
               onEdit={openEditModal}
               onDelete={openDeleteModal}
            />
            {orders?.data?.length === 0 && !loadingOrders && (
               <div className="col-span-full text-center text-gray-500">
                  No orders found.
               </div>
            )}
            <div className="flex justify-center items-center">
               <Pagination
                  totalItems={orders?.pagination?.totalItems}
                  totalPages={orders?.pagination?.totalPages}
                  currentPage={orders?.pagination?.currentPage}
                  pageSize={orders?.pagination?.pageSize}
                  hasNextPage={orders?.pagination?.hasNextPage}
                  isLoading={loadingOrders}
                  onPageChange={handlePageChange}
               />
            </div>
         </div>

         {modalState?.type === "filter" && modalState.isOpen && (
            <Modal isOpen={modalState.isOpen} onClose={closeFilterModal}>
               <OrderFilterForm
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  onApply={() => {
                     setFilters({ ...tempFilters, page: 1 });
                     closeFilterModal();
                  }}
                  onClear={() => {
                     setFilters({
                        minTotal: null,
                        maxTotal: null,
                        paymentMethod: "",
                        searchQuery: "",
                        page: 1,
                        pageSize: 10,
                        sortBy: "createdAt",
                        sortOrder: "desc",
                        dateRange: "",
                        fromDate: "",
                        toDate: "",
                        paymentStatus: "paid",
                     });
                     closeFilterModal();
                  }}
               />
            </Modal>
         )}

         {/* Add Modal Form */}
         {modalState?.type === "add" && modalState.isOpen && (
            <Modal isOpen={modalState.isOpen} onClose={closeAddModal}>
               <AddCategoryForm closeAddModal={closeAddModal} mutate={mutate} />
            </Modal>
         )}

         {/* Edit Modal Form */}
         {modalState?.type === "edit" && modalState.isOpen && selectedOrder && (
            <Modal isOpen={modalState.isOpen} onClose={closeEditModal}>
               <EditCategoryForm
                  categoryId={selectedOrder.orderId}
                  mutate={mutate}
                  closeEditModal={closeEditModal}
               />
            </Modal>
         )}

         {/* Delete Modal Form */}
         {modalState?.type === "delete" &&
            modalState.isOpen &&
            selectedOrder && (
               <Modal isOpen={modalState.isOpen} onClose={closeDeleteModal}>
                  <div>
                     <p className="text-center">
                        Are you sure you want to delete this data?
                     </p>
                     <div className="mt-4 gap-4  flex justify-center">
                        <button
                           onClick={confirmDeleteOrder}
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
