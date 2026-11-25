import React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
}

export function PhoneMockup({
  children,
  className,
  screenClassName,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative w-[280px] sm:w-[310px] md:w-[325px] aspect-[388/800] select-none",
        className
      )}
    >
      {/* Screen Area (Behind the Frame) */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-white flex flex-col z-10",
          screenClassName
        )}
        style={{
          top: "1.75%",
          bottom: "1.75%",
          left: "4.38%",
          right: "4.38%",
          borderRadius: "38px",
        }}
      >
        {/* Status bar row aligned with the Dynamic Island */}
        <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-semibold text-slate-800 shrink-0 select-none z-10">
          <span>09:41</span>
          {/* Spacer for dynamic island */}
          <div className="w-20" />
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100%</span>
          </div>
        </div>

        {/* Dynamic Children Content inside Screen */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>

      {/* Frame Image Overlay on Top with Transparent Screen Window */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/phone-frame.png"
        alt="Phone Frame"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none drop-shadow-2xl"
        draggable={false}
      />
    </div>
  );
}
