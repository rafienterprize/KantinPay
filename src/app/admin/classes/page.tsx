"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Users, TrendingUp, GraduationCap } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

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
    >
      <div className="space-y-5">
        {/* Header Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
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
                      Lihat Detail Siswa →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
