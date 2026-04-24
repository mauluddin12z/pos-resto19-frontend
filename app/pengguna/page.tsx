"use client";

import React, { FormEvent, useCallback, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Modal from "../components/ui/Modal";
import { useUsers } from "../api/userServices";
import { PageShell } from "../components/ui/PageShell";
import { Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import UserTable from "../components/user/UserTable";
import { UserFormInterface, UserInterface } from "../types";
import UserForm from "../components/user/UserForm";
import useUserActions from "../hooks/useUserActions";
import LoadingButton from "../components/ui/LoadingButton";
import { Button } from "../components/ui/Button";

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: UserInterface }
  | { mode: "delete"; record: UserInterface };

type FormErrors = Partial<Record<keyof UserFormInterface, string>>;

const emptyForm: UserFormInterface = {
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  role: "",
};

const mapUserToForm = (record: UserInterface) => ({
  name: record.name,
  username: record.username,
  password: "",
  confirmPassword: "",
  role: record.role,
});

export default function Page() {
  const { users, isLoading, mutate } = useUsers();
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setDialog({ mode: "create" });
  };

  const openEdit = (record: UserInterface) => {
    setFormData(mapUserToForm(record));
    setFormErrors({});
    setShowPwd(false);
    setDialog({ mode: "edit", record });
  };
  const openDelete = (record: UserInterface) => {
    setFormData(mapUserToForm(record));
    setFormErrors({});
    setShowPwd(false);
    setDialog({ mode: "delete", record });
  };

  const close = () => setDialog({ mode: "closed" });

  // Handle input change
  const handleChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const { handleAddUser, handleEditUser, handleDeleteUser } = useUserActions();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dialog.mode === "create") {
      await handleAddUser({
        formData,
        setIsSubmitting,
        setFormErrors,
        closeAddModal: close,
        mutate,
      });
    } else if (dialog.mode === "edit") {
      await handleEditUser({
        userId: Number(formData.userId),
        formData,
        setIsSubmitting,
        setFormErrors,
        closeEditModal: close,
        mutate,
      });
    }
  };

  const submitDeleteUser = async () => {
    await handleDeleteUser({
      userId: Number(formData.userId),
      setIsDeleting: setIsSubmitting,
      closeDeleteModal: close,
      mutate,
    });
  };

  return (
    <MainLayout>
      <PageShell
        title="Pengguna"
        description="Kelola akun staff dan hak akses"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </button>
        }
      >
        <UserTable
          users={users}
          loading={isLoading}
          mutate={mutate}
          openEdit={openEdit}
          openDelete={openDelete}
        />
      </PageShell>

      <Modal
        isOpen={dialog.mode === "create" || dialog.mode === "edit"}
        onClose={close}
        title={dialog.mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
        description={
          dialog.mode === "create"
            ? "Buat akun baru untuk anggota tim"
            : "Perbarui informasi akun"
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
              form="user-form"
              isLoading={isSubmitting}
              loadingText="Loading"
            >
              {dialog.mode === "create"
                ? "Tambah User"
                : dialog.mode === "edit"
                  ? "Simpan Perubahan"
                  : "Submit"}
            </Button>
          </>
        }
      >
        <UserForm
          dialog={dialog}
          formData={formData}
          formErrors={formErrors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowPwd={setShowPwd}
          showPwd={showPwd}
        />
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={dialog.mode === "delete"}
        onClose={close}
        title="Hapus Pengguna"
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
              onClick={() => submitDeleteUser()}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {dialog.record.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="font-semibold">{dialog.record.name}</p>
              <p className="text-sm text-muted-foreground">
                @{dialog.record.username}
              </p>
              <p className="mt-2 text-sm text-foreground">
                Yakin ingin menghapus pengguna ini?
              </p>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
