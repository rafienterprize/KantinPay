"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Users, TrendingUp, GraduationCap, Plus, Filter, MessageCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

interface ClassSummary {
  className: string;
  totalStudents: number;
  totalBalance: number;
  classLeader?: {
    id: string;
    name: string;
    whatsapp?: string;
  };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
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
  const [sortBy, setSortBy] = useState("saldo-tertinggi");

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
                <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((classData) => (
              <div
                key={classData.className}
                className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] hover:shadow-md transition-all"
              >
                {/* Header with Class Name and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        {classData.className}
                      </h3>
                      {classData.classLeader && (
                        <p className="text-xs text-slate-500">
                          Ketua: {classData.classLeader.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Online Status Badge */}
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-heading font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Aktif
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Kelas {classData.className} — Total {classData.totalStudents} siswa terdaftar
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 mb-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Total Saldo Kelas</span>
                    <span className="font-heading font-bold text-base text-slate-900">
                      {formatRupiah(classData.totalBalance)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block mb-1">Jumlah Siswa</span>
                    <span className="font-heading font-bold text-base text-slate-900">
                      {classData.totalStudents} Siswa
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  {classData.classLeader && (
                    <a
                      href={`https://wa.me/${classData.classLeader.whatsapp?.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-cyan-600 transition flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Hubungi Ketua Kelas
                    </a>
                  )}
                  
                  <Link
                    href={`/admin/classes/${encodeURIComponent(classData.className)}`}
                    className="ml-auto px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-heading font-semibold transition flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Lihat Detail Siswa
                  </Link>
                </div>
              </div>
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
            
            <div className="space-y-4">
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
                label="Urutkan Berdasarkan"
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "saldo-tertinggi", label: "Total Saldo (Tertinggi)" },
                  { value: "saldo-terendah", label: "Total Saldo (Terendah)" },
                  { value: "siswa-terbanyak", label: "Jumlah Siswa (Terbanyak)" },
                  { value: "siswa-tersedikit", label: "Jumlah Siswa (Tersedikit)" },
                  { value: "nama-az", label: "Nama Kelas (A-Z)" },
                ]}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 rounded-xl"
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  // Apply filter logic here
                  console.log("Filter:", { filterTingkat, filterJurusan, sortBy });
                  setShowFilterModal(false);
                }}
                className="flex-1 rounded-xl"
              >
                Terapkan Filter
              </Button>
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
            
            <div className="space-y-4">
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
                label="Nomor Rombel"
                type="number"
                value={newClassRombel}
                onChange={(e) => setNewClassRombel(e.target.value)}
                placeholder="Contoh: 1, 2, 3"
                min="1"
              />

              {newClassTingkat && newClassJurusan && newClassRombel && (
                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                  <p className="text-xs text-cyan-700">
                    <strong>Nama Kelas:</strong> {newClassTingkat} {newClassJurusan} {newClassRombel}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setShowAddClassModal(false);
                  setNewClassTingkat("");
                  setNewClassJurusan("");
                  setNewClassRombel("");
                }}
                className="flex-1 rounded-xl"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!newClassTingkat || !newClassJurusan || !newClassRombel}
                onClick={() => {
                  // Add class logic here
                  alert(`Kelas ${newClassTingkat} ${newClassJurusan} ${newClassRombel} berhasil dibuat!`);
                  setShowAddClassModal(false);
                  setNewClassTingkat("");
                  setNewClassJurusan("");
                  setNewClassRombel("");
                }}
                className="flex-1 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" />
                Buat Kelas
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
