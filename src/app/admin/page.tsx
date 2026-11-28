"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users,
  Wallet,
  Receipt,
  TrendingUp,
  UserPlus,
  Sparkles,
  Store,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface AnalyticsData {
  kpis: {
    totalStudents: number;
    totalStudentBalance: number;
    totalTransactions: number;
    totalTransactionValue: number;
  };
  chart: Array<{ time: string; amount: number; count: number }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartPeriod, setChartPeriod] = useState<"hari-ini" | "minggu-ini">("hari-ini");
  const [todayString, setTodayString] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    setTodayString(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout
      pageTitle="Dashboard Koperasi"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setShowFilterModal(true)}
    >
      <div className="space-y-6">
        {/* Greetings Section matching wireframe */}
        <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7] animate-pulse" />
                <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                  Panel Pengurus Koperasi
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                Greetings, Pengurus Koperasi!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pantau seluruh sirkulasi pembayaran digital kantin sekolah dan saldo kasir hari ini.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Koperasi Buka & Aktif
              </span>
            </div>
          </div>
        </div>

        {/* More Greetings / Quick Announcement banner */}
        <div className="rounded-2xl bg-[#D6EFFF]/60 p-4 border border-[#5CC0F7]/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span className="font-heading font-medium">
              more grettings: Rekap harian seluruh 8 kantin sekolah telah disinkronkan otomatis. Seluruh transaksi kasir aman.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-[#0284c7] font-heading font-semibold">
            {todayString || "Senin, 25 Januari 2026"}
          </span>
        </div>

        {/* 4 KPI Cards in a row matching wireframe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !data ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* KPI 1 */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Siswa Terdaftar
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {data.kpis.totalStudents} Siswa
                </h3>
                <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                  100% Akun Aktif
                </p>
              </div>

              {/* KPI 2 */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Saldo Siswa
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {formatRupiah(data.kpis.totalStudentBalance)}
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  Tersimpan di Kas Koperasi
                </p>
              </div>

              {/* KPI 3 */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Transaksi
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {data.kpis.totalTransactions} Transaksi
                </h3>
                <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                  Hari Ini Selesai
                </p>
              </div>

              {/* KPI 4 */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Nilai Transaksi
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {formatRupiah(data.kpis.totalTransactionValue)}
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  Omset Kantin Hari Ini
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Section matching wireframe: Left: 2 Quick Action cards; Right: Grafik Aktivitas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 2 Quick Action Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Action 1 */}
            <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                  Quick Action
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Top Up Saldo Siswa
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Terima setoran tunai dari siswa di loket koperasi sekolah dan tambahkan saldo digital secara instan.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/admin/students"
                  className="inline-flex items-center text-xs font-heading font-semibold text-[#5CC0F7] hover:text-[#48b1eb]"
                >
                  <span>Buka Tabel Siswa & Top Up</span>
                </Link>
              </div>
            </div>

            {/* Quick Action 2 */}
            <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                  Quick Action
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Kelola Tenant & Settlement
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pantau omset harian 8 kantin sekolah dan selesaikan pencairan dana settlement sore hari.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/admin/settlement"
                  className="inline-flex items-center text-xs font-heading font-semibold text-[#5CC0F7] hover:text-[#48b1eb]"
                >
                  <span>Lihat Rekap Harian 8 Tenant</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Grafik Aktivitas */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Grafik Aktivitas
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Distribusi volume transaksi pembayaran siswa per jam istirahat
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-heading font-semibold">
                  <button
                    onClick={() => setChartPeriod("hari-ini")}
                    className={`px-3 py-1 rounded-xl transition ${
                      chartPeriod === "hari-ini"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Hari Ini
                  </button>
                  <button
                    onClick={() => setChartPeriod("minggu-ini")}
                    className={`px-3 py-1 rounded-xl transition ${
                      chartPeriod === "minggu-ini"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Minggu Ini
                  </button>
                </div>
              </div>

              {/* Visualized Bar Chart with real numbers */}
              <div className="mt-6 space-y-4">
                {data?.chart.map((point) => {
                  const maxAmount = 800000;
                  const percentage = Math.min(100, Math.round((point.amount / maxAmount) * 100));

                  return (
                    <div key={point.time} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-heading">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#5CC0F7]" />
                          {point.time} WIB
                        </span>
                        <span className="text-slate-500 font-medium">
                          {formatRupiah(point.amount)} • {point.count} Transaksi
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#5CC0F7] to-[#38bdf8] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Puncak Transaksi: Jam Istirahat I (09:30) & Jam Istirahat II (12:00)
              </span>
              <span className="font-heading font-semibold text-[#0284c7]">
                Live Sync Neon DB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Filter Aktivitas Koperasi
            </h3>
            
            <p className="text-sm text-slate-600">
              Fitur filter akan segera tersedia untuk menyaring data berdasarkan periode, jenis transaksi, dan kantin tertentu.
            </p>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-[#5CC0F7] hover:bg-[#38bdf8] transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
