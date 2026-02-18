'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(false);

  const products = [
    {
      id: 'digital-planner',
      name: 'Digital Study Planner & Journal',
      description: 'Everything you need to organize your academic life in one comprehensive digital package',
      price: 2.00,
      originalPrice: 5.00,
      rating: 4.9,
      reviews: 100,
      features: [
        {
          category: 'Planner Features',
          items: [
            'Weekly & Monthly Planning Templates',
            'Assignment Tracking System',
            'Study Schedule Builder',
            'Progress Monitoring Tools'
          ]
        },
        {
          category: 'Journal Features',
          items: [
            'Daily Reflection Prompts',
            'Goal Setting Worksheets',
            'Habit Tracking Pages',
            'Academic Achievement Log'
          ]
        }
      ],
      included: [
        '150+ Pages of Planning Templates',
        'Digital PDF Format (Print or Use Digitally)',
        'Mobile & Tablet Friendly'
      ],
      image: '/study-planner-shop.png'
    }
  ];

  const handleCheckout = async (product: typeof products[0]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b-4 border-primary bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground">STUDYFORGE SHOP</h1>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-2 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 text-balance">
            Master Your Studies with Our{' '}
            <span className="text-primary">Digital Planner</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate study companion that combines planning and journaling in one beautiful, organized system.
          </p>
        </div>

        {/* Product Showcase */}
        {products.map((product) => (
          <div key={product.id} className="space-y-12">
            {/* Product Images and Details */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Product Image */}
              <div className="border-4 border-primary rounded-none overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="max-w-full h-auto"
                />
              </div>

              {/* Product Info Card */}
              <div className="border-4 border-primary rounded-none bg-white p-8">
                <h3 className="text-3xl font-black text-foreground mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">({product.rating} from {product.reviews}+ students)</span>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-primary">${product.price.toFixed(2)}</span>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {product.features.map((feature, idx) => (
                    <div key={idx}>
                      <h4 className="font-black text-foreground mb-4 text-sm uppercase tracking-wider">
                        {feature.category}
                      </h4>
                      <ul className="space-y-2">
                        {feature.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* What's Included */}
                <div className="bg-primary/10 border-2 border-primary p-6 rounded-none mb-8">
                  <h4 className="font-black text-foreground mb-4 uppercase tracking-wider">What's Included:</h4>
                  <ul className="space-y-2">
                    {product.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-black">•</span>
                        <span className="text-sm font-medium text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  onClick={() => handleCheckout(product)}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 text-lg rounded-none border-0"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Get Your Study Planner Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Purchase Guidelines */}
            <div className="border-4 border-primary rounded-none bg-white p-8">
              <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-wider">Purchase & Order Guidelines</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-black text-primary flex-shrink-0">•</span>
                  <span className="font-medium text-foreground">After you have made the payment, your order will be processed within 24 hours.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-black text-primary flex-shrink-0">•</span>
                  <span className="font-medium text-foreground">To check your order status, use your email address by clicking the Order Status button.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-black text-primary flex-shrink-0">•</span>
                  <span className="font-medium text-foreground">If you have any issues or questions, please contact our support team.</span>
                </li>
              </ul>
              <div className="mt-8 flex gap-4">
                <Link href="/shop/orders">
                  <Button variant="outline" className="border-2 font-black bg-transparent">
                    Order Status
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 font-black bg-transparent">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
