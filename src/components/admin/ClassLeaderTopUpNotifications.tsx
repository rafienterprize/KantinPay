"use client";

import React, { useState, useEffect } from "react";
import { ClassLeaderTopUpLog } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  User as UserIcon,
  Calendar,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ClassLeaderTopUpNotificationsProps {
  onRefresh?: () => void;
}

export function ClassLeaderTopUpNotifications({
  onRefresh,
}: ClassLeaderTopUpNotificationsProps) {
  const [logs, setLogs] = useState<ClassLeaderTopUpLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingLog, setRejectingLog] = useState<ClassLeaderTopUpLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/class-leader-topups");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (logId: string) => {
    setProcessingId(logId);
    try {
      const res = await fetch(`/api/admin/class-leader-topups/${logId}/approve`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menyetujui top-up");
        setProcessingId(null);
        return;
      }

      alert(data.message);
      fetchLogs();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Approve error:", error);
      alert("Terjadi gangguan jaringan");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (log: ClassLeaderTopUpLog) => {
    setRejectingLog(log);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingLog) return;

    setProcessingId(rejectingLog.id);
    try {
      const res = await fetch(`/api/admin/class-leader-topups/${rejectingLog.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menolak top-up");
        setProcessingId(null);
        return;
      }

      alert(data.message);
      setShowRejectModal(false);
      setRejectingLog(null);
      setRejectReason("");
      fetchLogs();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Reject error:", error);
      alert("Terjadi gangguan jaringan");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        <p className="text-sm text-slate-500 mt-3">Memuat permintaan top-up...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-heading font-bold text-slate-900 mb-1">
          Tidak Ada Permintaan
        </h3>
        <p className="text-sm text-slate-500">
          Belum ada permintaan top-up dari ketua kelas
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="px-4 py-2 bg-cyan-50 border-b border-cyan-100">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Permintaan Top-Up dari Ketua Kelas ({logs.length})
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Verifikasi dan setujui permintaan top-up dari ketua kelas
          </p>
        </div>

        <div className="max-h-[500px] overflow-y-auto px-4 space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3"
            >
              {/* Class Leader Info */}
              <div className="flex items-center gap-3 pb-3 border-b border-amber-200/60">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {log.classLeaderName}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Ketua Kelas {log.className}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-amber-700">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(log.createdAt)}
                  </div>
                </div>
              </div>

              {/* Target Student Info */}
              <div className="p-3 rounded-xl bg-white/80 border border-cyan-200/60">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Siswa Target
                    </span>
                    <h5 className="font-heading font-bold text-sm text-slate-900">
                      {log.targetStudentName}
                    </h5>
                    <p className="text-xs text-slate-600">
                      NIS: {log.targetStudentNis}
                    </p>
                  </div>
                </div>

                {/* Amount & Balance */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-semibold block mb-1">
                      Nominal Top-Up
                    </span>
                    <div className="flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-heading font-bold text-sm text-emerald-700">
                        {formatRupiah(log.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-600 font-semibold block mb-1">
                      Saldo Sebelum
                    </span>
                    <span className="font-heading font-bold text-sm text-slate-700 block">
                      {formatRupiah(log.previousBalance)}
                    </span>
                  </div>
                </div>

                {/* Projected Balance */}
                <div className="mt-2 p-2 rounded-lg bg-cyan-50 border border-cyan-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyan-700 font-semibold">
                      Saldo Setelah Disetujui
                    </span>
                    <span className="font-heading font-bold text-sm text-cyan-700">
                      {formatRupiah(log.newBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectClick(log)}
                  disabled={processingId === log.id}
                  className="flex-1 rounded-xl h-9 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Tolak
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={processingId === log.id}
                  onClick={() => handleApprove(log.id)}
                  className="flex-1 rounded-xl h-9 text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Setujui
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && rejectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-rose-100">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-heading font-bold text-slate-900">
              Tolak Permintaan Top-Up
            </h3>

            {/* Description */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">
                <strong>Ketua Kelas:</strong> {rejectingLog.classLeaderName}
              </p>
              <p className="text-xs text-slate-600 mb-1">
                <strong>Siswa Target:</strong> {rejectingLog.targetStudentName}
              </p>
              <p className="text-xs text-slate-600">
                <strong>Nominal:</strong> {formatRupiah(rejectingLog.amount)}
              </p>
            </div>

            {/* Reason Input */}
            <div>
              <Input
                label="Alasan Penolakan (Opsional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Nominal tidak sesuai dengan setoran"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingLog(null);
                  setRejectReason("");
                }}
                disabled={processingId === rejectingLog.id}
                className="flex-1 rounded-xl"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={processingId === rejectingLog.id}
                onClick={handleRejectConfirm}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700"
              >
                Ya, Tolak
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
