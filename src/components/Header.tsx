"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  
  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-2 sm:ml-0">
                {getPageTitle()}
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 relative">
              <Link href="/profile">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                    <span className="text-sm font-medium">US</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 