import toast from "react-hot-toast";
import { createUser, deleteUser, updateUser } from "../api/userServices";
import { MESSAGES } from "../constants/messages";
import { UserFormInterface } from "../types";

/**
 * Custom hook to manage User-related actions
 */
const useUserActions = () => {
  /**
   * Validates User form data and returns error messages
   */
  const validateUserForm = (formData: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    const errors = {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    };

    if (!formData.name.trim()) errors.name = "Nama wajib diisi.";
    if (!formData.username) errors.username = "Username wajib diisi.";
    if (formData.password.length < 6) errors.password = "Minimal 6 karakter";
    else if (formData.password.length > 64)
      errors.password = "Maksimal 64 karakter";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Konfirmasi tidak cocok";
    if (!formData.role) errors.role = "Role is required.";

    return errors;
  };

  /**
   * Handles adding a new user
   */
  const handleAddUser = async ({
    formData,
    setIsSubmitting,
    closeAddModal,
    mutate,
    setFormErrors,
  }: {
    formData: UserFormInterface;
    setIsSubmitting: (val: boolean) => void;
    closeAddModal: () => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateUserForm(formData);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }
    const toastId = toast.loading("Sedang menambahkan pengguna...");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);

      const res = await createUser(formDataToSend);
      toast.success(MESSAGES.USER.CREATE_SUCCESS || res?.message, {
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

  /**
   * Handles editing an existing user
   */
  const handleEditUser = async ({
    userId,
    formData,
    closeEditModal,
    setIsSubmitting,
    mutate,
    setFormErrors,
  }: {
    userId: number;
    formData: UserFormInterface;
    closeEditModal: () => void;
    setIsSubmitting: (val: boolean) => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateUserForm(formData);
    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }
    const toastId = toast.loading("Sedang memperbarui pengguna...");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", formData.userId?.toString() || "");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);

      const res = await updateUser(userId, formDataToSend);
      toast.success(MESSAGES.USER.UPDATE_SUCCESS || res?.message, {
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

  /**
   * Handles deleting a user
   */
  const handleDeleteUser = async ({
    userId,
    setIsDeleting,
    closeDeleteModal,
    mutate,
  }: {
    userId: number;
    setIsDeleting: (val: boolean) => void;
    closeDeleteModal: () => void;
    mutate: () => void;
  }) => {
    setIsDeleting(true);
    const toastId = toast.loading("Sedang menghapus pengguna...");
    try {
      const res = await deleteUser(userId);
      toast.success(MESSAGES.USER.DELETE_SUCCESS || res?.message, {
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
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
  };
};

export default useUserActions;
