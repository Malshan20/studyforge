import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Lock, Database, Users, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 uppercase tracking-tight text-balance">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground font-semibold">Last updated: October 26, 2025</p>
          </div>

          <div className="space-y-8">
            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Introduction</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                At StudyForge, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Database className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Information We Collect</h2>
              </div>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Personal Information</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground mb-6 font-medium">
                <li>Email address and password for account creation</li>
                <li>Profile information (name, avatar preferences)</li>
                <li>Study-related data (tasks, notes, flashcards, study sessions)</li>
                <li>Progress and analytics data</li>
              </ul>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Automatically Collected Information</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                When you use StudyForge, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and feature interactions</li>
                <li>Performance and error logs</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate AI-powered study plans and flashcards</li>
                <li>Track your study progress and provide analytics</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your requests and provide customer support</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Lock className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Data Storage and Security</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                Your data is stored securely using industry-standard encryption. We use Supabase for database
                management, which provides enterprise-grade security and compliance. We implement appropriate technical
                and organizational measures to protect your personal information.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Third-Party Services</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                We use third-party services to provide our features:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground mb-4 font-medium">
                <li>Groq AI for generating study content</li>
                <li>Supabase for authentication and data storage</li>
                <li>Stripe for payment processing</li>
              </ul>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                These services have their own privacy policies and we encourage you to review them.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Your Rights</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Contact Us</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                If you have questions about this Privacy Policy, please contact us at{" "}
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
