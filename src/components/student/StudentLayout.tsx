"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  user?: {
    fullName: string;
    className: string;
    isClassLeader: boolean;
  };
}

export function StudentLayout({ children, pageTitle, user }: StudentLayoutProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Data Siswa",
      href: "/student/classmates",
      icon: Users,
      badge: "Kelas",
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#D1D1D1]/60 z-30 flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/student" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/logo.png"
              alt="KantinPay"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span>
          </span>
        </Link>

        {/* User Info - Right Side */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-heading font-bold text-slate-900">
                {user.fullName}
              </p>
              <div className="flex items-center justify-end gap-1.5">
                <p className="text-xs text-slate-500">{user.className}</p>
                {user.isClassLeader && (
                  <Crown className="w-3 h-3 text-amber-500" />
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-heading font-bold text-sm">
              {user.fullName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 bottom-0 w-64 border-r border-[#D1D1D1]/60 bg-white flex flex-col justify-between shrink-0 p-4 select-none z-20">
          {/* Top Navigation Items */}
          <div className="space-y-1.5 overflow-y-auto">
            <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
              {user?.isClassLeader ? "Menu Ketua Kelas" : "Menu Siswa"}
            </p>
            {menuItems.map((item) => {
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

          {/* Bottom Section - Class Leader Badge & Logout */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
              Pengaturan
            </p>

            {user?.isClassLeader && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-amber-700 font-heading font-semibold">
                    Ketua Kelas
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Keluar Portal</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 overflow-y-auto">
          {/* Page Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            {pageTitle && (
              <h1 className="text-xl font-heading font-bold text-slate-900">
                {pageTitle}
              </h1>
            )}
          </div>

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
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
              Apakah Anda yakin ingin keluar dari akun siswa?
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
    </div>
  );
}
