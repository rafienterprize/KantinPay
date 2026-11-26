"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Utensils, Search, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AdminNavbarProps {
  pageTitle?: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onFilterClick?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminNavbar({
  pageTitle = "Panel Koperasi",
  searchTerm = "",
  onSearchChange,
  onFilterClick,
  actionButton,
}: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand Logo & Brand Name */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="KantinPay Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
            Kantin<span className="text-[#5CC0F7]">Pay</span>
          </span>
        </Link>
      </div>

      {/* Right Controls: Search, Filter, and Action Button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search bar */}
        <div className="w-44 sm:w-64 md:w-80">
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="h-10 py-1.5 text-xs rounded-2xl bg-slate-50 border-slate-200"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="rounded-2xl border-slate-200 text-xs px-3.5 h-10 gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">filter</span>
        </Button>

        {/* Action Button (e.g. Add Student / Add Tenant) */}
        {actionButton && (
          <Button
            variant="primary"
            size="sm"
            onClick={actionButton.onClick}
            className="rounded-2xl text-xs px-4 h-10 gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
