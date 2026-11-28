"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Bell,
  User as UserIcon,
  LogOut,
  Crown,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wallet,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";
import { NotificationItem, ClassLeaderTopUpLog } from "@/types";

export interface StudentLayoutUser {
  id: string;
  fullName: string;
  email?: string;
  role?: "student" | "admin" | "merchant";
  studentId?: string;
  className: string;
  isClassLeader: boolean;
  balance?: number;
  whatsappNumber?: string;
}

interface StudentLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  user?: StudentLayoutUser | null;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onFilterClick?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  notifications?: NotificationItem[];
  pendingTopUps?: ClassLeaderTopUpLog[];
}

export function StudentLayout({
  children,
  pageTitle = "Dashboard Siswa",
  user,
  searchTerm = "",
  onSearchChange,
  onFilterClick,
  actionButton,
  notifications = [],
  pendingTopUps = [],
}: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hasReadNotif, setHasReadNotif] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Bayar Kantin",
      href: "/student/pay",
      icon: CreditCard,
      badge: "Bayar",
    },
    {
      label: "Data Siswa",
      href: "/student/classmates",
      icon: Users,
      badge: user?.className ? "Kelas" : "Siswa",
    },
  ];

  const pendingCount = pendingTopUps.filter((l) => l.status === "pending").length;
  const rawNotificationCount = notifications.length + (user?.isClassLeader ? pendingCount : 0);
  const notificationCount = hasReadNotif ? 0 : rawNotificationCount;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#D6EFFF]">
      {/* Top Navbar matching AdminNavbar */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Brand Name */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/student" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="KantinPay Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
              Kantin<span className="text-[#5CC0F7]">Pay</span>
            </span>
          </Link>
        </div>

        {/* Right Controls: Search, Filter, Action Button (Identical to AdminNavbar) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search bar */}
          <div className="w-40 sm:w-64 md:w-80">
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search..."
              icon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-10 py-1.5 text-xs rounded-2xl bg-slate-50 border-slate-200"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            className="rounded-2xl border-slate-200 text-xs px-3.5 h-10 gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">filter</span>
          </Button>

          {/* Optional Action Button (e.g. Top Up Teman for Class Leader) */}
          {actionButton && (
            <Button
              variant="primary"
              size="sm"
              onClick={actionButton.onClick}
              className="rounded-2xl text-xs px-4 h-10 gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{actionButton.label}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Container with Sidebar + Content (Identical to AdminLayout) */}
      <div className="flex flex-1">
        {/* Desktop Sidebar Spacer */}
        <div className="hidden md:block w-64 shrink-0" aria-hidden="true" />

        {/* Desktop Fixed Sidebar (Identical to AdminSidebar) */}
        <div className="hidden md:block">
          <aside className="fixed top-16 left-0 bottom-0 w-64 border-r border-[#D1D1D1]/60 bg-white flex flex-col justify-between shrink-0 p-4 select-none z-20">
            {/* Top Navigation Items */}
            <div className="space-y-1.5 overflow-y-auto">
              <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
                {user?.isClassLeader ? "Menu Ketua Kelas" : "Menu Utama Siswa"}
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

              {/* Class Category Indicator Pill */}
              {user?.className && (
                <div className="mt-4 mx-1 p-3 rounded-2xl bg-[#D6EFFF]/40 border border-[#5CC0F7]/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Kategori Kelas</span>
                  </div>
                  <p className="text-xs font-heading font-bold text-slate-900">
                    {user.className}
                  </p>
                  {user.isClassLeader && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Crown className="w-3 h-3" />
                      Ketua Kelas
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Items: Notification, Account & Logout (Identical to AdminSidebar) */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 mt-auto shrink-0">
              <p className="px-3 py-1 text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider">
                Pengaturan
              </p>

              <button
                onClick={() => {
                  setNotificationOpen(true);
                  setHasReadNotif(true);
                }}
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
                onClick={() => setAccountOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Account</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {user?.isClassLeader ? "Ketua" : "Siswa"}
                </span>
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-heading font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Keluar Portal</span>
              </button>
            </div>
          </aside>
        </div>

        {/* Dynamic Content Area matching AdminLayout */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 max-w-7xl w-full mx-auto overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <motion.div
            key={pageTitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Native Bottom Tab Bar */}
      <BottomTabBar role="student" />

      {/* Notification Modal */}
      <Modal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        title="Notifikasi Kelas & Saldo"
        description={`Pemberitahuan aktivitas terbaru kelas ${user?.className || ""}`}
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          {/* Class Leader Top-Up History */}
          {user?.isClassLeader && pendingTopUps.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                Riwayat Pengajuan Top-Up Ketua Kelas
              </h4>
              {pendingTopUps.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        log.status === "approved"
                          ? "success"
                          : log.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {log.status === "approved"
                        ? "Disetujui Admin"
                        : log.status === "rejected"
                        ? "Ditolak"
                        : "Menunggu Admin"}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                  <h5 className="font-heading font-semibold text-xs text-slate-900">
                    Top-Up {log.targetStudentName} ({formatRupiah(log.amount)})
                  </h5>
                  <p className="text-xs text-slate-500">
                    Notifikasi telah dikirim ke Admin Koperasi untuk verifikasi.
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Student Notifications */}
          <div className="space-y-2.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
              Pemberitahuan Akun
            </h4>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        notif.type === "success"
                          ? "success"
                          : notif.type === "error"
                          ? "danger"
                          : "primary"
                      }
                      size="sm"
                    >
                      {notif.title}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
                Belum ada notifikasi baru untuk akun Anda.
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Account Info Modal (Identical style to AdminLayout Account Modal) */}
      <Modal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        title={`Profil ${user?.fullName || "Siswa"}`}
        description="Informasi akun siswa pada ekosistem KantinPay"
      >
        <div className="py-2 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#D6EFFF]/40 border border-[#5CC0F7]/30">
            <div className="w-12 h-12 rounded-2xl bg-[#5CC0F7] text-white flex items-center justify-center font-bold text-lg font-heading">
              {user?.fullName?.slice(0, 2).toUpperCase() || "SW"}
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5">
                {user?.fullName || "Siswa"}
                {user?.isClassLeader && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </h4>
              <p className="text-xs text-slate-500">
                {user?.isClassLeader
                  ? `Ketua Kelas ${user.className}`
                  : `Siswa Kelas ${user?.className || "-"}`}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                Saldo Pribadi
              </span>
              <span className="font-heading font-bold text-emerald-600">
                {formatRupiah(user?.balance || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Kelas & NIS
              </span>
              <span className="font-semibold text-slate-800">
                {user?.className || "-"} • {user?.studentId || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              <span className="font-semibold text-slate-800">
                {user?.email || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Nomor WhatsApp
              </span>
              <span className="font-semibold text-slate-800">
                {user?.whatsappNumber || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5CC0F7]" />
                Tingkat Akses
              </span>
              <Badge variant={user?.isClassLeader ? "warning" : "primary"} size="sm">
                {user?.isClassLeader ? "Ketua Kelas (Akses Top-Up)" : "Siswa Reguler"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Status Akun
              </span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif & Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-rose-100">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-center text-lg font-heading font-bold text-slate-900">
              Konfirmasi Keluar
            </h3>

            <p className="text-center text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun siswa?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
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
