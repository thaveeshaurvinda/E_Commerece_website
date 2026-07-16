'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from "./context/CartContext";
import { products } from "./products";

export default function Home() {
  const { 
    addToCart, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    isCartOpen, 
    setIsCartOpen, 
    cartCount, 
    cartTotal,
    wishlist,
    toggleWishlist,
    isInWishlist,
    isWishlistOpen,
    setIsWishlistOpen
  } = useCart();

  // --- 1. FILTER & SEARCH STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // --- 2. DYNAMICALLY ENSURE CATEGORIES EXIST ---
  // In case your products.js items do not have a "category" property, 
  // we dynamically inject them here so the filters work out-of-the-box.
  const processedProducts = useMemo(() => {
    return products.map((product, index) => {
      if (product.category) return product;
      
      // Fallback categorization based on index/id if undefined
      let assignedCategory = 'Accessories';
      if (index % 3 === 0) assignedCategory = 'Men';
      else if (index % 3 === 1) assignedCategory = 'Women';
      
      return { ...product, category: assignedCategory };
    });
  }, []);

  // --- 3. FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    return processedProducts
      .filter((product) => {
        const matchesCategory = 
          selectedCategory === 'All' || 
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'low-to-high') return a.price - b.price;
        if (sortBy === 'high-to-low') return b.price - a.price;
        return 0; // default sorting (order in array)
      });
  }, [processedProducts, selectedCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden">
      
      {/* Promo Announcement Bar */}
      <div className="promo-bar bg-black text-white text-center py-2 text-xs tracking-widest font-bold uppercase">
        Free Shipping Worldwide on Orders Over $75
      </div>

      {/* Navigation Header */}
      <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
            className="text-xl font-black tracking-widest cursor-pointer"
          >
            URBAN FIT
          </Link>
          
          {/* Category Links with Active Highlighting */}
          <nav className="flex items-center space-x-6 lg:space-x-8 text-xs font-bold uppercase tracking-widest">
            {['All', 'Men', 'Women', 'Accessories'].map((cat) => {
              const displayLabel = cat === 'All' ? 'Shop All' : cat;
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`transition-colors duration-150 py-1 border-b-2 ${
                    isActive 
                      ? 'border-black text-black font-black' 
                      : 'border-transparent text-gray-400 hover:text-black'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </nav>
          
          {/* Search & Actions Bar */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
            
            {/* Minimalist Search Input */}
            <div className="relative w-full max-w-[180px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs outline-none focus:border-black transition uppercase tracking-wider"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsWishlistOpen(true)} 
              className="hover:underline uppercase text-xs font-bold flex items-center space-x-1 shrink-0"
            >
              <span>Favorites ({wishlist.length})</span>
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:underline uppercase text-xs font-bold shrink-0"
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gray-50">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">New Collection</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
          {selectedCategory === 'All' ? 'Summer Essentials' : `${selectedCategory} Collection`}
        </h1>
        <p className="text-sm font-bold tracking-widest text-red-500 uppercase">DROP NOW LIVE • UP TO 50% OFF</p>
      </section>

      {/* Dynamic Filter Controls & Sorting Toolbar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="text-xs uppercase tracking-wider font-bold text-gray-400">
          Showing <span className="text-black font-black">{filteredProducts.length}</span> Products
          {searchTerm && <span> for "{searchTerm}"</span>}
          {selectedCategory !== 'All' && <span> in <span className="text-black">{selectedCategory}</span></span>}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <label htmlFor="sort" className="text-xs uppercase tracking-widest font-bold text-gray-400">Sort By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 text-xs font-bold uppercase tracking-wider py-1.5 px-3 outline-none focus:border-black rounded bg-white"
          >
            <option value="default">Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Dynamic Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-4">No Products Match Your Criteria</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setSortBy('default'); }} 
              className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const favorited = isInWishlist(product.id);
              return (
                <div key={product.id} className="group relative flex flex-col justify-between">
                  
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center font-black text-lg tracking-widest mb-4 overflow-hidden border border-gray-100">
                    <Link href={`/products/${product.id}`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:opacity-85 transition">
                      {product.placeholderText}
                    </Link>
                    
                    {product.discount && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 pointer-events-none">
                        {product.discount}
                      </span>
                    )}

                    {/* Wishlist Heart Toggle Button */}
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-sm hover:scale-110 transition z-10"
                      aria-label="Toggle Wishlist"
                    >
                      {favorited ? (
                        <span className="text-red-500">❤️</span>
                      ) : (
                        <span className="text-gray-400 hover:text-black">🖤</span>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        <h3 className="text-sm font-bold uppercase tracking-wider">{product.name}</h3>
                      </Link>
                      {/* Subtitle containing category label */}
                      <span className="text-[9px] text-gray-400 block uppercase tracking-widest mt-0.5">{product.category}</span>
                      <button 
                        onClick={() => addToCart(product, 'M')}
                        className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition"
                      >
                        + Add To Cart
                      </button>
                    </div>
                    <p className="text-sm font-black">${product.price.toFixed(2)}</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Shop The Look Editorial Callout */}
      <section className="bg-neutral-900 text-white text-center py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Limited Time Offer</span>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Shop The Look</h2>
          <p className="text-gray-400 text-sm tracking-wide max-w-md mx-auto mb-8">
            Elevate your streetwear game with selected summer drops.
          </p>
          <button 
            onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 400, behavior: 'smooth' }); }} 
            className="bg-white text-black px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition inline-block"
          >
            Explore Styles
          </button>
        </div>
      </section>

      {/* Brand Trust Badges */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-xl mb-2">📦</div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Fast Delivery</h3>
            <p className="text-xs text-gray-500 tracking-wider">Across The World</p>
          </div>
          <div>
            <div className="text-xl mb-2">🛡️</div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Secure Payment</h3>
            <p className="text-xs text-gray-500 tracking-wider">100% Protected</p>
          </div>
          <div>
            <div className="text-xl mb-2">💬</div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">24/7 Support</h3>
            <p className="text-xs text-gray-500 tracking-wider">We're Here To Help</p>
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
                  <Link 
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-black text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition block"
                  >
                    Checkout
                  </Link>
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

      {/* Footer */}
      <footer className="bg-black text-white/50 text-center py-8 text-xs border-t border-neutral-900">
        © {new Date().getFullYear()} Urban Fit. All rights reserved.
      </footer>

    </main>
  );
}