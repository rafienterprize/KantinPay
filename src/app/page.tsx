import React from "react";
import Link from "next/link";
import { FloatingNavbar } from "@/components/navigation/FloatingNavbar";
import {
  Utensils,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Wallet,
  MessageSquare,
  Sparkles,
  Store,
  CheckCircle2,
  RefreshCw,
  Clock,
  Coins,
} from "lucide-react";

export default function LandingPage() {
  const canteensList = [
    { name: "Kantin 1", menu: "Nasi Rames & Sayur Asem", owner: "Bu Nur" },
    { name: "Kantin 2", menu: "Mie Ayam & Bakso Sapi", owner: "Pak Joko" },
    { name: "Kantin 3", menu: "Ayam Geprek & Nasi Goreng", owner: "Ibu Siti" },
    { name: "Kantin 4", menu: "Aneka Snack & Gorengan", owner: "Pak Budi" },
    { name: "Kantin 5", menu: "Jus Segar & Minuman Dingin", owner: "Bu Maya" },
    { name: "Kantin 6", menu: "Soto Ayam & Rawon Daging", owner: "Pak Slamet" },
    { name: "Kantin 7", menu: "Roti Bakar & Pastry Enak", owner: "Ibu Dewi" },
    { name: "Kantin 8", menu: "Dimsum Kukus & Salad Buah", owner: "Bu Rita" },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-800 overflow-x-hidden selection:bg-[#D6EFFF]">
      {/* Floating Pill Navigation */}
      <FloatingNavbar />

      {/* Orbit Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[850px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full border border-[#5CC0F7]/15" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[980px] h-[980px] rounded-full border border-[#D6EFFF]/40" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-b from-[#D6EFFF]/60 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D6EFFF]/80 border border-[#5CC0F7]/40 text-slate-700 text-xs font-heading font-medium mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>Solusi Finansial Digital Khusus Lingkungan Sekolah</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Smart Payments, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#5CC0F7] to-[#38bdf8]">
            Simpler School Life.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Solusi pembayaran digital sekolah yang praktis, cepat, dan terintegrasi melalui website maupun WhatsApp. Tetap bisa jajan walau hanya dengan paket chat.
        </p>

        {/* Minimalist CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-heading font-semibold text-sm bg-[#5CC0F7] text-white hover:bg-[#48b1eb] shadow-md shadow-[#5CC0F7]/25 active:scale-95 transition"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#fitur"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-heading font-semibold text-sm bg-white text-slate-700 border border-[#D1D1D1] hover:bg-slate-50 active:scale-95 transition"
          >
            <span>Jelajahi KantinPay</span>
          </a>
        </div>

        {/* Centered Hero Graphic with Orbit Floating Elements */}
        <div className="relative mt-16 max-w-3xl mx-auto">
          {/* Main Simulated Tablet / Phone Card */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5CC0F7] text-white flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-slate-900">KantinPay Student Hub</h4>
                  <p className="text-[11px] text-slate-500">SMK Negeri 1 — Ekosistem Finansial Mandiri</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-heading font-medium border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Saldo Siswa Box */}
              <div className="rounded-2xl bg-gradient-to-br from-[#D6EFFF]/60 to-white p-4 border border-[#5CC0F7]/30">
                <p className="text-xs text-slate-500 font-medium">Saldo Tersedia (Closed-Loop)</p>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                  Rp 85.000
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-600 font-heading">
                  <Coins className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Dikelola Kas Koperasi Sekolah</span>
                </div>
              </div>

              {/* Status Transaksi Hari Ini */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                <p className="text-xs text-slate-500 font-medium">Transaksi Terakhir</p>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-slate-800">Kantin 1 (Bu Nur)</h4>
                    <p className="text-[11px] text-slate-500">Nasi Rames Ayam • 09:45 WIB</p>
                  </div>
                  <span className="font-heading font-bold text-sm text-slate-900">-Rp 15.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Fintech Pill 1: WhatsApp Bot */}
          <div className="hidden lg:flex items-center gap-3 absolute -left-12 top-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-[#D1D1D1]/70 animate-bounce [animation-duration:4s]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left text-xs">
              <p className="font-heading font-semibold text-slate-900">WhatsApp Bot Ready</p>
              <p className="text-slate-500 text-[11px]">Ketik &quot;BAYAR&quot; via paket chat</p>
            </div>
          </div>

          {/* Floating Fintech Pill 2: Payment Notification */}
          <div className="hidden lg:flex items-center gap-3 absolute -right-12 bottom-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-[#D1D1D1]/70">
            <div className="w-10 h-10 rounded-xl bg-[#5CC0F7] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left text-xs">
              <p className="font-heading font-semibold text-slate-900">Pembayaran Sukses</p>
              <p className="text-emerald-600 font-bold text-[11px]">Rp 10.000 ke Kantin 2</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: PROBLEM & SOLUTION */}
      <section id="fitur" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
              Mengapa KantinPay?
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mt-2">
              Bukan Sekadar QRIS Biasa, Dirancang Spesifik untuk Siswa
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Banyak siswa memiliki QRIS, namun sering terkendala kuota data internet saat jam istirahat. KantinPay hadir memadukan website modern dan WhatsApp bot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-3xl p-7 bg-[#F8FAFC] border border-[#D1D1D1]/70 hover:border-[#5CC0F7] transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Akses Tanpa Kuota Penuh</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Dapat diakses lewat aplikasi website sekolah maupun integrasi bot WhatsApp yang ramah paket chat.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl p-7 bg-[#F8FAFC] border border-[#D1D1D1]/70 hover:border-[#5CC0F7] transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mb-5">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Closed-Loop Ecosystem</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Koperasi sekolah memegang peranan sebagai bendahara sentral, memastikan perputaran uang tetap aman di lingkungan sekolah.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl p-7 bg-[#F8FAFC] border border-[#D1D1D1]/70 hover:border-[#5CC0F7] transition duration-200">
              <div className="w-12 h-12 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Keamanan Finansial Atomik</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Setiap transaksi diverifikasi di sisi server dengan integritas ACID, saldo anti-minus, dan catatan audit yang tidak bisa dihapus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 8 CANTEENS ECOSYSTEM */}
      <section id="kantin" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
              Tenant Terdaftar
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mt-2">
              Mendukung 8 Kantin Sekolah
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Siswa dapat memilih kantin favorit dan langsung melakukan pembayaran non-tunai seketika.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-xs font-heading font-semibold text-[#0284c7] hover:underline"
          >
            <span>Masuk untuk melihat menu lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {canteensList.map((c, i) => (
            <div
              key={c.name}
              className="rounded-3xl bg-white p-5 border border-slate-200 hover:border-[#5CC0F7] transition shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-heading font-bold text-xs group-hover:bg-[#5CC0F7] group-hover:text-white transition">
                  #{i + 1}
                </div>
                <span className="text-[11px] font-heading px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {c.owner}
                </span>
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-base">{c.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.menu}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Koneksi Realtime</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Buka
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: REKAP DAN SETTLEMENT KOPERASI */}
      <section id="keamanan" className="py-20 bg-[#D6EFFF]/30 border-y border-[#5CC0F7]/20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#5CC0F7]/30 text-slate-700 text-xs font-heading font-medium mb-4">
              <Store className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Rekonsiliasi & Settlement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
              Pencatatan Finansial Transparan dan Otomatis
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Pembayaran siswa dan pencairan pedagang kantin dipisahkan dengan tertib. Setiap sore, koperasi sekolah merekap total transaksi harian dari 8 tenant, memverifikasi nomor referensi, dan mencairkan dana settlement secara tepat.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5CC0F7] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>Pemisahan Rekening Payable:</strong> Saldo pedagang bertambah sesuai transaksi riil yang masuk.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5CC0F7] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>3 Status Settlement:</strong> Pending, Processing, dan Settled dengan nomor referensi audit.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5CC0F7] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>Top-up Fleksibel di Koperasi:</strong> Siswa menyetor tunai di loket koperasi untuk mengisi saldo akun digital.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-heading font-bold text-sm text-slate-800">
                Alur Transaksi KantinPay
              </span>
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-heading font-bold text-xs shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <p className="font-heading font-bold text-slate-800">Siswa Top-up di Koperasi</p>
                  <p className="text-slate-500">Petugas memasukkan NIS dan menambahkan saldo digital.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-heading font-bold text-xs shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <p className="font-heading font-bold text-slate-800">Beli Makanan di Kantin</p>
                  <p className="text-slate-500">Pilih salah satu dari 8 kantin lewat web atau WhatsApp bot.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-heading font-bold text-xs shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <p className="font-heading font-bold text-slate-800">Rekap & Settlement Sore Hari</p>
                  <p className="text-slate-500">Koperasi menyelesaikan pencairan harian ke pemilik kantin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#5CC0F7] to-[#38bdf8] rounded-3xl p-8 sm:p-14 text-white shadow-lg">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold">
            Siap Memulai Transaksi Digital di Sekolah?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            Masuk ke portal siswa, pantau penjualan di dashboard kantin, atau kelola seluruh keuangan koperasi sekarang.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-heading font-bold text-sm bg-white text-slate-800 hover:bg-slate-100 shadow-md active:scale-95 transition"
            >
              <span>Masuk Portal KantinPay</span>
              <ArrowRight className="w-4 h-4 text-[#5CC0F7]" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#5CC0F7] flex items-center justify-center text-white">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-slate-800 text-sm">
              Kantin<span className="text-[#5CC0F7]">Pay</span>
            </span>
          </div>
          <p>© 2026 KantinPay Ecosystem. Closed-loop School Payment System. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              07:00 - 16:00 WIB
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
