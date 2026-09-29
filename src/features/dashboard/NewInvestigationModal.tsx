"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { X, ShieldAlert, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/uiStore"
import { useInvestigationStore } from "@/store/investigationStore"
import { Investigation, InvestigationSeverity } from "@/types/investigation"

export function NewInvestigationModal() {
  const router = useRouter()
  const activeModal = useUIStore((state) => state.activeModal)
  const closeModal = useUIStore((state) => state.closeModal)
  const addInvestigation = useInvestigationStore((state) => state.addInvestigation)

  const [title, setTitle] = useState("Suspicious Rundll32 In-Memory Execution")
  const [caseName, setCaseName] = useState("CASE-2026-RUNDLL-04")
  const [intent, setIntent] = useState("Interrogate parentless rundll32 process tree and verify code-signing certificates on FIN-WS-44.")
  const [severity, setSeverity] = useState<InvestigationSeverity>("HIGH")
  const [selectedProfile, setSelectedProfile] = useState("PROFILE-A (VOLATILE TRIAGE)")
  const [targetHost, setTargetHost] = useState("ep-ws-44")

  if (activeModal !== "NEW_INVESTIGATION") return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newId = `inv-2026-00${Math.floor(Math.random() * 90) + 10}`
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    const newInv: Investigation = {
      id: newId,
      title,
      caseName,
      intent,
      description: `Forensic campaign targeting ${targetHost} with adaptive profile ${selectedProfile}.`,
      severity,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      initiatedBy: "Judge-Console-Operator (Manual Intent)",
      targetEndpointIds: [targetHost],
      progressPercentage: 15,
      evidenceCount: 1,
      adaptiveProfile: selectedProfile,
      provenanceRootHash: randomHash,
      steps: [
        {
          id: `step-${Date.now()}-1`,
          order: 1,
          title: "Capture Process Handle Hierarchy & Memory Maps",
          description: "Acquire thread stacks and unbacked executable allocations.",
          actionType: "PROCESS_INTERROGATE",
          status: "RUNNING",
          targetEndpointIds: [targetHost],
        },
        {
          id: `step-${Date.now()}-2`,
          order: 2,
          title: "Cryptographic Evidence Sealing",
          description: "Hash artifacts and mint Merkle leaf proof.",
          actionType: "HASH_VERIFY",
          status: "PENDING",
          targetEndpointIds: [targetHost],
        },
      ],
      findings: [],
    }

    addInvestigation(newInv)
    closeModal()
    router.push(`/investigations/${newId}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xl max-h-[92dvh] flex flex-col border-4 border-black bg-white shadow-[8px_8px_0px_#000] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b-4 border-black bg-amber-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-black shrink-0" />
            <h2 id="modal-title" className="font-mono text-sm sm:text-base font-black uppercase text-black tracking-wide truncate">
              Initialize Forensic Campaign
            </h2>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center font-bold hover:bg-rose-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          <div className="p-3 border-2 border-black bg-cyan-50 text-xs font-mono font-bold text-zinc-900">
            ⚡ <span className="underline">Forensic Intent Driven</span>: Specify natural investigative intent. The Adaptive Engine compiles it into synchronized cross-endpoint inspection commands.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="case-name" className="block text-xs font-mono font-black uppercase text-zinc-700">
                Case Identifier
              </label>
              <input
                id="case-name"
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                required
                className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="severity" className="block text-xs font-mono font-black uppercase text-zinc-700">
                Initial Severity
              </label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as InvestigationSeverity)}
                className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="campaign-title" className="block text-xs font-mono font-black uppercase text-zinc-700">
              Investigation Title
            </label>
            <input
              id="campaign-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="intent" className="block text-xs font-mono font-black uppercase text-zinc-700">
              Forensic Intent Specification
            </label>
            <textarea
              id="intent"
              rows={2}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              required
              className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="target-host" className="block text-xs font-mono font-black uppercase text-zinc-700">
                Target Endpoint Node
              </label>
              <select
                id="target-host"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
              >
                <option value="ep-ws-44">FIN-WS-44 (10.0.4.44 - Windows)</option>
                <option value="ep-dc-01">DC-PROD-PRIMARY (10.0.1.10 - WinServer)</option>
                <option value="ep-app-09">CORE-APP-NODE-09 (10.0.2.19 - Linux)</option>
                <option value="ep-sec-proxy">SEC-EGRESS-PROXY-01 (10.0.99.5 - Linux)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="profile" className="block text-xs font-mono font-black uppercase text-zinc-700">
                Adaptive Collector Profile
              </label>
              <select
                id="profile"
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono text-xs font-bold bg-zinc-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
              >
                <option value="PROFILE-A (VOLATILE TRIAGE)">PROFILE-A (VOLATILE TRIAGE)</option>
                <option value="PROFILE-B (CONTAINMENT & MFT)">PROFILE-B (CONTAINMENT & MFT)</option>
                <option value="PROFILE-C (eBPF ROOTKIT AUDIT)">PROFILE-C (eBPF ROOTKIT AUDIT)</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" className="gap-1.5">
              <span>Launch Adaptive Campaign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
