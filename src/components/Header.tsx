"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";

type HeaderProps = {
  toggleSidebar: () => void;
};

type User = {
  name?: string;
  isDarkMode?: boolean;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const [user, setUser] = useState<User>({});
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

  useEffect(() => {
    if(localStorage.getItem('isDarkMode') === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []); 

  useEffect(() => {
    fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          showToast.error(data.error, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          return;
        }
        setUser(data)
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        showToast.error(`Error fetching profile`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      });
  }, []);

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
            <div className="ml-3 relative">
              <Link href="/profile">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                    <span>{user?.name
                      ? user.name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase())
                        .join('')
                      : ''}</span>
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