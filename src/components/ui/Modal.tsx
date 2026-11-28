"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  showCloseButton = true,
  disableBackdropClick = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      // Lock body scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      // Unlock body scroll
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => {
        // Prevent scroll propagation to body
        e.stopPropagation();
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={disableBackdropClick ? undefined : onClose}
      />

      {/* Modal Box - No scrollbar, responsive with viewport units */}
      <div
        className={cn(
          "relative w-full rounded-3xl bg-white p-6 shadow-xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200",
          maxWidths[maxWidth]
        )}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
        onWheel={(e) => {
          // Allow scroll within modal, prevent propagation to backdrop/body
          e.stopPropagation();
        }}
      >
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-heading font-semibold text-slate-800">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
