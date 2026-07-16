'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useCart } from "../../context/CartContext";
import { products } from "../../products";

export default function ProductDetailPage({ params: paramsPromise }) {
  // Unwrap params using React.use()
  const params = use(paramsPromise);
  const productId = parseInt(params.id);

  // Find the requested product
  const product = products.find((p) => p.id === productId);

  // State to track selected size
  const [selectedSize, setSelectedSize] = useState('M');

  const { 
    cart,
    addToCart, 
    removeFromCart,
    updateQuantity,
    cartCount, 
    cartTotal,
    isCartOpen,
    setIsCartOpen, 
    toggleWishlist, 
    isInWishlist,
    isWishlistOpen,
    setIsWishlistOpen, 
    wishlist 
  } = useCart();

  // If the product doesn't exist, show error state
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
        <h2 className="text-xl font-black uppercase tracking-widest mb-4">Product Not Found</h2>
        <Link href="/" className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800">
          Return Home
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans relative">
      
      {/* 1. Header */}
      <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-widest cursor-pointer">URBAN FIT</Link>
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest">
            <Link href="/" className="hover:text-gray-500">Shop All</Link>
            <a href="#" className="hover:text-gray-500">Men</a>
            <a href="#" className="hover:text-gray-500">Women</a>
            <span className="text-red-500">Sale</span>
          </nav>
          
          <div className="flex items-center space-x-6 text-sm font-bold tracking-wider">
            <button 
              onClick={() => setIsWishlistOpen(true)} 
              className="hover:underline uppercase text-xs font-bold flex items-center space-x-1"
            >
              <span>Favorites ({wishlist.length})</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:underline uppercase text-xs font-bold"
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* 2. Product Presentation Area */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left Side: Editorial Image Box */}
        <div className="relative aspect-[3/4] bg-gray-100 border border-gray-100 flex items-center justify-center text-2xl font-black tracking-widest">
          {product.placeholderText}
          {product.discount && (
            <span className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
              {product.discount}
            </span>
          )}
        </div>

        {/* Right Side: Product Customization & Ordering */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold tracking-widest uppercase block mb-2">URBAN FIT ESSENTIALS</span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">{product.name}</h1>
            <p className="text-lg font-black mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-8">
              {product.description}
            </p>

            {/* Sizes (Interactive State) */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">
                Select Size: <span className="text-black font-black">{selectedSize}</span>
              </span>
              <div className="flex space-x-3">
                {['S', 'M', 'L', 'XL'].map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-xs font-bold tracking-wider border transition-all duration-150 ${
                        isSelected 
                          ? 'bg-black text-white border-black scale-105' 
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Feature Details */}
            <div className="border-t border-gray-100 pt-6 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">Product Highlights</span>
              <ul className="list-disc list-inside text-xs text-gray-500 space-y-1.5 leading-relaxed">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
            >
              Add To Cart
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className="w-full border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:border-black transition flex items-center justify-center space-x-2"
            >
              <span>{isFavorited ? '❤️ Favorited' : '🖤 Add to Favorites'}</span>
            </button>
          </div>
        </div>

      </section>

      {/* Interactive Cart Slide-Over Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <h2 className="text-md font-black uppercase tracking-wider">Your Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xl font-bold hover:text-gray-500">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-4">Your cart is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3">Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {cart.map((item) => {
                    const itemSize = item.selectedSize || 'M';
                    return (
                      <div key={`${item.id}-${itemSize}`} className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                          <p className="text-[10px] bg-gray-100 text-black px-2 py-0.5 rounded font-bold uppercase inline-block mt-1">
                            Size: {itemSize}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.id, itemSize, -1)} 
                              className="border border-gray-300 w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-50 font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, itemSize, 1)} 
                              className="border border-gray-300 w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-50 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end space-y-2">
                          <span className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromCart(item.id, itemSize)} 
                            className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
                    <span className="text-md font-black">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-black text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Interactive Wishlist Slide-Over Drawer */}
      {isWishlistOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsWishlistOpen(false)} />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <h2 className="text-md font-black uppercase tracking-wider">Your Favorites ({wishlist.length})</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="text-xl font-bold hover:text-gray-500">
                ✕
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-4">Your wishlist is empty</p>
                <button onClick={() => setIsWishlistOpen(false)} className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3">Explore Collections</button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => {
                          addToCart(item, 'M');
                          toggleWishlist(item);
                        }}
                        className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 hover:bg-neutral-800 transition"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => toggleWishlist(item)} 
                        className="text-xs hover:scale-110 transition"
                        title="Remove from favorites"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. Footer */}
      <footer className="bg-black text-white/50 text-center py-8 text-xs border-t border-neutral-900 mt-20">
        © {new Date().getFullYear()} Urban Fit. All rights reserved.
      </footer>

    </main>
  );
}