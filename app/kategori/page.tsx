"use client";

import { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { CategoryInterface } from "../types";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import { useCategories } from "../api/categoryServices";
import AddCategoryForm from "../components/category/AddCategoryForm";
import EditCategoryForm from "../components/category/EditCategoryForm";
import useCategoryActions from "../hooks/useCategoryActions";
import { Pencil, Plus, Trash2, Tag } from "lucide-react";
import { PageShell } from "../components/ui/PageShell";
import IconButton from "../components/ui/IconButton";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import { useDebounce } from "../hooks/useDebounce";

type ModalType = "add" | "edit" | "delete" | null;

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

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.searchQuery === debouncedSearch) return prev;
      return { ...prev, searchQuery: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  /* ---------------- MODAL STATE (REFACTORED) ---------------- */

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryInterface | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const { handleDeleteCategory } = useCategoryActions();

  /* ---------------- MODAL HANDLERS ---------------- */

  const openAddModal = () => {
    setSelectedCategory(null);
    setActiveModal("add");
  };

  const openEditModal = useCallback((category: CategoryInterface) => {
    setSelectedCategory(category);
    setActiveModal("edit");
  }, []);

  const openDeleteModal = useCallback((category: CategoryInterface) => {
    setSelectedCategory(category);
    setActiveModal("delete");
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedCategory(null);
  }, []);

  /* ---------------- DELETE ACTION ---------------- */

  const confirmDeleteCategory = useCallback(async () => {
    if (!selectedCategory?.categoryId) return;

    await handleDeleteCategory({
      categoryId: selectedCategory.categoryId,
      setIsDeleting,
      closeDeleteModal: closeModal,
      mutate,
    });
  }, [selectedCategory, mutate, closeModal]);

  return (
    <MainLayout>
      <PageShell
        title="Kategori"
        description="Kelompokkan menu Anda untuk navigasi yang lebih cepat"
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1 rounded-lg bg-primary hover:opacity-90 px-3 py-2 text-sm font-semibold text-white cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Kategori
          </button>
        }
      >
        <div className="flex flex-col w-full gap-4 p-4">
          {/* GRID */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loadingCategories ? (
              <div className="col-span-full text-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              categories?.data?.map((category: CategoryInterface) => (
                <div
                  key={category.categoryId}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Tag className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    {category.categoryName}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    ID #{category.categoryId}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs font-semibold transition hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <IconButton
                      variant="delete"
                      onClick={() => openDeleteModal(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center">
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
      </PageShell>

      {/* ================= MODALS ================= */}

      {/* ADD */}
      {activeModal === "add" && (
        <Modal isOpen onClose={closeModal}>
          <AddCategoryForm closeAddModal={closeModal} mutate={mutate} />
        </Modal>
      )}

      {/* EDIT */}
      {activeModal === "edit" && selectedCategory && (
        <Modal isOpen onClose={closeModal}>
          <EditCategoryForm
            categoryId={selectedCategory.categoryId}
            mutate={mutate}
            closeEditModal={closeModal}
          />
        </Modal>
      )}

      {/* DELETE */}
      {activeModal === "delete" && selectedCategory && (
        <DeleteConfirmationModal
          isOpen={activeModal === "delete"}
          onClose={closeModal}
          onConfirm={confirmDeleteCategory}
          isLoading={isDeleting}
          message="Apakah Anda yakin ingin menghapus pengguna ini?"
        />
      )}
    </MainLayout>
  );
}
