"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for combining classes

interface BrandDropdownProps {
  initials: string;
  brandName: string;
  className?: string;
  onToggle?: () => void;
}

export function BrandDropdown({ initials, brandName, className, onToggle }: BrandDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle?.();
  };

  return (
    <button onClick={handleToggle} className={cn("my-[22px] mx-[16px] w-[180px] bg-white rounded-[12px] shadow-sm border border-gray-100 hover:bg-gray-50/50 transition-colors", className)}>
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#309E96] rounded-lg flex items-center justify-center text-white text-[11px] font-medium">{initials}</div>
          <span className="font-semibold text-gray-800 text-[14px]">{brandName}</span>
        </div>
        <div className="flex flex-col -space-y-1">
          <ChevronUp className="w-3 h-3 text-[#031B15]" />
          <ChevronDown className="w-3 h-3 text-[#031B15]" />
        </div>
      </div>
    </button>
  );
}
