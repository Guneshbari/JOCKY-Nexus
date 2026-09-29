import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { Database, Layers } from "lucide-react"

interface RoutePlaceholderProps {
  title: string
  route: string
  architectureRole: string
  description: string
  connectedTypes: string[]
  connectedData: string[]
  badge?: string
}

export function RoutePlaceholder({
  title,
  route,
  architectureRole,
  description,
  connectedTypes,
  connectedData,
  badge = "FOUNDATION ESTABLISHED",
}: RoutePlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Route Header Banner */}
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black bg-black text-amber-400 px-2.5 py-1">
                {route}
              </span>
              <Badge variant="cyber">{badge}</Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase text-black">
              {title}
            </h1>
            <p className="text-sm font-bold text-zinc-700 max-w-3xl">
              {description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <StatusPill label="PHASE 1 READY" status="verified" />
          </div>
        </div>
      </div>

      {/* Architecture & Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture Role Card */}
        <Card className="border-4 border-black shadow-[4px_4px_0px_#000]">
          <CardHeader className="bg-amber-300">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-black" />
              <CardTitle>Architecture Mapping</CardTitle>
            </div>
            <CardDescription className="text-black font-bold">
              Prototype system design & role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-xs font-bold text-zinc-900 leading-relaxed">
              {architectureRole}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-black text-zinc-500 uppercase tracking-wider">
                Constraints & Guarantees:
              </span>
              <ul className="text-xs font-mono font-bold space-y-1 text-zinc-800 list-disc list-inside">
                <li>Frontend-only modular architecture</li>
                <li>Realistic simulated forensic telemetry</li>
                <li>Ready for Phase 2 detailed UI implementation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Connected Types & Data Card */}
        <Card className="border-4 border-black shadow-[4px_4px_0px_#000]">
          <CardHeader className="bg-cyan-300">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-black" />
              <CardTitle>Connected Foundation Modules</CardTitle>
            </div>
            <CardDescription className="text-black font-bold">
              Shared TypeScript schemas & data stores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <span className="text-xs font-mono font-black text-zinc-500 uppercase tracking-wider block mb-2">
                Shared Types:
              </span>
              <div className="flex flex-wrap gap-2">
                {connectedTypes.map((type) => (
                  <Badge key={type} variant="neutral" className="bg-zinc-100">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-black text-zinc-500 uppercase tracking-wider block mb-2">
                Prototype Datasets & Stores:
              </span>
              <div className="flex flex-wrap gap-2">
                {connectedData.map((data) => (
                  <Badge key={data} variant="default" className="bg-amber-200">
                    {data}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
