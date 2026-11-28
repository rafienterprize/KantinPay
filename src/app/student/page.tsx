"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout, StudentLayoutUser } from "@/components/student/StudentLayout";
import {
  Users,
  Wallet,
  Receipt,
  TrendingUp,
  UserPlus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Crown,
  Award,
  Clock,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCanteenCount } from "@/hooks/useCanteenCount";
import { NotificationItem, ClassLeaderTopUpLog, ClassBilling } from "@/types";

interface ClassStatsData {
  className: string;
  myBalance: number;
  totalBalance: number;
  totalStudents: number;
  totalTransactions: number;
  totalSpending: number;
  billing?: ClassBilling;
  classLeader: {
    id: string;
    fullName: string;
    studentId?: string;
    whatsappNumber?: string;
  } | null;
  topSpender: {
    id: string;
    name: string;
    nis: string;
    amount: number;
    count: number;
    isClassLeader: boolean;
  } | null;
  topSpenders: Array<{
    id: string;
    name: string;
    nis: string;
    amount: number;
    count: number;
    isClassLeader: boolean;
  }>;
  recentTransactions: Array<{
    id: string;
    studentName: string;
    canteenName: string;
    type: string;
    amount: number;
    description: string;
    timestamp: string;
  }>;
  chart: Array<{ time: string; amount: number; count: number }>;
  pendingTopUps: ClassLeaderTopUpLog[];
  notifications: NotificationItem[];
}

