'use client';
import { useCart } from "./context/CartContext";

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
    // Wishlist context features
    wishlist,
    toggleWishlist,
    isInWishlist,
    isWishlistOpen,
    setIsWishlistOpen
  } = useCart();

  const products = [
    {
      id: 1,
      name: "Sneakers",
      price: 49.99,
      discount: "UP TO 50% OFF",
      placeholderText: "SNEAKERS"
    },
    {
      id: 2,
      name: "Chaotic Hoodie",
      price: 59.99,
      discount: "UP TO 50% OFF",
      placeholderText: "HOODIE"
    },
    {
      id: 3,
      name: "Puffer Vest",
      price: 69.99,
      discount: "30% OFF",
      placeholderText: "PUFFER VEST"
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black font-sans relative overflow-x-hidden">
      
      {/* 1. Promo Announcement Bar */}
      <div className="promo-bar bg-black text-white text-center py-2 text-xs tracking-widest font-bold uppercase">
        Free Shipping Worldwide on Orders Over $75
      </div>

      {/* 2. Navigation Header */}
      <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-black tracking-widest">URBAN FIT</div>
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-gray-500">New In</a>
            <a href="#" className="hover:text-gray-500">Men</a>
            <a href="#" className="hover:text-gray-500">Women</a>
            <a href="#" className="hover:text-gray-500">Accessories</a>
            <span className="text-red-500">Sale</span>
          </nav>
          
          <div className="flex items-center space-x-6 text-sm font-bold tracking-wider">
            {/* Wishlist Nav Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)} 
              className="hover:underline uppercase text-xs font-bold flex items-center space-x-1"
            >
              <span>Favorites ({wishlist.length})</span>
            </button>
            
            {/* Cart Nav Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:underline uppercase text-xs font-bold"
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="text-center py-20 px-4 bg-gray-50">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">New Collection</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Summer Essentials</h1>
        <p className="text-sm font-bold tracking-widest text-red-500 uppercase">DROP NOW LIVE • UP TO 50% OFF</p>
        <div className="mt-8">
          <a href="#" className="bg-black text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition inline-block">
            Shop Now
          </a>
        </div>
      </section>

      {/* 4. Dynamic Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black uppercase tracking-wider mb-8 text-center">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => {
            const favorited = isInWishlist(product.id);
            return (
              <div key={product.id} className="group relative flex flex-col justify-between">
                
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center font-black text-lg tracking-widest mb-4 overflow-hidden border border-gray-100">
                  {product.placeholderText}
                  
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">
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
                    <h3 className="text-sm font-bold uppercase tracking-wider">{product.name}</h3>
                    <button 
                      onClick={() => addToCart(product)}
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
      </section>

      {/* 5. Shop The Look Editorial Callout */}
      <section className="bg-neutral-900 text-white text-center py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Limited Time Offer</span>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Shop The Look</h2>
          <p className="text-gray-400 text-sm tracking-wide max-w-md mx-auto mb-8">
            Elevate your streetwear game with selected summer drops.
          </p>
          <a href="#" className="bg-white text-black px-8 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition inline-block">
            Explore Styles
          </a>
        </div>
      </section>

      {/* 6. Brand Trust Badges */}
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

      {/* 7. Interactive Cart Slide-Over Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-6 animate-slide-in">
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
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="border border-gray-300 w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-50 font-bold">-</button>
                          <span className="text-xs font-bold px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="border border-gray-300 w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-50 font-bold">+</button>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end space-y-2">
                        <span className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
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

      {/* 8. Interactive Wishlist Slide-Over Drawer */}
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
                          addToCart(item);
                          toggleWishlist(item); // Optional: remove from wishlist once added to cart
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

      {/* 9. Footer */}
      <footer className="bg-black text-white/50 text-center py-8 text-xs border-t border-neutral-900">
        © {new Date().getFullYear()} Urban Fit. All rights reserved.
      </footer>

    </main>
  );
}