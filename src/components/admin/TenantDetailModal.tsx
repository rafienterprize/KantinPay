"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Canteen } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Phone,
  Store,
  Utensils,
  User,
  TrendingUp,
  Receipt,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface TenantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Canteen | null;
}

export function TenantDetailModal({
  isOpen,
  onClose,
  tenant,
}: TenantDetailModalProps) {
  const [editedTenant, setEditedTenant] = useState<Canteen | null>(null);
  const [originalTenant, setOriginalTenant] = useState<Canteen | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  React.useEffect(() => {
    if (tenant) {
      setEditedTenant({ ...tenant });
      setOriginalTenant({ ...tenant });
      setMessage(null);
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowUnsavedWarning(false);
    }
  }, [tenant]);

  if (!tenant || !editedTenant || !originalTenant) return null;

  const categoryOptions = [
    { value: "Makanan Berat", label: "Makanan Berat" },
    { value: "Mie & Bakso", label: "Mie & Bakso" },
    { value: "Minuman Segar", label: "Minuman Segar" },
    { value: "Snack & Gorengan", label: "Snack & Gorengan" },
    { value: "Kue & Bakery", label: "Kue & Bakery" },
  ];

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (newPassword || confirmPassword) return true;
    
    return (
      editedTenant.name !== originalTenant.name ||
      editedTenant.ownerName !== originalTenant.ownerName ||
      editedTenant.whatsappNumber !== originalTenant.whatsappNumber ||
      editedTenant.category !== originalTenant.category ||
      editedTenant.description !== originalTenant.description
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

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Validate required fields
    if (!editedTenant.name || !editedTenant.ownerName || !editedTenant.whatsappNumber || !editedTenant.category) {
      setMessage({ type: "error", text: "Semua field wajib diisi" });
      setSaving(false);
      return;
    }

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
        name: editedTenant.name,
        ownerName: editedTenant.ownerName,
        whatsappNumber: editedTenant.whatsappNumber,
        category: editedTenant.category,
        description: editedTenant.description || "",
      };

      // Tambahkan password jika diisi
      if (newPassword) {
        updateData.password = newPassword;
      }

      const res = await fetch(`/api/admin/tenants/${editedTenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("API Error:", data);
        setMessage({ type: "error", text: data.error || "Gagal menyimpan perubahan" });
        setSaving(false);
        return;
      }

      const successMsg = newPassword 
        ? "Data tenant dan password berhasil diperbarui!" 
        : "Data tenant berhasil diperbarui!";
      setMessage({ type: "success", text: successMsg });
      
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Network Error:", error);
      setMessage({ type: "error", text: "Terjadi gangguan jaringan. Pastikan koneksi internet Anda stabil." });
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Profile Tenant"
        description="Ubah informasi tenant kantin"
        maxWidth="xl"
        showCloseButton={false}
        disableBackdropClick={true}
      >
        <div className="space-y-5 py-3">
          {/* Tenant Identity Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D6EFFF]/50 to-white border border-[#5CC0F7]/30">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#5CC0F7] text-white font-heading font-bold text-3xl flex items-center justify-center shrink-0">
                <Store className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <Input
                  label="Nama Kantin"
                  value={editedTenant.name}
                  onChange={(e) => setEditedTenant({ ...editedTenant, name: e.target.value })}
                  placeholder="Nama kantin"
                  className="mb-3"
                />
                <Select
                  label="Kategori Menu"
                  value={editedTenant.category || "Makanan Berat"}
                  onChange={(value) => setEditedTenant({ ...editedTenant, category: value })}
                  options={categoryOptions}
                  icon={<Utensils className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <label className="text-sm text-slate-500 font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Nama Pemilik
            </label>
            <Input
              value={editedTenant.ownerName || ""}
              onChange={(e) => setEditedTenant({ ...editedTenant, ownerName: e.target.value })}
              placeholder="Nama pemilik kantin"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="text-sm text-slate-500 font-semibold mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              Nomor WhatsApp
            </label>
            <Input
              value={editedTenant.whatsappNumber || ""}
              onChange={(e) => setEditedTenant({ ...editedTenant, whatsappNumber: e.target.value })}
              placeholder="08xxxxxxxxxxx"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-500 font-semibold mb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-slate-400" />
              Deskripsi Menu
            </label>
            <Input
              value={editedTenant.description || ""}
              onChange={(e) => setEditedTenant({ ...editedTenant, description: e.target.value })}
              placeholder="Deskripsi menu dan spesialisasi"
            />
          </div>

          {/* Password Reset Section */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-heading font-bold text-amber-900">Reset Password (Opsional)</h4>
            </div>
            <p className="text-xs text-amber-700 mb-3">
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

          {/* Sales Information (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-semibold">Penjualan Hari Ini</span>
              </div>
              <span className="font-heading font-bold text-2xl text-emerald-700 block">
                {formatRupiah(editedTenant.dailyTotal || 0)}
              </span>
            </div>

            <div className="p-5 bg-gradient-to-r from-cyan-50 to-cyan-100/50 rounded-xl border border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-cyan-700 font-semibold">Jumlah Transaksi</span>
              </div>
              <span className="font-heading font-bold text-2xl text-cyan-700 block">
                {editedTenant.dailyCount || 0} Transaksi
              </span>
            </div>
          </div>

          {/* Connection Status (Read-only) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-semibold">Status Koneksi:</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  editedTenant.connectionStatus === "online" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`} />
                <span className={`text-sm font-bold ${
                  editedTenant.connectionStatus === "online" ? "text-emerald-700" : "text-slate-500"
                }`}>
                  {editedTenant.connectionStatus === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
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
          <div className="pt-4 border-t border-slate-100 flex gap-3">
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
    </>
  );
}
