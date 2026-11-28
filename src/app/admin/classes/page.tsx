"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Users, TrendingUp, GraduationCap, Plus, Filter } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ClassSummary {
  className: string;
  totalStudents: number;
  totalBalance: number;
  classLeader?: {
    id: string;
    name: string;
  };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/classes");
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="space-y-5">
        {/* Header Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-heading font-semibold text-cyan-600 uppercase tracking-wider">
                  Manajemen Per Kelas
                </span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-slate-900">
                Data Siswa Berdasarkan Kelas
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Lihat total saldo dan siswa per kelas. Klik untuk melihat detail siswa.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterModal(true)}
                className="rounded-2xl"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddClassModal(true)}
                className="rounded-2xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kelas
              </Button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <p className="text-sm text-slate-500 mt-3">Memuat data kelas...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Tidak ada data kelas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((classData) => (
              <Link
                key={classData.className}
                href={`/admin/classes/${encodeURIComponent(classData.className)}`}
                className="block"
              >
                <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer group">
                  {/* Class Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-cyan-600 transition">
                          {classData.className}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {classData.totalStudents} Siswa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Class Leader Badge */}
                  {classData.classLeader && (
                    <div className="mb-3 p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700">
                        <span className="font-semibold">Ketua Kelas:</span>{" "}
                        {classData.classLeader.name}
                      </p>
                    </div>
                  )}

                  {/* Total Balance */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-semibold">
                        Total Saldo Kelas
                      </span>
                    </div>
                    <span className="font-heading font-bold text-2xl text-emerald-700 block">
                      {formatRupiah(classData.totalBalance)}
                    </span>
                  </div>

                  {/* View Details Hint */}
                  <div className="mt-4 text-center">
                    <span className="text-xs text-cyan-600 font-semibold group-hover:underline">
                      Lihat Detail Siswa
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Filter Kelas
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Tingkat Kelas
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["X", "XI", "XII"].map((tingkat) => (
                    <button
                      key={tingkat}
                      className="px-4 py-2.5 rounded-xl text-sm font-heading font-semibold text-slate-700 bg-slate-100 hover:bg-cyan-100 hover:text-cyan-700 hover:border-cyan-300 border border-slate-200 transition"
                    >
                      Kelas {tingkat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Jurusan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["RPL", "TKJ", "SIJA", "DKV"].map((jurusan) => (
                    <button
                      key={jurusan}
                      className="px-4 py-2.5 rounded-xl text-sm font-heading font-semibold text-slate-700 bg-slate-100 hover:bg-cyan-100 hover:text-cyan-700 hover:border-cyan-300 border border-slate-200 transition"
                    >
                      {jurusan}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Urutkan Berdasarkan
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm font-heading bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Total Saldo (Tertinggi)</option>
                  <option>Total Saldo (Terendah)</option>
                  <option>Jumlah Siswa (Terbanyak)</option>
                  <option>Jumlah Siswa (Tersedikit)</option>
                  <option>Nama Kelas (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  // Apply filter logic here
                  setShowFilterModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-cyan-600 hover:bg-cyan-700 transition"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Tambah Kelas Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Buat kelas baru untuk mengelompokkan siswa
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Tingkat Kelas
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm font-heading bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Pilih Tingkat</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Jurusan
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm font-heading bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Pilih Jurusan</option>
                  <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="TKJ">Teknik Komputer Jaringan (TKJ)</option>
                  <option value="SIJA">Sistem Informasi Jaringan & Aplikasi (SIJA)</option>
                  <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                  <option value="MM">Multimedia (MM)</option>
                  <option value="TJKT">Teknik Jaringan Komputer & Telekomunikasi (TJKT)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Nomor Rombel
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Contoh: 1, 2, 3"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-heading bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                <p className="text-xs text-cyan-700">
                  <strong>Contoh format:</strong> X RPL 1, XI TKJ 2, XII SIJA 1
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddClassModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // Add class logic here
                  alert("Fitur tambah kelas akan segera tersedia!");
                  setShowAddClassModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-white bg-cyan-600 hover:bg-cyan-700 transition"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Buat Kelas
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
