"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Utensils,
  Mail,
  Lock,
  Shield,
  GraduationCap,
  Store,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@kantinpay.sch.id");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setErrorMessage("");
    // Convenient defaults for reviewer testing
    if (selectedRole === "admin") {
      setEmail("admin@kantinpay.sch.id");
      setPassword("admin123");
    } else if (selectedRole === "student") {
      setEmail("ahmad@kantinpay.sch.id");
      setPassword("password123");
    } else if (selectedRole === "merchant") {
      setEmail("kantin1@kantinpay.sch.id");
      setPassword("password123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal masuk ke dalam sistem.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Autentikasi berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/admin");
        router.refresh();
      }, 600);
    } catch {
      setErrorMessage("Terjadi gangguan jaringan. Silakan coba kembali.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-11 h-11 rounded-2xl bg-[#5CC0F7] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span>
          </span>
        </Link>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Masuk ke Portal Sekolah
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sistem Pembayaran Digital Ekosistem Kantin Sekolah
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#D1D1D1]/60">
        {/* Role Picker */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Pilih Peran Akun
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-heading font-semibold transition ${
                role === "admin"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Shield className="w-4 h-4 mb-1 text-[#5CC0F7]" />
              <span>Koperasi</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-heading font-semibold transition ${
                role === "student"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4 mb-1 text-[#5CC0F7]" />
              <span>Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("merchant")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-heading font-semibold transition ${
                role === "merchant"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Store className="w-4 h-4 mb-1 text-[#5CC0F7]" />
              <span>Tenant</span>
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email atau Username"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@kantinpay.sch.id"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Kata Sandi"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#5CC0F7] focus:ring-[#5CC0F7]"
              />
              <span>Ingat Saya</span>
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Silakan hubungi Pengurus Koperasi Sekolah untuk mereset kata sandi Anda.");
              }}
              className="text-[#0284c7] hover:underline font-medium"
            >
              Lupa Kata Sandi?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-4"
          >
            <span>Masuk Sekarang</span>
          </Button>
        </form>

        {/* Footer Request Admin */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akses akun resmi?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  "Pendaftaran akun siswa dan kantin dikoordinasikan langsung oleh Pengurus Koperasi Sekolah melalui loket tata usaha."
                );
              }}
              className="font-heading font-semibold text-[#0284c7] hover:underline"
            >
              Request Admin / Permintaan Akun
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-600 underline">
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
