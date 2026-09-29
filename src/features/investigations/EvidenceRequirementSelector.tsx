"use client"

import { Check, Database } from "lucide-react"
import { EvidenceRequirement } from "@/types/investigation"

interface EvidenceRequirementSelectorProps {
  selectedEvidence: EvidenceRequirement[]
  onChange: (evidence: EvidenceRequirement[]) => void
  onNext: () => void
  onBack: () => void
}

const ALL_REQUIREMENTS: { name: EvidenceRequirement; description: string; icon: string }[] = [
  { name: "Process activity", description: "Process trees, handle tables, command-line arguments", icon: "⚙️" },
  { name: "Network connections", description: "Socket states, listening ports, remote connections", icon: "🌐" },
  { name: "Services", description: "System services, daemon configs, autostart entries", icon: "🛠️" },
  { name: "Persistence artifacts", description: "Scheduled tasks, Registry Run keys, systemd timers", icon: "📌" },
  { name: "Authentication events", description: "Logon sessions, Kerberos TGS/TGT, PAM tokens", icon: "🔑" },
  { name: "System logs", description: "Windows Security Event Logs, journald, syslog", icon: "📜" },
  { name: "File metadata", description: "$MFT journals, timestamp anomalies, cryptographic hashes", icon: "📁" },
  { name: "Memory indicators", description: "Injected threads, RWX memory sections, hook detectors", icon: "🧠" },
  { name: "Container activity", description: "Namespace maps, cgroup stats, container pod telemetry", icon: "📦" },
  { name: "Kernel / driver inventory", description: "Loaded kernel modules, eBPF tracepoints, filter drivers", icon: "🛡️" },
  { name: "DNS activity", description: "DNS client resolver cache, outbound query telemetry", icon: "📡" },
  { name: "User activity", description: "User session duration, terminal history, shell commands", icon: "👤" },
]

export function EvidenceRequirementSelector({
  selectedEvidence,
  onChange,
  onNext,
  onBack,
}: EvidenceRequirementSelectorProps) {
  const toggleRequirement = (req: EvidenceRequirement) => {
    if (selectedEvidence.includes(req)) {
      onChange(selectedEvidence.filter((r) => r !== req))
    } else {
      onChange([...selectedEvidence, req])
    }
  }

  const selectAll = () => onChange(ALL_REQUIREMENTS.map((r) => r.name))
  const selectRecommended = () =>
    onChange([
      "Process activity",
      "Network connections",
      "Authentication events",
      "Memory indicators",
      "Persistence artifacts",
    ])

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Selector Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-2 border-black bg-zinc-100">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-black" />
          <span className="font-black text-black uppercase">
            Selected Requirements ({selectedEvidence.length} / {ALL_REQUIREMENTS.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectRecommended}
            className="px-2.5 py-1 text-[11px] font-bold border-2 border-black bg-white hover:bg-amber-200 transition-colors shadow-[1px_1px_0px_#000]"
          >
            ⚡ Select Recommended
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="px-2.5 py-1 text-[11px] font-bold border-2 border-black bg-white hover:bg-zinc-200 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2.5 py-1 text-[11px] font-bold border-2 border-black bg-white hover:bg-rose-100 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid of Evidence Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_REQUIREMENTS.map((item) => {
          const isSelected = selectedEvidence.includes(item.name)
          return (
            <div
              key={item.name}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => toggleRequirement(item.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleRequirement(item.name)
                }
              }}
              className={`p-3 border-2 border-black cursor-pointer transition-all flex items-start justify-between gap-3 select-none ${
                isSelected
                  ? "bg-amber-300 shadow-[3px_3px_0px_#000] -translate-y-0.5"
                  : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000]"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-black text-black">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <p className="text-[10px] text-zinc-600 font-bold leading-tight">
                  {item.description}
                </p>
              </div>

              <div
                className={`w-5 h-5 border-2 border-black flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-black text-amber-300" : "bg-white"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border-2 border-black bg-white text-black font-bold uppercase hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedEvidence.length === 0}
          className="px-5 py-2.5 border-2 border-black bg-amber-400 text-black font-black uppercase shadow-[3px_3px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          Proceed to Target Endpoints →
        </button>
      </div>
    </div>
  )
}
