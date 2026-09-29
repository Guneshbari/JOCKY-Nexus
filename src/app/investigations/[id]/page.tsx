"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvestigationDetailView } from "@/features/investigations/InvestigationDetailView"
import { useInvestigationStore } from "@/store/investigationStore"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"

export default function InvestigationDetailPage() {
  const params = useParams()
  const rawId = params?.id
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : ""

  const investigations = useInvestigationStore((state) => state.investigations)
  const investigation =
    investigations.find((i) => i.id === id) ??
    MOCK_INVESTIGATIONS.find((i) => i.id === id)

  React.useEffect(() => {
    if (investigation) {
      document.title = `${investigation.id}: ${investigation.title.slice(0, 30)} | JOCKY Nexus`
    }
  }, [investigation])

  if (!investigation) {
    return (
      <div className="space-y-6 font-mono">
        <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex justify-center">
            <SearchX className="w-12 h-12 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase text-black">
              Campaign Not Found
            </h2>
            <p className="text-xs font-bold text-zinc-600 max-w-md mx-auto">
              No investigation with identifier <span className="font-mono text-black font-black bg-amber-200 px-1 border border-black">{id || "UNKNOWN"}</span> could be located in active memory or local ledger.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <Link href="/investigations">
              <Button variant="default" size="sm" className="gap-2 text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Active Campaigns</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <InvestigationDetailView investigation={investigation} />
}
