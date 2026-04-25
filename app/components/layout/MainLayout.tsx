"use client";
import React, { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-white text-gray-900">
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
