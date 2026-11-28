"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Crown,
  Users,
  Wallet,
  Receipt,
  User as UserIcon,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MinusCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { formatRupiah } from "@/lib/utils";
import { User, ClassBilling, ClassLeaderTopUpLog } from "@/types";
import { StudentDetailModal } from "@/components/admin/StudentDetailModal";
import { ClassLeaderTopUpModal } from "@/components/admin/ClassLeaderTopUpModal";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ className: string }>;
}) {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<User | null>(null);

  // Top-Up Modal (Class Leader)
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpTargetStudent, setTopUpTargetStudent] = useState<User | null>(null);

  // Class Billing State
  const [billing, setBilling] = useState<ClassBilling | null>(null);
  const [topUpLogs, setTopUpLogs] = useState<ClassLeaderTopUpLog[]>([]);
  const [payLoading, setPayLoading] = useState(false);
  const [billingFeedback, setBillingFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [partialModalOpen, setPartialModalOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");

  useEffect(() => {
    const initClass = async () => {
      const resolvedParams = await params;
      const decoded = decodeURIComponent(resolvedParams.className);
      setClassName(decoded);
      fetchStudents(decoded);
      fetchCurrentUser();
    };
    initClass();
  }, [params]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchStudents = async (cls: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/classes/${encodeURIComponent(cls)}`);
      const data = await res.json();

      const sorted = (data.students || []).sort((a: User, b: User) => {
        if (a.isClassLeader && !b.isClassLeader) return -1;
        if (!a.isClassLeader && b.isClassLeader) return 1;
        return a.fullName.localeCompare(b.fullName);
      });

      setStudents(sorted);
      setBilling(data.billing || null);
      setTopUpLogs(data.topUpLogs || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBilling = async (mode: "full" | "partial") => {
    setPayLoading(true);
    setBillingFeedback(null);
    try {
      const res = await fetch(
        `/api/admin/classes/${encodeURIComponent(className)}/pay-billing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            amount: mode === "partial" ? Number(partialAmount) : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setBillingFeedback({
          type: "error",
          text: data.error || "Gagal memproses pembayaran.",
        });
        setPayLoading(false);
        return;
      }
      setBilling(data.billing);
      setBillingFeedback({ type: "success", text: data.message });
      setPartialModalOpen(false);
      setPartialAmount("");
      fetchStudents(className);
    } catch {
      setBillingFeedback({ type: "error", text: "Terjadi gangguan jaringan." });
    } finally {
      setPayLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentId && s.studentId.includes(searchTerm))
  );

  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const classLeader = students.find((s) => s.isClassLeader) || null;
  const unpaidAmount = billing?.remainingAmount || 0;
  const isFrozen = Boolean(billing?.isFrozen);

  return (
    <>
      <AdminLayout
        pageTitle={`Kelas ${className}`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="space-y-6">
          {/* 1. Header Card (Identical to Admin Dashboard & Data Siswa) */}
          <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7]" />
                  <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                    Detail Data Per Kelas
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                  Kelas {className}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Kelola saldo siswa, status tagihan top-up ketua kelas, dan log transaksi kelas {className}.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {isFrozen ? (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Saldo Dibekukan
                  </span>
                ) : unpaidAmount > 0 ? (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Tagihan Aktif
                  </span>
                ) : (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Lunas &amp; Aktif
                  </span>
                )}

                <Link
                  href="/admin/classes"
                  className="px-4 py-1.5 rounded-2xl border border-[#D1D1D1] bg-white hover:bg-slate-50 text-xs font-heading font-semibold text-slate-700 transition"
                >
                  Kembali ke Daftar Kelas
                </Link>
              </div>
            </div>
          </div>

          {/* 2. 4 KPI Cards Row (Matching Admin Dashboard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {/* KPI 1: Total Siswa */}
                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Total Siswa
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900">
                    {students.length} Siswa
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                    100% Akun Aktif
                  </p>
                </div>

                {/* KPI 2: Total Saldo Kelas */}
                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Total Saldo Kelas
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900">
                    {formatRupiah(totalBalance)}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-heading mt-1">
                    Tersimpan di Kas Koperasi
                  </p>
                </div>

                {/* KPI 3: Tagihan ke Koperasi */}
                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Tagihan ke Koperasi
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isFrozen
                          ? "bg-rose-100 text-rose-600"
                          : unpaidAmount > 0
                          ? "bg-amber-100 text-amber-600"
                          : "bg-[#D6EFFF] text-[#0284c7]"
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <h3
                    className={`text-2xl font-heading font-bold ${
                      isFrozen
                        ? "text-rose-600"
                        : unpaidAmount > 0
                        ? "text-amber-700"
                        : "text-slate-900"
                    }`}
                  >
                    {formatRupiah(unpaidAmount)}
                  </h3>
                  <p
                    className={`text-[11px] font-heading font-semibold mt-1 ${
                      isFrozen
                        ? "text-rose-600"
                        : unpaidAmount > 0
                        ? "text-amber-700"
                        : "text-emerald-600"
                    }`}
                  >
                    {isFrozen
                      ? "Lewat Tenggat 1x24 Jam"
                      : unpaidAmount > 0
                      ? "Menunggu Setoran 1x24 Jam"
                      : "Semua Tagihan Lunas"}
                  </p>
                </div>

                {/* KPI 4: Ketua Kelas */}
                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Ketua Kelas
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Crown className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-slate-900 truncate">
                    {classLeader ? classLeader.fullName : "Belum Ditentukan"}
                  </h3>
                  {classLeader ? (
                    <a
                      href={`https://wa.me/${classLeader.whatsappNumber.replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#0284c7] hover:underline font-heading font-semibold mt-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Hubungi via WhatsApp
                    </a>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-heading mt-1">
                      Hubungi Admin Koperasi
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 3. Billing Strip / Action Panel (Clean pastel strip when Lunas, action card when Unpaid) */}
          {!loading && billing && (
            unpaidAmount > 0 ? (
              <div
                className={`rounded-3xl p-6 border shadow-xs space-y-4 ${
                  isFrozen
                    ? "bg-rose-50/70 border-rose-200"
                    : "bg-amber-50/70 border-amber-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Tagihan Top-Up Ketua Kelas ({className})
                      </h3>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-heading font-bold ${
                          isFrozen
                            ? "bg-rose-600 text-white"
                            : "bg-amber-200 text-amber-900"
                        }`}
                      >
                        {isFrozen ? "DIBEKUKAN (LEWAT 1x24 JAM)" : "BELUM DIBAYAR"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {isFrozen
                        ? "Batas setor 1x24 jam telah lewat. Saldo kelas dibekukan sampai tagihan dilunasi ke Koperasi."
                        : billing.dueAt
                        ? `Batas setor 1x24 jam: ${new Date(billing.dueAt).toLocaleString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )} WIB`
                        : "Tenggat setor maksimal 1x24 jam sejak top-up ketua kelas."}
                      {billing.paidAmount > 0 &&
                        ` • Sudah disetor ${formatRupiah(billing.paidAmount)} dari ${formatRupiah(
                          billing.totalBilled
                        )}`}
                    </p>
                  </div>

                  {currentUser?.role === "admin" && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={payLoading}
                        onClick={() => {
                          setPartialAmount("");
                          setPartialModalOpen(true);
                        }}
                        className="rounded-2xl text-xs h-9 px-4 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                      >
                        <MinusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Kurangi Nominal
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={payLoading}
                        onClick={() => handlePayBilling("full")}
                        className="rounded-2xl text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Sudah Dibayar (Lunas)
                      </Button>
                    </div>
                  )}
                </div>

                {topUpLogs.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/70 space-y-2">
                    <p className="text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider">
                      Log Top-Up Ketua Kelas ({topUpLogs.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {topUpLogs.slice(0, 6).map((log) => (
                        <div
                          key={log.id}
                          className="px-3.5 py-2.5 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-slate-800 truncate">
                              {log.targetStudentName}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Oleh {log.classLeaderName} •{" "}
                              {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              WIB
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-heading font-bold text-slate-900 block">
                              +{formatRupiah(log.amount)}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                log.status === "approved"
                                  ? "text-emerald-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {log.status === "approved" ? "Lunas" : "Tagihan Aktif"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#D6EFFF]/60 p-4 border border-[#5CC0F7]/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-800">
                  <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span className="font-heading font-medium">
                    Status Tagihan Kelas {className}: Tidak ada tagihan top-up ketua kelas yang tertunggak. Saldo seluruh siswa aktif normal.
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] text-emerald-700 font-heading font-bold shrink-0">
                  Lunas
                </span>
              </div>
            )
          )}

          {billingFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-heading font-medium ${
                billingFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {billingFeedback.text}
            </div>
          )}

          {/* 4. Students Table (Identical styling to Admin Students & Student Classmates) */}
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#D6EFFF] border-b border-[#5CC0F7]/30 px-6 py-3.5 grid grid-cols-12 text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
              <div className="col-span-6">Nama Siswa</div>
              <div className="col-span-3">Saldo</div>
              <div className="col-span-3 text-right">Aksi</div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-6">
                <SkeletonTable rows={5} />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada siswa di kelas ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/70 transition"
                  >
                    {/* Student Info */}
                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          student.isClassLeader
                            ? "bg-amber-100 text-amber-600"
                            : "bg-[#D6EFFF] text-[#0284c7]"
                        }`}
                      >
                        {student.isClassLeader ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                            {student.fullName}
                          </h4>
                          {student.isClassLeader && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                              KETUA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          NIS: {student.studentId || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="col-span-3">
                      <span className="font-heading font-bold text-sm text-slate-900 block">
                        {formatRupiah(student.balance)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Aktif
                      </span>
                    </div>

                    {/* Action Buttons (Consistent KantinPay Blue & Clean Outline) */}
                    <div className="col-span-3 flex justify-end gap-2">
                      {(currentUser?.role === "admin" ||
                        (classLeader && currentUser?.id === classLeader.id)) && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setTopUpTargetStudent(student);
                            setTopUpModalOpen(true);
                          }}
                          className="rounded-2xl px-3.5 py-1.5 h-8 text-xs"
                        >
                          Top Up
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDetailStudent(student);
                          setDetailModalOpen(true);
                        }}
                        className="rounded-2xl px-3.5 py-1.5 h-8 text-xs"
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        student={detailStudent}
      />

      {/* Class Leader Top-Up Modal */}
      <ClassLeaderTopUpModal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        targetStudent={topUpTargetStudent}
        classLeader={classLeader}
        onSuccess={() => {
          fetchStudents(className);
        }}
      />

      {/* Partial Billing Reduction Modal */}
      <Modal
        isOpen={partialModalOpen}
        onClose={() => setPartialModalOpen(false)}
        title={`Kurangi Tagihan Kelas ${className}`}
        description="Masukkan nominal setoran yang sudah diterima jika pembayaran dari ketua kelas masih kurang."
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
            <span className="font-heading font-semibold text-amber-800">
              Sisa Tagihan Saat Ini
            </span>
            <span className="font-heading font-bold text-base text-amber-900">
              {formatRupiah(billing?.remainingAmount || 0)}
            </span>
          </div>

          <Input
            label="Nominal Dibayar (Rp)"
            type="number"
            value={partialAmount}
            onChange={(e) => setPartialAmount(e.target.value)}
            placeholder="Contoh: 20000"
          />

          {partialAmount && Number(partialAmount) > 0 && billing && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Sisa Tagihan Setelah Dikurangi</span>
              <span className="font-heading font-bold text-slate-900">
                {formatRupiah(
                  Math.max(0, billing.remainingAmount - Number(partialAmount))
                )}
              </span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPartialModalOpen(false)}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={payLoading}
              disabled={!partialAmount || Number(partialAmount) <= 0}
              onClick={() => handlePayBilling("partial")}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Simpan Pengurangan
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
