"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";
import { Modal } from "@/components/ui/Modal";
import { Bell, User, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

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
            onOpenNotification={() => setNotificationOpen(true)}
            onOpenAccount={() => setAccountOpen(true)}
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
      >
        <div className="space-y-3 py-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">
                Rekap Harian
              </Badge>
              <span className="text-[10px] text-slate-400">12:30 WIB</span>
            </div>
            <h4 className="font-heading font-semibold text-xs text-slate-800">
              Rekap Transaksi 8 Kantin Siap Dicairkan
            </h4>
            <p className="text-xs text-slate-500">
              Total 8 kantin beroperasi penuh hari ini dengan akumulasi penjualan Rp2.200.000.
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
      </Modal>

      {/* Account Info Modal */}
      <Modal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        title="Profil Pengurus Koperasi"
        description="Informasi akun pengelola sistem KantinPay"
      >
        <div className="py-2 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#D6EFFF]/40 border border-[#5CC0F7]/30">
            <div className="w-12 h-12 rounded-2xl bg-[#5CC0F7] text-white flex items-center justify-center font-bold text-lg font-heading">
              KP
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Pengurus Koperasi Sekolah
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
              <span className="font-semibold text-slate-800">admin@kantinpay.sch.id</span>
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
