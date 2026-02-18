import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Cookie, Settings, BarChart3, Users, Mail } from "lucide-react"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 uppercase tracking-tight text-balance">
              Cookie Policy
            </h1>
            <p className="text-sm text-muted-foreground font-semibold">Last updated: October 26, 2025</p>
          </div>

          <div className="space-y-8">
            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Cookie className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">What Are Cookies</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                Cookies are small text files that are placed on your device when you visit our website. They help us
                provide you with a better experience by remembering your preferences and understanding how you use our
                service.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">How We Use Cookies</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium">
                StudyForge uses cookies for the following purposes:
              </p>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Essential Cookies</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                These cookies are necessary for the website to function properly. They enable core functionality such
                as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground mb-6 font-medium">
                <li>Authentication and account access</li>
                <li>Security features</li>
                <li>Session management</li>
                <li>Load balancing</li>
              </ul>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Functional Cookies</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                These cookies allow us to remember your preferences and provide enhanced features:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground mb-6 font-medium">
                <li>Theme preferences (light/dark mode)</li>
                <li>Language settings</li>
                <li>Dashboard layout preferences</li>
                <li>Recently accessed content</li>
              </ul>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Analytics Cookies</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                These cookies help us understand how visitors interact with our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Pages visited and features used</li>
                <li>Time spent on the platform</li>
                <li>Navigation patterns</li>
                <li>Error tracking and performance monitoring</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Third-Party Cookies</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                We use third-party services that may set their own cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground mb-4 font-medium">
                <li>
                  <strong className="font-black">Supabase:</strong> For authentication and database services
                </li>
                <li>
                  <strong className="font-black">Groq AI:</strong> For AI-powered features
                </li>
                <li>
                  <strong className="font-black">Stripe:</strong> For payment processing
                </li>
              </ul>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                These third parties have their own privacy policies and cookie policies.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Managing Cookies</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Browser Settings</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium">
                Most browsers allow you to refuse or accept cookies. You can usually find these settings in your
                browser's "Options" or "Preferences" menu. Note that disabling cookies may affect the functionality of
                StudyForge.
              </p>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Cookie Duration</h3>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                We use both session cookies (which expire when you close your browser) and persistent cookies (which
                remain on your device for a set period or until you delete them).
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Updates to This Policy</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
                policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Contact Us</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                If you have questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@studyforge.com" className="text-primary hover:underline font-semibold">
                  privacy@studyforge.com
                </a>
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
