"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  ClipboardList,
  BarChart3,
  ListOrdered,
  LayoutGrid,
  Users,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import Modal from "../ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/Button";

const baseClass =
  "flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium transition-colors cursor-pointer";
const inactive =
  "text-muted-foreground hover:bg-secondary hover:text-foreground";
const active = "bg-primary-soft text-primary";

export default function Sidebar() {
  const { user, handleLogout, isLoading } = useAuth();
  const userRole = user?.role ?? "superadmin";
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    {
      label: "Beranda",
      icon: Home,
      href: "/beranda",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Pesanan",
      icon: ClipboardList,
      href: "/pesanan",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Penjualan",
      icon: BarChart3,
      href: "/penjualan",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Menu",
      icon: ListOrdered,
      href: "/menu",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Kategori",
      icon: LayoutGrid,
      href: "/kategori",
      roles: ["superadmin"],
    },
    {
      label: "Pengguna",
      icon: Users,
      href: "/pengguna",
      roles: ["superadmin"],
    },
  ];

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    await handleLogout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <aside className="flex w-20 flex-col items-center justify-between border-r border-border bg-card py-4">
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-14 rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="flex w-20 flex-col items-center justify-between border-r border-border bg-card py-4">
        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1">
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={label}
                  href={href}
                  className={`${baseClass} ${isActive ? active : inactive}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span>{label}</span>
                </Link>
              );
            })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className={`${baseClass} ${inactive}`}
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </aside>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        >
          <div className="flex flex-col justify-center items-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <LogOut className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Keluar dari sesi?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Anda akan keluar dari panel kasir. Pesanan yang belum disimpan
              akan hilang.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="default"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-10"
              >
                <div className="flex gap-2">
                  <ArrowLeft className="h-4 w-4" /> Batal
                </div>
              </Button>
              <Button
                variant="destructive"
                isLoading={isLoggingOut}
                loadingText="Loading"
                onClick={handleLogoutClick}
                className="px-10"
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
