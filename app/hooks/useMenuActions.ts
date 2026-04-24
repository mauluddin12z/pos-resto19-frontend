import { createMenu, updateMenu, deleteMenu } from "@/app/api/menuServices";
import { useGlobalAlert } from "../context/AlertContext";
import { MenuFormInterface } from "../types";
import { MESSAGES } from "../constants/messages";

/**
 * Custom hook to manage Menu-related actions
 */
const useMenuActions = () => {
  const { showAlert } = useGlobalAlert();

  /**
   * Validates menu form data and returns error messages
   */
  const validateMenuForm = (formData: MenuFormInterface) => {
    const errors = {
      menuName: "",
      categoryId: "",
      stock: "",
      price: "",
    };

    console.log(formData);
    const stock = Number(formData.stock);
    const price = Number(formData.price);

    if (!formData.menuName.trim()) {
      errors.menuName = "Nama menu wajib diisi.";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Kategori wajib dipilih.";
    }

    if (isNaN(stock) || stock <= 0) {
      errors.stock = "Stok harus bernilai 0 atau lebih.";
    }

    if (isNaN(price) || price <= 0) {
      errors.price = "Harga harus bernilai 0 atau lebih.";
    }

    return errors;
  };

  /**
   * Handles adding a new menu
   */
  const handleAddMenu = async ({
    formData,
    setIsSubmitting,
    closeAddModal,
    mutate,
    setFormErrors,
  }: {
    formData: MenuFormInterface;
    setIsSubmitting: (val: boolean) => void;
    closeAddModal: () => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateMenuForm(formData);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("menuName", formData.menuName);
      formDataToSend.append("categoryId", formData.categoryId ?? "");
      formDataToSend.append("menuDescription", formData.menuDescription ?? "");
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("price", formData.price);

      if (formData.menuImage instanceof File) {
        formDataToSend.append("menuImage", formData.menuImage);
      }

      const res = await createMenu(formDataToSend);

      showAlert({
        type: "success",
        message: MESSAGES.MENU.CREATE_SUCCESS || res?.message,
      });
    } catch (error: any) {
      showAlert({
        type: "error",
        message:
          MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
      });
    } finally {
      mutate();
      closeAddModal();
      setIsSubmitting(false);
    }
  };

  /**
   * Handles editing an existing menu
   */
  const handleEditMenu = async ({
    menuId,
    formData,
    closeEditModal,
    setIsSubmitting,
    mutate,
    setFormErrors,
  }: {
    menuId: number;
    formData: MenuFormInterface;
    closeEditModal: () => void;
    setIsSubmitting: (val: boolean) => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateMenuForm(formData);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("menuName", formData.menuName);
      formDataToSend.append("menuDescription", formData.menuDescription);
      formDataToSend.append("categoryId", formData.categoryId || "");
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());

      if (formData.menuImage instanceof File) {
        formDataToSend.append("menuImage", formData.menuImage);
      }

      const res = await updateMenu(menuId, formDataToSend);

      showAlert({
        type: "success",
        message: MESSAGES.MENU.UPDATE_SUCCESS || res?.message,
      });
    } catch (error: any) {
      showAlert({
        type: "error",
        message:
          MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
      });
    } finally {
      mutate();
      closeEditModal();
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting a menu item
   */
  const handleDeleteMenu = async ({
    menuId,
    setIsDeleting,
    closeDeleteModal,
    mutate,
  }: {
    menuId: number;
    setIsDeleting: (val: boolean) => void;
    closeDeleteModal: () => void;
    mutate: () => void;
  }) => {
    setIsDeleting(true);

    try {
      const res = await deleteMenu(menuId);
      showAlert({
        type: "success",
        message: MESSAGES.MENU.DELETE_SUCCESS || res?.message,
      });
    } catch (error: any) {
      showAlert({
        type: "error",
        message:
          MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
      });
    } finally {
      mutate();
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return {
    handleAddMenu,
    handleEditMenu,
    handleDeleteMenu,
  };
};

export default useMenuActions;
