import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";
import { formatRupiah } from "@/lib/utils";
import { Utensils, Store, Clock } from "lucide-react";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";

export default async function MerchantPage() {
  const session = await getSession();
  const canteen = store.getCanteens()[0]; // Kantin 1 by default

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-[#D6EFFF]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#5CC0F7] flex items-center justify-center text-white">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span> Merchant
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
            <span>Menunggu UI Reference Dashboard Merchant</span>
          </div>
          <p className="leading-relaxed">
            Sesuai petunjuk Master Prompt, layout final dashboard merchant akan dibangun segera setelah screenshot UI referensi disediakan.
          </p>
        </div>

        {/* Live Daily Sales Card */}
        <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading text-slate-500">Penjualan Hari Ini</span>
            <span className="text-xs font-heading px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Buka / Terhubung
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">
              {formatRupiah(canteen.dailyTotal)}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {canteen.name} ({canteen.ownerName})
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{canteen.dailyCount} Transaksi Pembeli</span>
            <span className="text-amber-600 font-semibold">Status Settlement: Menunggu Sore</span>
          </div>
        </div>
      </main>

      {/* Merchant Bottom Tab Bar */}
      <BottomTabBar role="merchant" />
    </div>
  );
}
