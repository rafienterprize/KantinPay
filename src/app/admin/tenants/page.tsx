"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Store,
  Phone,
  LayoutGrid,
  List,
  Utensils,
  Share2,
  TrendingUp,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import { Canteen } from "@/types";
import { TenantDetailModal } from "@/components/admin/TenantDetailModal";

export default function TenantsPage() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [connectionFilter, setConnectionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"box" | "list">("box");

  // Add Tenant Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    ownerName: "",
    whatsappNumber: "",
    category: "Makanan Berat",
    description: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTenant, setDetailTenant] = useState<Canteen | null>(null);

  const fetchCanteens = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/tenants?${params.toString()}`);
      const data = await res.json();
      let list: Canteen[] = data.canteens || [];

      if (connectionFilter !== "all") {
        list = list.filter((c) => c.connectionStatus === connectionFilter);
      }

      setCanteens(list);
    } catch {
      console.error("Failed to load canteens");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, statusFilter, connectionFilter, sortBy]);

  useEffect(() => {
    fetchCanteens();
  }, [fetchCanteens]);

  const handleAddTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");

    try {
      const res = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTenant),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Gagal menambahkan kantin.");
        setAddLoading(false);
        return;
      }

      setAddModalOpen(false);
      setNewTenant({
        name: "",
        ownerName: "",
        whatsappNumber: "",
        category: "Makanan Berat",
        description: "",
      });
      fetchCanteens();
    } catch {
      setAddError("Terjadi kesalahan jaringan.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleInviteVendor = (canteen: Canteen) => {
    const waText = encodeURIComponent(
      `Halo ${canteen.ownerName} (${canteen.name}), akun merchant KantinPay Anda telah aktif. Anda dapat memantau penjualan realtime melalui portal KantinPay SMK Negeri 7 Semarang.`
    );
    window.open(`https://wa.me/${canteen.whatsappNumber.replace(/\D/g, "")}?text=${waText}`, "_blank");
  };

  return (
    <AdminLayout
      pageTitle="Data Tenant"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onFilterClick={() => setCategoryFilter((prev) => (prev === "all" ? "Makanan" : "all"))}
      actionButton={{
        label: "Add Tenant",
        onClick: () => setAddModalOpen(true),
      }}
    >
      <div className="space-y-5">
        {/* Top Header Card matching wireframe: Data Tenant (left) & Status Koneksi (right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-semibold text-[#0284c7] uppercase tracking-wider">
                Mitra Kantin Sekolah
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mt-0.5">
              Data Tenant
            </h1>
            <p className="text-xs text-slate-500">
              Kelola 8 kantin terdaftar, monitoring penjualan harian, dan koordinasi pedagang.
            </p>
          </div>

          {/* Status Koneksi */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-heading self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-semibold">Status Koneksi:</span>
            <span className="text-emerald-700 font-bold">8/8 Tenant Terhubung</span>
          </div>
        </div>

        {/* Three Filter Controls matching wireframe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filter 1: Kategori */}
          <Select
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            options={[
              { value: "all", label: "Semua Kategori" },
              { value: "Makanan", label: "Makanan" },
              { value: "Minuman", label: "Minuman" },
              { value: "Snack", label: "Snack" },
            ]}
            placeholder="Kategori"
            className="w-full"
          />

          {/* Filter 2: Status Buka */}
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: "all", label: "Semua Status" },
              { value: "active", label: "Buka / Aktif" },
              { value: "closed", label: "Tutup" },
            ]}
            placeholder="Status Buka"
            className="w-full"
          />

          {/* Filter 3: Koneksi */}
          <Select
            value={connectionFilter}
            onChange={(value) => setConnectionFilter(value)}
            options={[
              { value: "all", label: "Semua Koneksi" },
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
            ]}
            placeholder="Koneksi Mesin"
            className="w-full"
          />
        </div>

        {/* Sort by (left) and Box / List view toggle (right) matching wireframe */}
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Sort By matching wireframe */}
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            options={[
              { value: "name", label: "Nama Kantin (Urut 1 - 8)" },
              { value: "sales", label: "Penjualan Tertinggi" },
              { value: "transactions", label: "Transaksi Terbanyak" },
            ]}
            placeholder="Sort by"
            className="w-auto min-w-[200px]"
          />

          {/* Box / List view toggle matching wireframe */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("box")}
              className={`p-1.5 rounded-xl transition ${
                viewMode === "box"
                  ? "bg-[#D6EFFF] text-[#0284c7]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Box View (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-xl transition ${
                viewMode === "list"
                  ? "bg-[#D6EFFF] text-[#0284c7]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-heading font-semibold text-slate-500 pr-2">
              Box / List view
            </span>
          </div>
        </div>

        {/* Tenant Cards Grid: 2 columns, 4 rows = 8 cafeterias matching wireframe */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-3xl bg-white border border-slate-200/80 p-5 space-y-3"
              >
                <div className="h-5 w-1/3 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-8 w-2/3 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        ) : viewMode === "box" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {canteens.map((canteen) => (
              <div
                key={canteen.id}
                onClick={() => {
                  setDetailTenant(canteen);
                  setDetailModalOpen(true);
                }}
                className="rounded-3xl bg-white p-6 border border-[#D1D1D1]/60 shadow-xs hover:border-[#5CC0F7] transition flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#D6EFFF] text-[#0284c7] font-heading font-bold text-sm flex items-center justify-center">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                          {canteen.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Pemilik: {canteen.ownerName}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-heading font-medium border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                    {canteen.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] font-heading font-semibold text-slate-400 block">
                        Penjualan Hari Ini
                      </span>
                      <span className="font-heading font-bold text-sm text-slate-900">
                        {formatRupiah(canteen.dailyTotal)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-heading font-semibold text-slate-400 block">
                        Jumlah Pembeli
                      </span>
                      <span className="font-heading font-bold text-sm text-slate-900">
                        {canteen.dailyCount} Transaksi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invite Vendor / WhatsApp Contact Action matching wireframe */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{canteen.whatsappNumber}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInviteVendor(canteen)}
                    className="rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-heading h-8 px-3"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1" />
                    <span>Invite Vendor WA</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="rounded-3xl bg-white border border-[#D1D1D1]/60 shadow-xs overflow-hidden divide-y divide-slate-100">
            {canteens.map((canteen) => (
              <div
                key={canteen.id}
                onClick={() => {
                  setDetailTenant(canteen);
                  setDetailModalOpen(true);
                }}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D6EFFF] text-[#0284c7] font-heading font-bold text-xs flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {canteen.name} — {canteen.ownerName}
                    </h4>
                    <p className="text-xs text-slate-500">{canteen.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="font-heading font-bold text-sm text-slate-900 block">
                      {formatRupiah(canteen.dailyTotal)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {canteen.dailyCount} Transaksi
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInviteVendor(canteen)}
                    className="rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1" />
                    Invite
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD TENANT MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Daftarkan Tenant Kantin Baru"
        description="Tambahkan unit kantin sekolah ke sistem pembayaran KantinPay"
      >
        <form onSubmit={handleAddTenantSubmit} className="space-y-3.5 py-1">
          {addError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <Input
            label="Nama Kantin"
            required
            value={newTenant.name}
            onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
            placeholder="Kantin 9"
            icon={<Store className="w-4 h-4" />}
          />

          <Input
            label="Nama Pemilik / Pengelola"
            required
            value={newTenant.ownerName}
            onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
            placeholder="Ibu Endang"
          />

          <Input
            label="Nomor WhatsApp"
            required
            value={newTenant.whatsappNumber}
            onChange={(e) => setNewTenant({ ...newTenant, whatsappNumber: e.target.value })}
            placeholder="081311223309"
            icon={<Phone className="w-4 h-4" />}
          />

          <div>
            <Select
              label="Kategori Menu Utama"
              value={newTenant.category}
              onChange={(value) => setNewTenant({ ...newTenant, category: value })}
              options={[
                { value: "Makanan Berat", label: "Makanan Berat" },
                { value: "Mie & Bakso", label: "Mie & Bakso" },
                { value: "Minuman Segar", label: "Minuman Segar" },
                { value: "Snack & Gorengan", label: "Snack & Gorengan" },
                { value: "Kue & Bakery", label: "Kue & Bakery" },
              ]}
              icon={<Utensils className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Deskripsi Menu & Spesialisasi"
            value={newTenant.description}
            onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
            placeholder="Menyediakan aneka olahan ayam & nasi kotak"
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
              Simpan Data Tenant
            </Button>
          </div>
        </form>
      </Modal>
    
      {/* TENANT DETAIL MODAL */}
      <TenantDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        tenant={detailTenant}
      />
    </AdminLayout>
  );
}

