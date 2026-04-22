import React, { useState, useCallback, useMemo } from "react";
import { MenuInterface } from "../../types";
import Image, { ImageLoader } from "next/image";
import { priceFormat } from "../../utils/priceFormat";
import Modal from "../ui/Modal";
import EditMenuForm from "./EditMenuForm";
import useMenuActions from "@/app/hooks/useMenuActions";
import { Pencil, Trash2 } from "lucide-react";
import IconButton from "../ui/IconButton";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

export interface MenuPropsInterface {
  menus: MenuInterface[];
  loading: boolean;
  mutate: () => void;
}

export default function MenuTable({
  menus,
  loading,
  mutate,
}: MenuPropsInterface) {
  const myLoader: ImageLoader = ({ src }) => src;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuInterface | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleDeleteMenu } = useMenuActions();

  const openEditModal = useCallback((menu: MenuInterface) => {
    setSelectedMenu(menu);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setSelectedMenu(null);
    setIsEditModalOpen(false);
  }, []);

  const openDeleteModal = useCallback((menu: MenuInterface) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setSelectedMenu(null);
    setIsDeleteModalOpen(false);
  }, []);

  const confirmDeleteMenu = useCallback(async () => {
    if (!selectedMenu?.menuId) return;

    await handleDeleteMenu({
      menuId: selectedMenu.menuId,
      setIsDeleting,
      closeDeleteModal,
      mutate,
    });
  }, [selectedMenu, setIsDeleting, closeDeleteModal, mutate]);

  const tableContent = useMemo(
    () =>
      menus?.map((m: MenuInterface) => (
        <tr
          key={m.menuId}
          className="border-t border-gray-200 hover:bg-gray-50"
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              {m.menuImageUrl && (
                <Image
                  loader={myLoader}
                  src={m.menuImageUrl ?? "no-image.png"}
                  alt={m.menuName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-lg object-cover"
                  unoptimized
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{m.menuName}</p>
                {m.menuDescription && (
                  <p className="line-clamp-1 text-xs text-gray-500">
                    {m.menuDescription}
                  </p>
                )}
              </div>
            </div>
          </td>

          <td className="px-4 py-3 text-gray-500">
            {m.category.categoryName || "-"}
          </td>

          <td className="px-4 py-3 text-right font-bold tabular-nums">
            {priceFormat(m.price)}
          </td>

          <td className="px-4 py-3 text-center">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                m.stock > 20
                  ? "bg-green-100 text-green-700"
                  : m.stock > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {m.stock} pcs
            </span>
          </td>

          <td className="px-4 py-3">
            <div className="flex justify-end gap-1.5">
              <IconButton variant="edit" onClick={() => openEditModal(m)}>
                <Pencil className="h-4 w-4" />
              </IconButton>

              <IconButton variant="delete" onClick={() => openDeleteModal(m)}>
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          </td>
        </tr>
      )),
    [menus, openEditModal, openDeleteModal],
  );

  return (
    <div className="relative overflow-x-auto border">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">Produk</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3 text-right">Harga</th>
            <th className="px-4 py-3 text-center">Stok</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center">
                Loading...
              </td>
            </tr>
          ) : menus?.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                Tidak ada menu ditemukan.
              </td>
            </tr>
          ) : (
            tableContent
          )}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {selectedMenu && isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <EditMenuForm
            menuId={selectedMenu.menuId}
            closeEditModal={closeEditModal}
            mutate={mutate}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {selectedMenu && isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteMenu}
          isLoading={isDeleting}
          message="Apakah Anda yakin ingin menghapus menu ini?"
        />
      )}
    </div>
  );
}
