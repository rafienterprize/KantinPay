import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    primary: "bg-[#D6EFFF] text-[#0284c7] border border-[#5CC0F7]/30",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-full font-medium",
    md: "text-xs px-2.5 py-1 rounded-full font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-heading tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
