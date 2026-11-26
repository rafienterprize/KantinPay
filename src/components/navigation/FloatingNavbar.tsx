"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Utensils,
  UserCircle,
  Sparkles,
  Store,
  HelpCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useLenisScroll } from "@/components/providers/SmoothScrollProvider";

export function FloatingNavbar() {
  const { scrollTo } = useLenisScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navLinks = [
    { label: "Fitur", id: "fitur", href: "#fitur", icon: Sparkles },
    { label: "8 Kantin", id: "kantin", href: "#kantin", icon: Store },
    { label: "Catatan", id: "catatan", href: "#catatan", icon: Utensils },
    { label: "FAQ", id: "faq", href: "#faq", icon: HelpCircle },
  ];

  // Scroll spy to highlight active menu
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        { id: "fitur", el: document.getElementById("fitur") },
        { id: "kantin", el: document.getElementById("kantin") },
        { id: "catatan", el: document.getElementById("catatan") },
        { id: "faq", el: document.getElementById("faq") },
      ];

      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, el } = sections[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(id);
          return;
        }
      }

      if (window.scrollY < 180) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (targetId === "top") {
      if (scrollTo) {
        scrollTo(0, { offset: 0, duration: 1.2 });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (scrollTo) {
        scrollTo(targetElement, { offset: -80, duration: 1.25 });
      }
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(targetId);

      if (window.history.pushState) {
        window.history.pushState(null, "", `#${targetId}`);
      }
    } else {
      console.warn(`Target #${targetId} not found`);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. DESKTOP FLOATING NAVBAR (With Smooth Motion & Gliding Active Pill)
         ========================================================================= */}
      <header className="hidden md:flex fixed top-5 inset-x-0 z-50 justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300",
            "bg-white/85 backdrop-blur-md border border-[#D1D1D1]/60 shadow-sm",
            scrolled && "shadow-md bg-white/95 border-slate-300/80 py-2"
          )}
        >
          {/* Brand Logo with micro-interaction */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                handleSmoothScroll(e, "top");
              }
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl overflow-hidden shadow-xs transition-transform"
            >
              <Image
                src="/logo.png"
                alt="KantinPay Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="font-heading font-bold text-lg tracking-tight text-slate-800">
              Kantin<span className="text-[#5CC0F7]">Pay</span>
            </span>
          </Link>

          {/* Center Navigation Links with Gliding Animated Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={(e) => handleSmoothScroll(e, link.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none",
                    isActive
                      ? "text-[#0284c7] font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-[#D6EFFF] rounded-full -z-10 shadow-2xs border border-[#5CC0F7]/30"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Actions (Login / Portal) with Tap feedback */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-heading font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <UserCircle className="w-4 h-4 text-slate-400" />
                Masuk Akun
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-heading font-semibold bg-[#5CC0F7] text-white hover:bg-[#48b1eb] shadow-xs transition"
              >
                <span>Buka Portal</span>
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      </header>

      {/* =========================================================================
          2. MOBILE TOP BAR
         ========================================================================= */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              handleSmoothScroll(e, "top");
            }
          }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs">
            <Image
              src="/logo.png"
              alt="KantinPay Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold bg-[#5CC0F7] text-white shadow-2xs active:scale-95 transition"
        >
          <span>Masuk</span>
        </Link>
      </div>

      {/* =========================================================================
          3. MOBILE FIXED BOTTOM NAVIGATION (5 Tabs, Thumb Zone, Safe Area Inset)
         ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#D1D1D1]/60 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {/* Tab 1: Home */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => handleSmoothScroll(e, "top")}
            className={cn(
              "flex flex-col items-center justify-center min-h-[46px] py-1 rounded-xl transition-all cursor-pointer select-none",
              activeSection === ""
                ? "text-[#5CC0F7]"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Utensils className="w-5 h-5" />
            <span
              className={cn(
                "text-[10px] font-heading mt-0.5 leading-none",
                activeSection === "" ? "font-bold text-[#5CC0F7]" : "font-medium"
              )}
            >
              Home
            </span>
            {activeSection === "" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CC0F7] mt-0.5" />
            )}
          </motion.button>

          {/* Tab 2: Fitur */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => handleSmoothScroll(e, "fitur")}
            className={cn(
              "flex flex-col items-center justify-center min-h-[46px] py-1 rounded-xl transition-all cursor-pointer select-none",
              activeSection === "fitur"
                ? "text-[#5CC0F7]"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Sparkles className="w-5 h-5" />
            <span
              className={cn(
                "text-[10px] font-heading mt-0.5 leading-none",
                activeSection === "fitur" ? "font-bold text-[#5CC0F7]" : "font-medium"
              )}
            >
              Fitur
            </span>
            {activeSection === "fitur" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CC0F7] mt-0.5" />
            )}
          </motion.button>

          {/* Tab 3: 8 Kantin */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => handleSmoothScroll(e, "kantin")}
            className={cn(
              "flex flex-col items-center justify-center min-h-[46px] py-1 rounded-xl transition-all cursor-pointer select-none",
              activeSection === "kantin"
                ? "text-[#5CC0F7]"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Store className="w-5 h-5" />
            <span
              className={cn(
                "text-[10px] font-heading mt-0.5 leading-none",
                activeSection === "kantin" ? "font-bold text-[#5CC0F7]" : "font-medium"
              )}
            >
              Kantin
            </span>
            {activeSection === "kantin" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CC0F7] mt-0.5" />
            )}
          </motion.button>

          {/* Tab 4: FAQ */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => handleSmoothScroll(e, "faq")}
            className={cn(
              "flex flex-col items-center justify-center min-h-[46px] py-1 rounded-xl transition-all cursor-pointer select-none",
              activeSection === "faq"
                ? "text-[#5CC0F7]"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <HelpCircle className="w-5 h-5" />
            <span
              className={cn(
                "text-[10px] font-heading mt-0.5 leading-none",
                activeSection === "faq" ? "font-bold text-[#5CC0F7]" : "font-medium"
              )}
            >
              FAQ
            </span>
            {activeSection === "faq" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CC0F7] mt-0.5" />
            )}
          </motion.button>

          {/* Tab 5: Portal */}
          <Link
            href="/login"
            className="flex flex-col items-center justify-center min-h-[46px] py-1 rounded-xl transition-all cursor-pointer select-none text-slate-500 hover:text-[#5CC0F7] active:scale-95"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-[10px] font-heading font-medium mt-0.5 leading-none">
              Portal
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
