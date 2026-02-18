"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MessageSquare, Clock, CheckCircle2, Loader2, Hammer } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
    ticketNumber?: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message,
          ticketNumber: data.ticketNumber,
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit form",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12 border-4 border-primary/20 rounded-none p-8 bg-gradient-to-br from-primary/5 to-transparent">
            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">
              Forge a <span className="text-primary">Connection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-semibold">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as
              possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-6 text-center border-4 border-primary/20 rounded-none hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 border-4 border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-black mb-2 uppercase">Email Us</h3>
              <p className="text-sm text-muted-foreground font-medium">support@studyforge.com</p>
            </Card>

            <Card className="p-6 text-center border-4 border-primary/20 rounded-none hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 border-4 border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-black mb-2 uppercase">Response Time</h3>
              <p className="text-sm text-muted-foreground font-medium">Within 24-48 hours</p>
            </Card>

            <Card className="p-6 text-center border-4 border-primary/20 rounded-none hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 border-4 border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-black mb-2 uppercase">Ticket System</h3>
              <p className="text-sm text-muted-foreground font-medium">Track your inquiry</p>
              <Button
              className="mt-4 w-full border-2 border-green-400 cursor-pointer"
              variant="secondary"
              onClick={() => window.location.href = "/support"}
              
            >
              My Ticket
            </Button>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-6 md:p-8 border-4 border-primary/30 rounded-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </div>

              {/* Status Messages */}
              {submitStatus.type === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border-4 border-green-500/30 rounded-none"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-black text-green-500 uppercase">Message Forged Successfully!</p>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">{submitStatus.message}</p>
                      {submitStatus.ticketNumber && (
                        <p className="text-sm font-mono mt-2 text-green-500 font-bold">
                          Ticket Number: {submitStatus.ticketNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus.type === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-sm text-red-500">{submitStatus.message}</p>
                </motion.div>
              )}

              <Button type="submit" size="lg" className="w-full font-black uppercase" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Forging Message...
                  </>
                ) : (
                  <>
                    <Hammer className="h-4 w-4 mr-2" />
                    Forge Message
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground font-medium">
                By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-primary hover:underline font-semibold">
                  Privacy Policy
                </a>
                . We'll only use your information to respond to your inquiry.
              </p>
            </form>
          </Card>

          {/* FAQ Section */}
          <div className="mt-12 text-center border-4 border-primary/20 rounded-none p-8 bg-card">
            <h2 className="text-2xl font-black mb-4 uppercase">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-6 font-medium">
              Check out our{" "}
              <a href="/about" className="text-primary hover:underline font-semibold">
                About page
              </a>{" "}
              for more information about StudyForge and how it works.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
