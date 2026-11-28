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
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={disableBackdropClick ? undefined : onClose}
      />

      {/* Modal Box */}
      <div
        className={cn(
          "relative w-full rounded-3xl bg-white p-6 shadow-xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-hidden flex flex-col",
          maxWidths[maxWidth]
        )}
      >
        {/* Custom scrollbar */}
        <style jsx>{`
          .modal-content::-webkit-scrollbar {
            width: 6px;
          }
          .modal-content::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .modal-content::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .modal-content::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
        
        <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100 shrink-0">
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
        <div className="modal-content overflow-y-auto flex-1 pr-2 -mr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
