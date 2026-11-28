"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
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
  onOpenNotification?: () => void;
  onOpenAccount?: () => void;
  notificationCount?: number;
}

interface TabItem {
  id: string;
  label: string;
  href?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export function BottomTabBar({
  role = "admin",
  onOpenNotification,
  onOpenAccount,
  notificationCount = 0,
}: BottomTabBarProps) {
  const pathname = usePathname();

  const adminTabs: TabItem[] = [
    { id: "admin-home", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { id: "admin-students", label: "Siswa", href: "/admin/students", icon: Users },
    { id: "admin-classes", label: "Kelas", href: "/admin/classes", icon: GraduationCap },
    { id: "admin-tenants", label: "Kantin", href: "/admin/tenants", icon: Store },
    { id: "admin-settlement", label: "Rekap", href: "/admin/settlement", icon: Receipt },
  ];

  const studentTabs: TabItem[] = [
    { id: "stu-home", label: "Home", href: "/student", icon: LayoutDashboard },
    { id: "stu-pay", label: "Bayar", href: "/student/pay", icon: CreditCard },
    { id: "stu-class", label: "Kelas", href: "/student/classmates", icon: Users },
    ...(onOpenNotification
      ? [
          {
            id: "stu-notif",
            label: "Notif",
            action: onOpenNotification,
            icon: Bell,
            badgeCount: notificationCount,
          },
        ]
      : []),
    ...(onOpenAccount
      ? [
          {
            id: "stu-account",
            label: "Akun",
            action: onOpenAccount,
            icon: User,
          },
        ]
      : []),
  ];

  const merchantTabs: TabItem[] = [
    { id: "mer-home", label: "Dashboard", href: "/merchant", icon: LayoutDashboard },
    { id: "mer-tx", label: "Transaksi", href: "/merchant/transactions", icon: History },
    { id: "mer-sales", label: "Penjualan", href: "/merchant/sales", icon: UtensilsCrossed },
    { id: "mer-notif", label: "Notif", href: "/merchant/notifications", icon: Bell },
    { id: "mer-profile", label: "Akun", href: "/merchant/profile", icon: User },
  ];

  const tabs =
    role === "student"
      ? studentTabs
      : role === "merchant"
      ? merchantTabs
      : adminTabs;

  const isTabActive = (tab: TabItem) => {
    if (!tab.href) return false;
    if (tab.href === "/admin" || tab.href === "/student" || tab.href === "/merchant") {
      return pathname === tab.href;
    }
    return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/92 backdrop-blur-lg border-t border-[#D1D1D1]/60 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div
        className={cn(
          "grid items-center gap-1 max-w-lg mx-auto",
          tabs.length === 5
            ? "grid-cols-5"
            : tabs.length === 4
            ? "grid-cols-4"
            : tabs.length === 3
            ? "grid-cols-3"
            : "grid-cols-2"
        )}
      >
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          const Icon = tab.icon;

          const innerContent = (
            <>
              {isActive && (
                <motion.div
                  layoutId={`bottomNavActivePill-${role}`}
                  className="absolute inset-0 rounded-2xl bg-[#D6EFFF] border border-[#5CC0F7]/35 shadow-2xs"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                  }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative z-10 flex flex-col items-center justify-center w-full"
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive
                        ? "text-[#0284c7] stroke-[2.4px] -translate-y-0.5"
                        : "text-slate-500 stroke-[1.8px]"
                    )}
                  />
                  {tab.badgeCount && tab.badgeCount > 0 ? (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#5CC0F7] text-white text-[9px] font-heading font-bold flex items-center justify-center shadow-2xs">
                      {tab.badgeCount}
                    </span>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-0.5 tracking-tight font-heading leading-none transition-colors",
                    isActive ? "text-[#0284c7] font-bold" : "text-slate-500 font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </motion.div>
            </>
          );

          if (tab.href) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center justify-center min-h-[48px] py-1.5 rounded-2xl select-none cursor-pointer"
              >
                {innerContent}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={tab.action}
              className="relative flex flex-col items-center justify-center min-h-[48px] py-1.5 rounded-2xl select-none cursor-pointer"
            >
              {innerContent}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
