import React, { Suspense } from "react"
import { Metadata } from "next"
import { CommandCenterWorkspace } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Command Center | JOCKY Nexus",
  description:
    "Aggregated forensic operations, cross-platform adaptive execution intelligence, verifiable evidence integrity, and unified investigation analytics.",
}

function CommandCenterFallback() {
  return (
    <div className="p-12 border-4 border-black bg-white shadow-[8px_8px_0px_#000] font-mono text-center space-y-4">
      <div className="inline-block animate-spin w-10 h-10 border-4 border-black border-t-amber-400 rounded-full" />
      <h3 className="text-lg font-black uppercase text-black">
        INITIALIZING JOCKY NEXUS COMMAND CENTER...
      </h3>
      <p className="text-xs font-bold text-zinc-600">
        Aggregating operational posture, adaptive profiles, and cryptographic evidence seals.
      </p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<CommandCenterFallback />}>
      <CommandCenterWorkspace />
    </Suspense>
  )
}
