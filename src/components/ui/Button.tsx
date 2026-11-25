import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5CC0F7]/40 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const variants = {
      primary:
        "bg-[#5CC0F7] text-white hover:bg-[#48b1eb] shadow-sm hover:shadow active:bg-[#3ba5df]",
      secondary:
        "bg-[#D6EFFF] text-[#1E293B] hover:bg-[#c2e5fc] active:bg-[#aeddfb]",
      outline:
        "border border-[#D1D1D1] bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/80",
      danger:
        "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-5 py-2.5 h-10 gap-2",
      lg: "text-base px-6 py-3.5 h-12 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
