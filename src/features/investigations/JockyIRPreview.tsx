"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight, Layers } from "lucide-react"
import { InvestigationBuilderDraft } from "@/types/investigation"
import { generateJockyIR } from "@/lib/jockyGenerator"
import { Badge } from "@/components/ui/badge"

interface JockyIRPreviewProps {
  draft: InvestigationBuilderDraft
}

export function JockyIRPreview({ draft }: JockyIRPreviewProps) {
  const [viewMode, setViewMode] = useState<"TREE" | "JSON">("TREE")
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    FORENSIC_INTENT: true,
    TARGET: true,
    EVIDENCE_REQUIREMENTS: true,
    CONSTRAINTS: false,
    EXECUTION_POLICY: false,
    PROVENANCE_POLICY: false,
  })

  const ir = generateJockyIR(draft)

  const toggleNode = (key: string) => {
    setExpandedNodes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const nodes = [
    {
      key: "FORENSIC_INTENT",
      label: "FORENSIC_INTENT",
      type: "IntentNode",
      badge: "ROOT",
      data: {
        intent_literal: ir.intent,
        category: ir.category,
        priority: draft.priority,
      },
    },
    {
      key: "TARGET",
      label: "TARGET_TOPOLOGY",
      type: "EndpointNodeSet",
      badge: `${ir.target.length} HOSTS`,
      data: {
        endpoints: ir.target,
        quarantine_handling: draft.constraints.restrictedEndpointHandling,
      },
    },
    {
      key: "EVIDENCE_REQUIREMENTS",
      label: "EVIDENCE_REQUIREMENTS",
      type: "ArtifactDescriptorSet",
      badge: `${ir.evidence.length} CLASSES`,
      data: {
        required_classes: ir.evidence,
      },
    },
    {
      key: "CONSTRAINTS",
      label: "EXECUTION_CONSTRAINTS",
      type: "ConstraintSet",
      badge: `${ir.constraints.length} RULES`,
      data: {
        rules: ir.constraints,
      },
    },
    {
      key: "EXECUTION_POLICY",
      label: "EXECUTION_POLICY",
      type: "AdaptivePolicyDescriptor",
      badge: "DYNAMIC",
      data: {
        policy: ir.execution_policy,
        adaptive_routing_enabled: ir.adaptive_routing_enabled,
      },
    },
    {
      key: "PROVENANCE_POLICY",
      label: "PROVENANCE_POLICY",
      type: "MerkleChainSpec",
      badge: "SEALED",
      data: {
        provenance_policy: ir.provenance_policy,
        tree_height: ir.merkle_tree_height,
        hash_function: "SHA-256",
      },
    },
  ]

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden flex flex-col font-mono text-xs">
      {/* Header Bar */}
      <div className="p-3 border-b-3 border-black bg-zinc-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-white">
            PLATFORM-INDEPENDENT JOCKY IR
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("TREE")}
            className={`px-2 py-0.5 text-[10px] font-bold border border-zinc-600 transition-colors ${
              viewMode === "TREE" ? "bg-amber-400 text-black font-black" : "bg-zinc-700 text-white hover:bg-zinc-600"
            }`}
          >
            IR TREE
          </button>
          <button
            type="button"
            onClick={() => setViewMode("JSON")}
            className={`px-2 py-0.5 text-[10px] font-bold border border-zinc-600 transition-colors ${
              viewMode === "JSON" ? "bg-amber-400 text-black font-black" : "bg-zinc-700 text-white hover:bg-zinc-600"
            }`}
          >
            RAW JSON
          </button>
        </div>
      </div>

      {/* Content View */}
      {viewMode === "TREE" ? (
        <div className="p-4 space-y-2 bg-zinc-50 max-h-[360px] overflow-y-auto">
          <div className="text-[10px] text-zinc-500 font-bold mb-2">
            SCHEMA: <span className="text-black font-black">{ir.schemaVersion}</span> (Simulated Rust/JSON IR)
          </div>

          <div className="space-y-1.5">
            {nodes.map((node) => {
              const isExpanded = expandedNodes[node.key]
              return (
                <div key={node.key} className="border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                  <button
                    type="button"
                    onClick={() => toggleNode(node.key)}
                    className="w-full p-2.5 flex items-center justify-between text-left hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-black" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                      <span className="font-black text-black">{node.label}</span>
                      <span className="text-[10px] text-zinc-500">:: {node.type}</span>
                    </div>
                    <Badge variant="neutral" className="text-[9px]">
                      {node.badge}
                    </Badge>
                  </button>

                  {isExpanded && (
                    <div className="p-3 border-t-2 border-zinc-200 bg-zinc-900 text-emerald-400 text-[11px] overflow-x-auto">
                      <pre className="font-mono">{JSON.stringify(node.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-zinc-950 text-emerald-400 font-mono text-[11px] max-h-[360px] overflow-y-auto overflow-x-auto">
          <pre>{JSON.stringify(ir, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
