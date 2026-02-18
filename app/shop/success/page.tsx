'use client';

import React from "react"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Mail, Download, Home } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isStoring, setIsStoring] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(!sessionId);

  useEffect(() => {
    if (!sessionId) {
      setIsVerifying(false);
      return;
    }

    // Auto-verify if we have a session ID
    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    if (!email && sessionId) {
      setShowEmailForm(true);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setIsStoring(true);
    
    try {
      const response = await fetch('/api/stripe/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          email: email || 'no-email@studyforge.com',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderId(data.orderId);
        setOrderNumber(data.orderNumber || '');
        setError('');
      } else {
        setError(data.error || 'Failed to verify payment');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to verify payment. Please try again.');
    } finally {
      setIsVerifying(false);
      setIsStoring(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      verifyPayment();
    }
  };

  const handleResendEmail = async () => {
    if (!email || !orderNumber) return;
    
    setIsResending(true);
    setResendSuccess('');
    
    try {
      const response = await fetch('/api/email/resend-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          orderId: orderNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResendSuccess('Confirmation email sent successfully! Check your inbox.');
        setTimeout(() => setResendSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to resend email');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary rounded-none mx-auto mb-6 animate-spin" />
          <h1 className="text-2xl font-black text-foreground mb-2">VERIFYING YOUR PAYMENT</h1>
          <p className="text-muted-foreground">Please wait while we secure your order...</p>
        </div>
      </main>
    );
  }

  if (showEmailForm && !orderId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-4 border-primary rounded-none p-8">
          <h1 className="text-3xl font-black text-foreground mb-2">VERIFY YOUR ORDER</h1>
          <p className="text-muted-foreground mb-8">Enter your email to verify and store your order</p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-primary rounded-none bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={isStoring || !email}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-none border-0"
            >
              {isStoring ? 'Verifying...' : 'Verify & Store Order'}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-none">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b-4 border-primary bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-black text-foreground">ORDER CONFIRMED</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Card */}
        <Card className="border-4 border-primary rounded-none p-12 bg-white mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-none mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-black text-foreground mb-2">PURCHASE SUCCESSFUL!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>

            {orderId && (
              <div className="bg-primary/10 border-2 border-primary p-6 rounded-none mb-8 inline-block">
                <p className="text-sm font-medium text-muted-foreground mb-1">YOUR ORDER ID</p>
                <p className="text-3xl font-black text-primary">{orderId}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border-2 border-primary p-6 rounded-none">
                <Mail className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-black text-foreground mb-2">CONFIRMATION EMAIL</h3>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to <span className="font-semibold">{email}</span>
                </p>
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="mt-4 border-1 border-primary font-semibold text-sm h-9 rounded-none bg-transparent hover:bg-primary/5"
                >
                  {isResending ? 'Sending...' : 'Resend Email'}
                </Button>
              </div>
              
              <div className="border-2 border-primary p-6 rounded-none">
                <Download className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-black text-foreground mb-2">DOWNLOAD LINK</h3>
                <p className="text-sm text-muted-foreground">
                  Your digital planner will be available to download within 24 hours
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="border-4 border-primary rounded-none p-8 bg-white mb-8">
          <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-wider">WHAT'S NEXT?</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="font-black text-primary text-lg flex-shrink-0">1.</span>
              <div>
                <p className="font-semibold text-foreground">Check your email</p>
                <p className="text-sm text-muted-foreground">Look for a confirmation email with your order details</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-black text-primary text-lg flex-shrink-0">2.</span>
              <div>
                <p className="font-semibold text-foreground">Download your planner</p>
                <p className="text-sm text-muted-foreground">Once processed, download your digital planner directly</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-black text-primary text-lg flex-shrink-0">3.</span>
              <div>
                <p className="font-semibold text-foreground">Start organizing</p>
                <p className="text-sm text-muted-foreground">Import to your favorite app or print and use digitally</p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Success Message */}
        {resendSuccess && (
          <Card className="border-4 border-green-500 rounded-none p-8 bg-green-50 mb-8">
            <p className="text-green-800 font-semibold">{resendSuccess}</p>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-4 border-red-500 rounded-none p-8 bg-red-50 mb-8">
            <p className="text-red-800 font-semibold">{error}</p>
            <p className="text-sm text-red-700 mt-2">Please contact support if you need assistance.</p>
          </Card>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop/orders">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-none border-0">
              Check Order Status
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full border-2 font-black h-12 rounded-none bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
