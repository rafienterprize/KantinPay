"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  icon,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    // Hide scrollbar for webkit browsers
    if (dropdownRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        .custom-select-dropdown::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        {/* Select Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border text-sm font-heading transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#5CC0F7]/30",
            disabled
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
              : isOpen
              ? "bg-white border-[#5CC0F7] text-slate-900 shadow-sm"
              : "bg-white border-[#D1D1D1] text-slate-900 hover:border-[#5CC0F7]/60"
          )}
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
            <span className={cn("font-medium", !selectedOption && "text-slate-400")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
            <div 
              ref={dropdownRef}
              className="custom-select-dropdown max-h-60 overflow-y-auto py-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-heading transition-colors",
                      isSelected
                        ? "bg-[#D6EFFF] text-[#0284c7] font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#0284c7]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
