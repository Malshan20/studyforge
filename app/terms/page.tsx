import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, UserCheck, Shield, Scale, AlertTriangle, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 uppercase tracking-tight text-balance">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground font-semibold">Last updated: October 26, 2025</p>
          </div>

          <div className="space-y-8">
            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Agreement to Terms</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                By accessing or using StudyForge, you agree to be bound by these Terms of Service. If you disagree with
                any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <UserCheck className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Use of Service</h2>
              </div>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Eligibility</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 font-medium">
                You must be at least 13 years old to use StudyForge. By using the service, you represent that you meet
                this age requirement.
              </p>

              <h3 className="text-xl font-black text-foreground mb-3 uppercase">Account Responsibilities</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Acceptable Use</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground font-medium">
                <li>Use the service for any illegal purpose</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use automated systems to access the service without permission</li>
              </ul>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Scale className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Intellectual Property</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                The service and its original content, features, and functionality are owned by StudyForge and are
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                You retain ownership of the content you create (notes, flashcards, tasks). By using our service, you
                grant us a license to use this content to provide and improve our services.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <AlertTriangle className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">AI-Generated Content</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                StudyForge uses AI to generate study plans, flashcards, and task suggestions. While we strive for
                accuracy, AI-generated content may contain errors. You are responsible for verifying the accuracy of
                AI-generated content before relying on it for academic purposes.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Termination</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                We may terminate or suspend your account immediately, without prior notice, for any reason, including
                breach of these Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <AlertTriangle className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Limitation of Liability</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                StudyForge shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including loss of data or profits, arising from your use of the service.
              </p>
            </section>

            <section className="border-4 border-primary/30 rounded-none bg-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center border-4 border-primary bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase">Changes to Terms</h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed font-medium">
                We reserve the right to modify these terms at any time. We will notify users of any material changes.
                Your continued use of the service after changes constitutes acceptance of the new terms.
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
                If you have questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@studyforge.com" className="text-primary hover:underline font-semibold">
                  legal@studyforge.com
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
