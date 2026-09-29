import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]",
  {
    variants: {
      variant: {
        default: "bg-amber-300 text-black",
        cyber: "bg-cyan-300 text-black",
        success: "bg-emerald-300 text-black",
        danger: "bg-rose-400 text-black",
        warning: "bg-orange-300 text-black",
        neutral: "bg-white text-black",
        dark: "bg-black text-white",
        purple: "bg-purple-300 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
