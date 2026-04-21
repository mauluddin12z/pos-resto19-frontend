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
} from "lucide-react";

import Modal from "../ui/Modal";
import LoadingButton from "../ui/LoadingButton";
import { useAuth } from "@/app/context/AuthContext";

const baseClass =
  "flex w-16 flex-col items-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium transition-colors";
const inactive =
  "text-muted-foreground hover:bg-secondary hover:text-foreground";
const active = "bg-primary-soft text-primary";

export default function Sidebar() {
  const { user, handleLogout, loading } = useAuth();
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

  if (loading) {
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
          <div>
            <p className="text-center">
              Are you sure you want to log out of your account?
            </p>

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ${
                  isLoggingOut
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isLoggingOut ? (
                  <div className="flex gap-2 items-center justify-center">
                    <LoadingButton /> Logging out...
                  </div>
                ) : (
                  "Logout"
                )}
              </button>

              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md cursor-pointer"
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
