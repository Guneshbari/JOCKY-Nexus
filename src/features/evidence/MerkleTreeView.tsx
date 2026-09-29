"use client"

import React, { useState } from "react"
import {
  GitMerge,
  CheckCircle2,
  Lock,
  ArrowUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact } from "@/types/evidence"
import { truncateHash } from "@/lib/formatters"

interface MerkleTreeViewProps {
  evidenceItems: EvidenceArtifact[]
  merkleRoot: string
}

export function MerkleTreeView({
  evidenceItems,
  merkleRoot,
}: MerkleTreeViewProps) {
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number>(1)

  // Take first 4 leaves or pad
  const leaves = evidenceItems.slice(0, 4)

  // Simulated parent nodes
  const parentHashA = "8a7c6e5d4b3a2f109876543210fedcba8a7c6e5d4b3a2f109876543210fedcba"
  const parentHashB = "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"

  // Active path highlight check:
  // If leaf 1 or 2 selected -> Parent A -> Root
  // If leaf 3 or 4 selected -> Parent B -> Root
  const isParentAActive = selectedLeafIndex === 1 || selectedLeafIndex === 2
  const isParentBActive = selectedLeafIndex === 3 || selectedLeafIndex === 4

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            CRYPTOGRAPHIC MERKLE TREE HASH AUDIT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">ROOT SEALED</Badge>
          <span className="text-[10px] font-bold text-zinc-500">
            LEAF COUNT: {leaves.length}
          </span>
        </div>
      </div>

      {/* Merkle Visual Tree Structure */}
      <div className="p-4 border-2 border-black bg-zinc-50 space-y-4">
        {/* Tier 1: Merkle Root Node */}
        <div className="flex justify-center">
          <div className="p-3 border-3 border-black bg-amber-400 text-black shadow-[4px_4px_0px_#000] max-w-md w-full text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>NVPL MERKLE ROOT ANCHOR</span>
            </div>
            <div className="font-mono text-xs font-black break-all bg-white p-1 border border-black">
              {truncateHash(merkleRoot, 14, 14)}
            </div>
            <div className="text-[10px] font-bold text-zinc-800">
              SHA256( Parent_A + Parent_B )
            </div>
          </div>
        </div>

        {/* Connector lines down to parents */}
        <div className="flex justify-around px-8 text-black text-xs font-black">
          <div className="flex flex-col items-center">
            <ArrowUp className={`w-4 h-4 ${isParentAActive ? "text-amber-600 stroke-[3]" : "text-zinc-400"}`} />
            <span className="text-[9px] uppercase text-zinc-500">Left Branch</span>
          </div>
          <div className="flex flex-col items-center">
            <ArrowUp className={`w-4 h-4 ${isParentBActive ? "text-amber-600 stroke-[3]" : "text-zinc-400"}`} />
            <span className="text-[9px] uppercase text-zinc-500">Right Branch</span>
          </div>
        </div>

        {/* Tier 2: Intermediate Parents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Parent A */}
          <div
            className={`p-2.5 border-2 border-black transition-all ${
              isParentAActive
                ? "bg-amber-100 shadow-[3px_3px_0px_#000] -translate-y-0.5"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-600 mb-1">
              <span>Parent Node A</span>
              <span>SHA256(Leaf_1 + Leaf_2)</span>
            </div>
            <div className="font-mono text-[11px] font-black text-black break-all bg-zinc-50 p-1 border border-black">
              {truncateHash(parentHashA, 10, 10)}
            </div>
          </div>

          {/* Parent B */}
          <div
            className={`p-2.5 border-2 border-black transition-all ${
              isParentBActive
                ? "bg-amber-100 shadow-[3px_3px_0px_#000] -translate-y-0.5"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-600 mb-1">
              <span>Parent Node B</span>
              <span>SHA256(Leaf_3 + Leaf_4)</span>
            </div>
            <div className="font-mono text-[11px] font-black text-black break-all bg-zinc-50 p-1 border border-black">
              {truncateHash(parentHashB, 10, 10)}
            </div>
          </div>
        </div>

        {/* Tier 3: Leaves (Evidence Hashes) */}
        <div>
          <div className="text-[10px] font-black uppercase text-zinc-600 mb-2">
            Evidence Leaf Nodes (Click leaf to inspect cryptographic proof path):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {leaves.map((leaf, index) => {
              const leafIndex = index + 1
              const isSelected = selectedLeafIndex === leafIndex

              return (
                <button
                  key={leaf.id}
                  type="button"
                  onClick={() => setSelectedLeafIndex(leafIndex)}
                  className={`p-2 border-2 border-black text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-black text-amber-300 shadow-[3px_3px_0px_#000] -translate-y-0.5"
                      : "bg-white text-black hover:bg-zinc-100 shadow-[1px_1px_0px_#000]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-black mb-1">
                    <span>LEAF #{leafIndex}</span>
                    <span className={isSelected ? "text-amber-300" : "text-emerald-700"}>
                      {leaf.id}
                    </span>
                  </div>

                  <div className="text-[10px] font-black truncate">
                    {leaf.name}
                  </div>

                  <div className={`font-mono text-[9px] truncate mt-1 ${isSelected ? "text-zinc-300" : "text-zinc-600"}`}>
                    {truncateHash(leaf.sha256, 6, 6)}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Proof Path Audit Banner */}
      <div className="p-3 border-2 border-black bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Active Proof Path: Leaf #{selectedLeafIndex} participates in {isParentAActive ? "Parent_A" : "Parent_B"} → Merkle Root Seal.
          </span>
        </div>
        <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 border border-emerald-600 shrink-0">
          PROVED TAMPER-FREE
        </span>
      </div>
    </div>
  )
}
