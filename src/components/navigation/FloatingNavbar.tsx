"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Utensils, ArrowRight, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Fitur", href: "/#fitur" },
    { label: "8 Kantin", href: "/#fitur" },
    { label: "Catatan", href: "/#catatan" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300",
          "bg-white/85 backdrop-blur-md border border-[#D1D1D1]/60 shadow-sm",
          scrolled && "shadow-md bg-white/95 border-slate-300/80 py-2"
        )}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#5CC0F7] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-slate-800">
            Kantin<span className="text-[#5CC0F7]">Pay</span>
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors duration-150 py-1",
                  isActive
                    ? "text-[#5CC0F7] font-bold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Actions (Login / Portal) */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-heading font-semibold text-slate-700 hover:bg-slate-100 transition active:scale-95"
          >
            <UserCircle className="w-4 h-4 text-slate-400" />
            Masuk Akun
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-heading font-semibold bg-[#5CC0F7] text-white hover:bg-[#48b1eb] shadow-xs active:scale-95 transition"
          >
            <span>Buka Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
