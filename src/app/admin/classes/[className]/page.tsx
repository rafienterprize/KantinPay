"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Crown, 
  Users, 
  ArrowUpCircle,
  ChevronLeft,
  User as UserIcon,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { User } from "@/types";
import Link from "next/link";
import { StudentDetailModal } from "@/components/admin/StudentDetailModal";
import { ClassLeaderTopUpModal } from "@/components/admin/ClassLeaderTopUpModal";

export default function ClassDetailPage({ params }: { params: { className: string } }) {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState<User | null>(null);
  
  // Top-Up Modal (Class Leader)
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpTargetStudent, setTopUpTargetStudent] = useState<User | null>(null);

  useEffect(() => {
    const decoded = decodeURIComponent(params.className);
    setClassName(decoded);
    fetchStudents(decoded);
  }, [params.className]);

  const fetchStudents = async (cls: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/classes/${encodeURIComponent(cls)}`);
      const data = await res.json();
      
      // Sort: class leader first, then alphabetically
      const sorted = (data.students || []).sort((a: User, b: User) => {
        if (a.isClassLeader && !b.isClassLeader) return -1;
        if (!a.isClassLeader && b.isClassLeader) return 1;
        return a.fullName.localeCompare(b.fullName);
      });
      
      setStudents(sorted);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.includes(searchTerm))
  );

  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const classLeader = students.find((s) => s.isClassLeader);

  return (
    <>
      <AdminLayout
        pageTitle={`Kelas ${className}`}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="space-y-5">
          {/* Back Button + Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/classes">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </Button>
            </Link>
          </div>

          {/* Class Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">
                  Kelas {className}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  {students.length} Siswa Terdaftar
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-slate-500 block mb-1">Total Saldo Kelas</span>
                <span className="text-2xl font-heading font-bold text-emerald-600">
                  {formatRupiah(totalBalance)}
                </span>
              </div>
            </div>

            {/* Class Leader Info */}
            {classLeader && (
              <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-amber-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                        Ketua Kelas
                      </span>
                      <p className="font-heading font-bold text-slate-900">
                        {classLeader.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        NIS: {classLeader.studentId} • Saldo: {formatRupiah(classLeader.balance)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hubungi Button */}
                  <a
                    href={`https://wa.me/${classLeader.whatsappNumber.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-heading font-semibold transition flex items-center gap-2 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Students List */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="bg-cyan-50 border-b border-cyan-100 px-6 py-3.5 grid grid-cols-12 text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
              <div className="col-span-6">Nama Siswa</div>
              <div className="col-span-3 text-right sm:text-left">Saldo</div>
              <div className="col-span-3 text-right">Aksi</div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                <p className="text-sm text-slate-500 mt-3">Memuat data siswa...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                Tidak ada siswa di kelas ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => {
                      setDetailStudent(student);
                      setDetailModalOpen(true);
                    }}
                    className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50 transition cursor-pointer"
                  >
                    {/* Student Info */}
                    <div className="col-span-6 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        student.isClassLeader 
                          ? "bg-amber-100 text-amber-600" 
                          : "bg-cyan-100 text-cyan-600"
                      }`}>
                        {student.isClassLeader ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-900">
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
                    <div className="col-span-3 text-right sm:text-left">
                      <span className="font-heading font-bold text-sm text-slate-900 block">
                        {formatRupiah(student.balance)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Aktif
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-3 flex justify-end gap-2">
                      {/* Only show Top-Up button if viewing as class leader and target is not self */}
                      {classLeader && student.id !== classLeader.id && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopUpTargetStudent(student);
                            setTopUpModalOpen(true);
                          }}
                          className="rounded-2xl px-3 py-1.5 h-8 text-xs bg-amber-500 hover:bg-amber-600"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                          Top-Up
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailStudent(student);
                          setDetailModalOpen(true);
                        }}
                        className="rounded-2xl px-3 py-1.5 h-8 text-xs"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
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
        classLeader={classLeader || null}
        onSuccess={() => {
          fetchStudents(className);
        }}
      />
    </>
  );
}
