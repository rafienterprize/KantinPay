"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";
import { Modal } from "@/components/ui/Modal";
import { Bell, User, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ClassLeaderTopUpNotifications } from "./ClassLeaderTopUpNotifications";
import { useCanteenCount } from "@/hooks/useCanteenCount";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onFilterClick?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminLayout({
  children,
  pageTitle = "Panel Koperasi",
  searchTerm,
  onSearchChange,
  onFilterClick,
  actionButton,
}: AdminLayoutProps) {
  const canteenCount = useCanteenCount();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingTopUpCount, setPendingTopUpCount] = useState(0);
  const [hasReadNotifications, setHasReadNotifications] = useState(false);
  const [seenPendingCount, setSeenPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRead = sessionStorage.getItem("admin_notif_read") === "true";
      const savedPending = parseInt(sessionStorage.getItem("admin_notif_seen_pending") || "0", 10);
      setHasReadNotifications(savedRead);
      setSeenPendingCount(isNaN(savedPending) ? 0 : savedPending);
    }
    fetchCurrentUser();
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await fetch("/api/admin/class-leader-topups");
      if (res.ok) {
        const data = await res.json();
        const count = (data.logs || []).length;
        setPendingTopUpCount(count);
        // If new pending top-up requests arrived after last read, show badge again
        if (typeof window !== "undefined") {
          const savedPending = parseInt(sessionStorage.getItem("admin_notif_seen_pending") || "0", 10);
          if (count > (isNaN(savedPending) ? 0 : savedPending)) {
            setHasReadNotifications(false);
            sessionStorage.setItem("admin_notif_read", "false");
          }
        }
      }
    } catch {
      // ignore
    }
  };

  const unreadNotificationCount = hasReadNotifications
    ? Math.max(0, pendingTopUpCount - seenPendingCount)
    : 2 + pendingTopUpCount;

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#D6EFFF]">
      {/* Top Navbar matching wireframe header */}
      <AdminNavbar
        pageTitle={pageTitle}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onFilterClick={onFilterClick}
        actionButton={actionButton}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar Spacer (reserves 16rem space for the fixed sidebar) */}
        <div className="hidden md:block w-64 shrink-0" aria-hidden="true" />
        
        {/* Desktop Fixed Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar
            onOpenNotification={() => {
              setNotificationOpen(true);
              setHasReadNotifications(true);
              setSeenPendingCount(pendingTopUpCount);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("admin_notif_read", "true");
                sessionStorage.setItem("admin_notif_seen_pending", String(pendingTopUpCount));
              }
              fetchNotificationCount();
            }}
            onOpenAccount={() => setAccountOpen(true)}
            notificationCount={unreadNotificationCount}
          />
        </div>

        {/* Dynamic Content Area with smooth transition */}
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
      <BottomTabBar role="admin" />

      {/* Notification Modal */}
      <Modal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        title="Notifikasi Koperasi"
        description="Pemberitahuan aktivitas transaksi dan sistem KantinPay"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          {/* Class Leader Top-Up Notifications */}
          <ClassLeaderTopUpNotifications onRefresh={fetchNotificationCount} />

          {/* Divider */}
          <div className="border-t border-slate-200 my-4"></div>

          {/* General Notifications */}
          <div className="px-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-3">
              Notifikasi Umum
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    Rekap Harian
                  </Badge>
                  <span className="text-[10px] text-slate-400">12:30 WIB</span>
                </div>
                <h4 className="font-heading font-semibold text-xs text-slate-800">
                  Rekap Transaksi {canteenCount} Kantin Siap Dicairkan
                </h4>
                <p className="text-xs text-slate-500">
                  Total {canteenCount} kantin beroperasi penuh hari ini dengan akumulasi penjualan Rp2.200.000.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm">
                    Top-up
                  </Badge>
                  <span className="text-[10px] text-slate-400">08:30 WIB</span>
                </div>
                <h4 className="font-heading font-semibold text-xs text-slate-800">
                  Top Up Siswa Berhasil
                </h4>
                <p className="text-xs text-slate-500">
                  Top up saldo siswa Nurul Hidayah (XII SIJA 2) sebesar Rp100.000 sukses dicatat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Account Info Modal */}
      <Modal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        title={`Profil ${currentUser?.fullName || "Admin"}`}
        description="Informasi akun pengelola sistem KantinPay"
      >
        <div className="py-2 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#D6EFFF]/40 border border-[#5CC0F7]/30">
            <div className="w-12 h-12 rounded-2xl bg-[#5CC0F7] text-white flex items-center justify-center font-bold text-lg font-heading">
              {currentUser?.fullName?.slice(0, 2).toUpperCase() || "AD"}
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                {currentUser?.fullName || "Admin"}
              </h4>
              <p className="text-xs text-slate-500">Administrator Utama Kasir & Keuangan</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              <span className="font-semibold text-slate-800">
                {currentUser?.email || "admin@kantinpay.sch.id"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Nomor WhatsApp
              </span>
              <span className="font-semibold text-slate-800">081234567890</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5CC0F7]" />
                Tingkat Akses
              </span>
              <Badge variant="primary" size="sm">
                Super Admin Koperasi
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Status Sistem
              </span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif & Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
