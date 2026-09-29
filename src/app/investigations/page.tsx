import React, { Suspense } from "react"
import { Metadata } from "next"
import { InvestigationsWorkspace } from "@/features/investigations"

export const metadata: Metadata = {
  title: "Investigation Campaigns | JOCKY Nexus",
  description:
    "Coordinate multi-endpoint forensic investigations across Windows, Linux, and macOS. Define natural intent, compile to platform-independent JOCKY IR, and maintain verifiable hash chains.",
}

function InvestigationsFallback() {
  return (
    <div className="p-8 border-4 border-black bg-white font-mono text-center shadow-[6px_6px_0px_#000]">
      <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-amber-400 rounded-full" />
      <p className="text-xs font-bold uppercase mt-2">Loading Investigations Console...</p>
    </div>
  )
}

export default function InvestigationsPage() {
  return (
    <Suspense fallback={<InvestigationsFallback />}>
      <InvestigationsWorkspace />
    </Suspense>
  )
}
