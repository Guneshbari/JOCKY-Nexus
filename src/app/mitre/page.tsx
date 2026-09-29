import React, { Suspense } from "react"
import { Metadata } from "next"
import { MitreIntelligenceWorkspace } from "@/features/mitre"

export const metadata: Metadata = {
  title: "MITRE ATT&CK Matrix",
  description:
    "Enterprise adversary tactic & technique matrix, automated evidence correlation, and attack path visualization.",
}

function MitreWorkspaceFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-rose-500 rounded-full" />
      <p className="text-sm font-black uppercase text-zinc-700">
        Loading MITRE ATT&CK Matrix & Correlation Engine...
      </p>
    </div>
  )
}

export default function MitrePage() {
  return (
    <Suspense fallback={<MitreWorkspaceFallback />}>
      <MitreIntelligenceWorkspace />
    </Suspense>
  )
}
