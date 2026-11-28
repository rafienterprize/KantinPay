"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Receipt,
  Store,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { MerchantSettlement } from "@/types";

export default function SettlementPage() {
  const [settlements, setSettlements] = useState<MerchantSettlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSettlement, setSelectedSettlement] = useState<MerchantSettlement | null>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSettleAllModal, setShowSettleAllModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleDownloadCsv = () => {
    const headers = ["Referensi", "Nama Kantin", "Jumlah Transaksi", "Total Penjualan", "Status"];
    const rows = settlements.map((s) => [
      s.referenceNumber,
      `"${s.canteenName}"`,
      s.transactionCount,
      s.totalAmount,
      s.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-settlement-kantinpay-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
  };

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settlement");
      const data = await res.json();
      let list: MerchantSettlement[] = data.settlements || [];

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        list = list.filter(
          (s) =>
            s.canteenName.toLowerCase().includes(q) ||
            s.referenceNumber.toLowerCase().includes(q)
        );
      }
      setSettlements(list);
    } catch {
      console.error("Failed to load settlements");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleOpenAction = (settlement: MerchantSettlement) => {
    setSelectedSettlement(settlement);
    setFeedback(null);
  };

  const handleUpdateStatus = async (action: "process" | "settle") => {
    if (!selectedSettlement) return;
    setProcessLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settlementId: selectedSettlement.id,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || "Gagal memproses settlement");
        setProcessLoading(false);
        return;
      }

      fetchSettlements();
      setFeedback(data.message);
      setTimeout(() => {
        setSelectedSettlement(null);
      }, 1000);
    } catch {
      setFeedback("Terjadi kesalahan jaringan.");
    } finally {
      setProcessLoading(false);
    }
  };

  const handleSettleAll = async () => {
    setShowSettleAllModal(false);
    for (const s of settlements.filter((x) => x.status !== "settled")) {
      await fetch("/api/admin/settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementId: s.id, action: "settle" }),
      });
    }
    fetchSettlements();
  };

  return (
    <AdminLayout
      pageTitle="Rekap Settlement"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setShowFilterModal(true)}
    >
      <div className="space-y-6">
        {/* Top Header Card: Rekap Harian Tenant matching wireframe */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                Rekonsiliasi Keuangan Koperasi
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mt-0.5">
              Rekap Harian Tenant
            </h1>
            <p className="text-xs text-slate-500">
              Pantau akumulasi penjualan harian {settlements.length || 8} kantin sekolah dan lakukan pencairan dana (settlement) sore hari.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-heading">
            <span className="px-3 py-1.5 rounded-2xl bg-[#D6EFFF] text-[#0284c7] border border-[#5CC0F7]/40 font-semibold">
              {settlements.length || 8} Tenant Terdaftar
            </span>
          </div>
        </div>

        {/* Tenant Cards + Status Settlement Grid (3 columns across) matching settlement.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-3xl bg-white border border-slate-200/80 p-5 space-y-3"
              >
                <div className="h-5 w-1/3 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-8 w-2/3 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-md animate-pulse" />
              </div>
            ))
          ) : (
            settlements.map((s) => {
              const statusBadges = {
                pending: {
                  label: "Pending",
                  variant: "warning" as const,
                  icon: Clock,
                },
                processing: {
                  label: "Processing",
                  variant: "primary" as const,
                  icon: Clock,
                },
                settled: {
                  label: "Settled",
                  variant: "success" as const,
                  icon: CheckCircle2,
                },
              };

              const badge = statusBadges[s.status];
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={s.id}
                  className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header card with name and status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                          {s.canteenName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {s.referenceNumber}
                        </span>
                      </div>
                      <Badge variant={badge.variant} size="sm">
                        <BadgeIcon className="w-3 h-3 mr-0.5" />
                        <span>{badge.label}</span>
                      </Badge>
                    </div>

                    {/* Total Amount & Transactions */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-3 space-y-1">
                      <span className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Penjualan Hari Ini
                      </span>
                      <h3 className="text-xl font-heading font-bold text-slate-900">
                        {formatRupiah(s.totalAmount)}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {s.transactionCount} Transaksi Pembayaran Siswa
                      </p>
                    </div>
                  </div>

                  {/* Settlement Action Button matching wireframe */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-heading">
                      <Calendar className="w-3 h-3" />
                      {s.settlementDate}
                    </span>

                    <Button
                      variant={s.status === "settled" ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleOpenAction(s)}
                      className="rounded-2xl text-xs px-3.5 h-8 font-heading"
                    >
                      <span>{s.status === "settled" ? "Lihat Bukti" : "Proses Cair"}</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section: Quick Action matching wireframe green box */}
        <div className="p-6 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
              <span className="font-heading font-bold text-sm text-slate-900">
                Pencairan Massal Sore Hari (Settlement Koperasi)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Selesaikan pencairan dana penjualan ke seluruh rekening {settlements.length || 8} pedagang kantin sekaligus setelah jam sekolah berakhir.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setExportDone(false);
                setShowExportModal(true);
              }}
              className="rounded-2xl text-xs gap-1.5 flex-1 sm:flex-none border-slate-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              <span>Ekspor Rekap</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowSettleAllModal(true)}
              className="rounded-2xl text-xs px-6 flex-1 sm:flex-none shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Quick Action: Selesaikan Semua</span>
            </Button>
          </div>
        </div>
      </div>

      {/* EXPORT REKAP POPUP MODAL */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Ekspor Laporan Rekap Settlement"
        description="Unduh laporan harian penjualan seluruh tenant kantin dalam format Excel/CSV atau cetak PDF"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-[#D6EFFF]/50 border border-[#5CC0F7]/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 block">Total Tenant Direkap</span>
              <span className="font-heading font-bold text-slate-900 text-sm">
                {settlements.length} Kantin Sekolah
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-600 block">Total Nominal</span>
              <span className="font-heading font-bold text-[#0284c7] text-sm">
                {formatRupiah(
                  settlements.reduce((sum, s) => sum + s.totalAmount, 0)
                )}
              </span>
            </div>
          </div>

          {exportDone && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Laporan CSV berhasil diunduh ke perangkat Anda!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowExportModal(false);
                window.print();
              }}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Cetak / Simpan PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadCsv}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Unduh Excel (.CSV)
            </Button>
          </div>
        </div>
      </Modal>

      {/* DETAIL & ACTION MODAL */}
      <Modal
        isOpen={Boolean(selectedSettlement)}
        onClose={() => setSelectedSettlement(null)}
        title="Detail Settlement Tenant"
        description="Verifikasi pembukuan dan status pencairan dana kantin"
      >
        {selectedSettlement && (
          <div className="space-y-4 py-1">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D6EFFF]/50 to-white border border-[#5CC0F7]/40 space-y-1">
              <span className="text-[10px] font-mono text-slate-500">
                Ref: {selectedSettlement.referenceNumber}
              </span>
              <h4 className="font-heading font-bold text-base text-slate-900">
                {selectedSettlement.canteenName}
              </h4>
              <p className="text-xs text-slate-600">
                Tanggal Operasional: {selectedSettlement.settlementDate}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block font-heading">Total Penjualan</span>
                <span className="font-heading font-bold text-base text-slate-900">
                  {formatRupiah(selectedSettlement.totalAmount)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block font-heading">Jumlah Transaksi</span>
                <span className="font-heading font-bold text-base text-slate-900">
                  {selectedSettlement.transactionCount} Transaksi
                </span>
              </div>
            </div>

            {feedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSettlement(null)}
                className="rounded-2xl"
              >
                Tutup
              </Button>

              <div className="flex items-center gap-2">
                {selectedSettlement.status === "pending" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={processLoading}
                    onClick={() => handleUpdateStatus("process")}
                    className="rounded-2xl"
                  >
                    Tandai Sedang Diproses
                  </Button>
                )}

                {selectedSettlement.status !== "settled" && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={processLoading}
                    onClick={() => handleUpdateStatus("settle")}
                    className="rounded-2xl px-5"
                  >
                    Konfirmasi Pencairan Selesai
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Filter Settlement
            </h3>
            
            <p className="text-sm text-slate-600">
              Fitur filter akan segera tersedia untuk menyaring data berdasarkan status, tenant, dan periode tertentu.
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

      {/* Settle All Confirmation Modal */}
      {showSettleAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-blue-100">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>

            <h3 className="text-center text-lg font-heading font-bold text-slate-900">
              Konfirmasi Pencairan Serentak
            </h3>

            <p className="text-center text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin memproses pencairan serentak untuk seluruh tenant berstatus pending?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSettleAllModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSettleAll}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-[#5CC0F7] hover:bg-[#38bdf8] transition"
              >
                Ya, Proses Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
