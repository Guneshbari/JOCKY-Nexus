"use client"

import React from "react"
import Link from "next/link"
import { Server } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useIsMounted } from "@/hooks/useIsMounted"

const ENDPOINT_DATA = [
  { name: "Online Ready", value: 8, color: "#10B981" },
  { name: "Investigating", value: 3, color: "#FACC15" },
  { name: "Restricted/Quarantine", value: 1, color: "#EF4444" },
  { name: "Offline", value: 0, color: "#9CA3AF" },
]

export function EndpointHealthCard() {
  const mounted = useIsMounted()

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between">
      <CardHeader className="bg-emerald-300 flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-black" />
          <CardTitle className="text-sm">ENDPOINT FLEET HEALTH</CardTitle>
        </div>
        <Link href="/endpoints">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer">
            12 HOSTS →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Recharts Pie & Counts */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-32 w-32 shrink-0 relative">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ENDPOINT_DATA}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={28}
                    outerRadius={48}
                    stroke="#000"
                    strokeWidth={2}
                    paddingAngle={3}
                  >
                    {ENDPOINT_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      borderColor: "#000",
                      borderRadius: "0px",
                      color: "#fff",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-zinc-100 border-2 border-black flex items-center justify-center font-mono text-xs font-bold">
                LOADING...
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-lg font-black text-black">12</span>
              <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase">HOSTS</span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 font-mono text-xs">
            <Link
              href="/endpoints"
              className="flex items-center justify-between p-1.5 border border-black bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                <span>Online Ready:</span>
              </div>
              <span className="font-black text-black">8</span>
            </Link>

            <Link
              href="/endpoints"
              className="flex items-center justify-between p-1.5 border border-black bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 border border-black" />
                <span>Investigating:</span>
              </div>
              <span className="font-black text-black">3</span>
            </Link>

            <Link
              href="/endpoints"
              className="flex items-center justify-between p-1.5 border border-black bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 border border-black" />
                <span>Restricted:</span>
              </div>
              <span className="font-black text-rose-700">1 (FIN-WS-44)</span>
            </Link>

            <Link
              href="/endpoints"
              className="flex items-center justify-between p-1.5 border border-black bg-zinc-50 hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-zinc-400 border border-black" />
                <span>Offline:</span>
              </div>
              <span className="font-black text-zinc-600">0</span>
            </Link>
          </div>
        </div>

        <Link
          href="/endpoints"
          className="block p-2 text-center border-2 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          OPEN ENDPOINT FLEET INVENTORY →
        </Link>
      </CardContent>
    </Card>
  )
}
