# JOCKY Nexus

> **"One Investigation. Multiple Endpoints. Verifiable Evidence."**  
> **Core USP:** *Forensic Intent → Adaptive Execution → Verifiable Evidence*

JOCKY Nexus is a frontend-only prototype for an adaptive, multi-endpoint digital forensics and incident response (DFIR) platform. It provides security investigators and judges with an intuitive, Neo-Brutalist command console to launch intent-driven investigations, adaptively orchestrate endpoint actions, and verify cryptographic chain-of-custody proofs.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI System**: [shadcn/ui](https://ui.shadcn.com/) (Neo-Brutalism theme)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Visualizations**: [Recharts](https://recharts.org/) & [React Flow / @xyflow/react](https://reactflow.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment Target**: [Vercel](https://vercel.com/)

---

## 🎨 Design Direction: Neo-Brutalism

- **High Contrast**: Bold solid black borders (`border-2 border-black` / `border-4 border-black`)
- **Hard Drop Shadows**: Tactile drop shadows (`shadow-[3px_3px_0px_#000]`, `shadow-[6px_6px_0px_#000]`)
- **Tactile Feedback**: Subtle button and card offset interactions (`hover:-translate-x-0.5 active:translate-x-0.5`)
- **Cyber / Forensic Accents**: Vibrant palette including Cyber Yellow (`#FACC15`), Cyan (`#00F0FF`), Neon Emerald (`#10B981`), and Alert Crimson (`#EF4444`)
- **Monospace Elements**: Hashes, block heights, IP addresses, and timestamps formatted with monospace accents

---

## 📂 Project Architecture

```
jocky-nexus/
├── public/
│   ├── assets/
│   ├── icons/
│   ├── images/
│   ├── logo/
│   │   └── jocky-nexus.svg       # Brand logo
│   └── favicon.svg               # Neo-brutalist favicon
├── src/
│   ├── app/                      # Next.js App Router (Routes & Pages)
│   │   ├── layout.tsx            # Global layout with AppShell wrapper
│   │   ├── globals.css           # Tailwind CSS v4 & theme variables
│   │   ├── page.tsx              # Prototype overview & modules index
│   │   ├── dashboard/            # Operational command dashboard
│   │   ├── investigations/       # Forensic campaign orchestration
│   │   │   └── [id]/             # Dynamic investigation detail view
│   │   ├── endpoints/            # Host fleet & isolation controls
│   │   ├── live-investigation/   # Real-time adaptive execution stream
│   │   ├── evidence/             # Cryptographic artifact explorer
│   │   ├── network/              # Lateral movement & C2 topology
│   │   ├── mitre/                # MITRE ATT&CK tactical mapping
│   │   └── provenance/           # Verifiable Merkle audit ledger
│   ├── components/
│   │   ├── ui/                   # Base primitives (Button, Badge, Card)
│   │   ├── layout/               # AppShell, RoutePlaceholder
│   │   ├── navigation/           # Sidebar, Header
│   │   ├── status/               # StatusPill indicators
│   │   ├── cards/                # Feature-specific card templates
│   │   ├── charts/               # Recharts & React Flow components
│   │   ├── tables/               # Table layouts & data grids
│   │   └── modals/               # Dialogs and inspection drawers
│   ├── features/                 # Feature-specific business logic & sub-views
│   ├── data/                     # Realistic static prototype datasets
│   ├── mock/                     # Scenarios and evidence generators
│   ├── hooks/                    # Reusable simulation & state hooks
│   ├── store/                    # Zustand client-side application state
│   ├── types/                    # Shared TypeScript domain models
│   └── lib/                      # Utilities, constants, and formatters
├── components.json               # shadcn/ui configuration
├── package.json
└── tsconfig.json
```

---

## 🔒 Prototype Constraints & Guarantees

- **Frontend-Only**: No backend server, external database, or real kernel agents required.
- **Realistic Forensic Data**: Hardcoded and simulated data mirrors real incident scenarios (Kerberoasting, Reflective DLL injection, eBPF rootkits, Ransomware canary detection).
- **Functional Interactions**: All visible navigation items, toggles, filter states, and isolation controls are interactive and connected to client state.
- **API-Ready**: All state stores and data loaders are organized to seamlessly transition to real REST/GraphQL APIs in future phases.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified by the CLI if 3000 is occupied).

### 3. Verify Code Quality & Types
```bash
npm run lint
npm run build
```

---

## 🌐 Deploy to Vercel

Push the repository to GitHub and import it directly into [Vercel](https://vercel.com/):
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- No environment variables required for prototype mode.
