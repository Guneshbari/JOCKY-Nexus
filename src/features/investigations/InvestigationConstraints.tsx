"use client"

import { Sliders } from "lucide-react"
import { InvestigationConstraints as ConstraintsType, InvestigationBuilderDraft } from "@/types/investigation"

interface InvestigationConstraintsProps {
  constraints: ConstraintsType
  adaptiveProfile: string
  onChange: (updates: Partial<InvestigationBuilderDraft>) => void
  onNext: () => void
  onBack: () => void
}

export function InvestigationConstraints({
  constraints,
  adaptiveProfile,
  onChange,
  onNext,
  onBack,
}: InvestigationConstraintsProps) {
  const toggleConstraint = (key: keyof ConstraintsType) => {
    onChange({
      constraints: {
        ...constraints,
        [key]: !constraints[key],
      },
    })
  }

  const handleSelectChange = (key: keyof ConstraintsType, value: unknown) => {
    onChange({
      constraints: {
        ...constraints,
        [key]: value,
      },
    })
  }

  const toggleItems = [
    {
      key: "volatileEvidencePriority" as const,
      label: "Volatile Evidence Priority",
      desc: "Prioritize LSASS, process handles, and active network connections before disk artifacts.",
      activeColor: "bg-amber-300",
    },
    {
      key: "minimalEndpointImpact" as const,
      label: "Minimal Endpoint Impact",
      desc: "Throttle agent telemetry collection to <5% CPU usage and enforce memory bounding.",
      activeColor: "bg-emerald-300",
    },
    {
      key: "evidenceIntegrityRequired" as const,
      label: "Cryptographic Evidence Sealing",
      desc: "Mandate SHA-256 calculation and Merkle root anchoring in NVPL tamper-evident ledger.",
      activeColor: "bg-purple-300",
    },
    {
      key: "networkCollectionEnabled" as const,
      label: "Live Network Trace & Socket Tap",
      desc: "Capture active socket states and stream suspicious external egress flows.",
      activeColor: "bg-cyan-300",
    },
    {
      key: "memoryAnalysisRequired" as const,
      label: "In-Memory Deep Dissection",
      desc: "Scan process memory space for unbacked executable allocations (RWX sections).",
      activeColor: "bg-rose-300",
    },
  ]

  return (
    <div className="space-y-5 font-mono text-xs">
      <div className="p-3 border-2 border-black bg-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-black" />
          <span className="font-black text-black uppercase">
            Forensic Execution Policy & Constraints
          </span>
        </div>
        <span className="text-[10px] font-bold text-zinc-600 bg-white px-2 py-0.5 border border-black">
          SAFE SIMULATION RULES
        </span>
      </div>

      {/* Safety & Execution Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {toggleItems.map((item) => {
          const isActive = constraints[item.key]
          return (
            <div
              key={item.key}
              role="switch"
              aria-checked={isActive}
              tabIndex={0}
              onClick={() => toggleConstraint(item.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleConstraint(item.key)
                }
              }}
              className={`p-3 border-2 border-black cursor-pointer transition-all flex items-start justify-between gap-3 select-none ${
                isActive
                  ? `${item.activeColor} shadow-[3px_3px_0px_#000] -translate-y-0.5`
                  : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000]"
              }`}
            >
              <div className="space-y-0.5">
                <div className="font-black text-black">{item.label}</div>
                <div className="text-[10px] text-zinc-700 font-bold leading-tight">
                  {item.desc}
                </div>
              </div>

              <div
                className={`w-9 h-5 border-2 border-black p-0.5 flex items-center shrink-0 transition-colors ${
                  isActive ? "bg-black justify-end" : "bg-zinc-200 justify-start"
                }`}
              >
                <div className={`w-3.5 h-3.5 border border-black ${isActive ? "bg-white" : "bg-black"}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Policy Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="space-y-1">
          <label htmlFor="quarantine-mode" className="block font-black uppercase text-zinc-700 text-[11px]">
            Restricted Node Handling
          </label>
          <select
            id="quarantine-mode"
            value={constraints.restrictedEndpointHandling}
            onChange={(e) =>
              handleSelectChange("restrictedEndpointHandling", e.target.value as unknown)
            }
            className="w-full p-2 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white"
          >
            <option value="ALLOW_AGENT_TUNNEL">ALLOW AGENT TUNNEL (Standard)</option>
            <option value="STRICT_QUARANTINE">STRICT QUARANTINE (Deny All)</option>
            <option value="PASSIVE_ONLY">PASSIVE ONLY (Read Only)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="duration-limit" className="block font-black uppercase text-zinc-700 text-[11px]">
            Max Execution Window
          </label>
          <select
            id="duration-limit"
            value={constraints.maxInvestigationDuration}
            onChange={(e) =>
              handleSelectChange("maxInvestigationDuration", e.target.value as unknown)
            }
            className="w-full p-2 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white"
          >
            <option value="15m">15 Minutes (Rapid Triage)</option>
            <option value="30m">30 Minutes (Balanced)</option>
            <option value="1h">1 Hour (Deep Inspection)</option>
            <option value="4h">4 Hours (Full Acquisition)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="adaptive-profile-select" className="block font-black uppercase text-zinc-700 text-[11px]">
            Adaptive Execution Profile
          </label>
          <select
            id="adaptive-profile-select"
            value={adaptiveProfile}
            onChange={(e) => onChange({ adaptiveProfile: e.target.value })}
            className="w-full p-2 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white"
          >
            <option value="PROFILE-A (VOLATILE TRIAGE)">PROFILE-A (VOLATILE TRIAGE)</option>
            <option value="PROFILE-B (CONTAINMENT & MFT)">PROFILE-B (CONTAINMENT & MFT)</option>
            <option value="PROFILE-C (eBPF ROOTKIT AUDIT)">PROFILE-C (eBPF ROOTKIT AUDIT)</option>
          </select>
        </div>
      </div>

      {/* Navigation action */}
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
          className="px-5 py-2.5 border-2 border-black bg-amber-400 text-black font-black uppercase shadow-[3px_3px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
        >
          Review & Generate JOCKY IR →
        </button>
      </div>
    </div>
  )
}
