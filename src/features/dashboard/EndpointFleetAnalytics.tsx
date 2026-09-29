"use client"

import React from "react"
import Link from "next/link"
import { Server, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_ENDPOINTS } from "@/data/endpoints"

export function EndpointFleetAnalytics() {
  const total = MOCK_ENDPOINTS.length
  const online = MOCK_ENDPOINTS.filter((e) => e.agentStatus === "ONLINE").length
  const isolated = MOCK_ENDPOINTS.filter((e) => e.isolationStatus === "ISOLATED").length
  const avgReadiness = Math.round(
    MOCK_ENDPOINTS.reduce((acc, e) => acc + e.forensicReadinessScore, 0) / total
  )

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] font-mono flex flex-col justify-between">
      <CardHeader className="bg-emerald-300 border-b-3 border-black p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Server className="w-5 h-5 text-black shrink-0" />
          <div className="min-w-0">
            <CardTitle className="text-sm font-black uppercase text-black truncate">
              ENDPOINT FLEET POSTURE
            </CardTitle>
            <p className="text-[10px] font-bold text-zinc-800 truncate">
              Cross-platform agent health & telemetry
            </p>
          </div>
        </div>

        <Link href="/endpoints" className="shrink-0">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer text-[10px]">
            {total} ENDPOINTS →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Fleet KPI Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">FLEET TOTAL</span>
            <span className="text-base font-black text-black">{total}</span>
            <span className="text-[9px] text-zinc-500 block">5 Nodes</span>
          </div>

          <div className="p-2 border-2 border-black bg-emerald-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">ONLINE</span>
            <span className="text-base font-black text-emerald-700">{online}</span>
            <span className="text-[9px] text-emerald-800 block">1 Busy</span>
          </div>

          <div className="p-2 border-2 border-black bg-rose-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">ISOLATED</span>
            <span className="text-base font-black text-rose-700">{isolated}</span>
            <span className="text-[9px] text-rose-800 block">Quarantined</span>
          </div>

          <div className="p-2 border-2 border-black bg-cyan-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">READINESS</span>
            <span className="text-base font-black text-cyan-700">{avgReadiness}%</span>
            <span className="text-[9px] text-zinc-600 block">Forensic</span>
          </div>
        </div>

        {/* Endpoint Quick Breakdown List */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-black uppercase text-zinc-700">
            Managed Agent Status:
          </div>
          <div className="space-y-1">
            {MOCK_ENDPOINTS.slice(0, 4).map((ep) => (
              <div
                key={ep.id}
                className="p-1.5 border border-black bg-white flex items-center justify-between text-[10px]"
              >
                <div className="flex items-center gap-1.5 truncate mr-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      ep.agentStatus === "ONLINE"
                        ? "bg-emerald-500"
                        : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  <span className="font-bold text-black truncate">{ep.hostname}</span>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase hidden sm:inline">
                    ({ep.platform})
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {ep.isolationStatus === "ISOLATED" ? (
                    <Badge variant="danger" className="text-[8px] py-0 px-1">
                      ISOLATED
                    </Badge>
                  ) : (
                    <span className="text-[9px] font-bold text-zinc-600 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{ep.forensicReadinessScore}%</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Policy Reminder */}
        <div className="p-2 border border-black bg-amber-50 flex items-center gap-2 text-[10px] font-bold text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Endpoint containment enforced via zero-impact host loopback firewall</span>
        </div>

        {/* Action Link */}
        <Link
          href="/endpoints"
          className="p-2 text-center border-2 border-black bg-white hover:bg-emerald-300 font-mono text-xs font-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>VIEW COMPLETE ENDPOINT FLEET</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
