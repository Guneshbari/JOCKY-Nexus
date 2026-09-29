"use client"

import React from "react"
import Link from "next/link"
import { Crosshair, ArrowRight, ShieldAlert, Target } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { useIsMounted } from "@/hooks/useIsMounted"
import { useInvestigationStore } from "@/store/investigationStore"

const TACTIC_DATA = [
  { tactic: "Cred Access", count: 8, fill: "#F87171", label: "T1558 (Kerberos)" },
  { tactic: "Defense Eva", count: 6, fill: "#FB923C", label: "T1070 (Log Clear)" },
  { tactic: "Execution", count: 5, fill: "#FBBF24", label: "T1059 (PowerShell)" },
  { tactic: "C2", count: 4, fill: "#38BDF8", label: "T1071 (Beacon)" },
  { tactic: "Lat Move", count: 4, fill: "#A78BFA", label: "T1021 (PsExec)" },
]

export function MitreIntelligenceSummary() {
  const mounted = useIsMounted()
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] font-mono flex flex-col justify-between">
      <CardHeader className="bg-orange-300 border-b-3 border-black p-3.5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-black" />
          <div>
            <CardTitle className="text-sm font-black uppercase text-black">
              MITRE ATT&CK INTELLIGENCE
            </CardTitle>
            <p className="text-[10px] font-bold text-zinc-800">
              Enterprise matrix mapping & automated TTP evidence correlation
            </p>
          </div>
        </div>

        <Link href={`/mitre?id=${currentInvId}`}>
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer text-[10px]">
            27 TECHNIQUES →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Metric Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">TACTICS</span>
            <span className="text-base font-black text-black">8</span>
            <span className="text-[9px] text-zinc-500 block">Enterprise</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">CONFIDENCE</span>
            <span className="text-base font-black text-emerald-700">96%</span>
            <span className="text-[9px] text-zinc-500 block">High Quorum</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">COVERAGE</span>
            <span className="text-base font-black text-amber-700">74%</span>
            <span className="text-[9px] text-zinc-500 block">Attack Path</span>
          </div>
        </div>

        {/* Compact Bar Chart of Top Tactics */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-700">
            <span>Primary Tactic Detections:</span>
            <span className="text-zinc-500">27 Techniques Correlated</span>
          </div>

          <div className="h-32 w-full border-2 border-black bg-white p-1">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TACTIC_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="tactic" tick={{ fontSize: 9, fill: "#000", fontWeight: "bold" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#000" }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="border-2 border-black bg-white p-1.5 text-xs font-mono shadow-[2px_2px_0px_#000]">
                            <div className="font-bold">{data.tactic}</div>
                            <div className="text-zinc-600">Sample: {data.label}</div>
                            <div className="text-rose-600 font-bold">Detections: {data.count}</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                    {TACTIC_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000" strokeWidth={1.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                Rendering MITRE metrics...
              </div>
            )}
          </div>
        </div>

        {/* Top Correlated Technique Tag */}
        <div className="p-2 border border-black bg-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate mr-1">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-700 shrink-0" />
            <span className="font-bold text-[10px] text-zinc-900 truncate">
              Primary: T1558.003 (Kerberoasting)
            </span>
          </div>
          <Badge variant="warning" className="text-[8px] py-0 px-1 shrink-0">
            HIGH SEV
          </Badge>
        </div>

        {/* Action Link */}
        <Link
          href={`/mitre?id=${currentInvId}`}
          className="p-2 text-center border-2 border-black bg-white hover:bg-orange-300 font-mono text-xs font-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          <span>EXPLORE MITRE ATT&CK MATRIX</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
