import React, { Suspense } from "react"
import { ProvenanceAuditWorkspace } from "@/features/provenance"

function ProvenanceWorkspaceFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-lime-500 rounded-full" />
      <p className="text-sm font-black uppercase text-zinc-700">
        Loading Verifiable Provenance Ledger...
      </p>
    </div>
  )
}

export default function ProvenancePage() {
  return (
    <Suspense fallback={<ProvenanceWorkspaceFallback />}>
      <ProvenanceAuditWorkspace />
    </Suspense>
  )
}
