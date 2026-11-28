"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Receipt,
  User,
  CreditCard,
  History,
  Bell,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomTabBarProps {
  role?: "student" | "admin" | "merchant";
}

export function BottomTabBar({ role = "admin" }: BottomTabBarProps) {
  const pathname = usePathname();

  // Define tab navigation per role as specified in Prompt Section 15
  const adminTabs = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Siswa", href: "/admin/students", icon: Users },
    { label: "Kantin", href: "/admin/tenants", icon: Store },
    { label: "Settlement", href: "/admin/settlement", icon: Receipt },
    { label: "Akun", href: "/admin/account", icon: User },
  ];

  const studentTabs = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Bayar", href: "/student/pay", icon: CreditCard },
    { label: "Data Siswa", href: "/student/classmates", icon: Users },
  ];

  const merchantTabs = [
    { label: "Dashboard", href: "/merchant", icon: LayoutDashboard },
    { label: "Transaksi", href: "/merchant/transactions", icon: History },
    { label: "Penjualan", href: "/merchant/sales", icon: UtensilsCrossed },
    { label: "Notifikasi", href: "/merchant/notifications", icon: Bell },
    { label: "Akun", href: "/merchant/profile", icon: User },
  ];

  const tabs =
    role === "student"
      ? studentTabs
      : role === "merchant"
      ? merchantTabs
      : adminTabs;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#D1D1D1]/60 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
      <div
        className={cn(
          "grid h-12 max-w-lg mx-auto px-2",
          tabs.length === 3 ? "grid-cols-3" : tabs.length === 2 ? "grid-cols-2" : "grid-cols-5"
        )}
      >
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin" && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-all duration-150 select-none",
                isActive
                  ? "text-[#5CC0F7] font-semibold"
                  : "text-[#64748B] hover:text-slate-900 active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "stroke-[2.5px] scale-110" : "stroke-[1.75px]"
                )}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-heading">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
