"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Utensils,
  Smartphone,
  Wallet,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Store,
  Clock,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { FloatingNavbar } from "@/components/navigation/FloatingNavbar";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedCard, AnimatedFadeIn } from "@/components/ui/AnimatedCard";
import { useLenisScroll } from "@/components/providers/SmoothScrollProvider";

export default function LandingPage() {
  const { scrollTo } = useLenisScroll();
  // FAQ accordion active item state
  const [activeFaq, setActiveFaq] = useState<string | null>("faq-1");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("all");

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const faqData = [
    {
      category: "Dasar KantinPay",
      items: [
        {
          id: "faq-1",
          question: "Apa itu KantinPay dan bagaimana cara kerjanya?",
          answer:
            "KantinPay adalah ekosistem pembayaran digital tertutup (closed-loop) khusus sekolah. Siswa menyetor tunai di koperasi sekolah untuk mendapatkan saldo digital. Saldo tersebut dapat dibelanjakan langsung di 8 kantin sekolah baik melalui website maupun WhatsApp bot.",
        },
        {
          id: "faq-2",
          question: "Mengapa menggunakan KantinPay dibanding QRIS umum?",
          answer:
            "Banyak siswa tidak memiliki kuota internet reguler saat jam istirahat atau hanya memiliki paket khusus WhatsApp/chat. KantinPay dirancang agar siswa tetap dapat bertransaksi lancar via WhatsApp bot tanpa kuota internet penuh.",
        },
        {
          id: "faq-3",
          question: "Berapa banyak kantin yang didukung saat ini?",
          answer:
            "KantinPay secara resmi mengintegrasikan 8 kantin sekolah (Kantin 1 sampai Kantin 8), mulai dari kantin makanan berat, soto, mie ayam, hingga minuman segar dan aneka snack.",
        },
      ],
    },
    {
      category: "Saldo & Top Up",
      items: [
        {
          id: "faq-4",
          question: "Bagaimana cara siswa mengisi ulang (top-up) saldo?",
          answer:
            "Siswa cukup mendatangi loket koperasi sekolah dengan membawa uang tunai. Petugas koperasi akan memasukkan NIS siswa dan saldo akan bertambah seketika secara realtime.",
        },
        {
          id: "faq-5",
          question: "Apakah saldo siswa bisa menjadi minus?",
          answer:
            "Tidak. Mesin pembayaran KantinPay menerapkan validasi atomik di sisi server dengan perlindungan anti-minus. Jika saldo tidak mencukupi, transaksi otomatis ditolak sebelum diproses.",
        },
        {
          id: "faq-6",
          question: "Apakah ada biaya admin saat top-up atau pembayaran?",
          answer:
            "Tidak ada biaya admin sama sekali. Sistem ini dikelola mandiri oleh koperasi sekolah untuk kesejahteraan seluruh warga sekolah.",
        },
      ],
    },
    {
      category: "WhatsApp Bot",
      items: [
        {
          id: "faq-7",
          question: "Bagaimana cara bertransaksi lewat WhatsApp Bot?",
          answer:
            "Cukup kirim pesan 'BAYAR' ke nomor resmi WhatsApp KantinPay. Bot akan menampilkan daftar 8 kantin. Balas dengan nomor kantin pilihan dan masukkan nominal pembayaran untuk menyelesaikan transaksi.",
        },
        {
          id: "faq-8",
          question: "Apakah bot bisa digunakan untuk cek saldo dan riwayat?",
          answer:
            "Bisa. Siswa dapat mengirim kata kunci 'SALDO' untuk memeriksa saldo terkini atau 'RIWAYAT' untuk melihat 5 transaksi terakhir.",
        },
      ],
    },
    {
      category: "Koperasi & Tenant",
      items: [
        {
          id: "faq-9",
          question: "Bagaimana pedagang kantin menerima uang hasil penjualan?",
          answer:
            "Setiap sore hari setelah jam operasional sekolah selesai, pengurus koperasi melakukan rekap harian settlement dan mencairkan total penjualan langsung ke pedagang kantin sesuai nomor referensi audit.",
        },
        {
          id: "faq-10",
          question: "Apakah pedagang kantin bisa memantau transaksi harian?",
          answer:
            "Ya, setiap pedagang kantin memiliki akses ke Dashboard Merchant mereka sendiri untuk melihat pembeli yang masuk dan total omset harian secara realtime.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800 selection:bg-[#D6EFFF] pb-24 md:pb-0 overflow-x-hidden">
      {/* Floating Pill Navigation */}
      <FloatingNavbar />

      {/* =========================================================================
          2. HERO SECTION (Text Left, Phone Frame Right with Organic Pastel Blobs)
         ========================================================================= */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 text-left">
            {/* Pill tag matching reference */}
            <AnimatedFadeIn direction="down" delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D6EFFF] border border-[#5CC0F7]/40 text-slate-800 text-xs font-heading font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Ekosistem Finansial Digital Sekolah</span>
              </div>
            </AnimatedFadeIn>

            {/* Main Headline with GSAP Animation */}
            <div className="mb-4">
              <AnimatedHeading
                as="h1"
                text="Jajan di sekolah, tercatat rapi."
                className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-slate-900 tracking-tight leading-[1.1] pb-1"
                scrub={false}
              />
            </div>

            {/* Paragraph Description */}
            <AnimatedFadeIn direction="up" delay={0.2}>
              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
                Solusi pembayaran digital sekolah tertutup yang praktis dan cepat. Tetap bisa bertransaksi di 8 kantin sekolah meski hanya menggunakan paket chat WhatsApp.
              </p>
            </AnimatedFadeIn>

            {/* CTA Buttons & Micro badges with Motion */}
            <AnimatedFadeIn direction="up" delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-heading font-semibold text-sm hover:bg-slate-800 active:scale-95 transition shadow-sm"
                  >
                    <span>Masuk Portal KantinPay</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <a
                    href="#kantin"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#kantin", { offset: -85, duration: 1.25 });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D6EFFF] text-slate-900 font-heading font-semibold text-sm hover:bg-[#c2e5fc] active:scale-95 transition border border-[#5CC0F7]/30 cursor-pointer"
                  >
                    <span>Jelajahi 8 Kantin</span>
                  </a>
                </motion.div>
              </div>

              <p className="mt-4 text-xs text-slate-400 font-heading">
                Didukung kasir koperasi sekolah • Bebas biaya admin • Aman &amp; instan
              </p>
            </AnimatedFadeIn>
          </div>

          {/* Right Column: Phone Mockup with the User's Frame and Organic Pastel Blobs */}
          <div className="lg:col-span-6 flex justify-center relative">
            {/* Soft Organic Pastel Blobs behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 sm:w-96 sm:h-[480px] bg-gradient-to-br from-[#D6EFFF] via-[#EBF7FF] to-[#D6EFFF]/50 rounded-[56px] -rotate-3 -z-10 blur-xs" />
            <div className="absolute top-1/3 -right-6 w-36 h-36 bg-[#5CC0F7]/20 rounded-full blur-2xl -z-10" />

            {/* Motion Animated Card Wrapper */}
            <AnimatedCard hoverEffect={true} delay={0.15}>
              <PhoneMockup>
                {/* App Screen Content inside Frame */}
                <div className="flex-1 p-3.5 bg-[#F8FAFC] overflow-y-auto space-y-3">
                  {/* Top Bar inside app */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[9px] text-slate-400 font-heading">Selamat Pagi,</p>
                      <h4 className="font-heading font-bold text-xs text-slate-900">Ahmad Rifai</h4>
                    </div>
                    <span className="text-[9px] font-heading px-2 py-0.5 rounded-full bg-[#D6EFFF] text-[#0284c7] font-bold">
                      XII SIJA 1
                    </span>
                  </div>

                  {/* Saldo Digital Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#5CC0F7] to-[#38bdf8] p-3.5 text-white shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-white/90">
                      <span>Saldo KantinPay</span>
                      <Coins className="w-3.5 h-3.5 text-white/90" />
                    </div>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl">Rp 85.000</h3>
                    <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[9px] text-white/90 font-medium">
                      <span>NIS: 20241001</span>
                      <span className="font-bold">Koperasi Aktif</span>
                    </div>
                  </div>

                  {/* Quick Canteen Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-heading font-bold text-slate-800">
                        Pilih 8 Kantin
                      </span>
                      <span className="text-[9px] text-[#0284c7] font-heading font-semibold">
                        Lihat Semua
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {[
                        { name: "Kantin 1", icon: "🍛" },
                        { name: "Kantin 2", icon: "🍜" },
                        { name: "Kantin 3", icon: "🍗" },
                        { name: "Kantin 4", icon: "🥟" },
                      ].map((k) => (
                        <div
                          key={k.name}
                          className="p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                        >
                          <span className="text-sm block">{k.icon}</span>
                          <span className="text-[8px] font-heading font-semibold text-slate-700 block mt-0.5">
                            {k.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transactions List */}
                  <div>
                    <span className="text-[10px] font-heading font-bold text-slate-800 block mb-1.5">
                      Transaksi Terakhir
                    </span>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-[10px]">
                        <div>
                          <p className="font-heading font-bold text-slate-800 text-[10px]">
                            Kantin 1 (Bu Nur)
                          </p>
                          <p className="text-[8px] text-slate-400">Nasi Rames Ayam • 09:30</p>
                        </div>
                        <span className="font-heading font-bold text-rose-500 text-[10px]">
                          -Rp 15.000
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-[10px]">
                        <div>
                          <p className="font-heading font-bold text-slate-800 text-[10px]">
                            Top Up Koperasi
                          </p>
                          <p className="text-[8px] text-slate-400">Kasir Koperasi • 08:15</p>
                        </div>
                        <span className="font-heading font-bold text-emerald-600 text-[10px]">
                          +Rp 50.000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom App Nav */}
                <div className="h-10 bg-white border-t border-slate-100 grid grid-cols-4 items-center px-2 text-center shrink-0">
                  <div className="text-[#5CC0F7] text-[9px] font-heading font-bold flex flex-col items-center">
                    <Utensils className="w-3 h-3" />
                    <span>Home</span>
                  </div>
                  <div className="text-slate-400 text-[9px] font-heading flex flex-col items-center">
                    <Store className="w-3 h-3" />
                    <span>Kantin</span>
                  </div>
                  <div className="text-slate-400 text-[9px] font-heading flex flex-col items-center">
                    <Clock className="w-3 h-3" />
                    <span>Riwayat</span>
                  </div>
                  <div className="text-slate-400 text-[9px] font-heading flex flex-col items-center">
                    <Wallet className="w-3 h-3" />
                    <span>Saldo</span>
                  </div>
                </div>
              </PhoneMockup>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURE 1 (Zig-Zag: Text Left, Cooperative Ledger Card Right)
         ========================================================================= */}
      <section id="fitur" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Left */}
          <div className="lg:col-span-5 text-left space-y-4">
            <AnimatedHeading
              as="h2"
              text="Ekosistem terpadu. Koperasi & kantin selalu selaras."
              className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              KantinPay bertindak sebagai jembatan keuangan tertutup di sekolah. Koperasi mengelola penerimaan dana setoran tunai siswa, sementara kantin fokus melayani pesanan tanpa repot menyiapkan uang kembalian.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#0284c7]">
                <CheckCircle2 className="w-4 h-4 text-[#5CC0F7]" />
                Rekonsiliasi transaksi otomatis setiap saat
              </span>
            </div>
          </div>

          {/* Visual Right: Cooperative Daily Ledger Card with Motion */}
          <div className="lg:col-span-7 flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D6EFFF]/40 to-[#EBF7FF]/70 rounded-[40px] -rotate-1 -z-10" />

            <AnimatedCard hoverEffect={true} delay={0.1} className="w-full max-w-lg">
              <div className="w-full bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4 my-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center font-bold text-xs font-heading">
                      KP
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-slate-900">
                        Buku Besar Koperasi Sekolah
                      </h4>
                      <p className="text-[10px] text-slate-400">Status Pembukuan Harian</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Sinkron Realtime
                  </span>
                </div>

                {/* Mini ledger rows */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-slate-800 block text-xs">
                        Kantin 1 (Bu Nurhasanah)
                      </span>
                      <span className="text-[11px] text-slate-500">28 transaksi siswa • Nasi Rames</span>
                    </div>
                    <span className="font-heading font-bold text-slate-900">Rp 345.000</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-slate-800 block text-xs">
                        Kantin 2 (Pak Joko Susilo)
                      </span>
                      <span className="text-[11px] text-slate-500">22 transaksi siswa • Mie Ayam &amp; Bakso</span>
                    </div>
                    <span className="font-heading font-bold text-slate-900">Rp 290.000</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-slate-800 block text-xs">
                        Kantin 3 (Ibu Siti Fatimah)
                      </span>
                      <span className="text-[11px] text-slate-500">31 transaksi siswa • Ayam Geprek</span>
                    </div>
                    <span className="font-heading font-bold text-slate-900">Rp 420.000</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-heading">
                  <span>Total Omset 8 Kantin:</span>
                  <span className="font-bold text-slate-900 text-sm">Rp 2.200.000</span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURE 2 (Zig-Zag: Phone Left, Text Right — WhatsApp Bot Feature)
         ========================================================================= */}
      <section id="kantin" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Left: Phone showing WhatsApp Bot Conversation with Motion */}
          <div className="lg:col-span-6 flex justify-center relative order-2 lg:order-1">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 sm:w-96 sm:h-[480px] bg-gradient-to-tr from-[#D6EFFF] via-[#EBF7FF] to-[#D6EFFF]/60 rounded-[56px] rotate-2 -z-10 blur-xs" />

            <AnimatedCard hoverEffect={true} delay={0.1}>
              <PhoneMockup>
                {/* WhatsApp Chat Header */}
                <div className="bg-emerald-600 text-white p-3 flex items-center gap-2 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs font-heading">
                    KP
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[11px]">KantinPay Bot Official</h4>
                    <p className="text-[8px] text-emerald-100">Akun WhatsApp Sekolah</p>
                  </div>
                </div>

                {/* WhatsApp Chat Messages */}
                <div className="flex-1 p-2.5 bg-[#ECE5DD]/40 overflow-y-auto space-y-2 text-[10px]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] p-2 rounded-xl rounded-tr-xs shadow-2xs max-w-[190px] text-slate-800">
                      <p className="font-bold">BAYAR</p>
                      <span className="text-[8px] text-slate-400 block text-right">09:40</span>
                    </div>
                  </div>

                  {/* Bot reply: Canteen menu */}
                  <div className="flex justify-start">
                    <div className="bg-white p-2 rounded-xl rounded-tl-xs shadow-2xs max-w-[210px] text-slate-800 space-y-0.5">
                      <p className="font-bold text-emerald-700 text-[10px]">Silakan pilih kantin:</p>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        1. Kantin 1 (Bu Nur)<br />
                        2. Kantin 2 (Pak Joko)<br />
                        3. Kantin 3 (Ibu Siti)<br />
                        ...s/d Kantin 8
                      </p>
                      <span className="text-[8px] text-slate-400 block text-right">09:40</span>
                    </div>
                  </div>

                  {/* User reply */}
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] p-1.5 rounded-xl rounded-tr-xs shadow-2xs text-slate-800">
                      <p className="font-bold">1</p>
                      <span className="text-[8px] text-slate-400 block text-right">09:41</span>
                    </div>
                  </div>

                  {/* Bot reply: Success */}
                  <div className="flex justify-start">
                    <div className="bg-white p-2 rounded-xl rounded-tl-xs shadow-2xs max-w-[210px] text-slate-800 space-y-0.5 border-l-3 border-emerald-500">
                      <p className="font-bold text-emerald-700 text-[10px]">Pembayaran Berhasil! 🎉</p>
                      <p className="text-[9px] text-slate-600">
                        Kantin: <strong>Kantin 1</strong><br />
                        Nominal: <strong>Rp 10.000</strong><br />
                        Sisa saldo: <strong>Rp 75.000</strong>
                      </p>
                      <p className="text-[8px] text-slate-400">Terima kasih telah jajan di kantin.</p>
                      <span className="text-[8px] text-slate-400 block text-right">09:41</span>
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </AnimatedCard>
          </div>

          {/* Text Right with GSAP */}
          <div className="lg:col-span-6 text-left space-y-4 order-1 lg:order-2">
            <AnimatedHeading
              as="h2"
              text="Ketika kuota reguler habis, jajan tetap jalan lancar."
              className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Banyak siswa yang paket internetnya hanya aktif untuk WhatsApp. KantinPay mengantisipasi ini dengan menghubungkan bot WhatsApp ke sistem database yang sama.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Siswa cukup membalas pesan teks sederhana untuk memilih kantin dan membayar makanan tanpa perlu membuka aplikasi perbankan yang rakus kuota data.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#0284c7]">
                <MessageSquare className="w-4 h-4 text-[#5CC0F7]" />
                Kompatibel dengan paket chat operator seluler apa pun
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURE 3 (Zig-Zag: Text Left, Phone Right — Easy Payment 2 Seconds)
         ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Left with GSAP */}
          <div className="lg:col-span-6 text-left space-y-4">
            <AnimatedHeading
              as="h2"
              text="Pembayaran instan. Bahkan saat antrean penuh."
              className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Jam istirahat sekolah hanya berlangsung singkat. KantinPay menghilangkan waktu tunggu mencari uang pas dan uang kembalian receh.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Cukup pilih nomor kantin, ketikkan nominal, dan konfirmasi. Notifikasi masuk seketika ke layar pengelola kantin dalam hitungan 2 detik.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#0284c7]">
                <Zap className="w-4 h-4 text-[#5CC0F7]" />
                Rata-rata kecepatan transaksi di bawah 2 detik
              </span>
            </div>
          </div>

          {/* Phone Right: Easy Payment Screen with Motion */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 sm:w-96 sm:h-[480px] bg-gradient-to-br from-[#D6EFFF]/60 via-[#EBF7FF] to-[#D6EFFF]/40 rounded-[56px] -rotate-2 -z-10 blur-xs" />

            <AnimatedCard hoverEffect={true} delay={0.1}>
              <PhoneMockup>
                <div className="p-4 flex-1 flex flex-col justify-between bg-white text-center">
                  <div className="space-y-3 pt-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#D6EFFF] text-[#0284c7] mx-auto flex items-center justify-center font-bold text-base font-heading">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        Kantin 1 (Bu Nur)
                      </h4>
                      <p className="text-[10px] text-slate-400">Nasi Rames &amp; Sayur Asem</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-heading block">
                        Nominal Pembayaran
                      </span>
                      <h3 className="font-heading font-bold text-xl text-slate-900 mt-0.5">
                        Rp 12.000
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {["Rp 5.000", "Rp 10.000", "Rp 15.000"].map((nominal) => (
                        <div
                          key={nominal}
                          className="py-1.5 px-0.5 rounded-xl bg-slate-50 border border-slate-200 text-[9px] font-heading font-semibold text-slate-700"
                        >
                          {nominal}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="w-full py-2.5 rounded-xl bg-[#5CC0F7] text-white font-heading font-bold text-[11px] shadow-2xs">
                      Bayar Sekarang
                    </div>
                    <p className="text-[9px] text-slate-400 font-heading">
                      Sisa Saldo: Rp 85.000
                    </p>
                  </div>
                </div>
              </PhoneMockup>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FEATURE 4 (Zig-Zag: Phone Left, Text Right with 3 Bullet Points)
         ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Phone Left: History View with Motion */}
          <div className="lg:col-span-6 flex justify-center relative order-2 lg:order-1">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 sm:w-96 sm:h-[480px] bg-gradient-to-tr from-[#EBF7FF] via-[#D6EFFF] to-[#EBF7FF] rounded-[56px] rotate-3 -z-10 blur-xs" />

            <AnimatedCard hoverEffect={true} delay={0.1}>
              <PhoneMockup>
                <div className="p-3.5 bg-slate-50 flex-1 space-y-2.5 overflow-y-auto">
                  <div className="flex items-center justify-between pt-1">
                    <h4 className="font-heading font-bold text-xs text-slate-900">
                      Riwayat Transaksi
                    </h4>
                    <span className="text-[9px] text-slate-400 font-heading">Semua</span>
                  </div>

                  {/* List of items */}
                  <div className="space-y-1.5">
                    {[
                      {
                        title: "Kantin 2 (Pak Joko)",
                        sub: "Mie Ayam Pangsit • Hari Ini",
                        amount: "-Rp 14.000",
                        type: "payment",
                      },
                      {
                        title: "Top Up Kasir Koperasi",
                        sub: "Setoran Tunai • Hari Ini",
                        amount: "+Rp 50.000",
                        type: "topup",
                      },
                      {
                        title: "Kantin 5 (Bu Maya)",
                        sub: "Jus Alpukat Segar • Kemarin",
                        amount: "-Rp 8.000",
                        type: "payment",
                      },
                      {
                        title: "Kantin 4 (Pak Budi)",
                        sub: "Risol Mayo & Tahu • Kemarin",
                        amount: "-Rp 6.000",
                        type: "payment",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center justify-between text-[10px]"
                      >
                        <div>
                          <p className="font-heading font-bold text-slate-800 text-[10px]">
                            {item.title}
                          </p>
                          <p className="text-[8px] text-slate-400">{item.sub}</p>
                        </div>
                        <span
                          className={`font-heading font-bold text-[10px] ${
                            item.type === "topup" ? "text-emerald-600" : "text-slate-800"
                          }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </PhoneMockup>
            </AnimatedCard>
          </div>

          {/* Text Right with GSAP & Motion */}
          <div className="lg:col-span-6 text-left space-y-5 order-1 lg:order-2">
            <AnimatedHeading
              as="h2"
              text="Bawa riwayatmu ke mana saja."
              className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Semua jejak pembayaran terekam kekal dalam basis data sekolah. Siswa dapat memeriksa pengeluaran uang saku secara mandiri, sementara orang tua dan pengurus koperasi mendapatkan transparansi finansial penuh.
            </p>

            {/* 3 Color Bullet Points matching Loaf reference */}
            <div className="space-y-3 pt-2">
              <AnimatedFadeIn direction="up" delay={0.1}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5CC0F7] shrink-0" />
                  <span className="text-sm font-heading font-semibold text-slate-800">
                    Riwayat transaksi abadi, tidak pernah hilang
                  </span>
                </div>
              </AnimatedFadeIn>
              <AnimatedFadeIn direction="up" delay={0.2}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm font-heading font-semibold text-slate-800">
                    Proteksi saldo anti-minus pada setiap pembelian
                  </span>
                </div>
              </AnimatedFadeIn>
              <AnimatedFadeIn direction="up" delay={0.3}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-sm font-heading font-semibold text-slate-800">
                    Rekap nomor referensi unik untuk setiap transaksi
                  </span>
                </div>
              </AnimatedFadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. "WHAT MATTERS WHEN YOU ACTUALLY USE IT" (2x2 Grid with Motion Cards)
         ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-100">
        <div className="text-left mb-12">
          <AnimatedHeading
            as="h2"
            text="Hal penting saat Anda menggunakannya"
            className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
            scrub={true}
          />
          <p className="text-sm text-slate-500 mt-2">
            Dirancang berdasarkan riset nyata kebutuhan siswa dan pedagang di kantin sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prop 1 */}
          <AnimatedCard
            hoverEffect={true}
            delay={0.05}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#5CC0F7]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D6EFFF] text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Kecepatan Transaksi 2 Detik
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Antrean kantin bergerak cepat tanpa waktu terbuang untuk menghitung uang kertas dan koin.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Prop 2 */}
          <AnimatedCard
            hoverEffect={true}
            delay={0.12}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#5CC0F7]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Pemisahan Rekening Payable
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Uang siswa dan saldo milik pedagang dipisahkan secara tertib dalam pembukuan koperasi.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Prop 3 */}
          <AnimatedCard
            hoverEffect={true}
            delay={0.19}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#5CC0F7]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Ramah Paket WhatsApp
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Siswa tanpa kuota reguler tetap bisa jajan dengan mudah menggunakan perintah bot WhatsApp.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Prop 4 */}
          <AnimatedCard
            hoverEffect={true}
            delay={0.26}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#5CC0F7]/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900">
                  Integritas Finansial ACID
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Setiap pemotongan saldo berjalan dalam transaksi database yang dapat di-rollback otomatis jika gagal.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* =========================================================================
          8. "A NOTE FROM THE COOPERATIVE" (Pastel Full-Width Band + Centered Paper Card)
         ========================================================================= */}
      <section id="catatan" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#D6EFFF]/50 via-[#EBF7FF]/80 to-[#D6EFFF]/30 border-y border-[#5CC0F7]/20 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedHeading
            as="h2"
            text="Catatan dari Pengurus Koperasi"
            className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-8 leading-tight pb-1"
            scrub={true}
          />

          <AnimatedCard hoverEffect={true} delay={0.1}>
            <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 shadow-md border border-slate-200 text-left space-y-4 relative">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                Ide awal dari KantinPay lahir dari sebuah pengamatan sederhana di kantin sekolah kami. Setiap kali jam istirahat berbunyi, ratusan siswa berdesakan di depan 8 kantin, antre menghitung uang receh, dan banyak yang batal jajan karena waktu istirahat yang sangat terbatas.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                Kami juga menemukan fakta bahwa mayoritas siswa memang memiliki ponsel, namun sering kali kuota internet mereka habis atau hanya terbatas pada paket chat WhatsApp. Dari sanalah kami merancang ekosistem ini: sebuah sistem pembayaran tertutup yang dikelola koperasi sekolah, aman dari minus, dan bisa diakses via web maupun bot WhatsApp.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                Harapan kami, KantinPay bukan hanya mempermudah siswa jajan dan membantu pedagang kantin merekap penjualan, tetapi juga menjadi sarana edukasi literasi keuangan digital yang bertanggung jawab bagi seluruh siswa sekolah.
              </p>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-heading font-bold text-slate-900 text-sm">
                    Pengurus Koperasi Sekolah
                  </h5>
                  <p className="text-xs text-slate-400">SMK Negeri 1 — Ekosistem KantinPay</p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#5CC0F7] text-white flex items-center justify-center font-heading font-bold text-sm">
                  KP
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* =========================================================================
          9. "YOUR QUESTIONS, ANSWERED." (FAQ with Left Sticky Sidebar & Right Accordions)
         ========================================================================= */}
      <section id="faq" className="min-h-screen flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sticky Sidebar */}
          <div className="lg:col-span-4 text-left">
            <div className="lg:sticky lg:top-28 space-y-4">
              <span className="text-xs font-heading font-bold text-[#0284c7] uppercase tracking-wider">
                Bantuan &amp; Panduan
              </span>
              <AnimatedHeading
                as="h2"
                text="Pertanyaan yang sering diajukan."
                className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-tight pb-1"
                scrub={true}
              />
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Punya pertanyaan seputar cara penggunaan, top-up saldo, atau pendaftaran kantin? Temukan jawabannya di sini.
              </p>

              {/* Category Pills */}
              <div className="pt-4 flex flex-wrap lg:flex-col gap-2">
                {[
                  { id: "all", label: "Semua Kategori" },
                  { id: "Dasar KantinPay", label: "Dasar KantinPay" },
                  { id: "Saldo & Top Up", label: "Saldo & Top Up" },
                  { id: "WhatsApp Bot", label: "WhatsApp Bot" },
                  { id: "Koperasi & Tenant", label: "Koperasi & Tenant" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFaqCategory(cat.id)}
                    className={`text-left px-3.5 py-2 rounded-xl text-xs font-heading font-semibold transition cursor-pointer ${
                      activeFaqCategory === cat.id
                        ? "bg-[#D6EFFF] text-[#0284c7] font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Accordion List with Motion */}
          <div className="lg:col-span-8 space-y-8">
            {faqData
              .filter(
                (section) =>
                  activeFaqCategory === "all" || section.category === activeFaqCategory
              )
              .map((section) => (
                <div key={section.category} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-[#5CC0F7]" />
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                      {section.category}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {section.items.map((item, idx) => {
                      const isOpen = activeFaq === item.id;
                      return (
                        <AnimatedCard
                          key={item.id}
                          hoverEffect={false}
                          delay={idx * 0.04}
                          className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleFaq(item.id)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                          >
                            <span className="font-heading font-bold text-sm text-slate-900">
                              {item.question}
                            </span>
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                                isOpen
                                  ? "bg-[#D6EFFF] text-[#0284c7] rotate-180"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </AnimatedCard>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. BOTTOM CALL TO ACTION
         ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white to-[#D6EFFF]/40 text-center">
        <div className="absolute -top-12 left-1/4 w-72 h-72 bg-[#D6EFFF]/60 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#5CC0F7]/15 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatedFadeIn direction="down" delay={0.05}>
            <div className="w-14 h-14 rounded-3xl bg-[#5CC0F7] text-white mx-auto flex items-center justify-center shadow-md">
              <Utensils className="w-7 h-7" />
            </div>
          </AnimatedFadeIn>

          <AnimatedHeading
            as="h2"
            text="Mulai Gunakan KantinPay Hari Ini"
            className="text-3xl sm:text-5xl font-heading font-bold text-slate-900 tracking-tight leading-snug pb-1.5"
            scrub={true}
          />

          <AnimatedFadeIn direction="up" delay={0.15}>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
              Satu akun untuk siswa, 8 kantin terintegrasi, dan pengelolaan keuangan koperasi sekolah yang transparan.
            </p>
          </AnimatedFadeIn>

          <AnimatedFadeIn direction="up" delay={0.25}>
            <div className="pt-2 flex justify-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900 text-white font-heading font-bold text-sm hover:bg-slate-800 transition shadow-md"
                >
                  <span>Buka Portal KantinPay</span>
                </Link>
              </motion.div>
            </div>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* =========================================================================
          11. FOOTER
         ========================================================================= */}
      <footer className="border-t border-slate-100 bg-white py-10 pb-28 md:pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-2xl bg-[#5CC0F7] flex items-center justify-center text-white">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-slate-900 text-sm">
              Kantin<span className="text-[#5CC0F7]">Pay</span>
            </span>
          </div>

          <p>© 2026 KantinPay Ecosystem. Closed-loop School Payment System. Hak Cipta Dilindungi.</p>

          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 font-heading font-semibold text-slate-600">
            <a
              href="#fitur"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#fitur", { offset: -85, duration: 1.25 });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Fitur
            </a>
            <a
              href="#kantin"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#kantin", { offset: -85, duration: 1.25 });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              8 Kantin
            </a>
            <a
              href="#catatan"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#catatan", { offset: -85, duration: 1.25 });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Catatan Koperasi
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#faq", { offset: -85, duration: 1.25 });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              FAQ
            </a>
            <Link href="/login" className="text-[#0284c7] hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
