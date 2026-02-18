"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Hammer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
    { label: "Shop", href: "/shop" },
    { label: "Pricing", href: "/pricing" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-border bg-background/90 shadow-sm backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -15, 15, -15, 0] }}
            transition={{ duration: 0.5 }}
            className="flex h-11 w-11 items-center justify-center rounded-lg border-2"
          >
            <Image src="/logo.png" alt="StudyForge Logo" width={50} height={50} />
          </motion.div>
          <span className="text-2xl font-black tracking-tight text-foreground">StudyForge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="font-bold">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="rounded-lg font-bold shadow-md shadow-green-500/20">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden" aria-label="Toggle menu">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border bg-background/95 backdrop-blur-lg md:hidden"
        >
          <nav className="flex flex-col gap-4 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-2 bg-transparent font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full rounded-lg font-bold shadow-md">Start Free</Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Header
export { Header }
