"use client"

import React, { useState } from "react"
import {
  GitBranch,
  ArrowRight,
  Lock,
  Layers,
  FileText,
  Server,
  Database,
  Cpu,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact } from "@/types/evidence"
import { truncateHash } from "@/lib/formatters"

interface ProvenanceChainProps {
  evidence: EvidenceArtifact
  merkleRoot: string
}

interface ChainNode {
  id: string
  type: string
  label: string
  identifier: string
  hash: string
  status: string
  details: string
  icon: React.ReactNode
}

export function ProvenanceChain({ evidence, merkleRoot }: ProvenanceChainProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-evidence")

  const nodes: ChainNode[] = [
    {
      id: "node-inv",
      type: "INVESTIGATION",
      label: "Originating Case",
      identifier: evidence.investigationId,
      hash: truncateHash(merkleRoot, 6, 6),
      status: "SEALED",
      details: "Top-level forensic intent specification approved for multi-endpoint collection.",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: "node-ir",
      type: "JOCKY_IR",
      label: "Platform AST",
      identifier: "v1.0.0-jocky-ir",
      hash: truncateHash(evidence.chainHash, 6, 6),
      status: "COMPILED",
      details: "Deterministic intermediate representation defining required telemetry scopes.",
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    {
      id: "node-profile",
      type: "EXECUTION_PROFILE",
      label: "Adaptive Profile",
      identifier: `${evidence.executionProfileId} (${evidence.executionProfileName})`,
      hash: truncateHash(evidence.sha256, 6, 6),
      status: "DISPATCHED",
      details: `Safe collection sequence mapped through ${evidence.collector} adapter.`,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "node-endpoint",
      type: "ENDPOINT",
      label: "Source Host",
      identifier: `${evidence.endpointHostname} (${evidence.endpointId})`,
      hash: truncateHash(evidence.sha256, 6, 6),
      status: "CAPTURED",
      details: `Acquired directly on host node at ${evidence.sourcePath}.`,
      icon: <Server className="w-3.5 h-3.5" />,
    },
    {
      id: "node-evidence",
      type: "EVIDENCE",
      label: "Raw Artifact",
      identifier: evidence.id,
      hash: truncateHash(evidence.sha256, 8, 8),
      status: "NORMALIZED",
      details: `${evidence.name} (${evidence.evidenceClass}) sealed into leaf #${evidence.merkleLeafIndex}.`,
      icon: <Database className="w-3.5 h-3.5" />,
    },
    {
      id: "node-seal",
      type: "SHA256_SEAL",
      label: "Integrity Seal",
      identifier: "SHA-256",
      hash: truncateHash(evidence.sha256, 8, 8),
      status: "VERIFIED",
      details: "Cryptographic digest binding the bitstream to prevent alteration.",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: "node-merkle",
      type: "MERKLE_BLOCK",
      label: "NVPL Merkle Block",
      identifier: `Leaf #${evidence.merkleLeafIndex}`,
      hash: truncateHash(merkleRoot, 8, 8),
      status: "SEALED",
      details: "Cryptographically bound into the contiguous append-only provenance block.",
      icon: <Lock className="w-3.5 h-3.5" />,
    },
  ]

  const activeNode = nodes.find((n) => n.id === selectedNodeId) ?? nodes[4]

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            PROVENANCE CHAIN & EVIDENCE LINEAGE // {evidence.id}
          </span>
        </div>
        <Badge variant="cyber">NVPL-CHAIN LOCKED</Badge>
      </div>

      {/* Horizontal Flow Container */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 min-w-[780px] p-2 bg-zinc-50 border-2 border-black">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id

            return (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-2 border-2 border-black text-left transition-all cursor-pointer flex-1 min-w-[105px] ${
                    isSelected
                      ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000] -translate-y-0.5"
                      : "bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-black uppercase text-zinc-500 mb-1">
                    <span className="flex items-center gap-1">
                      {node.icon}
                      <span>{node.type.slice(0, 8)}</span>
                    </span>
                    <span className="text-emerald-700">{node.status}</span>
                  </div>

                  <div className="text-[10px] font-black text-black truncate">
                    {node.label}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-600 truncate mt-0.5">
                    {node.identifier}
                  </div>
                </button>

                {index < nodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-black shrink-0" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Selected Node Details Box */}
      <div className="p-3 border-2 border-black bg-amber-50 space-y-1.5 text-xs font-bold">
        <div className="flex items-center justify-between border-b border-black pb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-black text-amber-300 px-1.5 py-0.5">
              {activeNode.type}
            </span>
            <span className="text-black font-black">{activeNode.label}</span>
          </div>
          <span className="font-mono text-zinc-600 text-[10px]">
            Digest: {activeNode.hash}
          </span>
        </div>

        <p className="text-zinc-800 text-[11px] leading-relaxed">
          {activeNode.details}
        </p>

        <div className="text-[10px] text-zinc-500 font-mono pt-0.5">
          Identifier: <span className="text-black font-bold">{activeNode.identifier}</span>
        </div>
      </div>
    </div>
  )
}
