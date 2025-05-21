"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show sidebar for auth pages
  const isAuthPage = pathname.includes('/auth/');
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-full sm:w-64 bg-white dark:bg-gray-800 h-full">
            <Navigation />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Navigation />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 