import React, { Suspense } from "react"
import { Metadata } from "next"
import { NetworkIntelligenceWorkspace } from "@/features/network"

export const metadata: Metadata = {
  title: "Network Forensics",
  description:
    "Interactive network topology, egress C2 beacon analysis, and inter-endpoint lateral movement tracking.",
}

function NetworkWorkspaceFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-blue-500 rounded-full" />
      <p className="text-sm font-black uppercase text-zinc-700">
        Loading Network Forensics & Flow Topology...
      </p>
    </div>
  )
}

export default function NetworkPage() {
  return (
    <Suspense fallback={<NetworkWorkspaceFallback />}>
      <NetworkIntelligenceWorkspace />
    </Suspense>
  )
}
