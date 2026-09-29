"use client"

import { Search, RotateCcw } from "lucide-react"
import { InvestigationStatus, InvestigationSeverity, InvestigationCategory } from "@/types/investigation"

interface InvestigationFiltersProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  statusFilter: InvestigationStatus | "ALL"
  onStatusChange: (status: InvestigationStatus | "ALL") => void
  severityFilter: InvestigationSeverity | "ALL"
  onSeverityChange: (severity: InvestigationSeverity | "ALL") => void
  categoryFilter: InvestigationCategory | "ALL"
  onCategoryChange: (category: InvestigationCategory | "ALL") => void
  onReset: () => void
}

const CATEGORIES: InvestigationCategory[] = [
  "RANSOMWARE ANALYSIS",
  "LATERAL MOVEMENT",
  "CREDENTIAL ACCESS",
  "PERSISTENCE ANALYSIS",
  "NETWORK ANOMALY",
  "ENDPOINT TRIAGE",
  "ROOTKIT / KERNEL AUDIT",
  "CUSTOM FORENSIC QUERY",
]

export function InvestigationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryChange,
  onReset,
}: InvestigationFiltersProps) {
  return (
    <div className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-3 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search campaigns by case code, intent, title, or target host..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border-2 border-black bg-zinc-50 font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Status quick tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 min-w-0 max-w-full">
          {(["ALL", "IN_PROGRESS", "READY", "COMPLETED", "DRAFT"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`px-2.5 py-1.5 font-bold border-2 border-black transition-all text-[11px] whitespace-nowrap ${
                statusFilter === st
                  ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary filter selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t-2 border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="font-black text-zinc-600 uppercase text-[10px] shrink-0">Priority:</span>
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value as InvestigationSeverity | "ALL")}
            className="w-full p-1.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none text-[11px]"
          >
            <option value="ALL">ALL PRIORITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-zinc-600 uppercase text-[10px] shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as InvestigationCategory | "ALL")}
            className="w-full p-1.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none text-[11px]"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-start sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white hover:bg-zinc-100 text-black font-bold shadow-[2px_2px_0px_#000] text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET FILTERS</span>
          </button>
        </div>
      </div>
    </div>
  )
}
