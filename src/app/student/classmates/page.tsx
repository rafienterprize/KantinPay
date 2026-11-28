"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout, StudentLayoutUser } from "@/components/student/StudentLayout";
import {
  Users,
  Crown,
  User as UserIcon,
  Wallet,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { User } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { ClassLeaderTopUpModal } from "@/components/admin/ClassLeaderTopUpModal";

interface ClassmateRow extends User {
  totalSpent?: number;
}

export default function ClassmatesPage() {
  const [user, setUser] = useState<StudentLayoutUser | null>(null);
  const [classmates, setClassmates] = useState<ClassmateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "leader" | "member">("all");
  const [sortBy, setSortBy] = useState<"default" | "balance-desc" | "balance-asc" | "spent-desc">("default");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Top-Up Modal (Only available for Class Leader)
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpTargetStudent, setTopUpTargetStudent] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);

        if (userData.user?.role === "student") {
          const classmatesRes = await fetch("/api/student/classmates");
          if (classmatesRes.ok) {
            const classmatesData = await classmatesRes.json();
            setClassmates(classmatesData.students || []);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch classmates data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassmates = [...classmates]
    .filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.studentId && s.studentId.includes(searchTerm));
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "leader" && Boolean(s.isClassLeader)) ||
        (roleFilter === "member" && !s.isClassLeader);
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "balance-desc") return b.balance - a.balance;
      if (sortBy === "balance-asc") return a.balance - b.balance;
      if (sortBy === "spent-desc") return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (a.isClassLeader && !b.isClassLeader) return -1;
      if (!a.isClassLeader && b.isClassLeader) return 1;
      return a.fullName.localeCompare(b.fullName);
    });

  const totalBalance = classmates.reduce((sum, s) => sum + s.balance, 0);
  const totalClassSpent = classmates.reduce((sum, s) => sum + (s.totalSpent || 0), 0);
  const classLeader = classmates.find((s) => s.isClassLeader) || null;

  if (!loading && user && user.role !== "student") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 border border-[#D1D1D1]/60 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Sesi Aktif Bukan Akun Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Saat ini browser Anda sedang login sebagai{" "}
              <strong className="text-slate-900">{user.fullName}</strong> ({user.role}).
              Silakan login dengan akun Siswa untuk mengakses Data Siswa Kelas.
            </p>
          </div>
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
        pageTitle="Data Siswa Kelas"
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={() => setFilterModalOpen(true)}
      >
        <div className="space-y-6">
          {/* Header Card matching Admin style */}
          <div className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7]" />
                  <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                    Kategori Kelas • {user?.className || "..."}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                  Data Siswa Kelas {user?.className || ""}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {user?.isClassLeader
                    ? "Sebagai Ketua Kelas, Anda dapat mengajukan top-up saldo untuk teman sekelas. Notifikasi otomatis dikirim ke Admin Koperasi."
                    : "Daftar siswa, saldo aktif, dan total jajan di kelas Anda."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {user?.isClassLeader ? (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 font-medium">
                    <Crown className="w-3.5 h-3.5" />
                    Akses Top-Up Aktif
                  </span>
                ) : (
                  <span className="text-xs font-heading px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mode Lihat Saldo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Total Siswa Kelas
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900">
                    {classmates.length} Siswa
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-heading font-semibold mt-1">
                    Kelas {user?.className}
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs">
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
                    Akumulasi Saldo Aktif
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 border border-[#D1D1D1]/60 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-medium text-slate-500">
                      Total Jajan Kelas
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900">
                    {formatRupiah(totalClassSpent)}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-heading mt-1">
                    Total Transaksi di 8 Kantin
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Students Table (Matching Admin Table) */}
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#D6EFFF] border-b border-[#5CC0F7]/30 px-6 py-3.5 grid grid-cols-12 text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
              <div className="col-span-5">Nama Siswa</div>
              <div className="col-span-3">Saldo</div>
              <div className="col-span-2 hidden sm:block">Total Jajan</div>
              <div className="col-span-4 sm:col-span-2 text-right">
                {user?.isClassLeader ? "Aksi" : "Status"}
              </div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-6">
                <SkeletonTable rows={5} />
              </div>
            ) : filteredClassmates.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Tidak ada siswa ditemukan di kelas ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredClassmates.map((student) => (
                  <div
                    key={student.id}
                    className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/70 transition"
                  >
                    {/* Student Info */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
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
                          {user && student.id === user.id && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D6EFFF] text-[#0284c7] font-semibold">
                              ANDA
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

                    {/* Total Jajan */}
                    <div className="col-span-2 hidden sm:block">
                      <span className="font-heading font-semibold text-xs text-slate-700">
                        {formatRupiah(student.totalSpent || 0)}
                      </span>
                    </div>

                    {/* Action / Status */}
                    <div className="col-span-4 sm:col-span-2 flex justify-end">
                      {user?.isClassLeader ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setTopUpTargetStudent(student);
                            setTopUpModalOpen(true);
                          }}
                          className="rounded-2xl px-3.5 py-1.5 h-8 text-xs bg-[#5CC0F7] hover:bg-[#48b1eb]"
                        >
                          Top Up
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-heading font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </StudentLayout>

      {/* Class Leader Top-Up Modal (Sends notification to Admin Koperasi) */}
      <ClassLeaderTopUpModal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        targetStudent={topUpTargetStudent}
        classLeader={classLeader}
        onSuccess={() => {
          fetchData();
        }}
      />

      {/* Filter Menu Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Data Siswa Kelas"
        description={`Urutkan dan saring daftar siswa kelas ${user?.className || ""}`}
      >
        <div className="space-y-5 py-2">
          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Kategori Peran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "all" as const, label: "Semua Siswa" },
                { value: "leader" as const, label: "Ketua Kelas" },
                { value: "member" as const, label: "Siswa Biasa" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRoleFilter(opt.value)}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-heading font-semibold border transition cursor-pointer ${
                    roleFilter === opt.value
                      ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Urutkan Berdasarkan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "default" as const, label: "Default (A-Z)" },
                { value: "balance-desc" as const, label: "Saldo Tertinggi" },
                { value: "balance-asc" as const, label: "Saldo Terendah" },
                { value: "spent-desc" as const, label: "Jajan Terbanyak" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-heading font-semibold border transition cursor-pointer ${
                    sortBy === opt.value
                      ? "bg-[#D6EFFF] text-[#0284c7] border-[#5CC0F7]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoleFilter("all");
                setSortBy("default");
              }}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Reset Filter
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setFilterModalOpen(false)}
              className="flex-1 rounded-2xl h-10 text-xs"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
