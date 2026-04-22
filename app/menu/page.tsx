"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { useMenus } from "../api/menuServices";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import AddMenuForm from "../components/menu/AddMenuForm";
import { useCategories } from "../api/categoryServices";
import { PageShell } from "../components/ui/PageShell";
import MenuTable from "../components/menu/MenuTable";
import Search from "../components/ui/Search";
import { CategoryInterface } from "../types";

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery, page: 1 }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  return (
    <MainLayout>
      <PageShell
        title="Menu"
        description="Kelola daftar menu dan harga produk"
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
          <MenuTable menus={menus?.data} loading={isLoading} mutate={mutate} />
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

        {/* MODAL */}
        <Modal isOpen={isAddModalOpen} onClose={() => closeAddModal()}>
          <AddMenuForm mutate={mutate} closeAddModal={() => closeAddModal()} />
        </Modal>
      </PageShell>
    </MainLayout>
  );
}
