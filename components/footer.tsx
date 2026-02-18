import Link from "next/link"
import { Hammer } from "lucide-react"
import Image from "next/image"

function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookie Policy", href: "/cookie-policy" },
      ],
    },
  ]

  return (
    <footer className="border-t-2 border-border bg-gradient-to-b from-background to-green-50/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2">
                <Image src="/logo.png" alt="StudyForge Logo" width={50} height={50} />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">StudyForge</span>
            </Link>
            <p className="mb-6 max-w-sm text-base font-medium leading-relaxed text-muted-foreground">
              Build your academic excellence with AI-powered tools. Forge your path to success through intelligent
              learning and strategic planning.
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t-2 border-border pt-8">
          <p className="text-center text-sm font-bold text-muted-foreground">
            © {new Date().getFullYear()} StudyForge. All rights reserved. Built for academic excellence.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
export { Footer }
