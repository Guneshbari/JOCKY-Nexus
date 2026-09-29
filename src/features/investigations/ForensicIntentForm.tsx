"use client"

import { Sparkles } from "lucide-react"
import { InvestigationBuilderDraft, InvestigationCategory, InvestigationSeverity } from "@/types/investigation"

interface ForensicIntentFormProps {
  draft: InvestigationBuilderDraft
  onChange: (updates: Partial<InvestigationBuilderDraft>) => void
  onNext: () => void
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

const INTENT_PRESETS = [
  {
    name: "Kerberos TGS Ticket Extraction",
    category: "CREDENTIAL ACCESS" as InvestigationCategory,
    priority: "CRITICAL" as InvestigationSeverity,
    intent: "Interrogate suspicious Ticket Granting Service requests on DC-PROD-PRIMARY and correlate with outbound lateral staging on FIN-WS-44.",
  },
  {
    name: "Ransomware ShadowCopy Canary Hunt",
    category: "RANSOMWARE ANALYSIS" as InvestigationCategory,
    priority: "HIGH" as InvestigationSeverity,
    intent: "Detect volume shadow copy deletion commands and scan for rapid unbacked file encryption across production file shares.",
  },
  {
    name: "eBPF Syscall Hook Dissection",
    category: "ROOTKIT / KERNEL AUDIT" as InvestigationCategory,
    priority: "CRITICAL" as InvestigationSeverity,
    intent: "Inspect kernel tracepoint handlers and verify integrity of sys_enter_execve probes on container worker nodes.",
  },
]

export function ForensicIntentForm({ draft, onChange, onNext }: ForensicIntentFormProps) {
  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Quick Intent Presets */}
      <div className="p-3 border-2 border-black bg-amber-100 space-y-2 shadow-[2px_2px_0px_#000]">
        <div className="flex items-center gap-1.5 font-black text-black text-xs uppercase">
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span>Quick Forensic Intent Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onChange({
                  name: preset.name,
                  category: preset.category,
                  priority: preset.priority,
                  intent: preset.intent,
                })
              }}
              className="px-2.5 py-1 text-[11px] font-bold border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-left"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="intent-title" className="block font-black uppercase text-zinc-700">
            Investigation Name
          </label>
          <input
            id="intent-title"
            type="text"
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Cobalt Strike Lateral Beacon Hunt"
            className="w-full p-2.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="intent-case" className="block font-black uppercase text-zinc-700">
            Case Identifier
          </label>
          <input
            id="intent-case"
            type="text"
            value={draft.caseName}
            onChange={(e) => onChange({ caseName: e.target.value })}
            placeholder="e.g. CASE-2026-LAT-04"
            className="w-full p-2.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="intent-category" className="block font-black uppercase text-zinc-700">
            Investigation Category
          </label>
          <select
            id="intent-category"
            value={draft.category}
            onChange={(e) => onChange({ category: e.target.value as InvestigationCategory })}
            className="w-full p-2.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="intent-priority" className="block font-black uppercase text-zinc-700">
            Forensic Priority
          </label>
          <select
            id="intent-priority"
            value={draft.priority}
            onChange={(e) => onChange({ priority: e.target.value as InvestigationSeverity })}
            className="w-full p-2.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
          >
            <option value="CRITICAL">CRITICAL (Tier-0 Intrusion)</option>
            <option value="HIGH">HIGH (Active Anomaly)</option>
            <option value="MEDIUM">MEDIUM (Suspicious Process)</option>
            <option value="LOW">LOW (Proactive Audit)</option>
          </select>
        </div>
      </div>

      {/* Forensic Objective Statement */}
      <div className="space-y-1">
        <label htmlFor="intent-statement" className="block font-black uppercase text-zinc-700">
          Forensic Intent & Objective (Natural Language)
        </label>
        <textarea
          id="intent-statement"
          rows={3}
          value={draft.intent}
          onChange={(e) => onChange({ intent: e.target.value })}
          placeholder="Specify what should be investigated and verified across target nodes..."
          className="w-full p-2.5 border-2 border-black bg-zinc-50 font-bold text-black focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 leading-relaxed"
        />
        <p className="text-[10px] text-zinc-500 font-bold">
          💡 The JOCKY compiler will convert this natural forensic intent into an adaptive execution graph.
        </p>
      </div>

      {/* Navigation action */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 border-2 border-black bg-amber-400 text-black font-black uppercase shadow-[3px_3px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
        >
          Proceed to Evidence Requirements →
        </button>
      </div>
    </div>
  )
}
