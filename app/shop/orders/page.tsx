'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Package, CheckCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/search?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search orders');
      setOrders([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b-4 border-primary bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-foreground">ORDER STATUS</h1>
            <Link href="/shop">
              <Button variant="outline" size="sm" className="border-2 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <Card className="border-4 border-primary rounded-none p-8 bg-white mb-12">
          <h2 className="text-2xl font-black text-foreground mb-6">FIND YOUR ORDER</h2>
          
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border-2 border-primary rounded-none bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={isSearching || !email}
              className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-none border-0"
            >
              {isSearching ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-none">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}
        </Card>

        {/* Orders List */}
        {searched && (
          <div>
            {orders.length === 0 ? (
              <Card className="border-4 border-primary rounded-none p-12 bg-white text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-black text-foreground mb-2">NO ORDERS FOUND</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any orders associated with this email address.
                </p>
                <Link href="/shop">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-none border-0">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-4 border-primary rounded-none p-6 bg-white hover:bg-primary/5 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Order ID */}
                      <div>
                        <p className="text-xs font-black text-primary uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-lg font-black text-foreground">{order.order_id}</p>
                      </div>

                      {/* Product */}
                      <div>
                        <p className="text-xs font-black text-primary uppercase tracking-wider mb-1">Product</p>
                        <p className="text-sm font-semibold text-foreground">{order.product_name}</p>
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="text-xs font-black text-primary uppercase tracking-wider mb-1">Amount</p>
                        <p className="text-lg font-black text-foreground">${order.amount.toFixed(2)}</p>
                      </div>

                      {/* Status */}
                      <div className="flex items-end">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider mb-1">Status</p>
                            <p className="text-sm font-semibold text-foreground capitalize">{order.status}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Download Instructions */}
                <Card className="border-4 border-primary rounded-none p-8 bg-primary/5">
                  <h3 className="text-xl font-black text-foreground mb-4">📥 HOW TO DOWNLOAD</h3>
                  <p className="text-muted-foreground mb-4">
                    Your digital planner will be available for download within 24 hours of payment. Check your email for a download link or contact support if you need assistance.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="border-2 font-black bg-transparent">
                      Contact Support
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <Card className="border-4 border-primary rounded-none p-12 bg-white text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-black text-foreground mb-2">ENTER YOUR EMAIL</h3>
            <p className="text-muted-foreground">
              Search for your orders by entering the email address used during checkout.
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
