import React, { Suspense } from "react"
import { Metadata } from "next"
import { AdaptiveExecutionWorkspace } from "@/features/execution/AdaptiveExecutionWorkspace"

export const metadata: Metadata = {
  title: "Live Adaptive Execution",
  description:
    "Real-time adaptive forensic execution pipeline, endpoint profiling, heuristic branching, and dynamic collector assignment.",
}

export default function LiveInvestigationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-mono border-4 border-black bg-white shadow-[6px_6px_0px_#000]">
          <div className="text-sm font-black uppercase text-black">
            INITIALIZING ADAPTIVE EXECUTION ENGINE...
          </div>
          <div className="text-xs text-zinc-600 font-bold mt-1">
            Loading endpoint profiles and JOCKY IR AST
          </div>
        </div>
      }
    >
      <AdaptiveExecutionWorkspace />
    </Suspense>
  )
}
