import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";
import { formatRupiah } from "@/lib/utils";
import { Utensils, Wallet, ShieldCheck, Clock } from "lucide-react";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";

export default async function StudentPage() {
  const session = await getSession();
  const student = session ? store.getUserById(session.id) : null;
  const balance = student ? student.balance : 85000;
  const fullName = student ? student.fullName : "Siswa KantinPay";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-[#D6EFFF]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#5CC0F7] flex items-center justify-center text-white">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span> Siswa
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-heading font-semibold text-slate-500 hover:text-slate-800"
        >
          Ke Beranda
        </Link>
      </header>

      <main className="max-w-md mx-auto p-4 sm:p-6 space-y-4">
        {/* Architecture Notice */}
        <div className="p-4 rounded-3xl bg-blue-50/70 border border-[#5CC0F7]/40 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-heading font-bold text-[#0284c7]">
            <Clock className="w-4 h-4" />
            <span>Menunggu UI Reference Dashboard Siswa</span>
          </div>
          <p className="leading-relaxed">
            Sesuai petunjuk Master Prompt, layout final dashboard siswa akan diimplementasikan begitu screenshot referensi resmi disediakan.
          </p>
        </div>

        {/* Live Balance Card */}
        <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading text-slate-500">Saldo Digital Anda</span>
            <span className="text-xs font-heading px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Closed-Loop Aktif
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">
              {formatRupiah(balance)}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Pemegang Akun: <strong>{fullName}</strong> ({student?.className || "XII SIJA 1"})
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>NIS: {student?.studentId || "20241001"}</span>
            <span>Kasir Koperasi Sekolah</span>
          </div>
        </div>

        {/* 8 Kantin Selection Placeholder */}
        <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Daftar 8 Kantin Terdaftar
          </h3>
          <p className="text-xs text-slate-500">
            Backend payment service dan integrasi saldo siap memproses transaksi pembayaran di seluruh 8 kantin.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-heading">
            {["Kantin 1 (Bu Nur)", "Kantin 2 (Pak Joko)", "Kantin 3 (Ibu Siti)", "Kantin 4 (Pak Budi)", "Kantin 5 (Bu Maya)", "Kantin 6 (Pak Slamet)", "Kantin 7 (Ibu Dewi)", "Kantin 8 (Bu Rita)"].map((k) => (
              <div key={k} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-700">
                {k}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Student Bottom Tab Bar */}
      <BottomTabBar role="student" />
    </div>
  );
}
