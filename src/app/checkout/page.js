'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a mock order object to store in local sessionStorage 
    // so we can read it on the success screen
    const mockOrder = {
      orderNumber: `UF-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart,
      total: cartTotal + 10, // Including $10 shipping
      shippingAddress: `${formData.address}, ${formData.city}`,
    };

    sessionStorage.setItem('latest_order', JSON.stringify(mockOrder));
    
    // Clear the global cart
    clearCart();
    
    // Direct to the order success page
    router.push('/checkout/success');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
        <h2 className="text-xl font-black uppercase tracking-widest mb-4">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-wider">Add some items before checking out.</p>
        <Link href="/" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black font-sans py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left: Checkout Form (7 cols) */}
        <div className="lg:col-span-7">
          <Link href="/" className="text-2xl font-black tracking-widest mb-10 block">URBAN FIT</Link>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Contact Information</h3>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
              />
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Simulated Payment */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Payment details</h3>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                required
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  required
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  required
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="border border-gray-200 p-3 text-xs focus:border-black outline-none transition uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
            >
              Complete Order • ${(cartTotal + 10).toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sticky Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-gray-50 p-8 border border-gray-100 self-start lg:sticky lg:top-8">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
          
          <div className="space-y-4 max-h-72 overflow-y-auto mb-6 pr-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold uppercase tracking-wider">{item.name}</p>
                  <p className="text-gray-400 mt-0.5">SIZE: {item.selectedSize || 'M'} x {item.quantity}</p>
                </div>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3 text-xs uppercase tracking-wider">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Flat Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between text-black font-black text-sm pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>${(cartTotal + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}