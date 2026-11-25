"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Store,
  Receipt,
  Bell,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onOpenNotification?: () => void;
  onOpenAccount?: () => void;
  notificationCount?: number;
}

export function AdminSidebar({
  onOpenNotification,
  onOpenAccount,
  notificationCount = 2,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const primaryNavItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "students page",
      href: "/admin/students",
      icon: Users,
      badge: "Siswa",
    },
    {
      label: "tenants page",
      href: "/admin/tenants",
      icon: Store,
      badge: "Kantin",
    },
    {
      label: "settlement page",
      href: "/admin/settlement",
      icon: Receipt,
      badge: "Rekap",
    },
  ];

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun admin koperasi?")) {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <aside className="w-64 border-r border-[#D1D1D1]/60 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] p-4 select-none">
      {/* Top Navigation Items */}
      <div className="space-y-1.5">
        <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama Koperasi
        </p>
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-heading font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#D6EFFF] text-slate-900 shadow-2xs border border-[#5CC0F7]/40 font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-[#0284c7]" : "text-slate-400"
                  )}
                />
                <span className="capitalize">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    isActive
                      ? "bg-[#5CC0F7] text-white"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Items: Notification & Account */}
      <div className="pt-4 border-t border-slate-100 space-y-1.5">
        <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
          Pengaturan
        </p>
        <button
          onClick={onOpenNotification}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <span>Notification</span>
          </div>
          {notificationCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#5CC0F7] text-white text-[10px] flex items-center justify-center font-bold">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenAccount}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <span>Account</span>
          </div>
          <span className="text-[10px] text-slate-400">Admin</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
}
