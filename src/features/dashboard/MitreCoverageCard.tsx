"use client"

import React from "react"
import Link from "next/link"
import { Crosshair } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { useIsMounted } from "@/hooks/useIsMounted"

const TACTIC_DATA = [
  { tactic: "CredAccess", count: 8, fill: "#F87171" },
  { tactic: "DefenseEva", count: 6, fill: "#FB923C" },
  { tactic: "Execution", count: 5, fill: "#FBBF24" },
  { tactic: "C2", count: 4, fill: "#38BDF8" },
  { tactic: "LatMove", count: 4, fill: "#A78BFA" },
]

export function MitreCoverageCard() {
  const mounted = useIsMounted()

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between">
      <CardHeader className="bg-orange-300 flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Crosshair className="w-5 h-5 text-black shrink-0" />
          <CardTitle className="text-sm font-black uppercase text-black leading-tight break-words">
            MITRE ATT&CK ALIGNMENT
          </CardTitle>
        </div>
        <Link href="/mitre">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer">
            27 TECHNIQUES →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 font-mono text-xs">
        {/* Metric summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 border border-black bg-zinc-50">
            <span className="text-[10px] text-zinc-500 font-bold block">TACTICS</span>
            <span className="text-base font-black text-black">8</span>
          </div>
          <div className="p-2 border border-black bg-zinc-50">
            <span className="text-[10px] text-zinc-500 font-bold block">CONFIDENCE</span>
            <span className="text-base font-black text-emerald-600">96%</span>
          </div>
          <div className="p-2 border border-black bg-zinc-50">
            <span className="text-[10px] text-zinc-500 font-bold block">COVERAGE</span>
            <span className="text-base font-black text-black">74%</span>
          </div>
        </div>

        {/* Compact Bar Chart */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase">
            Top Tactic Detections:
          </div>
          <div className="h-28 w-full border-2 border-black bg-white p-1">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TACTIC_DATA} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <XAxis dataKey="tactic" tick={{ fontSize: 9, fontFamily: "monospace", fill: "#000" }} />
                  <YAxis tick={{ fontSize: 9, fontFamily: "monospace", fill: "#000" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      borderColor: "#000",
                      borderRadius: "0px",
                      color: "#fff",
                      fontFamily: "monospace",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="count" stroke="#000" strokeWidth={1.5}>
                    {TACTIC_DATA.map((entry) => (
                      <Cell key={entry.tactic} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs">
                LOADING MATRIX...
              </div>
            )}
          </div>
        </div>

        {/* Recent Technique Hit */}
        <div className="p-2 border border-black bg-amber-50 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] font-black text-zinc-600 block">RECENT CORRELATION:</span>
            <span className="font-bold text-black text-[11px] truncate">
              T1558.003 - Kerberoasting Ticket Flood
            </span>
          </div>
          <Badge variant="danger" className="text-[9px] shrink-0 ml-1">
            HIGH CONF
          </Badge>
        </div>

        <Link
          href="/mitre"
          className="block p-2 text-center border-2 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          VIEW MITRE ATT&CK HEATMAP MATRIX →
        </Link>
      </CardContent>
    </Card>
  )
}
