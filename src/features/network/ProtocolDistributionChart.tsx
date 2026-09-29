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
import { PieChart } from "lucide-react"
import { useIsMounted } from "@/hooks/useIsMounted"
import { PROTOCOL_DISTRIBUTION } from "@/data/network"

export function ProtocolDistributionChart() {
  const isMounted = useIsMounted()

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-black uppercase text-black">
            Protocol Breakdown & Volume Distribution
          </h3>
        </div>
        <span className="text-[10px] bg-purple-200 px-2 py-0.5 border border-purple-600 font-black">
          RECHARTS
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Simulated transport protocol proportions across all monitored target endpoints.
      </p>

      {/* Bar Chart Container */}
      <div className="h-44 w-full border-2 border-black bg-zinc-50 p-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PROTOCOL_DISTRIBUTION}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}
              />
              <YAxis
                unit="%"
                tick={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="border-2 border-black bg-white p-2 text-xs font-mono shadow-[3px_3px_0px_#000]">
                        <span className="font-black text-black block">{data.name}</span>
                        <span className="text-zinc-700">Percentage: {data.percentage}%</span>
                        <span className="text-zinc-500 block text-[10px]">
                          Observed Flows: {data.count}
                        </span>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="percentage" stroke="#000" strokeWidth={2}>
                {PROTOCOL_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-zinc-400">
            Rendering Protocol Chart...
          </div>
        )}
      </div>

      {/* Protocol Legend Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {PROTOCOL_DISTRIBUTION.map((proto) => (
          <div
            key={proto.name}
            className="p-2 border-2 border-black bg-white flex items-center justify-between shadow-[2px_2px_0px_#000]"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 border border-black"
                style={{ backgroundColor: proto.color }}
              />
              <span className="font-black text-black">{proto.name}</span>
            </div>
            <span className="font-black text-zinc-900">{proto.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
