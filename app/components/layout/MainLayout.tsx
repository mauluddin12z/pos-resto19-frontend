"use client";
import React, { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useGlobalAlert } from "@/app/context/AlertContext";
import Alert from "../ui/Alert";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { alert, closeAlert } = useGlobalAlert();
  return (
    <div className="bg-white text-gray-900">
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
      <div className="flex">
        {/* Fixed Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
