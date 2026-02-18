"use client"

import { motion } from "framer-motion"
import { Crown, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UpgradePromptProps {
  feature: string
  currentUsage?: number
  limit?: number
  compact?: boolean
}

export function UpgradePrompt({ feature, currentUsage, limit, compact = false }: UpgradePromptProps) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          {currentUsage !== undefined && limit !== undefined
            ? `${currentUsage}/${limit} ${feature} used.`
            : `Limited ${feature}.`}
        </span>
        <Link href="/upgrade">
          <Button variant="link" size="sm" className="p-0 h-auto font-semibold">
            Upgrade for unlimited
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-primary/30 rounded-none bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/10 rounded-none flex-shrink-0">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg mb-2 uppercase">Unlock Higher Limits</h3>
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                {currentUsage !== undefined && limit !== undefined
                  ? `You've used ${currentUsage} of ${limit} ${feature}. `
                  : `You're on the free plan with limited ${feature}. `}
                Upgrade to Genius for unlimited access to all features.
              </p>
              <Link href="/upgrade">
                <Button className="font-black uppercase">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
