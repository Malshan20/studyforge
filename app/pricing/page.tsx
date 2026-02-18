import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PLAN_DETAILS } from "@/lib/types/subscription"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - StudyForge Plans | Free & Premium Options",
  description:
    "Choose the perfect StudyForge plan for your study needs. Start free with Scholar plan or upgrade to Master for unlimited study planning, flashcards, and analytics.",
  keywords: [
    "studyforge pricing",
    "study app pricing",
    "student app plans",
    "free study app",
    "premium study tools",
    "student subscription plans",
  ],
  openGraph: {
    title: "Pricing - StudyForge Plans",
    description: "Start free or upgrade to unlimited features. Choose the perfect plan for your study needs.",
    url: "https://www.study-forge.app/pricing",
    type: "website",
  },
  alternates: {
    canonical: "https://www.study-forge.app/pricing",
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Forge Your Plan</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-semibold">
              Start with Scholar for free, or upgrade to Master for unlimited access to all features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Scholar Plan */}
            <Card className="relative border-4 border-primary/20 rounded-none hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">{PLAN_DETAILS.scholar.name}</CardTitle>
                <CardDescription className="font-medium">{PLAN_DETAILS.scholar.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-muted-foreground font-semibold">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {PLAN_DETAILS.scholar.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full font-black uppercase bg-transparent" variant="outline">
                  <Link href="/auth/signup">Start Building</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Master Plan */}
            <Card className="relative border-4 border-primary shadow-lg rounded-none">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 border-2 border-primary text-sm font-black uppercase">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">{PLAN_DETAILS.genius.name}</CardTitle>
                <CardDescription className="font-medium">{PLAN_DETAILS.genius.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black">${PLAN_DETAILS.genius.price}</span>
                  <span className="text-muted-foreground font-semibold">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {PLAN_DETAILS.genius.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full font-black uppercase">
                  <Link href="/auth/signup">Forge Mastery</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto border-4 border-primary/20 rounded-none p-8 bg-card">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase">Plan Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="py-4 px-4 font-black uppercase text-sm">Feature</th>
                    <th className="py-4 px-4 font-black uppercase text-sm text-center">Scholar (Free)</th>
                    <th className="py-4 px-4 font-black uppercase text-sm text-center">Genius ($4.99)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Tasks per month</td>
                    <td className="py-3 px-4 text-center">50</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Total flashcards</td>
                    <td className="py-3 px-4 text-center">100</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Total notes</td>
                    <td className="py-3 px-4 text-center">20</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">AI study plans per month</td>
                    <td className="py-3 px-4 text-center">5</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">AI flashcard generations</td>
                    <td className="py-3 px-4 text-center">5 per month</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Progress tracking</td>
                    <td className="py-3 px-4 text-center">Basic charts</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">Enhanced charts</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-medium">Pomodoro timer</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 mx-auto text-primary" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 mx-auto text-primary" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Priority support</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">-</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 mx-auto text-primary" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto border-4 border-primary/20 rounded-none p-8 bg-card">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-black mb-2 uppercase text-sm">Can I switch plans anytime?</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Yes! You can upgrade from Scholar to Master at any time. Your new features will be available
                  immediately.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2 uppercase text-sm">What happens when I reach my limits?</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  On the Scholar plan, you'll be notified when you approach your monthly limits. You can upgrade to
                  Master for unlimited access.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2 uppercase text-sm">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  The Scholar plan is completely free forever. You can try all basic features without a credit card.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "StudyForge Study App",
              description: "Powerful study planning app with flashcards, progress tracking, and productivity tools",
              offers: [
                {
                  "@type": "Offer",
                  name: "Scholar Plan",
                  price: "0",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://www.study-forge.app/pricing",
                },
                {
                  "@type": "Offer",
                  name: "Master Plan",
                  price: PLAN_DETAILS.genius.price.toString(),
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: "https://www.study-forge.app/pricing",
                },
              ],
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
