"use client";

import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Modal from "../components/ui/Modal";
import { useUsers } from "../api/userServices";
import AddUserForm from "../components/user/AddUserForm";
import { PageShell } from "../components/ui/PageShell";
import { Plus } from "lucide-react";
import UserTable from "../components/user/UserTable";

export default function Page() {
  const { users, isLoading, mutate } = useUsers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <MainLayout>
      <PageShell
        title="Pengguna"
        description="Kelola akun staff dan hak akses"
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </button>
        }
      >
        <UserTable users={users} loading={isLoading} mutate={mutate} />
      </PageShell>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddUserForm
          mutate={mutate}
          closeAddModal={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </MainLayout>
  );
}