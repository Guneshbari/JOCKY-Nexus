import React, { Suspense } from "react"
import { EvidenceIntelligenceWorkspace } from "@/features/evidence"

function EvidenceWorkspaceFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-cyan-500 rounded-full" />
      <p className="text-sm font-black uppercase text-zinc-700">
        Loading Evidence Vault & Cryptographic Ledger...
      </p>
    </div>
  )
}

export default function EvidencePage() {
  return (
    <Suspense fallback={<EvidenceWorkspaceFallback />}>
      <EvidenceIntelligenceWorkspace />
    </Suspense>
  )
}
