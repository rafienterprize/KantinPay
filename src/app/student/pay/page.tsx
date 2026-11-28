"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout, StudentLayoutUser } from "@/components/student/StudentLayout";
import {
  Store,
  Wallet,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Receipt,
  Clock,
  CreditCard,
  Utensils,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Canteen, Transaction, ClassBilling } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function StudentPayPage() {
  const [user, setUser] = useState<StudentLayoutUser | null>(null);
  const [balance, setBalance] = useState(0);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [billing, setBilling] = useState<ClassBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Payment form state
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Digital Receipt Modal
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [receiptBalance, setReceiptBalance] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me", { cache: "no-store" });
      if (userRes.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);

        if (userData.user?.role === "student") {
          const payRes = await fetch("/api/student/pay", { cache: "no-store" });
          if (payRes.ok) {
            const payData = await payRes.json();
            setBalance(payData.balance || 0);
            setCanteens(payData.canteens || []);
            setMyTransactions(payData.myTransactions || []);
            setBilling(payData.billing || null);
            if (!selectedCanteen && payData.canteens?.length > 0) {
              const firstActive =
                payData.canteens.find((c: Canteen) => c.status === "active") ||
                payData.canteens[0];
              setSelectedCanteen(firstActive);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const numericAmount = Math.floor(Number(amount)) || 0;
  const isInsufficient = numericAmount > balance;
  const isFrozen = Boolean(billing?.isFrozen);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedCanteen) {
      setErrorMessage("Silakan pilih kantin tujuan terlebih dahulu.");
      return;
    }
    if (numericAmount <= 0) {
      setErrorMessage("Masukkan nominal pembayaran yang valid.");
      return;
    }
    if (isInsufficient) {
      setErrorMessage("Saldo Anda tidak mencukupi untuk transaksi ini.");
      return;
    }
    if (isFrozen) {
      setErrorMessage(
        "Saldo kelas sedang dibekukan karena tagihan ketua kelas melewati batas 1x24 jam."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canteenId: selectedCanteen.id,
          amount: numericAmount,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal memproses pembayaran.");
        setSubmitting(false);
        return;
      }

      setReceiptTx(data.transaction);
      setReceiptBalance(data.remainingBalance ?? balance - numericAmount);
      setBalance(data.remainingBalance ?? balance - numericAmount);
      setAmount("");
      setNote("");
      fetchData();
    } catch {
      setErrorMessage("Terjadi gangguan jaringan. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCanteens = canteens.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Role guard
  if (!loading && user && user.role !== "student") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 border border-[#D1D1D1]/60 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Khusus Akun Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Silakan login menggunakan akun Siswa untuk melakukan pembayaran kantin melalui website.
          </p>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#5CC0F7] hover:bg-[#48b1eb] text-white font-heading font-semibold text-xs transition cursor-pointer"
          >
            Login sebagai Siswa
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <StudentLayout
        pageTitle="Bayar Kantin"
        user={user ? { ...user, balance } : null}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="space-y-6">
          {/* 1. Header Card (Matching Admin & Student Dashboard) */}
          <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7] animate-pulse" />
                  <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                    Pembayaran Digital Web • {user?.className || "..."}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                  Bayar Kantin Lewat Website
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pilih kantin tujuan, masukkan nominal jajan, dan tunjukkan bukti pembayaran digital ke penjual kantin.
                </p>
              </div>

              {/* Live Personal Balance Pill */}
              <div className="px-5 py-3 rounded-2xl bg-[#D6EFFF]/60 border border-[#5CC0F7]/40 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-[#5CC0F7] text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-semibold text-[#0284c7] uppercase block">
                    Saldo Pribadi Anda
                  </span>
                  <span className="text-lg font-heading font-bold text-slate-900">
                    {loading ? "..." : formatRupiah(balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Freeze Warning Banner if class is overdue > 24h */}
          {isFrozen && (
            <div className="rounded-3xl p-5 bg-rose-50 border border-rose-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-rose-900">
                  Pembayaran Sementara Dibekukan (Lewat Tenggat 1x24 Jam)
                </h3>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Saldo kelas {user?.className} tidak dapat digunakan sementara karena tagihan top-up Ketua Kelas sebesar{" "}
                  <strong>{formatRupiah(billing?.remainingAmount || 0)}</strong> telah melewati batas 1x24 jam. Pembayaran akan aktif otomatis setelah disetor ke Koperasi Sekolah.
                </p>
              </div>
            </div>
          )}

          {/* 2. Main 2-Column Layout: Left = Canteen Picker, Right = Payment Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Select Canteen Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    1. Pilih Kantin Tujuan ({canteens.length} Kantin)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Klik salah satu kantin sekolah di bawah ini
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredCanteens.length === 0 ? (
                <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 p-10 text-center text-xs text-slate-400">
                  Kantin tidak ditemukan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredCanteens.map((canteen) => {
                    const isSelected = selectedCanteen?.id === canteen.id;
                    const isClosed = canteen.status !== "active";

                    return (
                      <button
                        key={canteen.id}
                        type="button"
                        disabled={isClosed}
                        onClick={() => {
                          setSelectedCanteen(canteen);
                          setErrorMessage("");
                        }}
                        className={`text-left p-4 rounded-3xl border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected
                            ? "bg-[#D6EFFF]/50 border-[#5CC0F7] shadow-sm ring-2 ring-[#5CC0F7]/30"
                            : "bg-white border-[#D1D1D1]/60 hover:border-[#5CC0F7]/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#5CC0F7] text-white"
                                : "bg-[#D6EFFF] text-[#0284c7]"
                            }`}
                          >
                            <Store className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-[10px] font-heading font-semibold px-2.5 py-0.5 rounded-full ${
                              isClosed
                                ? "bg-slate-100 text-slate-500"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isClosed ? "Tutup" : "Buka"}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-sm text-slate-900">
                          {canteen.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {canteen.ownerName}
                        </p>
                        {canteen.category && (
                          <span className="inline-block mt-2 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                            {canteen.category}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Payment Form Card */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handlePay}
                className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs space-y-5 lg:sticky lg:top-24"
              >
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    2. Detail Pembayaran
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transaksi diproses instan &amp; bebas biaya admin
                  </p>
                </div>

                {/* Selected Canteen Summary */}
                <div className="p-4 rounded-2xl bg-[#D6EFFF]/40 border border-[#5CC0F7]/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5CC0F7] text-white flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-heading font-semibold text-[#0284c7] uppercase block">
                      Kantin Tujuan
                    </span>
                    <p className="font-heading font-bold text-sm text-slate-900 truncate">
                      {selectedCanteen ? selectedCanteen.name : "Belum dipilih"}
                    </p>
                    {selectedCanteen && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {selectedCanteen.ownerName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2.5">
                  <Input
                    label="Nominal Pembayaran (Rp)"
                    type="number"
                    min={500}
                    step={500}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Contoh: 12000"
                    disabled={submitting || isFrozen}
                  />

                  {/* Quick Nominal Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 12000, 15000, 20000, 25000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        disabled={submitting || isFrozen}
                        onClick={() => {
                          setAmount(String(val));
                          setErrorMessage("");
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-heading font-semibold border transition cursor-pointer disabled:opacity-50 ${
                          numericAmount === val
                            ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Menu Note */}
                <Input
                  label="Catatan Pesanan (Opsional)"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Nasi Rames + Es Teh"
                  disabled={submitting || isFrozen}
                />

                {/* Balance Preview */}
                {numericAmount > 0 && (
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                      isInsufficient
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className="font-heading font-semibold">
                      {isInsufficient ? "Saldo Tidak Mencukupi" : "Sisa Saldo Setelah Bayar"}
                    </span>
                    <span className="font-heading font-bold text-sm">
                      {isInsufficient
                        ? `Kurang ${formatRupiah(numericAmount - balance)}`
                        : formatRupiah(balance - numericAmount)}
                    </span>
                  </div>
                )}

                {/* Error Feedback */}
                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  disabled={!selectedCanteen || numericAmount <= 0 || isInsufficient || isFrozen}
                  className="w-full rounded-2xl"
                >
                  <span>
                    {numericAmount > 0
                      ? `Bayar ${formatRupiah(numericAmount)}`
                      : "Bayar Sekarang"}
                  </span>
                </Button>
              </form>
            </div>
          </div>

          {/* 3. Personal Transaction History */}
          <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Riwayat Transaksi Saya
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Catatan pembayaran kantin &amp; top-up pribadi Anda
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
            ) : myTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada riwayat transaksi.
              </div>
            ) : (
              <div className="space-y-2">
                {myTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-bold text-slate-900 truncate">
                        {tx.canteenName || (tx.type === "topup" ? "Top Up Saldo" : "Kantin")}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tx.description} • {tx.referenceNumber}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-heading font-bold block ${
                          tx.type === "topup" ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {tx.type === "topup" ? "+" : "-"}
                        {formatRupiah(tx.amount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </StudentLayout>

      {/* Digital Payment Receipt Modal */}
      <Modal
        isOpen={Boolean(receiptTx)}
        onClose={() => setReceiptTx(null)}
        title="Pembayaran Berhasil!"
        description="Tunjukkan struk digital ini kepada pedagang kantin"
      >
        {receiptTx && (
          <div className="space-y-5 py-2">
            <div className="p-5 rounded-2xl bg-[#D6EFFF]/50 border border-[#5CC0F7]/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#5CC0F7] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider block">
                Nominal Dibayar
              </span>
              <h3 className="text-3xl font-heading font-bold text-slate-900">
                {formatRupiah(receiptTx.amount)}
              </h3>
              <p className="text-xs text-slate-600 font-heading">
                {receiptTx.canteenName}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  Nomor Referensi
                </span>
                <span className="font-heading font-bold text-slate-900">
                  {receiptTx.referenceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Siswa</span>
                <span className="font-semibold text-slate-800">
                  {user?.fullName} ({user?.className})
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Keterangan</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                  {receiptTx.description}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Sisa Saldo Anda</span>
                <span className="font-heading font-bold text-emerald-600">
                  {formatRupiah(receiptBalance)}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Link href="/student" className="flex-1">
                <Button variant="outline" size="sm" className="w-full rounded-2xl h-10 text-xs">
                  Ke Dashboard
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setReceiptTx(null)}
                className="flex-1 rounded-2xl h-10 text-xs"
              >
                Selesai
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
