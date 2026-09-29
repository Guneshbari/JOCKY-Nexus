import React from "react"
import { cn } from "@/lib/utils"

interface StatusPillProps {
  label: string
  status?: "online" | "offline" | "busy" | "isolated" | "verified" | "warning"
  showDot?: boolean
  className?: string
}

export function StatusPill({
  label,
  status = "online",
  showDot = true,
  className,
}: StatusPillProps) {
  const statusStyles = {
    online: "bg-emerald-400 text-black border-black",
    offline: "bg-zinc-300 text-zinc-700 border-black",
    busy: "bg-amber-400 text-black border-black",
    isolated: "bg-rose-500 text-white border-black",
    verified: "bg-cyan-400 text-black border-black",
    warning: "bg-orange-400 text-black border-black",
  }

  const dotStyles = {
    online: "bg-emerald-700 animate-pulse",
    offline: "bg-zinc-600",
    busy: "bg-amber-800 animate-ping",
    isolated: "bg-rose-900 animate-pulse",
    verified: "bg-cyan-800",
    warning: "bg-orange-800 animate-bounce",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold uppercase border-2 shadow-[2px_2px_0px_#000] select-none",
        statusStyles[status],
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-2 h-2 rounded-full border border-black", dotStyles[status])}
        />
      )}
      <span>{label}</span>
    </div>
  )
}
