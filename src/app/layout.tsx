import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/layout/AppShell"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "JOCKY Nexus — Adaptive Digital Forensics & Evidence Intelligence",
    template: "%s | JOCKY Nexus",
  },
  description: "One Investigation. Multiple Endpoints. Verifiable Evidence. Forensic Intent → Adaptive Execution → Verifiable Evidence.",
  keywords: [
    "Digital Forensics",
    "Evidence Intelligence",
    "Adaptive Execution",
    "JOCKY Nexus",
    "Incident Response",
    "MITRE ATT&CK",
    "Chain of Custody",
    "Merkle Provenance",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo/jocky-nexus.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JOCKY Nexus",
    title: "JOCKY Nexus — Adaptive Digital Forensics & Evidence Intelligence",
    description: "One Investigation. Multiple Endpoints. Verifiable Evidence.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-zinc-100 text-black selection:bg-amber-400 selection:text-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