export default function StudentDashboardPage() {
  const canteenCount = useCanteenCount();
  const [user, setUser] = useState<StudentLayoutUser | null>(null);
  const [stats, setStats] = useState<ClassStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartPeriod, setChartPeriod] = useState<"hari-ini" | "minggu-ini">("hari-ini");
  const [txTypeFilter, setTxTypeFilter] = useState<"all" | "payment" | "topup">("all");
  const [leaderboardSort, setLeaderboardSort] = useState<"amount" | "count">("amount");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [todayString, setTodayString] = useState("");

  useEffect(() => {
    setTodayString(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);

        // Only fetch student class stats if logged in as a student
        if (userData.user?.role === "student") {
          const statsRes = await fetch("/api/student/class-stats");
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch student dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopSpenders = [...(stats?.topSpenders || [])]
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (leaderboardSort === "count" ? b.count - a.count : b.amount - a.amount));

  const filteredRecentTx = (stats?.recentTransactions || []).filter((tx) => {
    const matchesSearch =
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.canteenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = txTypeFilter === "all" || tx.type === txTypeFilter;
    return matchesSearch && matchesType;
  });

  const chartMultiplier = chartPeriod === "minggu-ini" ? 4.5 : 1;
  const maxChartAmount = Math.max(
    150000 * chartMultiplier,
    ...(stats?.chart || []).map((p) => p.amount * chartMultiplier)
  );

  // Guard: If currently logged in as Admin or Merchant (e.g., from another browser tab)
  if (!loading && user && user.role !== "student") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 border border-[#D1D1D1]/60 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Sesi Aktif Bukan Akun Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Saat ini browser Anda sedang login sebagai{" "}
              <strong className="text-slate-900">{user.fullName}</strong> ({user.role}).
              Karena cookie sesi dibagi antar tab browser, silakan login ulang dengan akun Siswa (atau buka di jendela Incognito untuk membuka Admin &amp; Siswa bersamaan).
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
            <p className="font-heading font-bold text-slate-700">Akun Demo XII SIJA 1:</p>
            <p className="text-slate-600">
              • Ketua Kelas: <strong>ahmad@kantinpay.sch.id</strong> (pw: password123)
            </p>
            <p className="text-slate-600">
              • Siswa Biasa: <strong>ashraf@kantinpay.sch.id</strong> (pw: password123)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href={user.role === "admin" ? "/admin" : "/merchant"}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-heading font-semibold text-xs hover:bg-slate-50 transition"
            >
              Ke Dashboard {user.role === "admin" ? "Admin" : "Merchant"}
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#5CC0F7] hover:bg-[#48b1eb] text-white font-heading font-semibold text-xs transition cursor-pointer"
            >
              Login sebagai Siswa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout
      pageTitle="Dashboard Siswa"
      user={user}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setFilterModalOpen(true)}
      notifications={stats?.notifications || []}
      pendingTopUps={stats?.pendingTopUps || []}
    >
      <div className="space-y-6">
        {/* 1. Greetings Section (Identical to AdminDashboardPage) */}
        <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs relative overflow-hidden">
          {loading || !user ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7] animate-pulse" />
                  <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                    {user.isClassLeader
                      ? `Panel Ketua Kelas • ${user.className}`
                      : `Panel Siswa • ${user.className}`}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                  Greetings, {user.fullName}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {user.isClassLeader
                    ? `Pantau statistik uang kelas ${user.className}, siswa paling banyak jajan, dan kelola top-up saldo teman sekelas.`
                    : `Pantau saldo pribadi, statistik kas kelas ${user.className}, dan aktivitas jajan teman sekelas hari ini.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user.isClassLeader ? (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 font-medium">
                    <Crown className="w-3.5 h-3.5" />
                    Ketua Kelas {user.className}
                  </span>
                ) : (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Siswa Aktif • {user.className}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Info Strip Banner (Identical to AdminDashboardPage) */}
        <div className="rounded-2xl bg-[#D6EFFF]/60 p-4 border border-[#5CC0F7]/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span className="font-heading font-medium">
              {user?.isClassLeader
                ? `Info Kelas ${user.className}: Setiap top-up teman sekelas yang Anda ajukan akan otomatis mengirim notifikasi ke Admin Koperasi.`
                : `Info Kelas ${user?.className || ""}: Data statistik kelas dan aktivitas jajan teman sekelas diperbarui secara realtime.`}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-[#0284c7] font-heading font-semibold shrink-0">
            {todayString || "Hari Ini"}
          </span>
        </div>

        {/* 2b. Tagihan Bayar ke Koperasi Card (Always visible for Ketua Kelas; visible for students when unpaid/frozen) */}
        {stats?.billing && (user?.isClassLeader || stats.billing.remainingAmount > 0) && (
          <div
            className={`rounded-3xl p-5 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              stats.billing.isFrozen
                ? "bg-rose-50 border-rose-200"
                : stats.billing.remainingAmount > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-[#D1D1D1]/60"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    stats.billing.isFrozen
                      ? "bg-rose-600 text-white"
                      : stats.billing.remainingAmount > 0
                      ? "bg-amber-200 text-amber-900"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {stats.billing.isFrozen
                    ? "Saldo Kelas Dibekukan (Lewat 1x24 Jam)"
                    : stats.billing.remainingAmount > 0
                    ? "Tagihan Bayar ke Koperasi • Tenggat 1x24 Jam"
                    : "Tagihan Bayar ke Koperasi • Lunas"}
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Tagihan Bayar ke Koperasi: {formatRupiah(stats.billing.remainingAmount)}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {stats.billing.isFrozen
                  ? `Tenggat 1x24 jam telah lewat. Seluruh saldo top-up ketua kelas di ${stats.className} tidak dapat digunakan sampai Ketua Kelas menyetor ke Koperasi Sekolah.`
                  : stats.billing.remainingAmount > 0
                  ? `Total tagihan dari top-up ketua kelas${
                      stats.billing.paidAmount > 0
                        ? ` (sudah dibayar ${formatRupiah(stats.billing.paidAmount)})`
                        : ""
                    }. Wajib disetor ke Koperasi maksimal sebelum ${
                      stats.billing.dueAt
                        ? new Date(stats.billing.dueAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "1x24 jam"
                    } WIB agar saldo kelas tetap aktif.`
                  : `Tidak ada tagihan top-up yang perlu disetor ke Koperasi Sekolah. Setiap top-up yang Anda lakukan untuk teman maupun diri sendiri akan otomatis masuk ke tagihan ini dengan tenggat 1x24 jam.`}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] font-heading uppercase text-slate-500 block">
                Sisa Tagihan Kelas
              </span>
              <span
                className={`text-2xl font-heading font-bold ${
                  stats.billing.isFrozen
                    ? "text-rose-600"
                    : stats.billing.remainingAmount > 0
                    ? "text-amber-700"
                    : "text-emerald-600"
                }`}
              >
                {formatRupiah(stats.billing.remainingAmount)}
              </span>
            </div>
          </div>
        )}

        {/* 3. 4 KPI Cards in a row (Identical to AdminDashboardPage with SkeletonCard shimmer) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !stats ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* KPI 1: Saldo Pribadi Saya */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Saldo Pribadi Saya
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {formatRupiah(stats.myBalance)}
                </h3>
                <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                  Akun Aktif • {stats.className}
                </p>
              </div>

              {/* KPI 2: Total Saldo Kelas */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Saldo Kelas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {formatRupiah(stats.totalBalance)}
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  {stats.totalStudents} Siswa Terdaftar di {stats.className}
                </p>
              </div>

              {/* KPI 3: Total Transaksi Kelas */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Transaksi Kelas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {stats.totalTransactions} Transaksi
                </h3>
                <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                  Jajan Kelas {stats.className}
                </p>
              </div>

              {/* KPI 4: Total Jajan Kelas */}
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Jajan Kelas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {formatRupiah(stats.totalSpending)}
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  Akumulasi Jajan di {canteenCount} Kantin
                </p>
              </div>
            </>
          )}
        </div>

        {/* 4. Bottom 2-Column Layout (Identical to AdminDashboardPage: 5 cols Left, 7 cols Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Quick Actions + Top Spenders Leaderboard */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Action for Ketua Kelas vs Siswa Biasa */}
            {user?.isClassLeader ? (
              <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                    Quick Action • Ketua Kelas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Top Up Saldo Teman Sekelas
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ajukan top-up saldo untuk teman kelas {user.className}. Permintaan akan otomatis mengirim notifikasi ke Admin Koperasi untuk persetujuan.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/student/classmates"
                    className="inline-flex items-center text-xs font-heading font-semibold text-[#5CC0F7] hover:text-[#48b1eb]"
                  >
                    <span>Buka Daftar Siswa & Top Up</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                    Quick Action
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Data Siswa Kelas {user?.className || ""}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Lihat daftar teman sekelas, total saldo kelas, dan statistik jajan kelas Anda. Ingin top-up? Hubungi Ketua Kelas atau loket Koperasi.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/student/classmates"
                    className="inline-flex items-center text-xs font-heading font-semibold text-[#5CC0F7] hover:text-[#48b1eb]"
                  >
                    <span>Lihat Daftar Teman Sekelas</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Top Spenders / Siswa Paling Banyak Jajan Card */}
            <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-heading font-bold text-[#0284c7] uppercase tracking-wider block">
                    Leaderboard {stats?.className || ""}
                  </span>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Siswa Paling Banyak Jajan
                  </h4>
                </div>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-2xl" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              ) : filteredTopSpenders.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredTopSpenders.map((spender, idx) => (
                    <div
                      key={spender.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        idx === 0
                          ? "bg-amber-50/70 border-amber-200"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-xs shrink-0 ${
                            idx === 0
                              ? "bg-amber-500 text-white"
                              : "bg-[#D6EFFF] text-[#0284c7]"
                          }`}
                        >
                          {idx === 0 ? <Crown className="w-4 h-4" /> : `#${idx + 1}`}
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-xs text-slate-900 truncate">
                            {spender.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {spender.count}x jajan di kantin
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-heading font-bold text-xs shrink-0 ${
                          idx === 0 ? "text-amber-700" : "text-slate-900"
                        }`}
                      >
                        {formatRupiah(spender.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada data jajan di kelas ini.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Grafik Aktivitas Kelas + Transaksi Terakhir (Identical to AdminDashboardPage) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Grafik Aktivitas */}
            <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-heading font-bold text-base text-slate-900">
                      Grafik Aktivitas Kelas {stats?.className || ""}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Distribusi volume transaksi jajan teman sekelas per jam istirahat
                    </p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-heading font-semibold">
                    <button
                      onClick={() => setChartPeriod("hari-ini")}
                      className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                        chartPeriod === "hari-ini"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Hari Ini
                    </button>
                    <button
                      onClick={() => setChartPeriod("minggu-ini")}
                      className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                        chartPeriod === "minggu-ini"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Minggu Ini
                    </button>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="mt-6 space-y-4">
                  {loading || !stats ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-4/5 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    stats.chart.map((point) => {
                      const scaledAmount = Math.round(point.amount * chartMultiplier);
                      const scaledCount = Math.round(point.count * chartMultiplier);
                      const percentage = Math.min(
                        100,
                        Math.max(8, Math.round((scaledAmount / maxChartAmount) * 100))
                      );

                      return (
                        <div key={point.time} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-heading">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#5CC0F7]" />
                              {point.time} WIB
                            </span>
                            <span className="text-slate-500 font-medium">
                              {formatRupiah(scaledAmount)} • {scaledCount} Transaksi
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
                    })
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Data disinkronkan khusus kategori kelas {stats?.className || "-"}
                </span>
                <span className="font-heading font-semibold text-[#0284c7]">
                  Realtime
                </span>
              </div>
            </div>

            {/* Transaksi Terakhir Kelas */}
            <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Transaksi Terakhir Kelas {stats?.className || ""}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Riwayat jajan & top-up terbaru teman sekelas
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {loading ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
              ) : filteredRecentTx.length > 0 ? (
                <div className="space-y-2">
                  {filteredRecentTx.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-heading font-bold text-slate-900 truncate">
                          {tx.studentName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {tx.canteenName} •{" "}
                          {new Date(tx.timestamp).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB
                        </p>
                      </div>
                      <span
                        className={`text-xs font-heading font-bold shrink-0 ${
                          tx.type === "topup" ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {tx.type === "topup" ? "+" : "-"}
                        {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">
                  Belum ada transaksi di kelas ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Menu Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Aktivitas Kelas"
        description={`Saring tampilan grafik, transaksi, dan leaderboard kelas ${stats?.className || ""}`}
      >
        <div className="space-y-5 py-2">
          {/* Periode Grafik */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Periode Grafik Aktivitas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "hari-ini" as const, label: "Hari Ini" },
                { value: "minggu-ini" as const, label: "Minggu Ini" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setChartPeriod(opt.value)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-heading font-semibold border transition cursor-pointer ${
                    chartPeriod === opt.value
                      ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jenis Transaksi */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Jenis Transaksi Terakhir
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "all" as const, label: "Semua" },
                { value: "payment" as const, label: "Jajan Kantin" },
                { value: "topup" as const, label: "Top Up" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTxTypeFilter(opt.value)}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-heading font-semibold border transition cursor-pointer ${
                    txTypeFilter === opt.value
                      ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Urutan Leaderboard */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Urutan Siswa Paling Banyak Jajan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "amount" as const, label: "Nominal Terbanyak" },
                { value: "count" as const, label: "Sering Jajan (x)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLeaderboardSort(opt.value)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-heading font-semibold border transition cursor-pointer ${
                    leaderboardSort === opt.value
                      ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setChartPeriod("hari-ini");
                setTxTypeFilter("all");
                setLeaderboardSort("amount");
              }}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Reset Filter
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setFilterModalOpen(false)}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>
    </StudentLayout>
  );
}
