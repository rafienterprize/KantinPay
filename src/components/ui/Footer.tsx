"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Utensils } from "lucide-react";

interface FooterProps {
  scrollTo?: (target: string | number | Element, options?: { offset?: number; duration?: number }) => void;
}

export function Footer({ scrollTo }: FooterProps) {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    if (scrollTo) {
      scrollTo(`#${targetId}`, { offset: -85, duration: 1.25 });
    }
  };

  return (
    <div className="relative">
      {/* Background for wave transition */}
      <div className="relative bg-white">
        {/* CTA Banner - Overlapping the Footer (half outside, half inside) */}
        <div className="relative -mb-66 sm:-mb-74 z-20 px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-r from-[#5CC0F7] to-[#38bdf8] rounded-3xl p-12 sm:p-16 overflow-hidden shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6"
                >
                  <Utensils className="w-8 h-8 text-white" />
                </motion.div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                  Mulai Gunakan KantinPay Hari Ini
                </h2>
                
                {/* Description */}
                <p className="text-white/90 text-sm sm:text-base mb-8 leading-relaxed">
                  Satu akun untuk siswa, 8 kantin terintegrasi, dan pengelolaan keuangan koperasi sekolah yang transparan.
                </p>

                {/* CTA Button */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-slate-900 text-white font-heading font-bold text-base hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Buka Portal KantinPay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative w-full overflow-hidden leading-[0] z-0">
        <svg
          className="relative block w-full h-32 sm:h-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          {/* Wave body with light blue fill */}
          <path
            d="M0,200 C320,80 420,80 720,200 C1020,320 1120,320 1440,200 L1440,400 L0,400 Z"
            className="fill-[#D6EFFF]/40"
          />
          {/* Gray wave outline on top */}
          <path
            d="M0,200 C320,80 420,80 720,200 C1020,320 1120,320 1440,200"
            className="fill-none stroke-slate-300 stroke-[3]"
          />
        </svg>
      </div>

      {/* Footer - Light Blue Background */}
      <footer className="relative bg-[#D6EFFF]/40 pt-32 sm:pt-36">
        {/* Footer Links Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="KantinPay Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-heading font-bold text-xl text-slate-900">
                  Kantin<span className="text-[#5CC0F7]">Pay</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                CLOSED-LOOP PAYMENT<br />
                Ekosistem Digital Kantin Sekolah
              </p>
            </div>

            {/* Fitur Links */}
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 mb-4">Fitur</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a
                    href="#fitur"
                    onClick={(e) => handleSmoothScroll(e, "fitur")}
                    className="hover:text-[#5CC0F7] transition cursor-pointer"
                  >
                    8 Kantin
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#5CC0F7] transition">
                    Portal Login
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => handleSmoothScroll(e, "faq")}
                    className="hover:text-[#5CC0F7] transition cursor-pointer"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Catatan Koperasi Links */}
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 mb-4">Catatan Koperasi</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a
                    href="#catatan"
                    onClick={(e) => handleSmoothScroll(e, "catatan")}
                    className="hover:text-[#5CC0F7] transition cursor-pointer"
                  >
                    Portal Login
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 mb-4">Contact</h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-900 text-white font-heading font-semibold text-xs hover:bg-slate-800 transition"
                >
                  Buka Portal KantinPay
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© 2026 KantinPay Ecosystem. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-slate-900 transition">Terms of Use</a>
                <span>•</span>
                <a href="#" className="hover:text-slate-900 transition">Legal</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
