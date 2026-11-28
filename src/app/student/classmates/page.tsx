"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { 
  Users, 
  Crown,
  User as UserIcon,
  ArrowUpCircle,
  Search,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { User } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ClassLeaderTopUpModal } from "@/components/admin/ClassLeaderTopUpModal";

export default function ClassmatesPage() {
  const [user, setUser] = useState<any>(null);
  const [classmates, setClassmates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Top-Up Modal
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpTargetStudent, setTopUpTargetStudent] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch current user
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch classmates
      if (userData.user?.className) {
        const classmatesRes = await fetch(
          `/api/admin/classes/${encodeURIComponent(userData.user.className)}`
        );
        const classmatesData = await classmatesRes.json();
        
        // Sort: class leader first, then alphabetically
        const sorted = (classmatesData.students || []).sort((a: User, b: User) => {
          if (a.isClassLeader && !b.isClassLeader) return -1;
          if (!a.isClassLeader && b.isClassLeader) return 1;
          return a.fullName.localeCompare(b.fullName);
        });
        
        setClassmates(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassmates = classmates.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.includes(searchTerm))
  );

  const totalBalance = classmates.reduce((sum, s) => sum + s.balance, 0);
  const classLeader = classmates.find((s) => s.isClassLeader);

  if (loading) {
    return (
      <StudentLayout pageTitle="Data Siswa" user={user}>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0284c7]"></div>
          <p className="text-sm text-slate-500 mt-3">Memuat data siswa...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!user) {
    return (
      <StudentLayout pageTitle="Data Siswa">
        <p className="text-center text-slate-500">User not found</p>
      </StudentLayout>
    );
  }

  return (
    <>
      <StudentLayout pageTitle="Data Siswa" user={user}>
        <div className="space-y-5">
          {/* Class Summary Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">
                  Kelas {user.className}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  {classmates.length} Siswa Terdaftar
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-slate-500 block mb-1">Total Saldo Kelas</span>
                <span className="text-2xl font-heading font-bold text-emerald-600">
                  {formatRupiah(totalBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <Input
              placeholder="Cari nama atau NIS siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Students List */}
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#D6EFFF] border-b border-[#5CC0F7]/30 px-6 py-3.5 grid grid-cols-12 text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
              <div className="col-span-6">Nama Siswa</div>
              <div className="col-span-3 text-right sm:text-left">Saldo</div>
              <div className="col-span-3 text-right">Aksi</div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0284c7]"></div>
                <p className="text-sm text-slate-500 mt-3">Memuat data siswa...</p>
              </div>
            ) : filteredClassmates.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                Tidak ada siswa ditemukan.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredClassmates.map((student) => (
                  <div
                    key={student.id}
                    className="px-6 py-4 grid grid-cols-12 items-center"
                  >
                    {/* Student Info */}
                    <div className="col-span-6 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        student.isClassLeader 
                          ? "bg-amber-100 text-amber-600" 
                          : "bg-[#D6EFFF] text-[#0284c7]"
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
                      {/* Show Top-Up button only for Class Leader and not for self */}
                      {user.isClassLeader && student.id !== user.id && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setTopUpTargetStudent(student);
                            setTopUpModalOpen(true);
                          }}
                          className="rounded-2xl px-3 py-1.5 h-8 text-xs bg-[#0284c7] hover:bg-[#0369a1]"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                          Top-Up
                        </Button>
                      )}
                      
                      {/* Self indicator for class leader */}
                      {user.isClassLeader && student.id === user.id && (
                        <span className="text-xs text-slate-400 font-medium px-3 py-1.5">
                          (Anda)
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

      {/* Class Leader Top-Up Modal */}
      <ClassLeaderTopUpModal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        targetStudent={topUpTargetStudent}
        classLeader={classLeader || null}
        onSuccess={() => {
          fetchData();
        }}
      />
    </>
  );
}
