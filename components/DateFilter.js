// components/DateFilter.js
"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDateFilter } from "@/hooks/useDateFilter";
import { MONTHS } from "@/utils/dateUtils";

export default function DateFilter({ onMonthChange, onYearChange }) {
  const {
    selectedMonth,
    selectedYear,
    isMonthOpen,
    isYearOpen,
    years,
    setIsMonthOpen,
    setIsYearOpen,
    handleMonthChange,
    handleYearChange,
  } = useDateFilter(onMonthChange, onYearChange);

  return (
    <div className="flex justify-center gap-4 py-6">
      {/* Filtre Mois */}
      <div className="w-48">
        <DropdownMenu open={isMonthOpen} onOpenChange={setIsMonthOpen}>
          <DropdownMenuTrigger className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center justify-between hover:border-gray-300 focus:outline-none">
            <span className="text-gray-700">{selectedMonth || "Mois"}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-0">
            {MONTHS.map((month) => (
              <DropdownMenuItem
                key={month}
                onClick={() => handleMonthChange(month)}
                className={`px-4 py-2 cursor-pointer focus:bg-gray-100 focus:text-gray-900 ${
                  selectedMonth === month
                    ? "bg-gray-100 flex items-center justify-between"
                    : ""
                }`}
              >
                <span>{month}</span>
                {selectedMonth === month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filtre Année */}
      <div className="w-36">
        <DropdownMenu open={isYearOpen} onOpenChange={setIsYearOpen}>
          <DropdownMenuTrigger className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center justify-between hover:border-gray-300 focus:outline-none">
            <span className="text-gray-700">{selectedYear || "Année"}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-0">
            {years.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => handleYearChange(year)}
                className={`px-4 py-2 cursor-pointer focus:bg-gray-100 focus:text-gray-900 ${
                  selectedYear === year
                    ? "bg-gray-100 flex items-center justify-between"
                    : ""
                }`}
              >
                <span>{year}</span>
                {selectedYear === year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
