"use client";

import React, { useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { UserInterface } from "../../types";
import IconButton from "../ui/IconButton";

interface UserPropsInterface {
  users: UserInterface[];
  loading: boolean;
  mutate: () => void;
  openEdit: (user: UserInterface) => void;
  openDelete: (user: UserInterface) => void;
}

export default function UserTable({
  users,
  loading,
  openEdit,
  openDelete,
}: UserPropsInterface) {
  const [search, setSearch] = useState("");
  /* ---------------- FILTER ---------------- */
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((u) =>
      `${u.name} ${u.username}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

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
            <IconButton variant="edit" onClick={() => openEdit(u)}>
              <Pencil className="h-4 w-4" />
            </IconButton>

            <IconButton variant="delete" onClick={() => openDelete(u)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        </td>
      </tr>
    ));
  }, [filteredUsers, openEdit, openDelete]);

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
    </>
  );
}
