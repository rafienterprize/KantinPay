"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users,
  Wallet,
  GraduationCap,
  Receipt,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ClassBilling } from "@/types";

interface ClassSummary {
  className: string;
  totalStudents: number;
  totalBalance: number;
  classLeader?: {
    id: string;
    name: string;
    whatsapp?: string;
  };
  billing?: ClassBilling;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [billingSummary, setBillingSummary] = useState({
    unpaidClassesCount: 0,
    totalUnpaidAmount: 0,
    frozenClassesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // Add Class Form State
  const [newClassTingkat, setNewClassTingkat] = useState("");
  const [newClassJurusan, setNewClassJurusan] = useState("");
  const [newClassRombel, setNewClassRombel] = useState("");

  // Filter State
  const [filterTingkat, setFilterTingkat] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [sortBy, setSortBy] = useState("tagihan-tertinggi");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/classes");
      const data = await res.json();
      setClasses(data.classes || []);
      if (data.summary) {
        setBillingSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = [...classes]
    .filter((c) => {
      const matchesSearch =
        c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.classLeader?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTingkat = !filterTingkat || c.className.startsWith(`${filterTingkat} `);
      const matchesJurusan =
        !filterJurusan || c.className.toUpperCase().includes(filterJurusan.toUpperCase());
      const remaining = c.billing?.remainingAmount || 0;
      const matchesBilling =
        !filterBilling ||
        (filterBilling === "unpaid" && remaining > 0) ||
        (filterBilling === "paid" && remaining === 0) ||
        (filterBilling === "frozen" && Boolean(c.billing?.isFrozen));
      return matchesSearch && matchesTingkat && matchesJurusan && matchesBilling;
    })
    .sort((a, b) => {
      if (sortBy === "saldo-tertinggi") return b.totalBalance - a.totalBalance;
      if (sortBy === "saldo-terendah") return a.totalBalance - b.totalBalance;
      if (sortBy === "siswa-terbanyak") return b.totalStudents - a.totalStudents;
      if (sortBy === "nama-az") return a.className.localeCompare(b.className);
      // Default: unpaid billing first, then alphabetically
      const remDiff = (b.billing?.remainingAmount || 0) - (a.billing?.remainingAmount || 0);
      return remDiff !== 0 ? remDiff : a.className.localeCompare(b.className);
    });

  const totalAllStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
  const totalAllBalance = classes.reduce((sum, c) => sum + c.totalBalance, 0);

  return (
    <AdminLayout
      pageTitle="Data Per Kelas"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setShowFilterModal(true)}
      actionButton={{
        label: "Tambah Kelas",
        onClick: () => setShowAddClassModal(true),
      }}
    >
      <div className="space-y-6">
        {/* 1. Header Card (Identical to Admin Dashboard) */}
        <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7]" />
                <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                  Manajemen Per Kelas
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                Data Siswa Berdasarkan Kelas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pantau total saldo per kelas, status tagihan top-up ketua kelas, dan daftar siswa tiap rombel.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {billingSummary.unpaidClassesCount > 0 ? (
                <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {billingSummary.unpaidClassesCount} Kelas Belum Bayar
                </span>
              ) : (
                <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Semua Kelas Lunas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. 4 KPI Summary Cards (Matching Admin Dashboard) */}
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
              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Total Rombel Kelas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900">
                  {classes.length} Kelas
                </h3>
                <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                  100% Terdaftar Aktif
                </p>
              </div>

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
                  {totalAllStudents} Siswa
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  Tersebar di {classes.length} Kelas
                </p>
              </div>

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
                  {formatRupiah(totalAllBalance)}
                </h3>
                <p className="text-[11px] text-slate-500 font-heading mt-1">
                  Tersimpan di Kas Koperasi
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-medium text-slate-500">
                    Tagihan Belum Dibayar
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      billingSummary.frozenClassesCount > 0
                        ? "bg-rose-100 text-rose-600"
                        : billingSummary.unpaidClassesCount > 0
                        ? "bg-amber-100 text-amber-600"
                        : "bg-[#D6EFFF] text-[#0284c7]"
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <h3
                  className={`text-2xl font-heading font-bold ${
                    billingSummary.frozenClassesCount > 0
                      ? "text-rose-600"
                      : billingSummary.unpaidClassesCount > 0
                      ? "text-amber-700"
                      : "text-slate-900"
                  }`}
                >
                  {formatRupiah(billingSummary.totalUnpaidAmount)}
                </h3>
                <p
                  className={`text-[11px] font-heading font-semibold mt-1 ${
                    billingSummary.unpaidClassesCount > 0
                      ? "text-amber-700"
                      : "text-emerald-600"
                  }`}
                >
                  {billingSummary.unpaidClassesCount > 0
                    ? `${billingSummary.unpaidClassesCount} Kelas Menunggu Setoran`
                    : "Semua Tagihan Lunas"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* 3. Classes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 p-12 text-center text-slate-400 text-sm">
            Tidak ada data kelas yang sesuai filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((classData) => {
              const unpaid = classData.billing?.remainingAmount || 0;
              const frozen = Boolean(classData.billing?.isFrozen);

              return (
                <div
                  key={classData.className}
                  className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition-all flex flex-col justify-between"
                >
                  {/* Card Top */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading font-bold text-base text-slate-900 truncate">
                            {classData.className}
                          </h3>
                          <p className="text-xs text-slate-500 truncate">
                            {classData.classLeader
                              ? `Ketua: ${classData.classLeader.name}`
                              : `${classData.totalStudents} Siswa Terdaftar`}
                          </p>
                        </div>
                      </div>

                      {/* Status Pill */}
                      {frozen ? (
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-heading font-semibold flex items-center gap-1.5 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          Dibekukan
                        </span>
                      ) : unpaid > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-heading font-semibold flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3 h-3" />
                          Belum Bayar
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-heading font-semibold flex items-center gap-1.5 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Lunas &amp; Aktif
                        </span>
                      )}
                    </div>

                    {/* Stats Box */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          Total Saldo
                        </span>
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {formatRupiah(classData.totalBalance)}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          Siswa
                        </span>
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {classData.totalStudents} Siswa
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          Tagihan
                        </span>
                        <span
                          className={`font-heading font-bold text-sm ${
                            frozen
                              ? "text-rose-600"
                              : unpaid > 0
                              ? "text-amber-700"
                              : "text-slate-900"
                          }`}
                        >
                          {formatRupiah(unpaid)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
                    {classData.classLeader ? (
                      <a
                        href={`https://wa.me/${classData.classLeader.whatsapp?.replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-[#0284c7] font-heading font-medium transition flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Hubungi Ketua Kelas
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Belum ada ketua kelas</span>
                    )}

                    <Link
                      href={`/admin/classes/${encodeURIComponent(classData.className)}`}
                      className="px-4 py-2 rounded-2xl bg-[#5CC0F7] hover:bg-[#48b1eb] text-white text-xs font-heading font-semibold transition shadow-2xs"
                    >
                      Lihat Detail Siswa
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Modal (Full-viewport blur via Modal component) */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Data Per Kelas"
        description="Saring daftar kelas berdasarkan tingkat, jurusan, dan status tagihan"
      >
        <div className="space-y-4 py-2">
          <Select
            label="Tingkat Kelas"
            value={filterTingkat}
            onChange={setFilterTingkat}
            options={[
              { value: "", label: "Semua Tingkat" },
              { value: "X", label: "Kelas X" },
              { value: "XI", label: "Kelas XI" },
              { value: "XII", label: "Kelas XII" },
            ]}
            placeholder="Pilih Tingkat"
          />

          <Select
            label="Jurusan"
            value={filterJurusan}
            onChange={setFilterJurusan}
            options={[
              { value: "", label: "Semua Jurusan" },
              { value: "RPL", label: "RPL" },
              { value: "TKJ", label: "TKJ" },
              { value: "SIJA", label: "SIJA" },
              { value: "DKV", label: "DKV" },
              { value: "MM", label: "MM" },
              { value: "TJKT", label: "TJKT" },
            ]}
            placeholder="Pilih Jurusan"
          />

          <Select
            label="Status Tagihan Koperasi"
            value={filterBilling}
            onChange={setFilterBilling}
            options={[
              { value: "", label: "Semua Status" },
              { value: "unpaid", label: "Belum Dibayar" },
              { value: "frozen", label: "Dibekukan (Lewat 24 Jam)" },
              { value: "paid", label: "Lunas" },
            ]}
          />

          <Select
            label="Urutkan Berdasarkan"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "tagihan-tertinggi", label: "Tagihan Tertinggi" },
              { value: "saldo-tertinggi", label: "Total Saldo (Tertinggi)" },
              { value: "saldo-terendah", label: "Total Saldo (Terendah)" },
              { value: "siswa-terbanyak", label: "Jumlah Siswa (Terbanyak)" },
              { value: "nama-az", label: "Nama Kelas (A-Z)" },
            ]}
          />

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterTingkat("");
                setFilterJurusan("");
                setFilterBilling("");
                setSortBy("tagihan-tertinggi");
              }}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Reset Filter
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFilterModal(false)}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Class Modal */}
      <Modal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        title="Tambah Kelas Baru"
        description="Buat kelas baru untuk mengelompokkan siswa"
      >
        <div className="space-y-4 py-2">
          <Select
            label="Tingkat Kelas"
            value={newClassTingkat}
            onChange={setNewClassTingkat}
            options={[
              { value: "X", label: "Kelas X" },
              { value: "XI", label: "Kelas XI" },
              { value: "XII", label: "Kelas XII" },
            ]}
            placeholder="Pilih Tingkat"
          />

          <Select
            label="Jurusan"
            value={newClassJurusan}
            onChange={setNewClassJurusan}
            options={[
              { value: "RPL", label: "Rekayasa Perangkat Lunak (RPL)" },
              { value: "TKJ", label: "Teknik Komputer Jaringan (TKJ)" },
              { value: "SIJA", label: "Sistem Informasi Jaringan & Aplikasi (SIJA)" },
              { value: "DKV", label: "Desain Komunikasi Visual (DKV)" },
              { value: "MM", label: "Multimedia (MM)" },
              { value: "TJKT", label: "Teknik Jaringan Komputer & Telekomunikasi (TJKT)" },
            ]}
            placeholder="Pilih Jurusan"
          />

          <Input
            label="Nomor Index"
            type="number"
            value={newClassRombel}
            onChange={(e) => setNewClassRombel(e.target.value)}
            placeholder="Contoh: 1, 2, 3"
          />

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddClassModal(false)}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (newClassTingkat && newClassJurusan && newClassRombel) {
                  const className = `${newClassTingkat} ${newClassJurusan} ${newClassRombel}`;
                  if (!classes.some((c) => c.className === className)) {
                    setClasses((prev) => [
                      ...prev,
                      {
                        className,
                        totalStudents: 0,
                        totalBalance: 0,
                        billing: {
                          className,
                          totalBilled: 0,
                          paidAmount: 0,
                          remainingAmount: 0,
                          dueAt: null,
                          isFrozen: false,
                          updatedAt: new Date().toISOString(),
                        },
                      },
                    ]);
                  }
                  setNewClassTingkat("");
                  setNewClassJurusan("");
                  setNewClassRombel("");
                  setShowAddClassModal(false);
                }
              }}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Simpan Kelas
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
