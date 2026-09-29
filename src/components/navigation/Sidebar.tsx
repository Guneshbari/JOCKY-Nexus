"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Server,
  Database,
  Network,
  Crosshair,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/uiStore"
import { Badge } from "@/components/ui/badge"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Investigations",
    href: "/investigations",
    icon: ShieldAlert,
    badge: "3 ACTIVE",
    badgeVariant: "danger" as const,
  },
  {
    label: "Live Investigation",
    href: "/live-investigation",
    icon: Activity,
    badge: "LIVE",
    badgeVariant: "cyber" as const,
  },
  {
    label: "Endpoints",
    href: "/endpoints",
    icon: Server,
    badge: "5",
    badgeVariant: "default" as const,
  },
  {
    label: "Evidence Explorer",
    href: "/evidence",
    icon: Database,
  },
  {
    label: "Network Analysis",
    href: "/network",
    icon: Network,
  },
  {
    label: "MITRE ATT&CK",
    href: "/mitre",
    icon: Crosshair,
  },
  {
    label: "Provenance Audit",
    href: "/provenance",
    icon: FileCheck,
    badge: "SEALED",
    badgeVariant: "success" as const,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, toggleSidebar } = useUIStore()

  return (
    <>
      {/* Mobile Backdrop when Sidebar is Open */}
      {isSidebarOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar backdrop"
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-25 md:hidden"
        />
      )}

      <aside
        className={cn(
          "relative flex flex-col border-r-4 border-black bg-zinc-100 transition-all duration-200 select-none z-30 shrink-0",
          isSidebarOpen ? "w-64" : "w-0 md:w-20 overflow-hidden md:overflow-visible border-r-0 md:border-r-4"
        )}
      >
      {/* Branding Header */}
      <div className="flex items-center justify-between p-4 border-b-4 border-black bg-amber-400">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 border-2 border-black bg-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#fff]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col truncate">
              <span className="font-black text-lg tracking-wider text-black leading-none">
                JOCKY
                <span className="bg-black text-cyan-400 px-1 py-0.5 ml-1 text-sm">NEXUS</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-zinc-900 mt-1 truncate">
                ADAPTIVE FORENSIC ENGINE
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-2 py-1 text-[11px] font-mono font-black text-zinc-500 uppercase tracking-widest">
          {isSidebarOpen ? "Operational Navigation" : "NAV"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-mono text-sm font-bold border-2 border-black transition-all",
                isActive
                  ? "bg-black text-amber-300 shadow-[3px_3px_0px_#FACC15] translate-x-1"
                  : "bg-white text-black hover:bg-amber-100 hover:shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              )}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-amber-400" : "text-black")} />
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant={item.badgeVariant} className="text-[10px] py-0 px-1.5 ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t-4 border-black bg-zinc-200">
        {isSidebarOpen ? (
          <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_#000] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-600">AUDIT PROOF</span>
              <span className="text-[10px] font-mono font-black bg-emerald-300 text-black px-1 border border-black">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-800 truncate font-semibold">
              NVPL-v1: 1,045 blocks
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Audit Proof: Active">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-black animate-pulse" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="mt-3 w-full flex items-center justify-center p-2 font-mono text-xs font-bold border-2 border-black bg-white shadow-[2px_2px_0px_#000] hover:bg-zinc-100 hover:-translate-x-0.5 active:translate-x-0"
        >
          {isSidebarOpen ? (
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> COLLAPSE
            </span>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
    </>
  )
}
