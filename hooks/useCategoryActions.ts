import toast from "react-hot-toast";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/categoryServices";
import { MESSAGES } from "../constants/messages";
import { CategoryFormInterface } from "../types";

export default function useCategoryActions() {
  const validateCategoryForm = (formData: { categoryName: string }) => {
    const errors = { categoryName: "" };
    if (!formData.categoryName.trim()) {
      errors.categoryName = "Nama kategori wajib diisi.";
    }
    return errors;
  };

  const handleAddCategory = async ({
    formData,
    setIsSubmitting,
    closeAddModal,
    mutate,
    setFormErrors,
  }: {
    formData: CategoryFormInterface;
    setIsSubmitting: (val: boolean) => void;
    closeAddModal: () => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);
    const validationErrors = validateCategoryForm(formData);
    setFormErrors(validationErrors);

    if (Object.values(validationErrors).some((e) => e)) {
      setIsSubmitting(false);
      return;
    }
    const toastId = toast.loading("Sedang menambahkan kategori...");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      const res = await createCategory(formDataToSend);
      toast.success(MESSAGES.CATEGORY.CREATE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      closeAddModal();
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async ({
    categoryId,
    formData,
    closeEditModal,
    setIsSubmitting,
    mutate,
    setFormErrors,
  }: {
    categoryId: number;
    formData: CategoryFormInterface;
    closeEditModal: () => void;
    setIsSubmitting: (val: boolean) => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);
    const validationErrors = validateCategoryForm(formData);
    setFormErrors(validationErrors);

    if (Object.values(validationErrors).some((e) => e)) {
      setIsSubmitting(false);
      return;
    }
    const toastId = toast.loading("Sedang memperbarui kategori...");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      const res = await updateCategory(categoryId, formDataToSend);
      toast.success(MESSAGES.CATEGORY.UPDATE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      closeEditModal();
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async ({
    categoryId,
    setIsDeleting,
    closeDeleteModal,
    mutate,
  }: {
    categoryId: number;
    setIsDeleting: (val: boolean) => void;
    closeDeleteModal: () => void;
    mutate: () => void;
  }) => {
    setIsDeleting(true);
    const toastId = toast.loading("Sedang menghapus kategori...");
    try {
      const res = await deleteCategory(categoryId);
      toast.success(MESSAGES.CATEGORY.DELETE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      closeDeleteModal();
      setIsDeleting(false);
    }
  };

  return {
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  };
}
