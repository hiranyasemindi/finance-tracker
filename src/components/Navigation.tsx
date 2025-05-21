"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  CreditCardIcon,
  FolderIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  WalletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Transactions", href: "/transactions", icon: CreditCardIcon },
  { name: "Categories", href: "/categories", icon: FolderIcon },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
  { name: "Budget", href: "/budget", icon: CurrencyDollarIcon },
  { name: "Accounts", href: "/accounts", icon: WalletIcon },
  { name: "Profile", href: "/profile", icon: UserCircleIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow">
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center mb-5 px-2 py-4"
        >
          <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Finance Tracker
          </span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = item.href === pathname;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive
                      ? "text-green-600 dark:text-green-300"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  } mr-3 h-5 w-5 flex-shrink-0`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 