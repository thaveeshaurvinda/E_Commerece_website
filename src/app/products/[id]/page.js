'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from "../../context/CartContext";
import { products } from "../../products";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    isWishlistOpen, 
    setIsWishlistOpen,
    isCartOpen,
    setIsCartOpen
  } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');

  // Safely grab the product ID from the URL params
  const productId = params?.id;

  // Compare IDs as strings to support both "m1", "w1", and numeric IDs
  const product = products.find((p) => String(p.id) === String(productId));

  // Fallback if product is truly not found
  if (!product) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Product Not Found</p>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-6">We couldn't find that item</h1>
        <Link href="/" className="bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-neutral-800 transition">
          Back To Shop
        </Link>
      </main>
    );
  }

  const favorited = isInWishlist(product.id);

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-24">
      {/* Mini-Header for Navigation Back */}
      <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-widest">
            URBAN FIT
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition">
            ← Back to Shop
          </Link>
        </div>
      </header>

      {/* Main Product Layout */}
      <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Product Image Container */}
          <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center border border-gray-100 overflow-hidden select-none">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-black text-2xl tracking-widest text-gray-300">
                {product.placeholderText}
              </span>
            )}
            
            {product.discount && (
              <span className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-10">
                {product.discount}
              </span>
            )}

            {/* Favorite button directly on the image */}
            <button 
              onClick={() => toggleWishlist(product)}
              className="absolute top-6 right-6 bg-white text-black p-3 rounded-full shadow-md hover:scale-110 transition z-10"
              aria-label="Toggle Wishlist"
            >
              {favorited ? (
                <span className="text-red-500 text-lg">❤️</span>
              ) : (
                <span className="text-gray-400 hover:text-black text-lg">🖤</span>
              )}
            </button>
          </div>

          {/* Right Column: Product Details & Purchase Controls */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-black mb-6">${product.price.toFixed(2)}</p>

            <hr className="border-gray-100 mb-6" />

            <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-8">
              {product.description}
            </p>

            {/* Size Selector (If not an Accessory) */}
            {product.category !== "Accessories" && (
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">Select Size</span>
                <div className="flex space-x-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-xs font-bold border transition flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-black bg-black text-white font-black'
                          : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const finalSize = product.category === "Accessories" ? "OS" : selectedSize;
                  addToCart(product, finalSize);
                }}
                className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-neutral-800 transition"
              >
                Add To Cart
              </button>
              
              <button
                onClick={() => toggleWishlist(product)}
                className="border border-gray-200 text-xs font-bold uppercase tracking-widest px-6 py-4 hover:border-black transition"
              >
                {favorited ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>

            {/* Details Dropdown List */}
            <div className="mt-12 border-t border-gray-100 pt-6 space-y-4">
              <details className="group outline-none">
                <summary className="list-none flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black cursor-pointer transition">
                  Composition & Care
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  100% premium sourced materials. Machine wash cold inside-out with like colors. Tumble dry low or hang dry to preserve shape and custom finishes.
                </p>
              </details>

              <details className="group outline-none">
                <summary className="list-none flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black cursor-pointer transition">
                  Shipping & Returns
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Free standard shipping on orders over $75. Standard delivery takes 3-5 business days. Easy 30-day hassle-free return window.
                </p>
              </details>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}