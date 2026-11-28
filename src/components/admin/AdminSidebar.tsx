"use client";

import React, { useState } from "react";
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
  AlertTriangle,
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const primaryNavItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Data Siswa",
      href: "/admin/students",
      icon: Users,
      badge: "Siswa",
    },
    {
      label: "Data Tenant",
      href: "/admin/tenants",
      icon: Store,
      badge: "Kantin",
    },
    {
      label: "Rekap Settlement",
      href: "/admin/settlement",
      icon: Receipt,
      badge: "Rekap",
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 border-r border-[#D1D1D1]/60 bg-white flex flex-col justify-between shrink-0 p-4 select-none z-20">
      {/* Top Navigation Items */}
      <div className="space-y-1.5 overflow-y-auto">
        <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama Koperasi
        </p>
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
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
                <span>{item.label}</span>
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
      <div className="pt-4 border-t border-slate-100 space-y-1.5 mt-auto shrink-0">
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
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Portal</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-rose-100">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-heading font-bold text-slate-900">
              Konfirmasi Keluar
            </h3>

            {/* Description */}
            <p className="text-center text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun admin koperasi?
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
