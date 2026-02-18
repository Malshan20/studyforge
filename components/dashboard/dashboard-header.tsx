"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Hammer, LogOut, Trophy, Zap, LayoutDashboard, User } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"

interface DashboardHeaderProps {
  profile: {
    display_name: string
    avatar_url: string | null
    xp: number
    level: number
    streak_days: number
  } | null
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b-4 border-primary/20 bg-white/50 backdrop-blur-lg"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-primary bg-primary/10">
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-black uppercase">StudyForge</span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 font-bold uppercase text-xs"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant={pathname === "/leaderboard" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 font-bold uppercase text-xs"
                >
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant={pathname === "/profile" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 font-bold uppercase text-xs"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <>
                <div className="hidden items-center gap-6 md:flex">
                  <div className="flex items-center gap-2 border-2 border-primary bg-primary/10 px-4 py-2 text-sm font-black text-primary uppercase">
                    <Zap className="h-4 w-4" />
                    {profile.xp} XP
                  </div>
                  <div className="flex items-center gap-2 border-2 border-primary bg-primary/10 px-4 py-2 text-sm font-black text-primary uppercase">
                    <Trophy className="h-4 w-4" />
                    Level {profile.level}
                  </div>
                </div>

                <Link href="/profile">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="hidden text-right md:block">
                      <p className="text-sm font-black uppercase">{profile.display_name}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{profile.streak_days} day streak</p>
                    </div>
                    <Avatar className="h-10 w-10 border-4 border-primary">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-black">
                        {profile.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="border-2 border-transparent hover:border-primary/30"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
