"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface JockyLogoProps {
  variant?: "full" | "compact" | "icon"
  size?: "sm" | "md" | "lg" | "xl"
  showSubtitle?: boolean
  animated?: boolean
  className?: string
}

/**
 * Artistic Neo-Brutalist JOCKY Nexus Emblem Vector.
 * Combines an angular Electric Amber 'J' and Hyper Cyan 'N' (Nexus) lattice,
 * anchored in a faceted obsidian shield with hard-offset brutalist geometry
 * and a glowing neon ruby forensic focus reticle.
 */
export function JockyEmblem({
  size = 40,
  animated = true,
  className,
}: {
  size?: number
  animated?: boolean
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none overflow-visible", className)}
      aria-label="JOCKY Nexus Emblem"
    >
      <defs>
        <linearGradient id="nexusCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="amberGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Hard Brutalist Drop Shadow */}
      <polygon points="36,6 62,20 62,48 36,62 10,48 10,20" fill="#000000" />

      {/* Main Faceted Shield Body */}
      <polygon
        points="32,3 58,17 58,45 32,59 6,45 6,17"
        fill="#090D16"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Inner Cyber Hexagon Facet */}
      <polygon
        points="32,6 54,19 54,43 32,55 10,43 10,19"
        fill="#0F172A"
        stroke="#00F0FF"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinejoin="round"
      />

      {/* 'J' Monogram Glyph (Electric Amber / Gold) */}
      <path
        d="M14 16 H28 V22 H22 V36 C22 41 19 44.5 14 44.5 C10 44.5 7.5 42 7.5 38.5 H13.5 C13.5 39.8 14.2 40.5 15.2 40.5 C16.5 40.5 17.2 39.2 17.2 36 V16 H14 Z"
        fill="url(#amberGoldGrad)"
        stroke="#000000"
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />

      {/* 'N' (Nexus) Lattice Stem & Diagonal (Hyper Cyan) */}
      <path
        d="M26 16 L42 41 V16 H48 V46 H42 L26 21 V46 H20 V41 L33 21 H26 V16 Z"
        fill="url(#nexusCyanGrad)"
        stroke="#000000"
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />

      {/* Central Nexus Core Crosshair / Forensic Focus Aperture */}
      <circle cx="34" cy="31" r="5.5" fill="#000000" stroke="#00F0FF" strokeWidth="1.5" />
      <circle
        cx="34"
        cy="31"
        r="2.5"
        fill="#FF1E56"
        className={animated ? "animate-pulse" : undefined}
      />

      {/* Crosshair Reticle Laser Ticks */}
      <line x1="34" y1="21" x2="34" y2="24.5" stroke="#FACC15" strokeWidth="2" strokeLinecap="square" />
      <line x1="34" y1="37.5" x2="34" y2="41" stroke="#FACC15" strokeWidth="2" strokeLinecap="square" />
      <line x1="24" y1="31" x2="27.5" y2="31" stroke="#00F0FF" strokeWidth="2" strokeLinecap="square" />
      <line x1="40.5" y1="31" x2="44" y2="31" stroke="#00F0FF" strokeWidth="2" strokeLinecap="square" />

      {/* Corner Forensic Calibration Marks */}
      <path d="M10 17 L14 17 M10 17 L10 21" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M54 17 L50 17 M54 17 L54 21" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M32 55 L32 58" stroke="#FF1E56" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

export function JockyLogo({
  variant = "full",
  size = "md",
  showSubtitle = true,
  animated = true,
  className,
}: JockyLogoProps) {
  // Sizing definitions for pixel dimensions and font sizes
  const sizeMap = {
    sm: { emblemSize: 28, textClass: "text-base", badgeClass: "text-[10px] px-1 py-0.2", subClass: "text-[8px]" },
    md: { emblemSize: 38, textClass: "text-lg", badgeClass: "text-xs px-1.5 py-0.5", subClass: "text-[9px]" },
    lg: { emblemSize: 52, textClass: "text-2xl", badgeClass: "text-sm px-2 py-0.5", subClass: "text-[11px]" },
    xl: { emblemSize: 72, textClass: "text-4xl", badgeClass: "text-base px-2.5 py-1", subClass: "text-xs" },
  }

  const { emblemSize, textClass, badgeClass, subClass } = sizeMap[size]

  if (variant === "icon") {
    return (
      <div className={cn("inline-flex items-center justify-center shrink-0", className)}>
        <JockyEmblem size={emblemSize} animated={animated} />
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-2.5 font-mono select-none", className)}>
        <JockyEmblem size={emblemSize} animated={animated} />
        <div className="flex items-center gap-1.5">
          <span className={cn("font-black tracking-wider text-black leading-none", textClass)}>
            JOCKY
          </span>
          <span
            className={cn(
              "font-mono font-black bg-black text-cyan-400 border border-black shadow-[1px_1px_0px_#00F0FF]",
              badgeClass
            )}
          >
            NEXUS
          </span>
        </div>
      </div>
    )
  }

  // Variant "full"
  return (
    <div className={cn("inline-flex items-center gap-3 font-mono select-none", className)}>
      <JockyEmblem size={emblemSize} animated={animated} />

      <div className="flex flex-col truncate">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={cn("font-black tracking-wider text-black", textClass)}>
            JOCKY
          </span>
          <span
            className={cn(
              "font-mono font-black bg-black text-cyan-400 border border-black shadow-[2px_2px_0px_#00F0FF]",
              badgeClass
            )}
          >
            NEXUS
          </span>
        </div>

        {showSubtitle && (
          <div className={cn("flex items-center gap-1.5 font-bold text-zinc-800 mt-1 truncate tracking-wider", subClass)}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            <span className="truncate">ADAPTIVE FORENSIC ENGINE</span>
          </div>
        )}
      </div>
    </div>
  )
}
