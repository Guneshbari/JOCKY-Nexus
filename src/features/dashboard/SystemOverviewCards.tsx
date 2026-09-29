"use client"

import React from "react"
import Link from "next/link"
import { ShieldAlert, Server, Database, Crosshair, Cpu, Lock, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"

export function SystemOverviewCards() {
  const investigations = useInvestigationStore((state) => state.investigations)
  const endpoints = useEndpointStore((state) => state.endpoints)

  const activeInvestigations = investigations.filter((i) => i.status === "IN_PROGRESS").length

  const overviewCards = [
    {
      id: "active-investigations",
      label: "ACTIVE INVESTIGATIONS",
      value: String(activeInvestigations),
      subtext: "Correlated multi-endpoint campaigns",
      status: "ACTIVE",
      badgeVariant: "danger" as const,
      color: "bg-rose-100",
      borderColor: "border-black",
      icon: ShieldAlert,
      href: "/investigations",
    },
    {
      id: "endpoints",
      label: "ENDPOINTS",
      value: "12",
      subtext: `${endpoints.length} hosts active in telemetry tree`,
      status: "ONLINE",
      badgeVariant: "success" as const,
      color: "bg-emerald-100",
      borderColor: "border-black",
      icon: Server,
      href: "/endpoints",
    },
    {
      id: "evidence-items",
      label: "EVIDENCE ITEMS",
      value: "1,284",
      subtext: "100% SHA-256 sealed & verified",
      status: "VERIFIED",
      badgeVariant: "cyber" as const,
      color: "bg-cyan-100",
      borderColor: "border-black",
      icon: Database,
      href: "/evidence",
    },
    {
      id: "mitre-techniques",
      label: "MITRE TECHNIQUES",
      value: "27",
      subtext: "Mapped across 8 enterprise tactics",
      status: "MAPPED",
      badgeVariant: "warning" as const,
      color: "bg-orange-100",
      borderColor: "border-black",
      icon: Crosshair,
      href: "/mitre",
    },
    {
      id: "adaptive-engine",
      label: "ADAPTIVE ENGINE",
      value: "ONLINE",
      subtext: "Autonomous rule compiler active",
      status: "READY",
      badgeVariant: "default" as const,
      color: "bg-amber-100",
      borderColor: "border-black",
      icon: Cpu,
      href: "/live-investigation",
    },
    {
      id: "provenance",
      label: "PROVENANCE",
      value: "SEALED",
      subtext: "Merkle Root: 7b4c9e... (1,045 blocks)",
      status: "INTEGRITY OK",
      badgeVariant: "purple" as const,
      color: "bg-purple-100",
      borderColor: "border-black",
      icon: Lock,
      href: "/provenance",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {overviewCards.map((card) => {
        const Icon = card.icon
        return (
          <Link
            key={card.id}
            href={card.href}
            className="group block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <div
              className={`h-full border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] transition-all group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_#000] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`p-1.5 border-2 border-black ${card.color}`}>
                    <Icon className="w-4 h-4 text-black" />
                  </div>
                  <Badge variant={card.badgeVariant} className="text-[10px] py-0 px-1">
                    {card.status}
                  </Badge>
                </div>

                <div className="font-mono text-[10px] font-black uppercase text-zinc-600 tracking-wider">
                  {card.label}
                </div>

                <div className="text-2xl md:text-3xl font-black text-black tracking-tight mt-1">
                  {card.value}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t-2 border-zinc-200 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-600">
                <span className="truncate">{card.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-black" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
