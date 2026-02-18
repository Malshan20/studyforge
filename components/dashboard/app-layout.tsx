"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Brain, BarChart3, Moon, Sun, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStudyStore } from "@/lib/store/study-store"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/planner", icon: Calendar, label: "Planner" },
  { href: "/flashcards", icon: Brain, label: "Flashcards" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useStudyStore()
  const router = useRouter()
  const supabase = createBrowserClient()

  const [isGenius, setIsGenius] = useState<boolean | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    // Check subscription plan_type
    let ignore = false
    async function fetchSubscription() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsGenius(false)
        return
      }
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_type")
        .eq("user_id", user.id)
        .maybeSingle()
      if (!ignore) {
        if (data && data.plan_type === "genius") {
          setIsGenius(true)
        } else {
          setIsGenius(false)
        }
      }
    }
    fetchSubscription()
    return () => { ignore = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 bg-card border-b border-border z-50 h-14">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
              {isGenius
                ? (
                  <>
                    StudyForge<sup className="align-super text-base text-yellow-500 tracking-tight" style={{ fontSize: "0.85em", marginLeft: "2px" }}><span style={{ fontFamily: "monospace" }}>Genius</span></sup>
                  </>
                )
                : "StudyForge"
              }
            </Link>
          <div className="flex items-center gap-2">
            {/* Hide upgrade button if isGenius is true */}
            {isGenius === false && (
              <Button asChild variant="ghost" size="icon" className="text-primary">
                <Link href="/upgrade">
                  <Sparkles className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              {isGenius
                ? (
                  <>
                    StudyForge<sup className="align-super text-base text-yellow-500 tracking-tight" style={{ fontSize: "0.85em", marginLeft: "2px" }}><span style={{ fontFamily: "monospace" }}>Genius</span></sup>
                  </>
                )
                : "StudyForge"
              }
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          {/* Hide upgrade button if isGenius is true */}
          {isGenius === false && (
            <div className="px-2 mb-4">
              <Button asChild className="w-full" variant="default">
                <Link href="/upgrade">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Genius
                </Link>
              </Button>
            </div>
          )}
          <div className="flex-shrink-0 flex border-t border-border p-4 gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="flex-1 bg-transparent">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleSignOut} className="flex-1 bg-transparent">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pt-14 md:pt-0 pb-20 md:pb-8">{children}</main>
      </div>
    </div>
  )
}
