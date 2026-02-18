import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.studyforge.com"),
  title: {
    default: "StudyForge - Build Your Academic Success | AI Study Tools & Flashcards",
    template: "%s | StudyForge",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  description:
    "StudyForge helps students build academic excellence through AI-powered flashcards, intelligent quiz generation, and comprehensive study planning. Forge your path to success.",
  keywords: [
    "study app",
    "student productivity",
    "AI flashcards",
    "quiz maker",
    "study planner",
    "academic success tools",
    "AI learning platform",
    "student study tools",
    "flashcard creator",
    "exam preparation app",
    "study organization",
    "learning management",
    "academic planner",
    "spaced repetition",
  ],
  authors: [{ name: "StudyForge" }],
  creator: "StudyForge",
  publisher: "StudyForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.studyforge.com",
    siteName: "StudyForge",
    title: "StudyForge - Build Your Academic Success",
    description:
      "Forge your path to academic excellence with AI-powered study tools: intelligent flashcards, adaptive quizzes, and strategic planning.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyForge - Build Your Academic Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyForge - Build Your Academic Success",
    description:
      "Forge your path to academic excellence with AI-powered study tools: intelligent flashcards, adaptive quizzes, and strategic planning.",
    images: ["/og-image.png"],
    creator: "@studyforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://www.studyforge.com",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GE31ZBKT11"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-GE31ZBKT11');
`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StudyForge",
              url: "https://www.studyforge.com",
              logo: "https://www.studyforge.com/logo.png",
              description:
                "AI-powered study platform helping students build academic success through intelligent flashcards, quizzes, and planning tools",
              sameAs: [
                "https://twitter.com/studyforge",
                "https://facebook.com/studyforge",
                "https://instagram.com/studyforge",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@studyforge.com",
                contactType: "Customer Support",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "StudyForge",
              url: "https://www.studyforge.com",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
