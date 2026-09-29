import React, { Suspense } from "react"
import { Metadata } from "next"
import { EndpointsWorkspace } from "@/features/endpoints"

export const metadata: Metadata = {
  title: "Endpoint Fleet | JOCKY Nexus",
  description:
    "Cross-platform endpoint management, instant host network isolation, forensic readiness scores, and live resource utilization telemetry.",
}

function EndpointsFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-emerald-500 rounded-full" />
      <p className="text-sm font-black uppercase text-zinc-700">
        Loading Endpoint Fleet Telemetry...
      </p>
    </div>
  )
}

export default function EndpointsPage() {
  return (
    <Suspense fallback={<EndpointsFallback />}>
      <EndpointsWorkspace />
    </Suspense>
  )
}
