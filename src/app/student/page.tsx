"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { 
  Users, 
  TrendingUp, 
  Receipt, 
  Wallet,
  Crown,
  Award,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface ClassStats {
  totalBalance: number;
  totalTransactions: number;
  totalStudents: number;
  topSpender: {
    name: string;
    amount: number;
  } | null;
  recentTransactions: Array<{
    studentName: string;
    amount: number;
    timestamp: string;
  }>;
}

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch current user
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch class stats
      const statsRes = await fetch("/api/student/class-stats");
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout pageTitle="Dashboard">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0284c7]"></div>
          <p className="text-sm text-slate-500 mt-3">Memuat data...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!user) {
    return (
      <StudentLayout pageTitle="Dashboard">
        <p className="text-center text-slate-500">User not found</p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout pageTitle="Dashboard" user={user}>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
              {user.isClassLeader ? "PANEL PENGURUS KOPERASI KELAS" : "DASHBOARD SISWA"}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">
            {user.isClassLeader 
              ? `Selamat Datang, Ketua Kelas ${user.className}!`
              : `Hai, ${user.fullName}!`
            }
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {user.isClassLeader
              ? "Pantau seluruh aktivitas pembayaran digital kelas kamu sekarang dan saldo teman sekelas."
              : "Lihat aktivitas kelas dan saldo teman-teman sekelas kamu."
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Siswa */}
          <div className="p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-heading font-semibold mb-1">
              Total Siswa Terdaftar
            </p>
            <h3 className="text-2xl font-heading font-bold text-slate-900">
              {stats?.totalStudents || 0} Siswa
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              100% Aktif
            </p>
          </div>

          {/* Total Saldo Kelas */}
          <div className="p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-heading font-semibold mb-1">
              Total Saldo Kelas
            </p>
            <h3 className="text-2xl font-heading font-bold text-emerald-600">
              {formatRupiah(stats?.totalBalance || 0)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Harian 25 Nov 2024
            </p>
          </div>

          {/* Total Transaksi */}
          <div className="p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-heading font-semibold mb-1">
              Total Transaksi
            </p>
            <h3 className="text-2xl font-heading font-bold text-slate-900">
              {stats?.totalTransactions || 0} Transaksi
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              Hari ini: Senin
            </p>
          </div>

          {/* Rata-rata */}
          <div className="p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-heading font-semibold mb-1">
              Rata-rata Transaksi
            </p>
            <h3 className="text-2xl font-heading font-bold text-slate-900">
              {formatRupiah(stats?.totalStudents ? (stats.totalBalance / stats.totalStudents) : 0)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Omset per siswa
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Spender */}
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Siswa Paling Banyak Jajan
                </h3>
              </div>
            </div>

            {stats?.topSpender ? (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-heading font-bold text-2xl flex items-center justify-center">
                    {stats.topSpender.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-heading font-bold text-slate-900">
                      {stats.topSpender.name}
                    </p>
                    <p className="text-xs text-slate-500">Juara Belanja Hari Ini</p>
                    <p className="text-lg font-heading font-bold text-amber-600 mt-1">
                      {formatRupiah(stats.topSpender.amount)}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                Belum ada transaksi hari ini
              </p>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Transaksi Terakhir
              </h3>
            </div>

            <div className="space-y-2">
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.slice(0, 5).map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-heading font-bold text-slate-900">
                        {tx.studentName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-heading font-bold text-rose-500">
                      -{formatRupiah(tx.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">
                  Belum ada transaksi
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions for Class Leader */}
        {user.isClassLeader && (
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs p-6">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-4">
              Quick Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/student/classmates"
                className="p-4 rounded-2xl border-2 border-dashed border-[#5CC0F7] hover:bg-[#D6EFFF]/30 transition text-center"
              >
                <Users className="w-6 h-6 text-[#0284c7] mx-auto mb-2" />
                <p className="text-sm font-heading font-bold text-slate-900">
                  Kelola Data Siswa
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Lihat & top-up saldo teman sekelas
                </p>
              </a>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center opacity-60 cursor-not-allowed">
                <TrendingUp className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-heading font-bold text-slate-600">
                  Laporan Bulanan
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Segera hadir
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
