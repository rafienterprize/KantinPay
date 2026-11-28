"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Crown,
  Wallet,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";

interface ClassLeaderTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: User | null;
  classLeader: User | null;
  onSuccess?: () => void;
}

export function ClassLeaderTopUpModal({
  isOpen,
  onClose,
  targetStudent,
  classLeader,
  onSuccess,
}: ClassLeaderTopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setAmount("");
      setMessage(null);
    }
  }, [isOpen]);

  if (!targetStudent || !classLeader) return null;

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async () => {
    const numAmount = parseInt(amount);

    if (!numAmount || numAmount <= 0) {
      setMessage({ type: "error", text: "Masukkan nominal yang valid" });
      return;
    }

    if (numAmount < 5000) {
      setMessage({ type: "error", text: "Nominal minimum Rp5.000" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/class-leader/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetStudentId: targetStudent.id,
          amount: numAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal mengajukan top-up" });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: `Top-up ${formatRupiah(numAmount)} untuk ${targetStudent.fullName} berhasil! Saldo langsung bertambah & tercatat sebagai tagihan 1x24 jam ke Koperasi.`,
      });

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Top-up error:", error);
      setMessage({ type: "error", text: "Terjadi gangguan jaringan." });
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Top-Up Siswa (Ketua Kelas)"
      description="Ajukan top-up untuk siswa se-kelas"
      maxWidth="lg"
      showCloseButton={false}
      disableBackdropClick={true}
    >
      <div className="space-y-5 py-3">
        {/* Class Leader Info */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide block">
                Ketua Kelas {classLeader.className}
              </span>
              <h4 className="font-heading font-bold text-base text-slate-900">
                {classLeader.fullName}
              </h4>
              <p className="text-xs text-slate-600">
                NIS: {classLeader.studentId}
              </p>
            </div>
          </div>
        </div>

        {/* Target Student Info */}
        <div className="p-4 rounded-2xl bg-[#D6EFFF] border border-[#5CC0F7]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wide block">
                Target Top-Up
              </span>
              <h4 className="font-heading font-bold text-base text-slate-900">
                {targetStudent.fullName}
              </h4>
              <p className="text-xs text-slate-600">
                NIS: {targetStudent.studentId} • Kelas: {targetStudent.className}
              </p>
            </div>
          </div>

          {/* Current Balance */}
          <div className="p-3 rounded-xl bg-white/80 border border-cyan-200/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Saldo Saat Ini</span>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="font-heading font-bold text-base text-emerald-700">
                  {formatRupiah(targetStudent.balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            label="Nominal Top-Up (Rp)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan nominal"
            icon={<ArrowUpCircle className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="text-xs text-slate-500 font-semibold mb-2 block">
            Nominal Cepat
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 20000, 50000, 100000, 200000, 500000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-heading font-semibold text-slate-700 bg-slate-100 hover:bg-cyan-100 hover:text-cyan-700 hover:border-cyan-300 border border-slate-200 transition disabled:opacity-50"
              >
                {formatRupiah(val)}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {amount && parseInt(amount) > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-700 font-semibold">Saldo Setelah Top-Up</span>
              <span className="font-heading font-bold text-lg text-emerald-700">
                {formatRupiah(targetStudent.balance + parseInt(amount))}
              </span>
            </div>
            <p className="text-xs text-emerald-600">
              <strong>Catatan:</strong> Saldo langsung bertambah &amp; nominal masuk ke Tagihan Bayar ke Koperasi (tenggat 1x24 jam).
            </p>
          </div>
        )}

        {/* Warning Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-900 font-semibold mb-1">
                Alur Top-Up Ketua Kelas (Tenggat 1x24 Jam)
              </p>
              <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                <li>Saldo teman (atau ketua kelas sendiri) langsung bertambah &amp; log masuk ke Admin Koperasi</li>
                <li>Nominal otomatis masuk ke Tagihan Bayar ke Koperasi di dashboard kelas &amp; admin</li>
                <li>Ketua kelas wajib menyetor uang ke Koperasi maksimal <strong>1x24 jam</strong></li>
                <li>Jika lewat 1x24 jam, saldo kelas dibekukan sementara sampai dibayar lunas di Koperasi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div
            className={`p-3 rounded-2xl text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl h-11"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={loading}
            onClick={handleSubmit}
            disabled={!amount || parseInt(amount) <= 0}
            className="flex-1 rounded-xl h-11"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Ajukan Top-Up
          </Button>
        </div>
      </div>
    </Modal>
  );
}
