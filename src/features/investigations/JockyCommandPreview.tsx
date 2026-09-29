"use client"

import React, { useState } from "react"
import { Copy, Check, Terminal } from "lucide-react"
import { InvestigationBuilderDraft } from "@/types/investigation"
import { generateJockyCommand, generateJockySpecification } from "@/lib/jockyGenerator"

interface JockyCommandPreviewProps {
  draft: InvestigationBuilderDraft
}

export function JockyCommandPreview({ draft }: JockyCommandPreviewProps) {
  const [copied, setCopied] = useState(false)
  const command = generateJockyCommand(draft)
  const spec = generateJockySpecification(draft)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="p-3 border-b-3 border-black bg-zinc-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
            JOCKY DSL SIMULATED COMMAND SPEC
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>COPY DSL</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted DSL Command Box */}
      <div className="p-4 bg-black text-white font-mono text-[11px] leading-relaxed border-b-2 border-black overflow-x-auto selection:bg-amber-400 selection:text-black">
        <pre className="text-zinc-300">
          <span className="text-amber-400 font-black">INVESTIGATE</span>{" "}
          <span className="text-cyan-300">targets:</span>[
          <span className="text-white font-bold">{spec.targetBlock.join(", ") || "ALL"}</span>]
          {"\n  "}
          <span className="text-amber-400 font-black">FOR</span>{" "}
          <span className="text-cyan-300">intent:</span>
          <span className="text-emerald-300 font-bold">&quot;{spec.intentBlock}&quot;</span>
          {"\n  "}
          <span className="text-amber-400 font-black">CATEGORY</span>{" "}
          <span className="text-purple-300 font-bold">{draft.category.replace(/\s+/g, "_")}</span>
          {"\n  "}
          <span className="text-amber-400 font-black">ANALYZE</span> [
          <span className="text-cyan-200">{draft.evidenceRequirements.join(", ") || "default"}</span>]
          {"\n  "}
          <span className="text-amber-400 font-black">CONSTRAIN</span> [
          <span className="text-yellow-200">{spec.constraintBlock.join("; ")}</span>]
          {"\n  "}
          <span className="text-amber-400 font-black">REQUIRE</span>{" "}
          <span className="text-emerald-400 font-bold">integrity:sha256_sealed</span>
          {"\n  "}
          <span className="text-amber-400 font-black">PROFILE</span>{" "}
          <span className="text-rose-400 font-bold">adaptive:&quot;{draft.adaptiveProfile}&quot;</span>
        </pre>
      </div>

      {/* Structured Blocks Breakdown */}
      <div className="p-4 space-y-3 bg-zinc-50 font-mono text-xs">
        <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
          Compiled Intent Spec Blocks:
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 border border-black bg-white">
            <span className="text-[10px] text-zinc-500 font-black block">INTENT TARGETS</span>
            <span className="font-bold text-black">{spec.targetBlock.length} Endpoints Selected</span>
          </div>

          <div className="p-2 border border-black bg-white">
            <span className="text-[10px] text-zinc-500 font-black block">EVIDENCE SCOPE</span>
            <span className="font-bold text-black">{spec.evidenceBlock.length} Artifact Classes</span>
          </div>

          <div className="p-2 border border-black bg-white">
            <span className="text-[10px] text-zinc-500 font-black block">EXECUTION STRATEGY</span>
            <span className="font-bold text-black truncate block">{spec.executionPolicy}</span>
          </div>

          <div className="p-2 border border-black bg-white">
            <span className="text-[10px] text-zinc-500 font-black block">PROVENANCE SEAL</span>
            <span className="font-bold text-emerald-700 truncate block">{spec.provenancePolicy}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
