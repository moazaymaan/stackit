"use client";

// Purpose: This module handles navigation logic and UI.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../app/(modules)/auth/services/authService";
import { Package, Boxes, Truck, ShoppingCart, ClipboardList, Users, BarChart3, LogOut } from "lucide-react";
import { getAuthToken } from "../lib/authCookies";
import { isAdminRole } from "../lib/userRoles";

const navItems = [
  { label: "Products", href: "/products", icon: Package },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Purchases", href: "/purchases", icon: ShoppingCart },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Users", href: "/users", icon: Users },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

// Process helper logic for navigation data and behavior.
function CubeLogo() {
  // Render the JSX layout for this section.
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="stackit-cube-top" x1="10" y1="7" x2="33" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A7D8FF" />
          <stop offset="1" stopColor="#42A5F5" />
        </linearGradient>
        <linearGradient id="stackit-cube-left" x1="8" y1="16" x2="24" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EC8FF" />
          <stop offset="1" stopColor="#1E4EA8" />
        </linearGradient>
        <linearGradient id="stackit-cube-right" x1="24" y1="16" x2="40" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3185E8" />
          <stop offset="1" stopColor="#0A2B73" />
        </linearGradient>
      </defs>

      <path d="M24 4 9 12.5 24 21l15-8.5L24 4Z" fill="url(#stackit-cube-top)" />
      <path d="M9 12.5V29.5L24 44V21L9 12.5Z" fill="url(#stackit-cube-left)" />
      <path d="M39 12.5V29.5L24 44V21L39 12.5Z" fill="url(#stackit-cube-right)" />

      <path
        d="M30.2 12.2c-1.8-1.4-3.9-2.2-6.4-2.2-3.6 0-6.3 1.7-6.3 4.3 0 4.7 9.1 2.7 9.1 5.9 0 1.2-1.2 2-3 2-2.1 0-4.1-.8-5.9-2.3"
        stroke="#EAF7FF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M17.2 25.8c1.8 1.5 4.2 2.4 6.8 2.4 3.7 0 6.5-1.8 6.5-4.5" stroke="#C4EDFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Render the main navigation component.
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const token = getAuthToken();

      if (!token) {
        if (isMounted) {
          setCurrentUserRole("");
          setRoleChecked(true);
        }
        return;
      }

      try {
        const response = await getCurrentUser();
        const userRole = response?.user?.role || response?.data?.role || "";

        if (isMounted) {
          setCurrentUserRole(userRole);
        }
      } catch {
        if (isMounted) {
          setCurrentUserRole("");
        }
      } finally {
        if (isMounted) {
          setRoleChecked(true);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle local navigation events and state updates.
  const handleLogout = () => {
    logout();
    router.replace("/auth");
  };

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const visibleNavItems = navItems.filter((item) => {
    if (item.label !== "Users") {
      return true;
    }

    if (!roleChecked) {
      return false;
    }

    return isAdminRole(currentUserRole);
  });

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/20 bg-linear-to-r from-slate-950 via-blue-950 to-slate-900/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/products" className="group inline-flex shrink-0 items-center gap-3">
          <span className="rounded-xl bg-slate-900/70 p-1.5 shadow-[0_0_30px_rgba(56,189,248,0.3)] transition duration-300 group-hover:shadow-[0_0_38px_rgba(34,211,238,0.45)]">
            <CubeLogo />
          </span>
          <span className="bg-linear-to-r from-sky-100 via-blue-200 to-cyan-300 bg-clip-text text-2xl font-black uppercase tracking-[0.2em] text-transparent">
            STACKIT
          </span>
        </Link>

        <nav className="flex-1 overflow-x-auto">
          <ul className="mx-auto flex min-w-max items-center justify-center gap-1.5">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition duration-300 ${
                      isActive
                        ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                        : "text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)] transition-all duration-300 ${
                        isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:from-sky-400 hover:to-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

