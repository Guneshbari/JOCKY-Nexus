"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"
import { Layers } from "lucide-react"
import { useIsMounted } from "@/hooks/useIsMounted"
import { TACTIC_COVERAGE_DATA } from "@/data/mitre"

export function MitreTacticCoverage() {
  const isMounted = useIsMounted()

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-600" />
          <h3 className="text-sm font-black uppercase text-black">
            ATT&CK Tactical Domain Coverage
          </h3>
        </div>
        <span className="text-[10px] bg-orange-200 px-2 py-0.5 border border-orange-600 font-black">
          8 TACTICAL CATEGORIES
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Aggregated observation frequency across standardized MITRE ATT&CK enterprise tactics.
      </p>

      {/* Chart Container */}
      <div className="h-52 w-full border-2 border-black bg-zinc-50 p-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={TACTIC_COVERAGE_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
            >
              <XAxis
                dataKey="tactic"
                interval={0}
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="border-2 border-black bg-white p-2 text-xs font-mono shadow-[3px_3px_0px_#000]">
                        <span className="font-black text-black block">{data.tactic}</span>
                        <span className="text-zinc-700">Observed Signals: {data.count}</span>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" stroke="#000" strokeWidth={2}>
                {TACTIC_COVERAGE_DATA.map((entry) => (
                  <Cell key={entry.tactic} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-zinc-400">
            Loading Tactic Coverage Chart...
          </div>
        )}
      </div>
    </div>
  )
}
