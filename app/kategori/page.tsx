"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CategoryFormInterface, CategoryInterface } from "@/types";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { useCategories } from "@/api/categoryServices";
import useCategoryActions from "@/hooks/useCategoryActions";
import { Pencil, Plus, Trash2, Tag, UtensilsCrossed } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import IconButton from "@/components/ui/IconButton";
import CategoryForm from "@/components/category/CategoryForm";
import { useMenus } from "@/api/menuServices";
import { Button } from "@/components/ui/Button";

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: CategoryInterface }
  | { mode: "delete"; record: CategoryInterface };

type FormErrors = Partial<Record<keyof CategoryInterface, string>>;

const emptyForm: CategoryFormInterface = {
  categoryId: "",
  categoryName: "",
};

const mapCategoryToForm = (
  record: CategoryInterface,
): CategoryFormInterface => ({
  categoryId: String(record.categoryId),
  categoryName: record.categoryName,
});

export default function Page() {
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

  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [formData, setFormData] = useState(emptyForm);

  const { menus } = useMenus({ categoryId: formData.categoryId });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const openCreate = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setDialog({ mode: "create" });
  };

  const openEdit = (record: CategoryInterface) => {
    setFormData(mapCategoryToForm(record));
    setFormErrors({});
    setDialog({ mode: "edit", record });
  };
  const openDelete = (record: CategoryInterface) => {
    setFormData(mapCategoryToForm(record));
    setFormErrors({});
    setDialog({ mode: "delete", record });
  };

  const close = () => setDialog({ mode: "closed" });

  // Handle input change
  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* ---------------- MODAL STATE (REFACTORED) ---------------- */

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission

  const { handleAddCategory, handleEditCategory, handleDeleteCategory } =
    useCategoryActions();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dialog.mode === "create") {
      await handleAddCategory({
        formData,
        setIsSubmitting,
        setFormErrors,
        closeAddModal: close,
        mutate,
      });
    } else if (dialog.mode === "edit") {
      await handleEditCategory({
        categoryId: Number(formData.categoryId),
        formData,
        setIsSubmitting,
        setFormErrors,
        closeEditModal: close,
        mutate,
      });
    }
  };

  const submitDeleteCategory = async () => {
    await handleDeleteCategory({
      categoryId: Number(formData.categoryId),
      setIsDeleting: setIsSubmitting,
      closeDeleteModal: close,
      mutate,
    });
  };
  return (
    <MainLayout>
      <PageShell
        title="Kategori"
        description="Kelompokkan menu Anda untuk navigasi yang lebih cepat"
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1 rounded-lg bg-primary hover:opacity-90 px-3 py-2 text-sm font-semibold text-white cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Kategori
          </button>
        }
      >
        <div className="flex flex-col w-full gap-4">
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
                      onClick={() => openEdit(category)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs font-semibold transition hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <IconButton
                      variant="delete"
                      onClick={() => openDelete(category)}
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
              onPageChange={(page: number) =>
                setFilters((prev) => ({ ...prev, page }))
              }
            />
          </div>
        </div>
      </PageShell>

      {/* ================= MODALS ================= */}
      <Modal
        isOpen={dialog.mode === "create" || dialog.mode === "edit"}
        onClose={close}
        title={dialog.mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
        description={
          dialog.mode === "create"
            ? "Tambahkan kategori baru untuk mengelompokkan menu"
            : "Perbarui informasi kategori"
        }
        icon={
          dialog.mode === "create" ? (
            <UtensilsCrossed className="h-5 w-5" />
          ) : (
            <Pencil className="h-5 w-5" />
          )
        }
        size="lg"
        footer={
          <>
            <Button variant="default" onClick={close}>
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="category-form"
              isLoading={isSubmitting}
              loadingText="Loading"
            >
              {dialog.mode === "create"
                ? "Tambah Kategori"
                : dialog.mode === "edit"
                  ? "Simpan Perubahan"
                  : "Submit"}
            </Button>
          </>
        }
      >
        <CategoryForm
          formData={formData}
          formErrors={formErrors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isDisable={isSubmitting}
        />
      </Modal>

      {/* DELETE */}
      <Modal
        isOpen={dialog.mode === "delete"}
        onClose={close}
        title="Hapus Kategori"
        description="Tindakan ini tidak dapat dibatalkan"
        icon={<Trash2 className="h-5 w-5" />}
        size="sm"
        footer={
          <>
            <Button variant="default" onClick={close}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => submitDeleteCategory()}
              isLoading={isSubmitting}
              loadingText="Loading"
            >
              <div className="flex gap-x-2">
                <Trash2 className="h-4 w-4" /> Hapus
              </div>
            </Button>
          </>
        }
      >
        {dialog.mode === "delete" && (
          <p className="text-sm text-foreground">
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold">
              "{dialog.record.categoryName}"
            </span>
            ?
            {menus?.data?.length > 0 && (
              <span className="mt-2 block rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                Kategori ini memiliki {menus?.data?.length} menu terkait.
                Menghapusnya bisa mempengaruhi data produk.
              </span>
            )}
          </p>
        )}
      </Modal>
    </MainLayout>
  );
}
