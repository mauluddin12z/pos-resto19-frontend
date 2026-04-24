"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useMenus } from "../api/menuServices";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import { useCategories } from "../api/categoryServices";
import { PageShell } from "../components/ui/PageShell";
import MenuTable from "../components/menu/MenuTable";
import Search from "../components/ui/Search";
import { CategoryInterface, MenuFormInterface, MenuInterface } from "../types";
import MenuForm from "../components/menu/MenuForm";
import useMenuActions from "../hooks/useMenuActions";
import { priceFormat } from "../utils/priceFormat";
import LoadingButton from "../components/ui/LoadingButton";
import { useDebounce } from "../hooks/useDebounce";
import { Button } from "../components/ui/Button";

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: MenuInterface }
  | { mode: "delete"; record: MenuInterface };

type FormErrors = Partial<Record<keyof MenuFormInterface, string>>;

const emptyForm: MenuFormInterface = {
  menuId: "",
  menuName: "",
  categoryId: "",
  menuDescription: "",
  stock: "0",
  price: "0",
  menuImage: null as File | null,
  imagePreview: "",
};

const mapMenuToForm = (record: MenuInterface): MenuFormInterface => ({
  menuId: String(record.menuId),
  menuName: record.menuName,
  menuDescription: record.menuDescription ?? "",
  categoryId: String(record.categoryId),
  price: String(record.price),
  stock: String(record.stock),
  menuImage: null,
  imagePreview: record.menuImageUrl ?? "",
});

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categoryId: null,
    searchQuery: "",
    page: 1,
    pageSize: 10,
  });
  const { menus, isLoading, mutate } = useMenus(filters);
  const { categories } = useCategories({
    searchQuery: "",
    page: 1,
    pageSize: 100,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.searchQuery === debouncedSearch) return prev;
      return { ...prev, searchQuery: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setDialog({ mode: "create" });
  };

  const openEdit = (record: MenuInterface) => {
    setFormData(mapMenuToForm(record));
    setFormErrors({});
    setDialog({ mode: "edit", record });
  };
  const openDelete = (record: MenuInterface) => {
    setFormData(mapMenuToForm(record));
    setFormErrors({});
    setDialog({ mode: "delete", record });
  };

  const close = () => setDialog({ mode: "closed" });

  // Handle input change
  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle file input (for image)
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => {
      if (prev.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return {
        ...prev,
        menuImage: file,
        imagePreview: URL.createObjectURL(file),
      };
    });
  };
  useEffect(() => {
    return () => {
      if (formData.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  // Handle form submission

  const { handleAddMenu, handleEditMenu, handleDeleteMenu } = useMenuActions();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dialog.mode === "create") {
      await handleAddMenu({
        formData,
        setIsSubmitting,
        setFormErrors,
        closeAddModal: close,
        mutate,
      });
    } else if (dialog.mode === "edit") {
      await handleEditMenu({
        menuId: Number(formData.menuId),
        formData,
        setIsSubmitting,
        setFormErrors,
        closeEditModal: close,
        mutate,
      });
    }
  };

  const submitDeleteMenu = async () => {
    await handleDeleteMenu({
      menuId: Number(formData.menuId),
      setIsDeleting: setIsSubmitting,
      closeDeleteModal: close,
      mutate,
    });
  };

  return (
    <MainLayout>
      <PageShell
        title="Menu"
        description="Kelola daftar menu dan harga produk"
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1 rounded-lg bg-primary hover:opacity-90 px-3 py-2 text-sm font-semibold text-white cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Menu
          </button>
        }
      >
        <div className="rounded-2xl border bg-card shadow">
          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              width="min-w-56"
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: null,
                    page: 1,
                  }))
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  filters.categoryId === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Menu
              </button>
              {categories?.data?.map((c: CategoryInterface) => (
                <button
                  key={c.categoryId}
                  onClick={() =>
                    setFilters((prev: any) => ({
                      ...prev,
                      categoryId: c.categoryId,
                      page: 1,
                    }))
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    c.categoryId === filters.categoryId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.categoryName}
                </button>
              ))}
            </div>
          </div>
          {/* TABLE */}
          <MenuTable
            menus={menus?.data}
            loading={isLoading}
            openEdit={openEdit}
            openDelete={openDelete}
          />
          <div className="py-4 flex justify-center">
            {/* PAGINATION */}
            <Pagination
              totalItems={menus?.pagination?.totalItems}
              totalPages={menus?.pagination?.totalPages}
              currentPage={menus?.pagination?.currentPage}
              pageSize={menus?.pagination?.pageSize}
              hasNextPage={menus?.pagination?.hasNextPage}
              isLoading={isLoading}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        </div>

        {/* MODAL ADD / EDIT */}
        <Modal
          isOpen={dialog.mode === "create" || dialog.mode === "edit"}
          onClose={close}
          title={dialog.mode === "create" ? "Tambah Menu" : "Edit Menu"}
          description={
            dialog.mode === "create"
              ? "Tambahkan produk baru ke daftar menu"
              : "Edit informasi produk"
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
                form="menu-form"
                isLoading={isSubmitting}
                loadingText="Loading"
              >
                {dialog.mode === "create"
                  ? "Tambah Menu"
                  : dialog.mode === "edit"
                    ? "Simpan Perubahan"
                    : "Submit"}
              </Button>
            </>
          }
        >
          <MenuForm
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            isDisable={isSubmitting}
          />
        </Modal>

        {/* Delete confirmation */}
        <Modal
          isOpen={dialog.mode === "delete"}
          onClose={close}
          title="Hapus Menu"
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
                onClick={() => submitDeleteMenu()}
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
            <div className="flex items-center gap-4">
              {dialog.record.menuImageUrl && (
                <img
                  src={dialog.record.menuImageUrl}
                  alt={dialog.record.menuName}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{dialog.record.menuName}</p>
                <p className="text-sm text-muted-foreground">
                  {priceFormat(dialog.record.price)}
                </p>
                <p className="mt-2 text-sm text-foreground">
                  Yakin ingin menghapus menu ini?
                </p>
              </div>
            </div>
          )}
        </Modal>
      </PageShell>
    </MainLayout>
  );
}
