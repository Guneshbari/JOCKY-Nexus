"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Database,
  GitBranch,
  Target,
  Download,
  Lock,
  ChevronDown,
  FileCheck2,
} from "lucide-react"
import { useInvestigationStore } from "@/store/investigationStore"
import { Badge } from "@/components/ui/badge"

import { EvidencePipeline } from "./EvidencePipeline"
import { EvidenceMetrics } from "./EvidenceMetrics"
import { CollectionSimulationPanel } from "./CollectionSimulationPanel"
import { EvidenceExplorer } from "./EvidenceExplorer"
import { EvidenceDetailDrawer } from "./EvidenceDetailDrawer"
import { ProvenanceChain } from "./ProvenanceChain"
import { MerkleTreeView } from "./MerkleTreeView"
import { MitreCorrelationPanel } from "./MitreCorrelationPanel"
import { EvidenceCollectionSummary } from "./EvidenceCollectionSummary"

export function EvidenceIntelligenceWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryInvestigationId = searchParams.get("id")

  const {
    investigations,
    activeInvestigation,
    selectInvestigation,
    evidenceItems,
    selectedEvidenceId,
    collectionSimulation,
    provenanceState,
    startEvidenceCollection,
    pauseEvidenceSimulation,
    resumeEvidenceSimulation,
    resetEvidenceSimulation,
    advanceCollectionStage,
    setCollectionStage,
    generateSimulatedEvidence,
    selectEvidence,
  } = useInvestigationStore()

  // Active view tab: explorer, chain, merkle, mitre
  const [activeTab, setActiveTab] = useState<"explorer" | "chain" | "merkle" | "mitre">("explorer")
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  // Sync investigation from query parameter if provided
  useEffect(() => {
    if (queryInvestigationId && (!activeInvestigation || activeInvestigation.id !== queryInvestigationId)) {
      const match = investigations.find((inv) => inv.id === queryInvestigationId)
      if (match) {
        selectInvestigation(match.id)
        generateSimulatedEvidence(match.id)
      }
    }
  }, [queryInvestigationId, activeInvestigation, investigations, selectInvestigation, generateSimulatedEvidence])

  // Selected evidence item
  const selectedEvidence = useMemo(() => {
    if (!selectedEvidenceId) return null
    return evidenceItems.find((e) => e.id === selectedEvidenceId) || null
  }, [selectedEvidenceId, evidenceItems])

  // Primary evidence item to show in ProvenanceChain if none selected
  const primaryEvidence = selectedEvidence || evidenceItems[0] || null

  const handleInvestigationSelect = (id: string) => {
    const found = investigations.find((inv) => inv.id === id)
    if (found) {
      selectInvestigation(found.id)
      generateSimulatedEvidence(found.id)
      router.push(`/evidence?id=${id}`)
    }
  }

  const handleExportBundle = () => {
    const exportData = {
      investigationId: activeInvestigation?.id ?? "INV-2026-0042",
      title: activeInvestigation?.title ?? "Operation Nightfall Breach",
      generatedAt: new Date().toISOString(),
      merkleRoot: provenanceState.merkleRoot,
      blockHeight: provenanceState.blockHeight,
      totalEvidenceCount: evidenceItems.length,
      artifacts: evidenceItems.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        class: e.evidenceClass,
        sha256: e.sha256,
        sourceEndpoint: e.endpointHostname,
        executionProfile: e.executionProfileId,
        merkleLeafIndex: e.merkleLeafIndex,
        mitreTechnique: e.mitreTechniqueId,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `JOCKY_EVIDENCE_BUNDLE_${activeInvestigation?.id ?? "CURRENT"}_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportNotice("Evidence bundle JSON manifest exported with cryptographic verification seals.")
    setTimeout(() => setExportNotice(null), 4000)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Workspace Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyber" className="text-xs px-2 py-0.5 font-black uppercase tracking-wider">
                PHASE 5 // EVIDENCE INTELLIGENCE
              </Badge>
              <Badge variant="neutral" className="text-xs">
                USP: INTENT → ADAPTIVE EXECUTION → VERIFIABLE EVIDENCE
              </Badge>
              <span className="text-xs text-zinc-500 font-bold">
                PROVENANCE LEDGER: #{provenanceState.blockHeight}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Database className="w-7 h-7 text-cyan-500 shrink-0" />
              Evidence Intelligence & Cryptographic Vault
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 max-w-3xl">
              Cross-platform forensic artifact normalization, SHA-256 integrity sealing, Merkle tree provenance,
              and MITRE ATT&CK correlation derived from adaptive execution profiles.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Investigation Selector */}
            <div className="relative inline-block">
              <select
                aria-label="Select Target Investigation"
                value={activeInvestigation?.id ?? ""}
                onChange={(e) => handleInvestigationSelect(e.target.value)}
                className="appearance-none bg-zinc-100 hover:bg-zinc-200 border-2 border-black px-3 py-2 pr-8 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.title.slice(0, 24)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-black absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Back to Live Investigation */}
            <Link
              href={`/live-investigation${activeInvestigation ? `?id=${activeInvestigation.id}` : ""}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-amber-300 hover:bg-amber-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              Adaptive Execution
            </Link>

            {/* Export Evidence Bundle */}
            <button
              type="button"
              onClick={handleExportBundle}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-emerald-400 hover:bg-emerald-500 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Bundle
            </button>
          </div>
        </div>

        {/* Export Toast Notification */}
        {exportNotice && (
          <div className="mt-3 p-2.5 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
              {exportNotice}
            </span>
            <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 border border-emerald-500">
              SHA-256 VERIFIED
            </span>
          </div>
        )}
      </div>

      {/* 6-Stage Evidence Workflow Pipeline */}
      <EvidencePipeline
        currentStage={collectionSimulation.currentStage}
        onSelectStage={setCollectionStage}
      />

      {/* Metrics Strip */}
      <EvidenceMetrics
        evidenceItems={evidenceItems}
        merkleRoot={provenanceState.merkleRoot}
      />

      {/* Collection Simulation Runner Panel */}
      <CollectionSimulationPanel
        simulation={collectionSimulation}
        onStart={() => startEvidenceCollection(activeInvestigation?.id)}
        onPause={pauseEvidenceSimulation}
        onResume={resumeEvidenceSimulation}
        onReset={resetEvidenceSimulation}
        onAdvanceStage={advanceCollectionStage}
        onSelectStage={setCollectionStage}
      />

      {/* View Switcher Tabs */}
      <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap border-b-2 border-black bg-zinc-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("explorer")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "explorer"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Evidence Explorer ({evidenceItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chain")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "chain"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Provenance Lineage Chain
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("merkle")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "merkle"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Merkle Tree & Proofs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mitre")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "mitre"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            MITRE ATT&CK Mapping ({evidenceItems.filter((e) => e.mitreTechniqueId).length})
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-4">
          {activeTab === "explorer" && (
            <EvidenceExplorer
              evidenceItems={evidenceItems}
              selectedEvidenceId={selectedEvidenceId}
              onSelectEvidence={(e) => selectEvidence(e.id)}
            />
          )}

          {activeTab === "chain" && (
            <div className="space-y-4">
              <div className="p-3 bg-zinc-50 border-2 border-black text-xs font-bold text-zinc-700 flex items-center justify-between">
                <span>
                  Showing cryptographic provenance chain for:{" "}
                  <strong className="text-black">{primaryEvidence?.name ?? "No artifact"}</strong>
                </span>
                <span className="text-[11px] text-zinc-500">
                  Select another artifact in the Explorer to inspect its specific lineage
                </span>
              </div>
              {primaryEvidence ? (
                <ProvenanceChain
                  evidence={primaryEvidence}
                  merkleRoot={provenanceState.merkleRoot}
                />
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  No evidence artifacts available to build provenance chain.
                </div>
              )}
            </div>
          )}

          {activeTab === "merkle" && (
            <MerkleTreeView
              evidenceItems={evidenceItems}
              merkleRoot={provenanceState.merkleRoot}
            />
          )}

          {activeTab === "mitre" && (
            <MitreCorrelationPanel evidenceItems={evidenceItems} />
          )}
        </div>
      </div>

      {/* Provenance Ledger Summary & Audit Quick Links */}
      <EvidenceCollectionSummary
        provenanceState={provenanceState}
        totalArtifacts={evidenceItems.length}
        verifiedArtifacts={evidenceItems.filter((e) => e.integrityVerified).length}
      />

      {/* Side Inspection Drawer */}
      <EvidenceDetailDrawer
        evidence={selectedEvidence}
        onClose={() => selectEvidence(null)}
      />
    </div>
  )
}
