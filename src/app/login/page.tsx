"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Info,
  MessageCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { CloudflareTurnstile } from "@/components/security/CloudflareTurnstile";
import { UserRole } from "@/types";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@kantinpay.sch.id");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  
  // Modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showRequestAccountModal, setShowRequestAccountModal] = useState(false);

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
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMessage("Silakan selesaikan verifikasi keamanan Cloudflare terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal masuk ke dalam sistem.");
        setTurnstileResetKey((prev) => prev + 1);
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
      setTurnstileResetKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="KantinPay Logo"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
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
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-lg border-2 border-slate-300 bg-white peer-checked:bg-[#0284c7] peer-checked:border-[#0284c7] transition-all duration-200 flex items-center justify-center">
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-slate-600 font-medium group-hover:text-slate-900 transition">Ingat Saya</span>
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
              }}
              className="text-[#0284c7] hover:underline font-medium"
            >
              Lupa Kata Sandi?
            </a>
          </div>

          {TURNSTILE_SITE_KEY && (
            <CloudflareTurnstile
              siteKey={TURNSTILE_SITE_KEY}
              action="login"
              resetTrigger={turnstileResetKey}
              onVerify={setTurnstileToken}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={Boolean(TURNSTILE_SITE_KEY) && !turnstileToken}
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
                setShowRequestAccountModal(true);
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

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        title="Lupa Kata Sandi?"
        description="Hubungi administrator untuk reset password"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-[#D6EFFF]/50 border border-[#5CC0F7]/30 flex gap-3">
            <Info className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-900 font-heading font-bold mb-1.5">
                Prosedur Reset Kata Sandi
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Silakan hubungi <strong>Pengurus Koperasi Sekolah</strong> melalui loket tata usaha untuk mereset kata sandi Anda. Bawa kartu identitas siswa/staff untuk verifikasi.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowForgotPasswordModal(false)}
              className="rounded-2xl flex-1"
            >
              Tutup
            </Button>
            <a
              href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20mereset%20kata%20sandi%20akun%20KantinPay%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="primary"
                size="md"
                className="rounded-2xl w-full"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </Modal>

      {/* Request Account Modal */}
      <Modal
        isOpen={showRequestAccountModal}
        onClose={() => setShowRequestAccountModal(false)}
        title="Permintaan Akun Baru"
        description="Informasi pendaftaran akun"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-2xl bg-[#D6EFFF]/50 border border-[#5CC0F7]/30 flex gap-3">
            <Info className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-900 font-heading font-bold mb-1.5">
                Pendaftaran Akun KantinPay
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Pendaftaran akun siswa dan tenant kantin dikoordinasikan langsung oleh <strong>Pengurus Koperasi Sekolah</strong> melalui loket tata usaha.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc">
                <li>Akun Siswa: Daftarkan melalui wali kelas atau tata usaha</li>
                <li>Akun Tenant: Hubungi koordinator koperasi sekolah</li>
                <li>Bawa dokumen identitas untuk verifikasi</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowRequestAccountModal(false)}
              className="rounded-2xl flex-1"
            >
              Tutup
            </Button>
            <a
              href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20mendaftar%20akun%20KantinPay%20baru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="primary"
                size="md"
                className="rounded-2xl w-full"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
