"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { User } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Phone,
  Mail,
  GraduationCap,
  Wallet,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Crown,
} from "lucide-react";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
  onTopUp?: (student: User) => void;
}

export function StudentDetailModal({
  isOpen,
  onClose,
  student,
}: StudentDetailModalProps) {
  const [editedStudent, setEditedStudent] = useState<User | null>(null);
  const [originalStudent, setOriginalStudent] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    if (student) {
      setEditedStudent({ ...student });
      setOriginalStudent({ ...student });
      setMessage(null);
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowUnsavedWarning(false);
      setShowDeleteConfirm(false);
    }
  }, [student]);

  if (!student || !editedStudent || !originalStudent) return null;

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (newPassword || confirmPassword) return true;
    
    return (
      editedStudent.fullName !== originalStudent.fullName ||
      editedStudent.studentId !== originalStudent.studentId ||
      editedStudent.email !== originalStudent.email ||
      editedStudent.whatsappNumber !== originalStudent.whatsappNumber ||
      editedStudent.className !== originalStudent.className
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges() && !saving) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const handleForceClose = () => {
    setShowUnsavedWarning(false);
    onClose();
  };

  const classOptions = [
    { value: "X RPL 1", label: "X RPL 1" },
    { value: "X TKJ 1", label: "X TKJ 1" },
    { value: "XI RPL 1", label: "XI RPL 1" },
    { value: "XI SIJA 1", label: "XI SIJA 1" },
    { value: "XII SIJA 1", label: "XII SIJA 1" },
    { value: "XII SIJA 2", label: "XII SIJA 2" },
  ];

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Validasi password jika diisi
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setMessage({ type: "error", text: "Password minimal 6 karakter" });
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "Password dan konfirmasi tidak cocok" });
        setSaving(false);
        return;
      }
    }

    try {
      const updateData: any = {
        fullName: editedStudent.fullName,
        studentId: editedStudent.studentId,
        email: editedStudent.email,
        whatsappNumber: editedStudent.whatsappNumber,
        className: editedStudent.className,
      };

      // Tambahkan password jika diisi
      if (newPassword) {
        updateData.password = newPassword;
      }

      const res = await fetch(`/api/admin/students/${editedStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal menyimpan perubahan" });
        setSaving(false);
        return;
      }

      const successMsg = newPassword 
        ? "Data siswa dan password berhasil diperbarui!" 
        : "Data siswa berhasil diperbarui!";
      setMessage({ type: "success", text: successMsg });
      
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to get updated data
      }, 1500);
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/students/${editedStudent.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Gagal menghapus akun siswa");
        setDeleting(false);
        return;
      }

      alert("Akun siswa berhasil dihapus!");
      setShowDeleteConfirm(false);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Terjadi gangguan jaringan.");
      setDeleting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Profile Siswa"
        description="Ubah informasi akun dan data siswa"
        maxWidth="xl"
        showCloseButton={false}
        disableBackdropClick={true}
      >
      <div className="space-y-5 py-3">
        {/* Student Identity Card */}
        <div className="p-5 rounded-2xl border bg-[#D6EFFF]/50 border-[#5CC0F7]/30">
          {editedStudent.isClassLeader && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#5CC0F7]/20">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                Ketua Kelas
              </span>
            </div>
          )}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#5CC0F7] text-white font-heading font-bold text-2xl flex items-center justify-center shrink-0">
              {editedStudent.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <Input
                label="Nama Lengkap"
                value={editedStudent.fullName}
                onChange={(e) => setEditedStudent({ ...editedStudent, fullName: e.target.value })}
                placeholder="Nama lengkap siswa"
                className="mb-3"
              />
              <Select
                label="Kelas"
                value={editedStudent.className || "XII SIJA 1"}
                onChange={(value) => setEditedStudent({ ...editedStudent, className: value })}
                options={classOptions}
                icon={<GraduationCap className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Account Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              NIS
            </label>
            <Input
              value={editedStudent.studentId || ""}
              onChange={(e) => setEditedStudent({ ...editedStudent, studentId: e.target.value })}
              placeholder="Nomor Induk Siswa"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center">
            <span className="text-sm text-slate-500 block mb-2">Kelas</span>
            <span className="font-heading font-bold text-base text-slate-900">
              {editedStudent.className || "XII SIJA 1"}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="text-sm text-slate-600 font-semibold mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            Nomor WhatsApp
          </label>
          <Input
            value={editedStudent.whatsappNumber || ""}
            onChange={(e) => setEditedStudent({ ...editedStudent, whatsappNumber: e.target.value })}
            placeholder="08xxxxxxxxxxx"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600 font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            Email
          </label>
          <Input
            type="email"
            value={editedStudent.email || ""}
            onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        {/* Password Reset Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[#0284c7]" />
            <h4 className="text-sm font-heading font-bold text-slate-900">Reset Password (Opsional)</h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Kosongkan jika tidak ingin mengubah password. Minimal 6 karakter.
          </p>
          
          <div className="space-y-3">
            <div className="relative">
              <Input
                label="Password Baru"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Konfirmasi Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Information (Read-only) */}
        <div className="p-5 bg-[#D6EFFF]/50 rounded-2xl border border-[#5CC0F7]/40">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-[#0284c7]" />
            <span className="text-sm text-slate-700 font-heading font-semibold">Saldo Tersedia</span>
          </div>
          <span className="font-heading font-bold text-3xl text-slate-900 block">
            {formatRupiah(editedStudent.balance)}
          </span>
          <span className="text-xs text-[#0284c7] font-heading font-semibold mt-2 block">
            Status: {editedStudent.balance >= 50000 ? "Aman" : "Perlu Top Up"}
          </span>
        </div>

        {/* Feedback message */}
        {message && (
          <div
            className={`p-3 rounded-2xl text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex gap-3 mb-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 rounded-xl h-11"
            >
              Tutup
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSave}
              className="flex-1 rounded-xl h-11"
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
          
          {/* Delete Account Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={saving}
            className="w-full rounded-xl h-10 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Akun Siswa
          </Button>
        </div>
      </div>
    </Modal>

    {/* Unsaved Changes Warning Modal */}
    <Modal
      isOpen={showUnsavedWarning}
      onClose={() => setShowUnsavedWarning(false)}
      title="Perubahan Belum Disimpan"
      description="Ada perubahan yang belum disimpan"
      maxWidth="md"
    >
      <div className="space-y-4 py-2">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 font-semibold mb-1">
              Anda memiliki perubahan yang belum disimpan
            </p>
            <p className="text-xs text-amber-700">
              Jika Anda menutup sekarang, semua perubahan akan hilang. Apakah Anda yakin ingin keluar tanpa menyimpan?
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowUnsavedWarning(false)}
            className="flex-1 rounded-xl"
          >
            Kembali Edit
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleForceClose}
            className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700"
          >
            Tutup Tanpa Simpan
          </Button>
        </div>
      </div>
    </Modal>

    {/* Delete Confirmation Modal */}
    <Modal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      title="Konfirmasi Hapus Akun"
      description="Tindakan ini tidak dapat dibatalkan"
      maxWidth="md"
    >
      <div className="space-y-4 py-2">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-rose-900 font-semibold mb-1">
              Peringatan! Tindakan Permanen
            </p>
            <p className="text-xs text-rose-700 mb-2">
              Anda akan menghapus akun siswa <strong>{editedStudent.fullName}</strong> secara permanen.
            </p>
            <ul className="text-xs text-rose-700 space-y-1 ml-4 list-disc">
              <li>Semua data siswa akan dihapus</li>
              <li>Riwayat transaksi akan hilang</li>
              <li>Saldo sebesar <strong>{formatRupiah(editedStudent.balance)}</strong> akan hangus</li>
              <li>Tindakan ini tidak dapat dibatalkan</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleting}
            className="flex-1 rounded-xl"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={deleting}
            onClick={handleDelete}
            className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Ya, Hapus Akun
          </Button>
        </div>
      </div>
    </Modal>
  </>
  );
}
