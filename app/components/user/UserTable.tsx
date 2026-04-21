"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { UserInterface } from "../../types";
import Modal from "../ui/Modal";
import EditUserForm from "./EditUserForm";
import useUserActions from "@/app/hooks/useUserActions";

interface UserPropsInterface {
  users: UserInterface[];
  loading: boolean;
  mutate: () => void;
}

export default function UserTable({
  users,
  loading,
  mutate,
}: UserPropsInterface) {
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleDeleteUser } = useUserActions();

  /* ---------------- FILTER ---------------- */
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((u) =>
      `${u.name} ${u.username}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  /* ---------------- MODALS ---------------- */
  const openEdit = useCallback((user: UserInterface) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setSelectedUser(null);
    setIsEditOpen(false);
  }, []);

  const openDelete = useCallback((user: UserInterface) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setSelectedUser(null);
    setIsDeleteOpen(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedUser?.userId) return;

    await handleDeleteUser({
      userId: selectedUser.userId,
      setIsDeleting,
      closeDeleteModal: closeDelete,
      mutate,
    });
  }, [selectedUser, mutate, closeDelete]);

  /* ---------------- ROWS ---------------- */
  const rows = useMemo(() => {
    return filteredUsers.map((u) => (
      <tr
        key={u.userId}
        className="border-t border-border hover:bg-secondary/40 transition"
      >
        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
          #{u.userId}
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {u.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <span className="font-semibold">{u.name}</span>
          </div>
        </td>

        <td className="px-4 py-3 text-muted-foreground">@{u.username}</td>

        <td className="px-4 py-3">
          <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
            {u.role}
          </span>
        </td>

        <td className="px-4 py-3 text-muted-foreground">
          {u.createdAt ? u.createdAt.slice(0, 10) : "-"}
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => openEdit(u)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={() => openDelete(u)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [filteredUsers]);

  return (
    <>
      {/* TABLE */}
      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
        {/* HEADER SEARCH */}
        <div className="border-b border-border p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau username..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Bergabung</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada user ditemukan
                  </td>
                </tr>
              ) : (
                rows
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {selectedUser && isEditOpen && (
        <Modal isOpen={isEditOpen} onClose={closeEdit}>
          <EditUserForm
            userId={selectedUser.userId}
            mutate={mutate}
            closeEditModal={closeEdit}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {selectedUser && isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={closeDelete}>
          <div>
            <p className="text-center">
              Are you sure you want to delete this user?
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={confirmDelete}
                className={`rounded-md bg-red-600 px-4 py-2 text-white ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </button>

              <button
                onClick={closeDelete}
                className="rounded-md bg-gray-200 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
