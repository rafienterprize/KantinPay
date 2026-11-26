"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Footer } from "@/components/ui/Footer";
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

  // Marquee items for the ticker strip
  const marqueeItems = [
    "PEMBAYARAN DIGITAL",
    "8 KANTIN TERINTEGRASI",
    "WHATSAPP BOT",
    "SALDO REALTIME",
    "ANTI MINUS",
    "KOPERASI SEKOLAH",
    "SETTLEMENT HARIAN",
    "CLOSED-LOOP SYSTEM",
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-800 selection:bg-[#D6EFFF] pb-24 md:pb-0 overflow-x-hidden">
      {/* Floating Pill Navigation */}
      <FloatingNavbar />

      {/* =========================================================================
          1. HERO SECTION (Text Left, Phone Frame Right with Organic Pastel Blobs)
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
          2. MARQUEE TICKER STRIP (Horizontal infinite scroll text band)
         ========================================================================= */}
      <div className="relative overflow-hidden border-y border-[#D1D1D1]/40 bg-[#D6EFFF]/30 py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className="mx-6 sm:mx-10 text-xs sm:text-sm font-heading font-bold text-slate-500 uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. SPLIT SECTION — Text Left, Cooperative Ledger Card Right
             (Referensi: "Crafting brand experiences" layout)
         ========================================================================= */}
      <section id="fitur" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Large headline + sub-text */}
          <div className="space-y-6">
            <AnimatedHeading
              as="h2"
              text="Ekosistem terpadu. Koperasi & kantin selalu selaras."
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-[1.12] pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              KantinPay bertindak sebagai jembatan keuangan tertutup di sekolah. Koperasi mengelola penerimaan dana setoran tunai siswa, sementara kantin fokus melayani pesanan tanpa repot menyiapkan uang kembalian.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#0284c7]">
                <CheckCircle2 className="w-4 h-4 text-[#5CC0F7]" />
                Rekonsiliasi transaksi otomatis setiap saat
              </span>
            </div>
          </div>

          {/* Right: Visual Ledger Card */}
          <AnimatedCard hoverEffect={true} delay={0.1} className="w-full">
            <div className="w-full bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
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
      </section>

      {/* =========================================================================
          4. SPLIT SECTION — Phone Left, Service List Right
             (Referensi: "Deep into brand experience" layout — image kiri, list kanan)
         ========================================================================= */}
      <section id="kantin" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Phone showing WhatsApp Bot */}
          <div className="flex justify-center relative order-2 lg:order-1">
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
                      <p className="font-bold text-emerald-700 text-[10px]">Pembayaran Berhasil!</p>
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

          {/* Right: Service list (like reference — vertical stacked items with separator) */}
          <div className="space-y-6 order-1 lg:order-2">
            <AnimatedHeading
              as="h2"
              text="Ketika kuota reguler habis, jajan tetap jalan lancar."
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-[1.12] pb-1"
              scrub={true}
            />

            {/* Stacked service items (like reference layout) */}
            <div className="space-y-0 divide-y divide-slate-100">
              {[
                { label: "WHATSAPP BOT", desc: "Bayar lewat pesan teks, tanpa perlu kuota reguler" },
                { label: "PORTAL WEB", desc: "Dashboard lengkap untuk siswa, kantin, dan koperasi" },
                { label: "SALDO DIGITAL", desc: "Setoran tunai berubah instan menjadi saldo digital" },
                { label: "SETTLEMENT HARIAN", desc: "Pencairan dana ke pedagang kantin setiap sore hari" },
              ].map((item, idx) => (
                <AnimatedFadeIn key={item.label} direction="up" delay={idx * 0.08}>
                  <div className="py-5 flex items-center justify-between group cursor-default">
                    <div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 uppercase tracking-wider">
                        {item.label}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#5CC0F7] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CENTERED HEADING + VERTICAL STACKED CARDS
             (Referensi: "Helping brands thrive" layout — heading di tengah, item cards vertikal)
         ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-100">
        <div className="text-center mb-14">
          <AnimatedHeading
            as="h2"
            text="Hal penting saat Anda menggunakannya"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-[1.12] pb-1"
            scrub={true}
          />
          <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto">
            Dirancang berdasarkan riset nyata kebutuhan siswa dan pedagang di kantin sekolah.
          </p>
        </div>

        {/* Stacked vertical cards (like reference project list) */}
        <div className="space-y-4">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              iconBg: "bg-[#D6EFFF] text-[#0284c7]",
              title: "Kecepatan Transaksi 2 Detik",
              desc: "Antrean kantin bergerak cepat tanpa waktu terbuang untuk menghitung uang kertas dan koin.",
              tag: "PERFORMA",
            },
            {
              icon: <Layers className="w-5 h-5" />,
              iconBg: "bg-emerald-50 text-emerald-600",
              title: "Pemisahan Rekening Payable",
              desc: "Uang siswa dan saldo milik pedagang dipisahkan secara tertib dalam pembukuan koperasi.",
              tag: "KEAMANAN",
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              iconBg: "bg-amber-50 text-amber-600",
              title: "Ramah Paket WhatsApp",
              desc: "Siswa tanpa kuota reguler tetap bisa jajan dengan mudah menggunakan perintah bot WhatsApp.",
              tag: "AKSESIBILITAS",
            },
            {
              icon: <Lock className="w-5 h-5" />,
              iconBg: "bg-sky-50 text-sky-600",
              title: "Integritas Finansial ACID",
              desc: "Setiap pemotongan saldo berjalan dalam transaksi database yang dapat di-rollback otomatis jika gagal.",
              tag: "RELIABILITAS",
            },
          ].map((item, idx) => (
            <AnimatedCard
              key={item.title}
              hoverEffect={true}
              delay={idx * 0.06}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#5CC0F7]/50 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-1.5">
                    <h4 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. SECOND MARQUEE TICKER STRIP
         ========================================================================= */}
      <div className="relative overflow-hidden border-y border-[#D1D1D1]/40 bg-[#D6EFFF]/20 py-4">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {[
            "TRANSAKSI INSTAN",
            "REKAP OTOMATIS",
            "BEBAS BIAYA ADMIN",
            "BOT WHATSAPP",
            "SALDO AMAN",
            "AUDIT TRAIL",
            "DASHBOARD REALTIME",
            "KOPERASI DIGITAL",
            "TRANSAKSI INSTAN",
            "REKAP OTOMATIS",
            "BEBAS BIAYA ADMIN",
            "BOT WHATSAPP",
            "SALDO AMAN",
            "AUDIT TRAIL",
            "DASHBOARD REALTIME",
            "KOPERASI DIGITAL",
          ].map((item, idx) => (
            <span
              key={idx}
              className="mx-6 sm:mx-10 text-xs sm:text-sm font-heading font-bold text-slate-400 uppercase tracking-widest"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          7. SPLIT — Phone Left, Bullet Points Right (Payment Speed)
             (Referensi: tetap zig-zag, tapi lebih spaced)
         ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Phone Left: Easy Payment Screen */}
          <div className="flex justify-center relative order-2 lg:order-1">
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

          {/* Right: Text + Bullet Points */}
          <div className="space-y-5 order-1 lg:order-2">
            <AnimatedHeading
              as="h2"
              text="Pembayaran instan. Bahkan saat antrean penuh."
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-[1.12] pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Jam istirahat sekolah hanya berlangsung singkat. KantinPay menghilangkan waktu tunggu mencari uang pas dan uang kembalian receh.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Cukup pilih nomor kantin, ketikkan nominal, dan konfirmasi. Notifikasi masuk seketika ke layar pengelola kantin dalam hitungan 2 detik.
            </p>

            {/* 3 Bullet Points */}
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
          8. HISTORY PHONE + TEXT (zig-zag: Text Left, Phone Right)
         ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-5">
            <AnimatedHeading
              as="h2"
              text="Bawa riwayatmu ke mana saja."
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 leading-[1.12] pb-1"
              scrub={true}
            />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Semua jejak pembayaran terekam kekal dalam basis data sekolah. Siswa dapat memeriksa pengeluaran uang saku secara mandiri, sementara orang tua dan pengurus koperasi mendapatkan transparansi finansial penuh.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#0284c7]">
                <Zap className="w-4 h-4 text-[#5CC0F7]" />
                Rata-rata kecepatan transaksi di bawah 2 detik
              </span>
            </div>
          </div>

          {/* Right: Phone History View */}
          <div className="flex justify-center relative">
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
        </div>
      </section>

      {/* =========================================================================
          9. CATATAN KOPERASI (Full-Width Pastel Band + Centered Paper Card)
             (Referensi: "Kind words, big ego boost" testimonial style)
         ========================================================================= */}
      <section id="catatan" className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-[#D6EFFF]/50 via-[#EBF7FF]/80 to-[#D6EFFF]/30 border-y border-[#5CC0F7]/20 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedHeading
            as="h2"
            text="Catatan dari Pengurus Koperasi"
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-10 leading-[1.12] pb-1"
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
          10. FAQ (Left Sticky Sidebar + Right Accordions)
         ========================================================================= */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
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
          11. FOOTER
         ========================================================================= */}
      <Footer scrollTo={scrollTo} />
    </div>
  );
}
