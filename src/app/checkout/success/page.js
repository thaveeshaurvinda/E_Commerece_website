'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Retrieve latest order details from session storage
    const savedOrder = sessionStorage.getItem('latest_order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <main className="min-h-screen bg-white text-black font-sans flex flex-col justify-between">
      
      {/* Spacer Header */}
      <header className="border-b border-gray-100 py-6 text-center">
        <Link href="/" className="text-xl font-black tracking-widest">URBAN FIT</Link>
      </header>

      {/* Main Success Message */}
      <section className="max-w-xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <div className="text-4xl mb-6">📦</div>
        <span className="text-xs font-black uppercase tracking-widest text-green-600 block mb-2">Payment Received</span>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Thank you for your order</h1>
        
        {order ? (
          <div className="w-full bg-gray-50 border border-gray-100 p-6 rounded mb-8 text-left space-y-4 text-xs uppercase tracking-wider">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-400">Order Number</span>
              <span className="font-black text-black">{order.orderNumber}</span>
            </div>
            <div className="space-y-2 border-b border-gray-200 pb-3">
              <span className="text-gray-400 block mb-1">Items Ordered</span>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between">
                  <span className="font-bold text-gray-700">{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-400">Ship To</span>
              <span className="font-bold text-gray-700 max-w-xs text-right truncate">{order.shippingAddress}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-black pt-1">
              <span>Amount Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-8 uppercase tracking-wider">Your order processing is complete.</p>
        )}

        <p className="text-xs text-gray-500 leading-relaxed mb-10 max-w-md">
          A confirmation email will be sent to your inbox shortly with delivery tracking details.
        </p>

        <Link href="/" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
          Continue Shopping
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/50 text-center py-6 text-[10px] border-t border-neutral-900">
        © {new Date().getFullYear()} Urban Fit. All rights reserved.
      </footer>

    </main>
  );
}