'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from "@/app/context/CartContext";
import { useUser } from "@/app/context/UserContext";
import { products } from "./products";

export default function Home() {
  const { 
    cart, 
    addToCart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    wishlist = [], 
    toggleWishlist, 
    isWishlistOpen, 
    setIsWishlistOpen,
    cartTotal
  } = useCart();
  
  const { user, logout } = useUser();

  // State Management for Filters, Search, and Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');

  const categories = ['All', 'Men', 'Women', 'Accessories'];

  // 1. Category Filtering Logic
  let processedProducts = selectedCategory === 'All' 
    ? [...products] 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // 2. Search Query Logic
  if (searchQuery.trim() !== '') {
    processedProducts = processedProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // 3. Sorting Logic
  if (sortBy === 'Price: Low to High') {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    processedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Discount') {
    // Show discounted items first
    processedProducts.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* Top Banner Notice */}
      <div className="bg-black text-white text-[10px] font-black tracking-widest uppercase py-2.5 text-center border-b border-neutral-900">
        Free Worldwide Shipping On Orders Over $75 • Code: URBANRUN
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-gray-100 py-6 px-6 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Category Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 w-full md:w-auto">
            <h1 className="text-2xl font-black tracking-widest select-none cursor-default text-center sm:text-left">
              URBAN FIT
            </h1>
            
            <nav className="flex space-x-6 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-black uppercase tracking-widest transition-all pb-1 ${
                    selectedCategory === cat 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          {/* Real-time Search Input */}
          <div className="w-full md:max-w-xs relative">
            <input 
              type="text" 
              placeholder="SEARCH PRODUCTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-none tracking-widest focus:border-black outline-none uppercase font-bold transition-all placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-black"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* User Status, Favorites, & Bag */}
          <div className="flex items-center space-x-6 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-4 shrink-0 text-xs">
              {user ? (
                <div className="flex items-center space-x-2 font-bold uppercase tracking-wider">
                  <span>Hey, {user.firstName}!</span>
                  <button 
                    onClick={logout} 
                    className="text-[10px] text-red-500 hover:underline tracking-widest uppercase font-bold"
                  >
                    (Sign Out)
                  </button>
                </div>
              ) : (
                <Link href="/auth" className="hover:underline uppercase font-bold tracking-widest">
                  Sign In
                </Link>
              )}

              <button 
                onClick={() => setIsWishlistOpen(true)} 
                className="hover:underline uppercase font-bold flex items-center space-x-1 shrink-0 tracking-widest"
              >
                <span>Favorites ({(wishlist || []).length})</span>
              </button>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition"
            >
              Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Component */}
      <section className="bg-neutral-50 border-b border-gray-100 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-3">
            Drop Now Live • Up to 50% Off
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            SUMMER ESSENTIALS
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Technical garments crafted for modern movement. Styled for high performance, engineered for absolute comfort.
          </p>
        </div>
      </section>

      {/* Product Catalog Sorting Controls */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
            Showing {processedProducts.length} Products
          </h2>
          
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-white rounded-none outline-none focus:border-black cursor-pointer"
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Discount">On Sale</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid Area */}
        {processedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">No matching items found</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {processedProducts.map((product) => {
              const isFavorited = (wishlist || []).some(item => item.id === product.id);

              return (
                <div key={product.id} className="group relative flex flex-col justify-between border border-gray-100 p-3 hover:shadow-md transition duration-300">
                  <div>
                    <div className="relative aspect-[3/4] bg-gray-100 mb-4 flex items-center justify-center border border-gray-200 select-none overflow-hidden">
                      {/* Render real image if it exists, otherwise fall back to placeholder text */}
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="font-black text-xl tracking-widest text-gray-300">
                          {product.placeholderText}
                        </span>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discount && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 z-10">
                          {product.discount}
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 bg-white text-black p-2.5 rounded-full shadow-md hover:scale-110 transition z-10"
                        aria-label="Toggle Wishlist"
                      >
                        {isFavorited ? '❤️' : '🖤'}
                      </button>

                      {/* Hover Overlay */}
                      <Link 
                        href={`/products/${product.id}`}
                        className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10"
                      >
                        <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          View Details
                        </span>
                      </Link>
                    </div>
                    <div className="flex justify-between items-start mb-1 px-1">
                      <h3 className="text-xs font-black uppercase tracking-tight max-w-[70%]">
                        <Link href={`/products/${product.id}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs font-black">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 px-1">
                      {product.category}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.category === 'Accessories' ? 'OS' : 'M')}
                    className="w-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest py-3.5 hover:bg-black transition duration-200"
                  >
                    Quick Add
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- Slideout Component Panel: Shopping Cart Bag --- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between font-sans">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest">Shopping Bag ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest">
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your bag is empty</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-[10px] font-black uppercase tracking-widest underline text-black">
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center space-x-4 border-b border-gray-50 pb-4">
                    <div className="w-16 h-20 bg-gray-100 border border-gray-200 shrink-0 overflow-hidden relative">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-[10px] text-gray-300">
                          {item.placeholderText}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Size: {item.selectedSize}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          className="px-2 py-0.5 border border-gray-200 text-xs hover:border-black"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                          className="px-2 py-0.5 border border-gray-200 text-xs hover:border-black"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-neutral-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Estimated Total</span>
                  <span className="text-base font-black">${(cartTotal || 0).toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="block text-center w-full bg-black text-white text-xs font-black uppercase tracking-widest py-4 hover:bg-neutral-800 transition">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Slideout Component Panel: Wishlist Favorites --- */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between font-sans">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest">Favorites ({(wishlist || []).length})</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest">
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(wishlist || []).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">No favorites added yet</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-gray-50 pb-4">
                    <div className="w-16 h-20 bg-gray-100 border border-gray-200 shrink-0 overflow-hidden relative">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-[10px] text-gray-300">
                          {item.placeholderText}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase tracking-tight">{item.name}</h4>
                      <p className="text-xs font-black mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <button 
                        onClick={() => {
                          addToCart(item, item.category === 'Accessories' ? 'OS' : 'M');
                          toggleWishlist(item);
                        }}
                        className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-800"
                      >
                        Add to Bag
                      </button>
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="text-[9px] text-gray-400 font-bold uppercase tracking-widest hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/*Newsletter Signup*/}
      <section className="border-t border-b border-gray-100 py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
            Join the Club
          </span>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
            Get 10% Off Your First Order
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest max-w-md mx-auto mb-8 leading-relaxed">
            Subscribe to receive early access to new collections, exclusive drops, and private sales.
          </p>
          <form 
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} 
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-3"
          >
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL..." 
              required
              className="flex-1 bg-gray-50 border border-gray-200 text-xs px-4 py-3 rounded-none tracking-widest focus:border-black outline-none uppercase font-bold transition-all placeholder-gray-400"
            />
            <button 
              type="submit" 
              className="bg-black text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* --- NEW SECTION: Brand Values Bar --- */}
      <section className="bg-neutral-50 py-10 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Express Shipping</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Free worldwide delivery on orders over $75</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">30-Day Returns</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Hassle-free sizing exchanges and return window</p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Secure Checkout</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">100% encrypted secure payments</p>
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: Main Footer --- */}
      <footer className="bg-white text-black py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-black tracking-widest">URBAN FIT</h3>
              <p className="text-[11px] text-gray-400 uppercase font-bold tracking-widest leading-relaxed">
                Technical streetwear garments engineered for modern movement. Styled for high performance, crafted for absolute comfort.
              </p>
            </div>

            {/* Column 2: Shop Links */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Shop</h4>
              <ul className="space-y-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <li><button onClick={() => setSelectedCategory('All')} className="hover:text-black transition">Shop All</button></li>
                <li><button onClick={() => setSelectedCategory('Men')} className="hover:text-black transition">Men's Collection</button></li>
                <li><button onClick={() => setSelectedCategory('Women')} className="hover:text-black transition">Women's Collection</button></li>
                <li><button onClick={() => setSelectedCategory('Accessories')} className="hover:text-black transition">Accessories</button></li>
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <li><a href="#" className="hover:text-black transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-black transition">Shipping & Delivery</a></li>
                <li><a href="#" className="hover:text-black transition">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-black transition">Size Guide</a></li>
              </ul>
            </div>

            {/* Column 4: Legal / Policies */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <li><a href="#" className="hover:text-black transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-black transition">Cookie Settings</a></li>
              </ul>
            </div>

          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Bottom Copyright & Social Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} URBAN FIT INC. All Rights Reserved.
            </span>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-black transition">Instagram</a>
              <a href="#" className="hover:text-black transition">TikTok</a>
              <a href="#" className="hover:text-black transition">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}