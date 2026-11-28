"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users,
  Search,
  SlidersHorizontal,
  Plus,
  Wallet,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { formatRupiah } from "@/lib/utils";
import { User } from "@/types";
import { StudentDetailModal } from "@/components/admin/StudentDetailModal";

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  // Pagination state matching wireframe footer
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);

  // Top Up Modal state
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpMessage, setTopUpMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add Student Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    studentId: "",
    email: "",
    whatsappNumber: "",
    className: "XII SIJA 1",
    initialBalance: 0,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<User | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (classFilter !== "all") params.set("class", classFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();

      let list: User[] = data.students || [];

      // Balance filter on client
      if (balanceFilter === "low") {
        list = list.filter((s) => s.balance < 50000);
      } else if (balanceFilter === "high") {
        list = list.filter((s) => s.balance >= 100000);
      }

      setStudents(list);
      setTotalStudents(data.pagination?.total || list.length);
    } catch {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, classFilter, statusFilter, balanceFilter, page, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenTopUp = (student: User) => {
    setSelectedStudent(student);
    setTopUpAmount(50000);
    setTopUpMessage(null);
    setTopUpModalOpen(true);
  };

  const handleExecuteTopUp = async () => {
    if (!selectedStudent) return;
    setTopUpLoading(true);
    setTopUpMessage(null);

    try {
      const res = await fetch("/api/admin/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          amount: topUpAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTopUpMessage({ type: "error", text: data.error || "Gagal memproses top up" });
        setTopUpLoading(false);
        return;
      }

      setTopUpMessage({
        type: "success",
        text: `Top up ${formatRupiah(topUpAmount)} untuk ${selectedStudent.fullName} berhasil!`,
      });

      // Refresh student list
      fetchStudents();

      setTimeout(() => {
        setTopUpModalOpen(false);
      }, 1200);
    } catch {
      setTopUpMessage({ type: "error", text: "Terjadi gangguan jaringan saat top up." });
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Gagal menambahkan siswa.");
        setAddLoading(false);
        return;
      }

      setAddModalOpen(false);
      setNewStudent({
        fullName: "",
        studentId: "",
        email: "",
        whatsappNumber: "",
        className: "XII SIJA 1",
        initialBalance: 0,
      });
      fetchStudents();
    } catch {
      setAddError("Terjadi gangguan jaringan.");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <AdminLayout
      pageTitle="Data Siswa"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setClassFilter((prev) => (prev === "all" ? "XII" : "all"))}
      actionButton={{
        label: "Add Student",
        onClick: () => setAddModalOpen(true),
      }}
    >
      <div className="space-y-5">
        {/* Top Header Card matching wireframe: Data Siswa (left) & Status Koneksi (right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                Manajemen Pengguna
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mt-0.5">
              Data Siswa
            </h1>
            <p className="text-xs text-slate-500">
              Kelola saldo digital, top-up tunai koperasi, dan identitas siswa sekolah.
            </p>
          </div>

          {/* Status Koneksi box on the right */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-heading self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-semibold">Status Koneksi:</span>
            <span className="text-emerald-700 font-bold">Terhubung Realtime</span>
          </div>
        </div>

        {/* Three Filter Controls matching wireframe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filter 1: Kelas */}
          <Select
            value={classFilter}
            onChange={(value) => setClassFilter(value)}
            options={[
              { value: "all", label: "Semua Kelas" },
              { value: "XII", label: "Kelas XII" },
              { value: "XI", label: "Kelas XI" },
              { value: "X", label: "Kelas X" },
            ]}
            placeholder="Filter Kelas"
            className="w-full"
          />

          {/* Filter 2: Status */}
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: "all", label: "Semua Status" },
              { value: "active", label: "Aktif" },
              { value: "inactive", label: "Nonaktif" },
            ]}
            placeholder="Filter Status"
            className="w-full"
          />

          {/* Filter 3: Rentang Saldo */}
          <Select
            value={balanceFilter}
            onChange={(value) => setBalanceFilter(value)}
            options={[
              { value: "all", label: "Semua Saldo" },
              { value: "low", label: "< Rp 50.000" },
              { value: "high", label: "≥ Rp 100.000" },
            ]}
            placeholder="Filter Saldo"
            className="w-full"
          />
        </div>

        {/* Student Data Table matching wireframe (10 rows, table header, data siswa row, Sisa Saldo, Top Up) */}
        <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
          {/* Table Header matching wireframe */}
          <div className="bg-[#D6EFFF]/40 border-b border-slate-200/80 px-6 py-3.5 grid grid-cols-12 text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
            <div className="col-span-6 sm:col-span-6">data siswa row (Identitas & Kelas)</div>
            <div className="col-span-3 sm:col-span-3 text-right sm:text-left">Sisa Saldo</div>
            <div className="col-span-3 sm:col-span-3 text-right">Top Up</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="p-6">
              <SkeletonTable rows={10} />
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-heading">
              Tidak ada data siswa yang cocok dengan filter atau pencarian.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setDetailStudent(student);
                    setDetailModalOpen(true);
                  }}
                  className="px-6 py-3.5 grid grid-cols-12 items-center hover:bg-slate-50/80 transition duration-150 cursor-pointer"
                >
                  {/* Student Info */}
                  <div className="col-span-6 sm:col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#D6EFFF] text-[#0284c7] font-heading font-bold text-xs flex items-center justify-center shrink-0">
                      {student.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                          {student.fullName}
                        </h4>
                        <span className="text-[10px] font-heading px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {student.className || "XII SIJA"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        NIS: {student.studentId || "-"} • WA: {student.whatsappNumber}
                      </p>
                    </div>
                  </div>

                  {/* Sisa Saldo */}
                  <div className="col-span-3 sm:col-span-3 text-right sm:text-left">
                    <span className="font-heading font-bold text-sm text-slate-900 block">
                      {formatRupiah(student.balance)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Aktif di Kantin
                    </span>
                  </div>

                  {/* Top Up Action Button */}
                  <div className="col-span-3 sm:col-span-3 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTopUp(student);
                      }}
                      className="rounded-2xl px-3.5 py-1.5 h-8 text-xs font-heading shadow-2xs"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Top Up</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table Footer / Pagination matching wireframe */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-heading">
            {/* Left: row per page count */}
            <div className="text-slate-500">
              <span>row per page count: </span>
              <span className="font-bold text-slate-800">10 baris</span>
            </div>

            {/* Right: table count & table nav buttons */}
            <div className="flex items-center gap-4">
              <span className="text-slate-500">
                table count:{" "}
                <strong className="text-slate-800">
                  {students.length} dari {totalStudents} Siswa
                </strong>
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5 rounded-xl border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-2 font-bold text-slate-700">Hal {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={students.length < limit}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-2.5 rounded-xl border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP UP MODAL */}
      <Modal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title="Top Up Saldo Siswa"
        description="Terima setoran tunai siswa di loket koperasi sekolah"
      >
        {selectedStudent && (
          <div className="space-y-4 py-1">
            {/* Student Card Summary */}
            <div className="p-4 rounded-2xl bg-[#D6EFFF] border border-[#5CC0F7]/40 flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  {selectedStudent.fullName}
                </h4>
                <p className="text-xs text-slate-500">
                  NIS: {selectedStudent.studentId} • Kelas: {selectedStudent.className}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Saldo Sekarang</span>
                <span className="font-heading font-bold text-slate-900 text-base">
                  {formatRupiah(selectedStudent.balance)}
                </span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Pilih Nominal Cepat
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10000, 20000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-xs font-heading font-bold border transition cursor-pointer ${
                      topUpAmount === amt
                        ? "bg-[#5CC0F7] text-white border-[#5CC0F7] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {formatRupiah(amt).replace(",00", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <Input
              label="Nominal Top Up (Rp)"
              type="number"
              min="1000"
              step="1000"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
              placeholder="50000"
              icon={<Wallet className="w-4 h-4" />}
            />

            {/* Summary preview */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center font-heading">
              <span className="text-slate-500">Total Saldo Setelah Top Up:</span>
              <span className="font-bold text-emerald-600 text-sm">
                {formatRupiah(selectedStudent.balance + (topUpAmount || 0))}
              </span>
            </div>

            {/* Feedback message */}
            {topUpMessage && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  topUpMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {topUpMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{topUpMessage.text}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTopUpModalOpen(false)}
                className="rounded-2xl"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={topUpLoading}
                onClick={handleExecuteTopUp}
                className="rounded-2xl px-6"
              >
                Konfirmasi & Tambah Saldo
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD STUDENT MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Data Siswa Baru"
        description="Daftarkan akun siswa baru ke dalam ekosistem KantinPay"
      >
        <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 py-1">
          {addError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap Siswa"
            required
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
            placeholder="Ahmad Fauzi"
            icon={<GraduationCap className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nomor Induk Siswa (NIS)"
              required
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
              placeholder="20241011"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Kelas
              </label>
              <Select
                value={newStudent.className}
                onChange={(value) => setNewStudent({ ...newStudent, className: value })}
                options={[
                  { value: "X RPL 1", label: "X RPL 1" },
                  { value: "X TKJ 1", label: "X TKJ 1" },
                  { value: "XI RPL 1", label: "XI RPL 1" },
                  { value: "XI SIJA 1", label: "XI SIJA 1" },
                  { value: "XII SIJA 1", label: "XII SIJA 1" },
                  { value: "XII SIJA 2", label: "XII SIJA 2" },
                ]}
                icon={<GraduationCap className="w-4 h-4" />}
              />
            </div>
          </div>

          <Input
            label="Email Siswa"
            type="email"
            required
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            placeholder="fauzi@kantinpay.sch.id"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Nomor WhatsApp (Untuk Bot)"
            required
            value={newStudent.whatsappNumber}
            onChange={(e) => setNewStudent({ ...newStudent, whatsappNumber: e.target.value })}
            placeholder="082199887711"
            icon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Saldo Awal Setoran (Opsional)"
            type="number"
            min="0"
            step="1000"
            value={newStudent.initialBalance}
            onChange={(e) => setNewStudent({ ...newStudent, initialBalance: Number(e.target.value) })}
            placeholder="0"
            icon={<Wallet className="w-4 h-4" />}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
              className="rounded-2xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={addLoading}
              className="rounded-2xl px-6"
            >
              Simpan Data Siswa
            </Button>
          </div>
        </form>
      </Modal>

      {/* STUDENT DETAIL MODAL */}
      <StudentDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        student={detailStudent}
      />
    </AdminLayout>
  );
}
