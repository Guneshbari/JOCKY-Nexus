"use client"

import React, { useState } from "react"
import { RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInvestigationStore } from "@/store/investigationStore"

interface DashboardRefreshButtonProps {
  className?: string
}

export function DashboardRefreshButton({ className }: DashboardRefreshButtonProps) {
  const refreshTelemetry = useInvestigationStore((state) => state.refreshTelemetry)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [justRefreshed, setJustRefreshed] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    refreshTelemetry()
    setTimeout(() => {
      setIsRefreshing(false)
      setJustRefreshed(true)
      setTimeout(() => setJustRefreshed(false), 2000)
    }, 450)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh simulated forensic telemetry"
      className={className}
    >
      {justRefreshed ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
      ) : (
        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
      )}
      <span>{isRefreshing ? "SYNCING..." : justRefreshed ? "TELEMETRY SYNCED" : "REFRESH TELEMETRY"}</span>
    </Button>
  )
}
